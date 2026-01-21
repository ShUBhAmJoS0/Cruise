export const adminOnly = (req, res, next) => {
  // Check if user exists and is admin
  if (!req.user || req.user.role !== "Admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};