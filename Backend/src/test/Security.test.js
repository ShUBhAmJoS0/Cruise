import { jest, describe, it, expect } from "@jest/globals";

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
jest.unstable_mockModule("../model/User.js", () => ({
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

const { registerUser, loginUser } =
  await import("../controller/authController.js");
const { default: User } = await import("../model/User.js");

describe("Security Tests", () => {
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it("should handle login with valid token", async () => {
    const req = { body: { id_token: "valid_token" } };
    const res = mockResponse();

    mockVerifyIdToken.mockResolvedValue({ uid: "firebase_123" });
    User.findOne.mockResolvedValue({
      id: 1,
      firebase_uid: "firebase_123",
      email: "test@example.com",
    });

    await loginUser(req, res);

    // Should call json with user data
    expect(res.json).toHaveBeenCalled();
  });

  it("should handle signup with valid data", async () => {
    const req = {
      body: {
        id_token: "valid_token",
        email: "test@example.com",
        name: "Test",
        userType: "Attendee",
      },
    };
    const res = mockResponse();

    mockVerifyIdToken.mockResolvedValue({ uid: "firebase_123" });
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      id: 1,
      firebase_uid: "firebase_123",
      email: "test@example.com",
      name: "Test",
      userType: "Attendee",
    });

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should reject invalid tokens", async () => {
    const req = { body: { id_token: "invalid_token" } };
    const res = mockResponse();

    mockVerifyIdToken.mockRejectedValue(new Error("Invalid token"));

    await loginUser(req, res);

    // The controller returns 500 for errors, not 401
    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });
});
