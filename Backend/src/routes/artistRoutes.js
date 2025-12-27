import express from "express";
import { AddEvent, GetrequestedEvent } from "../controller/eventController.js";
import upload from "../Config/multer.js";
import { artistOnly } from "../middleware/Artistonly.js";
import { addProduct, deleteProduct, editProduct, getAllProduct} from "../controller/ProductController.js";

const router= express.Router()
router.get("/request",artistOnly,GetrequestedEvent);

router.post("/request",upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]), artistOnly,AddEvent);

router.post("/addmerch",upload.fields([
  { name: 'image', maxCount: 1 }]),addProduct)

router.get("/addmerch", getAllProduct)
router.put("/addmerch/:id",upload.fields([
  { name: 'image', maxCount: 1 }]),editProduct)
  router.delete("/addmerch/:id",deleteProduct)
export default router