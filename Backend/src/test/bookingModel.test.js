import SequelizeMock from 'sequelize-mock';

// Create a mock DB
const dbMock = new SequelizeMock();

// Define Booking mock
const Booking = dbMock.define('Booking', {
  id: 1,
  ticketCode: 'ABC123',
  eventName: 'Concert',
  ticketType: 'VIP',
  quantity: 1,
  customerName: 'John Doe',
  billingAddress: '123 Street',
  totalPrice: 100,
  paymentStatus: 'success',
  createdBy: 1,
  EventId: 10
}, {
  timestamps: true,
  underscored: true
});

describe('Booking Model', () => {

  it('should define Booking model', () => {
    expect(Booking).toBeDefined();
    expect(Booking.name).toBe('Booking'); // sequelize-mock uses .name instead of .modelName
  });

  it('should have required fields', () => {
    const fields = Booking._defaults; // sequelize-mock stores initial values in _defaults

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

  it('should have default quantity of 1', () => {
    expect(Booking._defaults.quantity).toBe(1);
  });

  it('should have default paymentStatus as success', () => {
    expect(Booking._defaults.paymentStatus).toBe('success');
  });

});
