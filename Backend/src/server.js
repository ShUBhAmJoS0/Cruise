import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config();
import sequelize from "./Database/db.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/EventRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
<<<<<<< HEAD
import merchandiseRoutes from "./routes/merchandiseRoutes.js";
// import { seedEvents } from "./model/seed.js";
=======
import artistRoutes from "./routes/artistRoutes.js";
import authToken from "./middleware/firebaseAuth.js";
>>>>>>> 6c8ad16988fb03f66bb332984f5d4c71d3c80076

const app=express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
//asignig routes
app.use(authToken)
app.use("/auth",authRoutes)
app.use("/event",eventRoutes)
app.use("/api/booking",bookingRoutes)
<<<<<<< HEAD
app.use("/api/merchandise", merchandiseRoutes);
=======
app.use("/artist",artistRoutes);
>>>>>>> 6c8ad16988fb03f66bb332984f5d4c71d3c80076


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