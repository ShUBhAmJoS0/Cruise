import express from "express";
import { AddEvent, getEventbookings, GetrequestedEvent } from "../controller/eventController.js";
import upload from "../Config/multer.js";
import { artistOnly } from "../middleware/Artistonly.js";
import { addProduct, deleteProduct, editProduct, getAllProduct, getproductbuyers, getproductBycreator} from "../controller/ProductController.js";
import { updateUser } from "../controller/authController.js";
import { createReview, followUser, getallArtists, getArtistbyid, getArtistgigs, getFollowers, getFollowing, getpendingArtistgigs, getReviewsByArtist, unfollowUser } from "../controller/Artistscontroller.js";
import { AttendeeOnly } from "../middleware/Attendeonly.js";


const router= express.Router()
router.get("/request",artistOnly,GetrequestedEvent);

router.post("/request",upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]), artistOnly,AddEvent);

router.post("/addmerch",upload.fields([
  { name: 'image', maxCount: 1 }]),artistOnly ,addProduct)

router.get("/addmerch", getAllProduct)
router.put("/addmerch/:id",upload.fields([
  { name: 'image', maxCount: 1 }]),artistOnly,editProduct)
  router.delete("/addmerch/:id",artistOnly,deleteProduct)

  
router.put("/updateProfile",upload.fields([
  { name: 'profilePic', maxCount: 1 },{name:"coverPic",maxCount:1}]),artistOnly,updateUser)
    router.get("/allmerch/details",artistOnly,getproductbuyers)
    router.get("/allevents/details",artistOnly,getEventbookings)
  router.get("/all",AttendeeOnly,getallArtists)
  router.get("/profile/:id",AttendeeOnly,getArtistbyid)
  router.get("/gig/:id",AttendeeOnly,getpendingArtistgigs)
  router.get("/allgigs/:id",AttendeeOnly,getArtistgigs)
    router.get("/allmerch/:id",AttendeeOnly,getproductBycreator)
    router.get("/allreview/:id",AttendeeOnly,getReviewsByArtist)
    router.post("/allreview",AttendeeOnly,createReview)
    router.post("/follow",AttendeeOnly,followUser)
     router.post("/unfollow",AttendeeOnly,unfollowUser)
     router.get("/followers",AttendeeOnly,getFollowers)
     router.get("/followings",AttendeeOnly,getFollowing)

export default router


