import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import request from "supertest";
import express from "express";

// Mock controller functions
const mockDisplayAll = jest.fn();
const mockGetEvent = jest.fn();

// Mock the modules before importing route
jest.unstable_mockModule("../controller/eventController.js", () => ({
  DisplayAll: mockDisplayAll,
  GetEvent: mockGetEvent,
  GetrequestedEvent: jest.fn(),
}));

// Import route after mocks
const { default: eventRoutes } = await import("../routes/EventRoutes.js");

const testApp = express();
testApp.use(express.json());
testApp.use("/event", eventRoutes);

describe("Event API Endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get all events", async () => {
    mockDisplayAll.mockImplementation((req, res) => {
      return res
        .status(200)
        .json([{ id: 1, title: "Test Event", category: "Music" }]);
    });

    const res = await request(testApp).get("/event/");

    expect(mockDisplayAll).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get an event by ID", async () => {
    mockGetEvent.mockImplementation((req, res) => {
      return res.status(200).json({ id: 1, title: "Test Event" });
    });

    const res = await request(testApp).get("/event/1");

    expect(mockGetEvent).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id");
  });

  it("should return 404 for non-existent event", async () => {
    mockGetEvent.mockImplementation((req, res) => {
      return res.status(404).json({ message: "Event not found" });
    });

    const res = await request(testApp).get("/event/99999");

    expect(res.status).toBe(404);
  });
});
