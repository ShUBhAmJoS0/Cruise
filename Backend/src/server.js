import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config();
import sequelize from "./Database/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import eventRoutes from "./routes/EventRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import eventFilters from './routes/eventFiltersRoutes.js';
import artistRoutes from "./routes/artistRoutes.js";
import authToken from "./middleware/firebaseAuth.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import orderHistoryRoutes from "./routes/orderHistoryRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userProblemRoutes from "./routes/userProblemRoutes.js";
import "./model/index.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Admin routes BEFORE auth middleware (uses separate admin auth)
app.use("/api/admin", adminRoutes);
app.use("/api/user-problems", userProblemRoutes);

// Firebase auth middleware for other routes
app.use(authToken);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/events", eventFilters);
app.use("/event", eventRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/artist", artistRoutes);
app.use("/merch", orderRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/orderhistory", orderHistoryRoutes);

const port = 5000;
(async () => {
  try {
    await sequelize.authenticate();
    console.log("database connected");
    await sequelize.sync({ alter: true });
    console.log("Models synced");
    app.listen(port, () => console.log(`server running on port ${port}`));
  } catch (err) {
    console.error("Unable to start server:", err);
  }
})(); 