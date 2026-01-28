import User from "../model/User.js";
import dotenv from "dotenv";
import { admin } from "../Config/firebaseAdmin.js";
dotenv.config();

//register User
const registerUser = async (req, res) => {
  try {
    const { id_token, email, name, userType } = req.body;

    // Verify Firebase ID Token
    const decodedToken = await admin.auth().verifyIdToken(id_token);
    const firebase_uid = decodedToken.uid;
    // Check if user exists in Postgres
    let user = await User.findOne({ where: { firebase_uid } });

    if (!user) {
      let existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        // Link googleId to existing user
        existingUser.firebase_uid = firebase_uid;
        await existingUser.save();
        return res.status(200).json({ message: "Google account linked", user: existingUser });
      }

      user = await User.create({
        firebase_uid,
        email,
        name,
        userType,
      });
      res.status(200).json({
        message: "Signup successful",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          userType: user.userType,
        },
      });
    }
  }
  catch (error) {
    console.log("firebaseSignup error:", error.message, error);
    res.status(500).json({ message: "Server error" });
  }
}
//login//
const loginUser = async (req, res) => {
  try {
    const { id_token } = req.body;

    const decodedToken = await admin.auth().verifyIdToken(id_token);
    const firebase_uid = decodedToken.uid;

    let user = await User.findOne({ where: { firebase_uid } });

    if (!user) {
      return res.status(404).json({ message: "User not found. Please sign up first." });
    }
    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        userType: user.userType,
      },
    });
  } catch (error) {
    console.log("firebaseLogin error:", error);
    res.status(500).json({ message: "Invalid Firebase token or login failed" });
  }
};
export const getUser = async (req, res) => {
  try {
    const firebaseUid = req.user.firebase_uid;

    const user = await User.findOne({
      where: { firebase_uid: firebaseUid },
      attributes: ["id", "name", "email", "bio", "about", "profileImage", "coverImage", "social", "userType", "mediaImages"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Ensure mediaImages is always an array
    const userData = user.toJSON();
    userData.mediaImages = userData.mediaImages || [];

    console.log(userData);
    return res.json({ user: userData, message: "user fetched sucessfully" });
  } catch (error) {
    console.error("getUser error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
const updateFirebaseEmail = async (uid, newEmail) => {
  try {
    await admin.auth().updateUser(uid, {
      email: newEmail,
    });
    console.log("Firebase email updated successfully");
  } catch (error) {
    console.error("Error updating Firebase email:", error);
    throw error;
  }
};
const updateUser = async (req, res) => {
  console.log("api hit")
  try {
    const uid = req.user.id
    const fid = req.user.firebase_uid
    const body = req.body
    console.log(body)
    if (!body.username) {
      return res.status(401).send({ message: "Cannot leave name empty" })

    }
    let imageUrl = body.profileImage;
    if (req.files.profilePic?.[0]) {
      imageUrl = req.files.profilePic[0].path.replace(/\\/g, '/');
    }
    let coverimage = body.coverImage;
    if (req.files.coverPic?.[0]) {
      coverimage = req.files.coverPic[0].path.replace(/\\/g, '/');
    }

    // Handle media images array
    let mediaImages = [];

    // Parse existing media JSON from frontend (if any)
    if (body.existingMediaImages) {
      try {
        mediaImages = JSON.parse(body.existingMediaImages);
      } catch (err) {
        mediaImages = [];
      }
    }

    // Append newly uploaded files from Multer
    if (req.files?.mediaImages) {
      const uploaded = req.files.mediaImages.map(f =>
        f.path.replace(/\\/g, '/')
      );
      mediaImages = [...mediaImages, ...uploaded];
    }

    const user = await User.findOne({ where: { id: uid } })
    if (!user) {
      return res.status(500).send({ message: "the user does not exist" })
    }
    await updateFirebaseEmail(fid, body.email.trim());
    await user.update({
      name: body.username,
      email: body.email,
      bio: body.bio,
      social: body.sociallink,
      coverImage: coverimage,
      profileImage: imageUrl,
      about: body.about,
      mediaImages: mediaImages

    }

    )
    res.status(200).send({ message: "Saved profile sucessfully", mediaImages: mediaImages })
  }
  catch (error) {
    res.status(500).send({ message: error.message })
  }
}

export { loginUser, registerUser, updateUser };
