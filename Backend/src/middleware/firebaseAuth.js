import { admin } from "../Config/firebaseAdmin.js"
import User from "../model/User.js";

const authToken = async (req, res, next) => {


  try {
    if (req.path === "/auth/login" || req.path == "/auth/signup") {
      return next();
    }
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    const decodedToken = await admin.auth().verifyIdToken(token);
    const user = await User.findOne({
      where: { firebase_uid: decodedToken.uid }
    });

    if (!user) {
      // Auto-heal: Check if user exists by email (if available in token)
      if (decodedToken.email) {
        user = await User.findOne({ where: { email: decodedToken.email } });
        if (user) {
          console.log(`Auto-healing UID for user ${user.email}. Old: ${user.firebase_uid}, New: ${decodedToken.uid}`);
          await user.update({ firebase_uid: decodedToken.uid });
        }
      }

      if (!user) {
        console.log("User not found for UID:", decodedToken.uid, "Email:", decodedToken.email);
        return res.status(200).json({ user: null });
      }
    }

    req.user = {
      id: user.id,
      firebase_uid: decodedToken.uid,
      role: user.userType
    };

    next();
  } catch (error) {
    console.error("Firebase Auth Error:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

export default authToken;
