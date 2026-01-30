import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import request from "supertest";
import express from "express";

// Mock controller functions
const mockCreateBooking = jest.fn();
const mockGetMyBookings = jest.fn();

// Mock the modules before importing route
jest.unstable_mockModule("../controller/bookingController.js", () => ({
  createBookingController: mockCreateBooking,
  Getmybookings: mockGetMyBookings,
}));

jest.unstable_mockModule("../middleware/Attendeonly.js", () => ({
  AttendeeOnly: (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Authorization token missing" });
    }
    req.user = { id: 1, firebase_uid: "test_uid", role: "Attendee" };
    next();
  },
}));

// Import route after mocks
const { default: bookingRoutes } = await import("../routes/bookingRoutes.js");

const testApp = express();
testApp.use(express.json());
testApp.use("/api/booking", bookingRoutes);

describe("Booking API Endpoints", () => {
  const token = "valid-test-token";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should handle booking creation request", async () => {
    mockCreateBooking.mockImplementation((req, res) => {
      return res.status(201).json({
        message: "Booking successful",
        booking: { id: 1, ticketCode: "TKT-123" },
      });
    });

    const res = await request(testApp)
      .post("/api/booking/")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ticket_type: "VIP",
        quantity: 2,
        customer_name: "John Doe",
        billing_address: "Kathmandu",
        card_number: "4242424242424242",
        event_id: 1,
      });

    expect(mockCreateBooking).toHaveBeenCalled();
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("booking");
  });

  it("should not create booking with missing fields", async () => {
    mockCreateBooking.mockImplementation((req, res) => {
      return res.status(400).json({ message: "Missing required fields" });
    });

    const res = await request(testApp)
      .post("/api/booking/")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ticket_type: "VIP",
        quantity: 2,
      });

    expect(res.status).toBe(400);
  });

  it("should handle get my bookings request", async () => {
    mockGetMyBookings.mockImplementation((req, res) => {
      return res.status(200).json({
        data: [{ id: 1, ticketCode: "TKT-123" }],
        message: "fetched all bookings successfully",
      });
    });

    const res = await request(testApp)
      .get("/api/booking/")
      .set("Authorization", `Bearer ${token}`);

    expect(mockGetMyBookings).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
  });

  it("should not get bookings without token", async () => {
    const res = await request(testApp).get("/api/booking/");

    expect(res.status).toBe(401);
  });
});
