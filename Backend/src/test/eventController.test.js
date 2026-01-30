import { jest, describe, it, expect, beforeEach } from "@jest/globals";

// Mock Event model
const mockEvent = {
  id: 1,
  title: "Test Event",
  description: "Test Description",
  location: "Test Location",
  date: "2024-01-01",
  time: "10:00",
  category: "Music",
  images: ["image1.jpg"],
  profileImage: "profile.jpg",
  prices: { vip: 100 },
  Quantity: { vip: 50 },
  createdBy: 1,
  status: "Approved",
  visible: "Active",
  update: jest.fn().mockResolvedValue(true),
  destroy: jest.fn().mockResolvedValue(true),
};

// Mock User model
const mockUser = {
  id: 1,
  name: "Test User",
  email: "test@example.com",
};

// Mock Booking model
const mockBooking = {
  id: 1,
  ticketCode: "ABC123",
  eventName: "Test Event",
  ticketType: "VIP",
  quantity: 2,
  customerName: "John Doe",
  billingAddress: "123 Test St",
  totalPrice: 200,
  paymentStatus: "paid",
  createdBy: 1,
  EventId: 1,
};

// Mock models
jest.unstable_mockModule("../model/Event.js", () => ({
  default: {
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

jest.unstable_mockModule("../model/User.js", () => ({
  default: {
    findByPk: jest.fn(),
  },
}));

jest.unstable_mockModule("../model/Booking.js", () => ({
  default: {
    findAll: jest.fn(),
  },
}));

jest.unstable_mockModule("../utils/eventFilters.js", () => ({
  buildEventFilters: jest.fn(),
}));

jest.unstable_mockModule("../model/Notification.js", () => ({
  default: {
    create: jest.fn(),
  },
}));

const { default: Event } = await import("../model/Event.js");
const { default: User } = await import("../model/User.js");
const { default: Booking } = await import("../model/Booking.js");
const { buildEventFilters } = await import("../utils/eventFilters.js");
const { default: Notification } = await import("../model/Notification.js");
const {
  DisplayAll,
  AddEvent,
  GetEvent,
  deleteEvent,
  filterEvent,
  GetrequestedEvent,
  getEventbookings,
} = await import("../controller/eventController.js");

describe("Event Controller - Essential Tests", () => {
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get all approved events", async () => {
    const req = {};
    const res = mockResponse();

    Event.findAll.mockResolvedValue([mockEvent]);

    await DisplayAll(req, res);

    expect(Event.findAll).toHaveBeenCalledWith({
      where: { status: "Approved", visible: "Active" },
    });
    expect(res.json).toHaveBeenCalledWith([mockEvent]);
  });

  it("should create a new event", async () => {
    const req = {
      user: { id: 1 },
      body: {
        title: "New Event",
        description: "New Description",
        location: "New Location",
        date: "2024-02-01",
        time: "14:00",
        category: "Art",
        prices: JSON.stringify({ vip: 150 }),
        Quantity: JSON.stringify({ vip: 30 }),
      },
      files: {},
    };
    const res = mockResponse();

    Event.create.mockResolvedValue(mockEvent);
    Notification.create.mockResolvedValue({});

    await AddEvent(req, res);

    expect(Event.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "New Event",
        status: "pending",
        createdBy: 1,
      }),
    );
    // Controller returns 200, not 201
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 500 if required fields are missing", async () => {
    const req = {
      user: { id: 1 },
      body: {}, // Missing required fields
      files: {},
    };
    const res = mockResponse();

    await AddEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "All required fields must be filled",
    });
  });

  it("should return 404 if event not found", async () => {
    const req = {
      user: { id: 1 },
      params: { id: 999 },
    };
    const res = mockResponse();

    Event.findByPk.mockResolvedValue(null);

    await GetEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Event not found" });
  });

  it("should get an event by ID", async () => {
    const req = {
      params: { id: 1 },
    };
    const res = mockResponse();

    Event.findByPk.mockResolvedValue(mockEvent);

    await GetEvent(req, res);

    expect(Event.findByPk).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should delete (set to inactive) an event", async () => {
    const req = {
      user: { id: 1 },
      params: { id: 1 },
    };
    const res = mockResponse();

    Event.findByPk.mockResolvedValue(mockEvent);

    await deleteEvent(req, res);

    expect(res.send).toHaveBeenCalledWith({
      message: "event deleted sucessfully",
    });
  });

  it("should filter events based on query", async () => {
    const req = {
      query: { category: "Music" },
    };
    const res = mockResponse();

    buildEventFilters.mockReturnValue({ category: "Music" });
    Event.findAll.mockResolvedValue([mockEvent]);

    await filterEvent(req, res);

    expect(buildEventFilters).toHaveBeenCalledWith(req.query);
    expect(Event.findAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith([mockEvent]);
  });

  it("should get all events created by user", async () => {
    const req = {
      user: { id: 1 },
    };
    const res = mockResponse();

    Event.findAll.mockResolvedValue([mockEvent]);

    await GetrequestedEvent(req, res);

    expect(Event.findAll).toHaveBeenCalledWith({
      where: { createdBy: 1, visible: "Active" },
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should get all bookings for artist events", async () => {
    const req = {
      user: { id: 1 },
    };
    const res = mockResponse();

    Event.findAll.mockResolvedValue([mockEvent]);
    Booking.findAll.mockResolvedValue([mockBooking]);

    await getEventbookings(req, res);

    expect(Event.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { createdBy: 1 },
      }),
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
