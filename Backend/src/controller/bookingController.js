// backend/src/controller/bookingController.js
import Booking from "../model/Booking.js";
import User from "../model/User.js";

const TICKET_PRICES = {
  VIP: 500,
  Standard: 300,
  Student: 200,
};

const fakeChargeCard = async () => {
  await new Promise((r) => setTimeout(r, 800));
  return { status: "success", transactionId: Date.now().toString() };
};

export const createBookingController = async (req, res) => {

  try {
    const {
      ticket_type,
      quantity,
      customer_name,
      billing_address,
      card_number,
    } = req.body;

    if (!ticket_type || !quantity || !customer_name || !billing_address) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const pricePerTicket = TICKET_PRICES[ticket_type] || 0;
    const subtotal = pricePerTicket * quantity;
    const fee = Math.round(subtotal * 0.05);
    const total = subtotal + fee;
    const firebaseUid = req.user.firebase_uid; // From your auth middleware

    console.log("Creating booking for firebase_uid:", firebaseUid);
    const paymentResult = await fakeChargeCard(card_number);

    const user = await User.findOne({ where: { firebase_uid:firebaseUid } });
console.log("Found user:", user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const booking = await Booking.create({
      eventName: "Summer Music Festival 2025",
      ticketType: ticket_type,
      quantity,
      customerName: customer_name,
      billingAddress: billing_address,
      totalPrice: total,
      paymentStatus: paymentResult.status,
      createdBy:user.id,
    });

    res.status(201).json({
      message: "Booking created",
      booking,
      payment: paymentResult,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

export const Getmybookings = async(req,res)=>{
try{
  const uid = req.user.uid
const bookings = Booking.findAll({where:{createdBy:uid}})
res.status(200).send({data:bookings,message:"fetched all bookings suscessfully"})
}
catch(e){
res.status(500).send({message:"Failed to fetch bookings"})
}
};
