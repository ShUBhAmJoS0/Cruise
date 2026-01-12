
import sequelize from "../Database/db.js";
import Booking from "../model/Booking.js";
import Event from "../model/Event.js";
import User from "../model/User.js";

const fakeChargeCard = async () => {
  await new Promise((r) => setTimeout(r, 800));
  return { status: "success", transactionId: Date.now().toString() };
};

export const createBookingController = async (req, res) => {
  const transaction = await sequelize.transaction();

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
      booking,
      remainingTickets: event.Quantity[ticket_type],
    });
  } catch (err) {
    await transaction.rollback();
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
export const Getmybookings=async()=>{
  try{
  const uid = req.user.uid
  const user = await User.findOne({ where: { id: uid } });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const bookings = await Booking.findAll({where:{createdBy:user.id}})
  res.status(200).send({data:bookings,message:"fetched all bookings successfully"})
}
catch(e){
res.status(500).send({message:"Failed to fetch bookings"})
}

}