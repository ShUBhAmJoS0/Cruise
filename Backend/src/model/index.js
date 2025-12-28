import User from "./User.js";
import Follow from "./follow.js";


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
