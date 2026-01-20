import CartItem from "./Cart.js";
import Order from "./Order.js";
import OrderItem from "./OrderItems.js";
import { Product } from "./Product.js";
import User from "./User.js";
import Follow from "./follow.js";
import Booking from "./Booking.js";
import Event from "./Event.js";
import Review from "./review.js";



Product.belongsTo(User, { foreignKey: "createdBy" });
Product.hasMany(OrderItem, {
  foreignKey: "productId",
});
User.hasMany(Product, { foreignKey: "createdBy"});
OrderItem.belongsTo(Order, { foreignKey: "orderId" });
OrderItem.belongsTo(Product, { foreignKey: "productId" });
OrderItem.belongsTo(User, { foreignKey: "artistId", as: "artist" });
Order.belongsTo(User, { foreignKey: "userId" });
CartItem.belongsTo(Product, { foreignKey: "productId"});
CartItem.belongsTo(User, { foreignKey: "artistId", as: "artist" });
User.hasMany(Booking, { foreignKey: "createdBy" });
Booking.belongsTo(User, { foreignKey: "createdBy" });
Event.hasMany(Booking, { foreignKey: "EventId" });
Booking.belongsTo(Event, { foreignKey: "EventId" });
Follow.belongsTo(User, {
    foreignKey: 'followerId',
    as: 'follower'
  });
  Follow.belongsTo(User, {
    foreignKey: 'followingId',
    as: 'following'
  });
  User.hasMany(Follow, {
    foreignKey: 'followerId',
    as: 'following'
  });
  User.hasMany(Follow, {
    foreignKey: 'followingId',
    as: 'followers'
  });
;
export {
  User,
  Product,
  Order,
  OrderItem,
  CartItem,
  Follow
};