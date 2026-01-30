import SequelizeMock from "sequelize-mock";

const dbMock = new SequelizeMock();
const OrderMock = dbMock.define('Order', {
  id: 1,
  userId: 1,
  totalPrice: 250.00,
  status: 'Confirmed',
  createdAt: new Date(),
});

describe('Order Model', () => {
  it('should create an order', async () => {
    const order = await OrderMock.create({
      id: 1,
      userId: 1,
      totalPrice: 250.00,
      status: 'Confirmed',
      createdAt: new Date(),
    });

    expect(order.userId).toBe(1);
    expect(order.totalPrice).toBe(250.00);
    expect(order.status).toBe('Confirmed');
  });
});

