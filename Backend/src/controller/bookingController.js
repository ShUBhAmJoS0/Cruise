
import sequelize from "../Database/db.js";
import Booking from "../model/Booking.js";
import Event from "../model/Event.js";
import User from "../model/User.js";
import crypto from 'crypto';

const fakeChargeCard = async () => {
  await new Promise((r) => setTimeout(r, 800));
  return { status: "success", transactionId: Date.now().toString() };
};
const generateTicketCode = () => {
  const timestamp = Date.now().toString(36).toUpperCase().slice(-6); // Last 6 chars
  const randomPart = crypto.randomBytes(2).toString('hex').toUpperCase(); // 4 chars
  return `TKT-${timestamp}-${randomPart}`;
};
export const createBookingController = async (req, res) => {
  let transaction 

  try {
    const {
      ticket_type,
      quantity,
      customer_name,
      billing_address,
      card_number,
      event_id,
    } = req.body;

    if (!ticket_type || !quantity || !customer_name || !billing_address || !event_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const firebaseUid = req.user.firebase_uid;
 
    const user = await User.findOne({
      where: { firebase_uid: firebaseUid },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

transaction= await sequelize.transaction();
    const event = await Event.findByPk(event_id, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const availableQty = event.Quantity?.[ticket_type];

    if (availableQty === undefined) {
      return res.status(400).json({ message: "Invalid ticket type" });
    }

    if (availableQty < quantity) {
      return res.status(400).json({
        message: `Only ${availableQty} ${ticket_type} tickets left`,
      });
    }

    const pricePerTicket = event.prices[ticket_type];
    const subtotal = pricePerTicket * quantity;
    const fee = Math.round(subtotal * 0.05);
    const total = subtotal + fee;
    const ticketCode = generateTicketCode();
    const paymentResult = await fakeChargeCard(card_number);
    if (paymentResult.status !== "success") {
      return res.status(402).json({ message: "Payment failed" });
    }


    event.Quantity = {
      ...event.Quantity,
      [ticket_type]: availableQty - quantity,
    };

    await event.save({ transaction });

    const booking = await Booking.create(
      {
        ticketCode,
        EventId: event.id,
        eventName: event.title,
        ticketType: ticket_type,
        quantity,
        customerName: customer_name,
        billingAddress: billing_address,
        totalPrice: total,
        paymentStatus: "success",
        createdBy: user.id,
      },
      { transaction }
    );

    await transaction.commit();

    res.status(201).json({
      message: "Booking successful",
      booking: {
        id: booking.id,
        ticketCode: booking.ticketCode,
        eventName: booking.eventName,
        ticketType: booking.ticketType,
        quantity: booking.quantity,
        customerName: booking.customerName,
        totalPrice: booking.totalPrice,
        createdAt: booking.createdAt,
        eventDetails: {
          title: event.title,
          date: event.date,
          time: event.time,
          location: event.location,
        }
      },
      remainingTickets: event.Quantity[ticket_type],
    });
  } catch (err) {
    await transaction.rollback();
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
export const Getmybookings=async(req,res)=>{
  console.log("Fetching bookings for user:", req.user);
  try{
  const uid = req.user.id
  const bookings = await Booking.findAll({where:{createdBy:uid}})
  if (bookings.length===0){
    return res.status(500).send({message:"No bookings found"})
  }
  res.status(200).send({data:bookings,message:"fetched all bookings successfully"})
 
 
}
catch(e){
res.status(500).send({message:"Failed to fetch bookings"})
}

}