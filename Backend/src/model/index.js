
import CartItem from "./Cart.js";
import Order from "./Order.js";
import OrderItem from "./OrderItems.js";
import { Product } from "./Product.js";
import User from "./User.js";
import Follow from "./follow.js";
import Booking from "./Booking.js";
import Event from "./Event.js";
import Review from "./review.js";
import UserProblem from "./UserProblem.js";
import Notification from "./Notification.js";
import CommunityGuidelineModel from "./CommunityGuideline.js";
import sequelize from "../Database/db.js";

const CommunityGuideline = CommunityGuidelineModel(sequelize);


Product.belongsTo(User, { foreignKey: "createdBy" });
Product.hasMany(OrderItem, { foreignKey: "productId" });
User.hasMany(Product, { foreignKey: "createdBy" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });
OrderItem.belongsTo(Product, { foreignKey: "productId" });
Order.hasMany(OrderItem, { foreignKey: "orderId" });
OrderItem.belongsTo(User, { foreignKey: "artistId", as: "artist" });
Order.belongsTo(User, { foreignKey: "userId" });
CartItem.belongsTo(Product, { foreignKey: "productId" });
CartItem.belongsTo(User, { foreignKey: "artistId", as: "artist" });
User.hasMany(Booking, { foreignKey: "createdBy" });
Booking.belongsTo(User, { foreignKey: "createdBy" });
Event.hasMany(Booking, { foreignKey: "EventId" });
Booking.belongsTo(Event, { foreignKey: "EventId" });
Follow.belongsTo(User, { foreignKey: 'followerId', as: 'follower' });
Follow.belongsTo(User, { foreignKey: 'followingId', as: 'following' });
User.hasMany(Follow, { foreignKey: 'followerId', as: 'following' });
User.hasMany(Follow, { foreignKey: 'followingId', as: 'followers' });
Follow.belongsTo(User, { foreignKey: "followingId", as: "FollowingUser" });

// Event associations
User.hasMany(Event, {
  foreignKey: "createdBy",
  as: "events"
});

Event.belongsTo(User, {
  foreignKey: "createdBy",
  as: "artist"
});

// UserProblem associations
User.hasMany(UserProblem, {
  foreignKey: "reportedBy",
  as: "problems"
});

UserProblem.belongsTo(User, {
  foreignKey: "reportedBy",
  as: "reporter"
});

export { User, Product, Order, OrderItem, CartItem, Follow, Booking, Event, Review, UserProblem, Notification, CommunityGuideline };
