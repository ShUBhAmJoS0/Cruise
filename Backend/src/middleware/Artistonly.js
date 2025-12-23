export const artistOnly = (req, res, next) => {
  if (req.user.role !== "Artist") {
    return res.status(403).json({ message: "Artist access only" });
  }
  next();
};