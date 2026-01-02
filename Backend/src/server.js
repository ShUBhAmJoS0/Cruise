import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config();
import sequelize from "./Database/db.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/EventRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import eventFilters from './routes/eventFiltersRoutes.js';
import merchandiseRoutes from "./routes/merchandiseRoutes.js";import artistRoutes from "./routes/artistRoutes.js";import authToken from "./middleware/firebaseAuth.js";
import {Product} from "./model/Product.js";
import communityRoutes from "./routes/communityRoutes.js"

const app=express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use("/api/events", eventFilters);
app.use("/api/community", communityRoutes);
app.use(authToken)
app.use("/auth",authRoutes)
app.use("/event",eventRoutes)
app.use("/api/booking",bookingRoutes)
app.use("/api/merchandise", merchandiseRoutes)
app.use("/artist",artistRoutes);


const port =  5000;
(async()=>{
    try{
        await sequelize.authenticate();
        console.log("database connected");
        await sequelize.sync({alter: true});
        console.log("Models synced");

        app.listen(port,()=>console.log(`server running on port ${port}`))
    }catch(err){
        console.error("Unable to start server:",err);
    }
})
(); 