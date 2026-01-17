// backend/src/controller/eventController.js

import Event from "../model/Event.js";
import sequelize from "../Database/db.js";
import { buildEventFilters } from "../utils/eventFilters.js";
import Booking from "../model/Booking.js";
import User from "../model/User.js";

export const DisplayAll = async (req, res) => {
  try {
    const events = await Event.findAll({where:{status:"pending"}});
    res.json(events);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

export const AddEvent = async (req, res) => {
  try {
    const body = req.body;
    const uid = req.user.id;
    console.log("User ID:", uid);
    console.log("Request body:", body);
    console.log("Files:", req.files);

    const prices = JSON.parse(body.prices || '{}');
    const quantity = JSON.parse(body.Quantity || '{}');


    if (!body.title || !body.description || !body.location || !body.date || 
        !body.time || !body.category || !prices || !quantity) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }


    const profileImagePath = req.files?.profileImage?.[0]?.path.replace(/\\/g, '/') || null;
    const imagePaths = req.files?.images?.map(file => file.path.replace(/\\/g, '/'))|| [];

    const event = await Event.create({
      title: body.title,
      description: body.description,
      location: body.location,
      date: body.date,
      time: body.time,
      category: body.category,
      images: imagePaths,
      profileImage: profileImagePath,
      prices: prices,
      Quantity: quantity,
      status: "pending",
      createdBy: uid
    });

    res.status(200).json({ message: "Event created successfully", event });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: `Failed to add: ${e.message}` });
  }
};
export const updateEvent = async (req, res) => {
  console.log("update event api hit");
  try {
    const eventId = req.params.id; 
    const body = req.body;
    const uid = req.user.id;
    
    console.log("Event ID:", eventId);
    console.log("User ID:", uid);
    console.log("Request body:", body);
    console.log("Files:", req.files);

    const existingEvent = await Event.findOne({ where: { id: eventId } });
    
    if (!existingEvent) {
      return res.status(404).json({ message: "Event not found" });
    }


    if (existingEvent.createdBy !== uid) {
      return res.status(403).json({ message: "Unauthorized to update this event" });
    }

    const prices = body.prices ? JSON.parse(body.prices) : existingEvent.prices;
    const quantity = body.Quantity ? JSON.parse(body.Quantity) : existingEvent.Quantity;


    if (!body.title || !body.description || !body.location || !body.date || 
        !body.time || !body.category) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    let profileImagePath = existingEvent.profileImage; 
    let imagePaths = existingEvent.images || []; 
    if (req.files?.profileImage?.[0]) {
      profileImagePath = req.files.profileImage[0].path.replace(/\\/g, '/');
    }


    if (req.files?.images && req.files.images.length > 0) {
      const newImagePaths = req.files.images.map(file => file.path.replace(/\\/g, '/'));
      imagePaths = [...imagePaths, ...newImagePaths];
    }

    await Event.update(
      {
        title: body.title,
        description: body.description,
        location: body.location,
        date: body.date,
        time: body.time,
        category: body.category,
        images: imagePaths,
        profileImage: profileImagePath,
        prices: prices,
        Quantity: quantity,
      },
      {
        where: { id: eventId }
      }
    );
    const updatedEvent = await Event.findOne({ where: { id: eventId } });

    res.status(200).json({ 
      message: "Event updated successfully", 
      event: updatedEvent 
    });
    
  } catch (e) {
    console.error("Update event error:", e);
    res.status(500).json({ message: `Failed to update: ${e.message}` });
  }
};

export const GetEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    console.log("event found",event)
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to fetch event" });
  }
};

export const filterEvent = async (req, res) => {
  try {
    const whereClause = buildEventFilters(req.query);
    const events = await Event.findAll({ where: whereClause });
    res.json(events);
  } catch (err) {
    console.error('Error fetching filtered events:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const GetrequestedEvent = async(req,res)=>{
  try{
     const userId = req.user.id; 
     console.log(userId)
    const requestedEvents = await Event.findAll({where:{createdBy:userId}});
 
if(!requestedEvents){
  return res.status(404).send({message:"no events found for this user"})
}
res.status(200).send({
  data:requestedEvents,
  message:"retrieved requested events sucessfully"
})
  }
  catch(e){
    res.status(500).send({message:e.message})
  }
}
export const getEventbookings = async(req,res)=>{
  console.log("get event bookings api hit")
  try {
    const artistId = req.user.id;
    const eventbookings = await Event.findAll({where:{createdBy:artistId},include:[{model:Booking,include:[{model:User,attributes:["name"]}]}]})
    console.log(eventbookings)
    res.status(200).send({data:eventbookings,message:"sucessfully fetched event bookings"})
  } catch (error) {
    res.status(500).send({message:error})
    
  }
}

