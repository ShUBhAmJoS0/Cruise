import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config();
import sequelize from "./Database/db.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/EventRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import eventFilters from './routes/eventFilters.js';
// import { seedEvents } from "./model/seed.js";
import artistRoutes from "./routes/artistRoutes.js";
import authToken from "./middleware/firebaseAuth.js";

const app=express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
//asignig routes
app.use(authToken)
app.use("/auth",authRoutes)
app.use("/event",eventRoutes)
app.use("/api/booking",bookingRoutes)
app.use("/api/events", eventFilters);
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