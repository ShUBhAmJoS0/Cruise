import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import request from "supertest";
import express from "express";

// Mock controller functions
const mockRegisterUser = jest.fn();
const mockLoginUser = jest.fn();
const mockGetUser = jest.fn();

// Mock auth middleware
const mockAuthToken = jest.fn((req, res, next) => {
  req.user = { id: 1 };
  next();
});

// Mock multer
const mockUploadFields = jest.fn(() => (req, res, next) => next());

// Mock the modules before importing router
jest.unstable_mockModule("../controller/authController.js", () => ({
  registerUser: mockRegisterUser,
  loginUser: mockLoginUser,
  getUser: mockGetUser,
}));

jest.unstable_mockModule("../middleware/firebaseAuth.js", () => ({
  default: mockAuthToken,
}));

jest.unstable_mockModule("../Config/multer.js", () => ({
  default: {
    fields: mockUploadFields,
  },
}));

// Import router after mocks
const { default: router } = await import("../routes/authRoutes.js");

// Create test app
const testApp = express();
testApp.use(express.json());
testApp.use("/", router);

describe("Auth Routes - Essential Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call registerUser on POST /signup", async () => {
    mockRegisterUser.mockImplementation((req, res) => {
      return res.status(201).json({ message: "User registered" });
    });

    const res = await request(testApp).post("/signup").send({
      name: "John",
      email: "john@example.com",
      password: "123456",
    });

    expect(mockRegisterUser).toHaveBeenCalled();
    expect(res.status).toBe(201);
    expect(res.body.message).toBe("User registered");
  });

  it("should call loginUser on POST /login", async () => {
    mockLoginUser.mockImplementation((req, res) => {
      return res.status(200).json({ message: "Login successful" });
    });

    const res = await request(testApp).post("/login").send({
      email: "john@example.com",
      password: "123456",
    });

    expect(mockLoginUser).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Login successful");
  });

  it("should call getUser on GET /getuser with auth", async () => {
    mockGetUser.mockImplementation((req, res) => {
      return res.status(200).json({ id: 1, name: "John Doe" });
    });

    const res = await request(testApp).get("/getuser");

    expect(mockAuthToken).toHaveBeenCalled();
    expect(mockGetUser).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("John Doe");
  });
});
