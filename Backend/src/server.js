import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config();
import sequelize from "./Database/db.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/EventRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
// import { seedEvents } from "./model/seed.js";

const app=express();
app.use(cors());
app.use(express.json());
//asignig routes
app.use("/auth",authRoutes)
app.use("/event",eventRoutes)
app.use("/api/booking",bookingRoutes)


const port = process.env.PORT || 5000;
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