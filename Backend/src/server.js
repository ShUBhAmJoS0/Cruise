import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config();
import sequelize from "./Database/db.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/EventRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import eventFilters from './routes/eventFiltersRoutes.js';
import artistRoutes from "./routes/artistRoutes.js";
import authToken from "./middleware/firebaseAuth.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import artistRoutes from "./routes/artistRoutes.js";
import communityRoutes from "./routes/communityRoutes.js"
import orderHistoryRoutes from "./routes/orderHistoryRoutes.js";

import "./model/index.js"
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


app.use(authToken)
app.use("/auth",authRoutes)
app.use("/api/community", communityRoutes);
//asignig routes
app.use("/api/events", eventFilters);
app.use("/event",eventRoutes)
app.use("/api/booking",bookingRoutes)
app.use("/artist",artistRoutes);
app.use("/merch", orderRoutes);
app.use("/api/cart",cartRoutes)


app.use("/api/orderhistory", orderHistoryRoutes);


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