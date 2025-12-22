export const AttendeeOnly = (req, res, next) => {
  if (req.user.role !== "Attendee") {
    return res.status(403).json({ message: "User access only" });
  }
  next();
};