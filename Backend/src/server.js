import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config();
import sequelize from "./Database/db.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/EventRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import merchandiseRoutes from "./routes/merchandiseRoutes.js";
import artistRoutes from "./routes/artistRoutes.js";
import authToken from "./middleware/firebaseAuth.js";
import Product from "./model/Product.js";
import Order from "./model/Order.js";
import OrderItem from "./model/OrderItems.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

const app=express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(authToken)
app.use("/auth",authRoutes)
app.use("/event",eventRoutes)
app.use("/api/booking",bookingRoutes)
app.use("/api/merchandise", merchandiseRoutes);
app.use("/artist",artistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);


const port =  5000;
(async()=>{
    try{
        await sequelize.authenticate();
        console.log("database connected");

        // One Order has many OrderItems
        Order.hasMany(OrderItem, { foreignKey: "orderId", as: "OrderItems" });
        OrderItem.belongsTo(Order, { foreignKey: "orderId" });

        // One Product can have many OrderItems
        Product.hasMany(OrderItem, { foreignKey: "productId" });
        OrderItem.belongsTo(Product, { foreignKey: "productId" });

        await sequelize.sync({alter: true});
        console.log("Models synced");

        app.listen(port,()=>console.log(`server running on port ${port}`))
    }catch(err){
        console.error("Unable to start server:",err);
    }
})
(); 