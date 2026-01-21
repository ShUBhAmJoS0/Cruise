import User from "./User.js";
import Follow from "./follow.js";
import Event from "./Event.js";
import Notification from "./Notification.js";

User.hasMany(Follow, {
  foreignKey: "followerId",
  as: "Following"
});

User.hasMany(Follow, {
  foreignKey: "followingId",
  as: "Followers"
});

Follow.belongsTo(User, { foreignKey: "followerId", as: "Follower" });
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
