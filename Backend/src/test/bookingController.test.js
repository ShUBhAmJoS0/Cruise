import { jest, describe, it, expect, beforeEach } from "@jest/globals";



const mockUser = {
  id: 1,
  firebase_uid: "firebase_123",
};

const mockEvent = {
  id: 1,
  title: "Test Event",
  prices: { VIP: 100 },
  Quantity: { VIP: 10 },
  save: jest.fn().mockResolvedValue(true),
};

const mockBooking = {
  id: 1,
  ticketCode: "TKT-123",
  ticketType: "VIP",
  quantity: 2,
  totalPrice: 210,
  createdAt: new Date(),
};

const mockTransaction = {
  commit: jest.fn(),
  rollback: jest.fn(),
  LOCK: { UPDATE: "UPDATE" },
};


jest.unstable_mockModule("../Database/db.js", () => ({
  default: {
    transaction: jest.fn().mockResolvedValue(mockTransaction),
    Transaction: {
      LOCK: { UPDATE: "UPDATE" },
    },
  },
}));

jest.unstable_mockModule("../model/User.js", () => ({
  default: {
    findOne: jest.fn(),
  },
}));

jest.unstable_mockModule("../model/Event.js", () => ({
  default: {
    findByPk: jest.fn(),
  },
}));

jest.unstable_mockModule("../model/Booking.js", () => ({
  default: {
    create: jest.fn(),
  },
}));

const { default: sequelize } = await import("../Database/db.js");
const { default: User } = await import("../model/User.js");
const { default: Event } = await import("../model/Event.js");
const { default: Booking } = await import("../model/Booking.js");
const { createBookingController } =
  await import("../controller/bookingController.js");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};


describe("createBookingController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock implementations
    User.findOne.mockResolvedValue(mockUser);
    Event.findByPk.mockResolvedValue(mockEvent);
    Booking.create.mockResolvedValue(mockBooking);
    mockEvent.save.mockResolvedValue(true);
  });

  it("creates booking successfully", async () => {
    const req = {
      user: { firebase_uid: "firebase_123" },
      body: {
        event_id: 1,
        ticket_type: "VIP",
        quantity: 2,
        customer_name: "John Doe",
        billing_address: "Test Address",
        card_number: "4242424242424242",
      },
    };

    const res = mockResponse();

    await createBookingController(req, res);

    expect(User.findOne).toHaveBeenCalled();
    expect(Event.findByPk).toHaveBeenCalled();
    expect(Booking.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("returns 400 if required fields are missing", async () => {
    const req = {
      user: { firebase_uid: "firebase_123" },
      body: {
        event_id: 1,
        ticket_type: "VIP",
        // missing quantity, customer_name, billing_address
      },
    };

    const res = mockResponse();

    await createBookingController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Missing required fields",
    });
  });

  it("returns 404 if user not found", async () => {
    User.findOne.mockResolvedValue(null);

    const req = {
      user: { firebase_uid: "unknown_uid" },
      body: {
        event_id: 1,
        ticket_type: "VIP",
        quantity: 2,
        customer_name: "John Doe",
        billing_address: "Test Address",
        card_number: "4242424242424242",
      },
    };

    const res = mockResponse();

    await createBookingController(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });
});
