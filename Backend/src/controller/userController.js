import User from "../model/User.js";
import { admin } from "../Config/firebaseAdmin.js";

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

const updateUserProfile = async(req, res) => {
  console.log("User profile update API hit");
  try {
    const uid = req.user.id;
    const fid = req.user.firebase_uid;
    const body = req.body;
    
    console.log("Request body:", body);
    console.log("Request files:", req.files);

    if (!body.username) {
      return res.status(401).send({ message: "Cannot leave name empty" });
    }

    let imageUrl = body.profileImage;
    if (req.files?.profilePic?.[0]) {
      imageUrl = req.files.profilePic[0].path.replace(/\\/g, '/');
      console.log("Profile image path:", imageUrl);
    }

    let coverimage = body.coverImage;
    if (req.files?.coverPic?.[0]) {
      coverimage = req.files.coverPic[0].path.replace(/\\/g, '/');
      console.log("Cover image path:", coverimage);
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
    
    const user = await User.findOne({ where: { id: uid } });
    if (!user) {
      return res.status(500).send({ message: "The user does not exist" });
    }

    // Update email in Firebase
    await updateFirebaseEmail(fid, body.email.trim());

    // Prepare update data
    const updateData = {
      name: body.username,
      email: body.email,
    };

    if (imageUrl !== body.profileImage) updateData.profileImage = imageUrl;
    if (coverimage !== body.coverImage) updateData.coverImage = coverimage;
    if (mediaImages.length > 0) updateData.mediaImages = mediaImages;
    if (body.bio) updateData.bio = body.bio;
    if (body.sociallink) updateData.social = body.sociallink;
    if (body.about) updateData.about = body.about;

    // Update user in database
    await user.update(updateData);
    
    res.status(200).send({ message: "Profile saved successfully"  ,mediaImages: updateData.mediaImages || user.mediaImages});
  } catch (error) {
    console.error("User profile update error:", error);
    res.status(500).send({ message: error.message });
  }
};

export { updateUserProfile };
