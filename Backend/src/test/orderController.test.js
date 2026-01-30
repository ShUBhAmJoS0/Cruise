import { jest, describe, it, expect, beforeEach } from "@jest/globals";

// Mock Product model
const mockProduct = {
  productId: 1,
  productName: "Art Print",
  productPrice: 50,
  productQuantity: 10,
  createdBy: 2,
  update: jest.fn().mockResolvedValue(true),
};

// Mock CartItem with Product association
const mockCartItem = {
  id: 1,
  userId: 1,
  productId: 1,
  artistId: 2,
  quantity: 2,
  product: mockProduct,
  destroy: jest.fn().mockResolvedValue(true),
};

// Mock OrderItem
const mockOrderItem = {
  id: 1,
  orderId: 1,
  productId: 1,
  artistId: 2,
  quantity: 2,
  price: 50,
  totalPrice: 100,
};

// Mock Order with OrderItems association
const mockOrder = {
  id: 1,
  userId: 1,
  totalPrice: 110,
  status: "Confirmed",
  update: jest.fn().mockResolvedValue(true),
  OrderItems: [
    {
      product: mockProduct,
    },
  ],
};

// Mock models
jest.unstable_mockModule("../model/Cart.js", () => ({
  default: {
    findByPk: jest.fn(),
    findAll: jest.fn(),
  },
}));

jest.unstable_mockModule("../model/Order.js", () => ({
  default: {
    create: jest.fn(),
    findOne: jest.fn(),
  },
}));

jest.unstable_mockModule("../model/OrderItems.js", () => ({
  default: {
    create: jest.fn(),
  },
}));

jest.unstable_mockModule("../model/Product.js", () => ({
  Product: {},
}));

// Import the mocked models
const { default: CartItem } = await import("../model/Cart.js");
const { default: Order } = await import("../model/Order.js");
const { default: OrderItem } = await import("../model/OrderItems.js");
const { buyAllCartItems, markOrderAsComplete } =
  await import("../controller/orderController.js");

describe("Order Controller - Essential Tests", () => {
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const validBuyRequest = {
    user: { id: 1 },
    body: { cartItemId: 1, quantity: 2 },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should buy a cart item successfully", async () => {
    const req = { ...validBuyRequest };
    const res = mockResponse();

    CartItem.findByPk.mockResolvedValue(mockCartItem);
    Order.create.mockResolvedValue(mockOrder);
    OrderItem.create.mockResolvedValue(mockOrderItem);

    await buyAllCartItems(req, res);

    expect(Order.create).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Order placed successfully",
        itemsBought: 1,
      }),
    );
  });

  it("should return 500 if insufficient product quantity", async () => {
    const req = { ...validBuyRequest };
    req.body.quantity = 15;
    const res = mockResponse();

    const insufficientStockCartItem = {
      ...mockCartItem,
      quantity: 15,
      product: {
        ...mockProduct,
        productQuantity: 10,
      },
    };

    CartItem.findByPk.mockResolvedValue(insufficientStockCartItem);

    await buyAllCartItems(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Only 10 items left for Art Print",
    });
  });

  it("should return 404 if cart item not found", async () => {
    const req = { ...validBuyRequest };
    const res = mockResponse();

    CartItem.findByPk.mockResolvedValue(null);

    await buyAllCartItems(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Cart item not found" });
  });

  it("should buy multiple cart items", async () => {
    const req = {
      user: { id: 1 },
      body: { cartItemIds: [1, 2] },
    };
    const res = mockResponse();

    const mockCartItems = [
      { ...mockCartItem },
      {
        id: 2,
        userId: 1,
        productId: 2,
        artistId: 2,
        quantity: 1,
        product: {
          ...mockProduct,
          productId: 2,
          productName: "T-Shirt",
        },
        destroy: jest.fn().mockResolvedValue(true),
      },
    ];

    CartItem.findAll.mockResolvedValue(mockCartItems);
    Order.create.mockResolvedValue(mockOrder);
    OrderItem.create.mockResolvedValue(mockOrderItem);

    await buyAllCartItems(req, res);

    expect(OrderItem.create).toHaveBeenCalledTimes(2);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Order placed successfully",
        itemsBought: 2,
      }),
    );
  });

  it("should mark order as complete successfully", async () => {
    const req = {
      params: { id: 1 },
      user: { id: 2 },
    };
    const res = mockResponse();

    Order.findOne.mockResolvedValue(mockOrder);

    await markOrderAsComplete(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Order marked as completed successfully",
      }),
    );
  });

  it("should return 403 if artist does not own products", async () => {
    const req = {
      params: { id: 1 },
      user: { id: 3 }, // Different artist ID
    };
    const res = mockResponse();

    const orderWithWrongArtist = {
      ...mockOrder,
      OrderItems: [
        {
          product: {
            ...mockProduct,
            createdBy: 999, // Different artist
          },
        },
      ],
    };

    Order.findOne.mockResolvedValue(orderWithWrongArtist);

    await markOrderAsComplete(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "You can only update orders for your own products",
    });
  });

  it("should return 404 if order not found", async () => {
    const req = {
      params: { id: 999 },
      user: { id: 2 },
    };
    const res = mockResponse();

    Order.findOne.mockResolvedValue(null);

    await markOrderAsComplete(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Order not found" });
  });

  it("should return 400 if order already completed", async () => {
    const req = {
      params: { id: 1 },
      user: { id: 2 },
    };
    const res = mockResponse();

    const completedOrder = {
      ...mockOrder,
      status: "Completed",
    };

    Order.findOne.mockResolvedValue(completedOrder);

    await markOrderAsComplete(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Order is already completed",
    });
  });
});
