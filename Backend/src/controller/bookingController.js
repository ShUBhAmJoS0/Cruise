// backend/src/controller/bookingController.js
import Booking from "../model/Booking.js";
import User from "../model/User.js";
import Event from "../model/Event.js";

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
      eventId,
    } = req.body;

    if (!ticket_type || !quantity || !customer_name || !billing_address || !eventId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Fetch the event to get the correct name and prices
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const ticketPrices = event.prices || {};
    const pricePerTicket = ticketPrices[ticket_type] || 0;
    const subtotal = pricePerTicket * quantity;
    const fee = Math.round(subtotal * 0.05);
    const total = subtotal + fee;
    const firebaseUid = req.user.firebase_uid;

    console.log("Creating booking for firebase_uid:", firebaseUid);
    const paymentResult = await fakeChargeCard(card_number);

    const user = await User.findOne({ where: { firebase_uid: firebaseUid } });
    console.log("Found user:", user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const booking = await Booking.create({
      eventName: event.title,
      ticketType: ticket_type,
      quantity,
      customerName: customer_name,
      billingAddress: billing_address,
      totalPrice: total,
      paymentStatus: paymentResult.status,
      createdBy: user.id,
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
  const firebaseUid = req.user.firebase_uid;
  const user = await User.findOne({ where: { firebase_uid: firebaseUid } });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const bookings = await Booking.findAll({where:{createdBy:user.id}})
  res.status(200).send({data:bookings,message:"fetched all bookings successfully"})
}
catch(e){
res.status(500).send({message:"Failed to fetch bookings"})
}
};
