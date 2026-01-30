import { jest, describe, it, expect, beforeEach } from "@jest/globals";

// Mock firebase admin
const mockVerifyIdToken = jest.fn();
jest.unstable_mockModule("../Config/firebaseAdmin.js", () => ({
  admin: {
    auth: jest.fn(() => ({
      verifyIdToken: mockVerifyIdToken,
    })),
  },
}));

// Mock User model
const mockFindOne = jest.fn();
const mockCreate = jest.fn();
jest.unstable_mockModule("../model/User.js", () => ({
  default: {
    findOne: mockFindOne,
    create: mockCreate,
  },
}));

const { registerUser, loginUser } =
  await import("../controller/authController.js");

describe("Auth Controller", () => {
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should register a new user successfully", async () => {
    const req = {
      body: {
        id_token: "valid_token",
        email: "test@example.com",
        name: "Test User",
        userType: "Attendee",
      },
    };
    const res = mockResponse();

    mockVerifyIdToken.mockResolvedValue({ uid: "firebase_123" });
    mockFindOne.mockResolvedValue(null);
    mockCreate.mockResolvedValue({
      id: 1,
      firebase_uid: "firebase_123",
      email: "test@example.com",
      name: "Test User",
      userType: "Attendee",
    });

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it("should login user successfully", async () => {
    const req = {
      body: { id_token: "valid_token" },
    };
    const res = mockResponse();

    mockVerifyIdToken.mockResolvedValue({ uid: "firebase_123" });
    mockFindOne.mockResolvedValue({
      id: 1,
      firebase_uid: "firebase_123",
      email: "test@example.com",
      name: "Test User",
      userType: "Attendee",
    });

    await loginUser(req, res);

    expect(res.json).toHaveBeenCalled();
  });

  it("should return 404 if user not found on login", async () => {
    const req = {
      body: { id_token: "valid_token" },
    };
    const res = mockResponse();

    mockVerifyIdToken.mockResolvedValue({ uid: "unknown_uid" });
    mockFindOne.mockResolvedValue(null);

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "User not found. Please sign up first.",
    });
  });
});
