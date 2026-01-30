import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import request from "supertest";
import express from "express";

// Mock controller functions
const mockGetAllMerch = jest.fn();
const mockMarkOrderAsComplete = jest.fn();

// Mock the modules before importing route
jest.unstable_mockModule("../controller/ProductController.js", () => ({
  getAllMerch: mockGetAllMerch,
}));

jest.unstable_mockModule("../controller/orderController.js", () => ({
  markOrderAsComplete: mockMarkOrderAsComplete,
}));

jest.unstable_mockModule("../middleware/Attendeonly.js", () => ({
  AttendeeOnly: (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Authorization token missing" });
    }
    req.user = { id: 1, role: "Attendee" };
    next();
  },
}));

jest.unstable_mockModule("../middleware/Artistonly.js", () => ({
  artistOnly: (req, res, next) => {
    req.user = { id: 1, role: "Artist" };
    next();
  },
}));

// Import route after mocks
const { default: orderRoutes } = await import("../routes/orderRoutes.js");

const testApp = express();
testApp.use(express.json());
testApp.use("/api/order", orderRoutes);

describe("Order/Merch API Endpoints", () => {
  const token = "valid-token";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 without token on GET merch", async () => {
    const res = await request(testApp).get("/api/order/");
    expect(res.status).toBe(401);
  });

  it("should get all merch with valid token", async () => {
    mockGetAllMerch.mockImplementation((req, res) => {
      return res.status(200).json([{ id: 1, name: "T-Shirt", price: 25 }]);
    });

    const res = await request(testApp)
      .get("/api/order/")
      .set("Authorization", `Bearer ${token}`);

    expect(mockGetAllMerch).toHaveBeenCalled();
    expect(res.status).toBe(200);
  });

  it("should handle order completion request", async () => {
    mockMarkOrderAsComplete.mockImplementation((req, res) => {
      return res.status(200).json({
        message: "Order marked as completed successfully",
      });
    });

    const orderId = 1;
    const res = await request(testApp)
      .put(`/api/order/complete/${orderId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(mockMarkOrderAsComplete).toHaveBeenCalled();
    expect(res.status).toBe(200);
  });
});
