import SequelizeMock from "sequelize-mock";

const dbMock = new SequelizeMock();


const Booking = dbMock.define(
  "Booking",
  {
    id: 1,
    ticketCode: "TKT-123ABC",
    eventName: "Concert",
    ticketType: "VIP",
    quantity: 1,
    customerName: "John Doe",
    billingAddress: "Kathmandu",
    totalPrice: 1500,
    paymentStatus: "success",
    createdBy: 1,
    EventId: 10,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    timestamps: true,
    underscored: true
  }
);

/* ---------------- TESTS ---------------- */

describe("Booking Model", () => {

  it("should define Booking model", () => {
    expect(Booking).toBeDefined();
    expect(Booking.name).toBe("Booking");
  });

  it("should have required fields", () => {
    const fields = Booking._defaults;

    expect(fields.id).toBeDefined();
    expect(fields.ticketCode).toBeDefined();
    expect(fields.eventName).toBeDefined();
    expect(fields.ticketType).toBeDefined();
    expect(fields.quantity).toBeDefined();
    expect(fields.customerName).toBeDefined();
    expect(fields.billingAddress).toBeDefined();
    expect(fields.totalPrice).toBeDefined();
    expect(fields.paymentStatus).toBeDefined();
    expect(fields.createdBy).toBeDefined();
    expect(fields.EventId).toBeDefined();
  });

  it("should have default quantity of 1", () => {
    expect(Booking._defaults.quantity).toBe(1);
  });

  it("should have default paymentStatus as success", () => {
    expect(Booking._defaults.paymentStatus).toBe("success");
  });

  it("should support timestamps", () => {
    expect(Booking.options.timestamps).toBe(true);
  });

});
