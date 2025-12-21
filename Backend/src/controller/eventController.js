// backend/src/controller/eventController.js

import Event from "../model/Event.js";

export const DisplayAll = async (req, res) => {
  try {
    const events = await Event.findAll();
    // console.log(events)
    res.json(events);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

export const AddEvent = async(req,res)=>{
  try {
    const body = req.body;
    const uid = req.user.id;
if (!body.title || !body.description || !body.location || !body.date || !body.time || !body.category || !body.profileImage || !body.prices || typeof body.prices !== "object" || !body.Quantity || typeof body.Quantity !== "object") {
    return res.status(400).json({ message: "All required fields must be filled and valid" });
}
const event = await Event.create({
            title: body.title,
            description: body.description,
            location: body.location,
            date: body.date,
            time: body.time,
            category: body.category,
            images: body.images || [], 
            profileImage: body.profileImage,
            prices: body.prices,
            Quantity: body.Quantity,
            status: "pending",
            createdBy:uid
        });

       res.status(200).json({ message: "Event created successfully", event });
  } catch (e) {
    console.log(e);
    res.status(500).json({message:`failed to add  ${e.message}` })
    
  }
}
export const GetEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    console.log("event found",event)
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to fetch event" });
  }
};

export const GetrequestedEvent = async(req,res)=>{
  try{
     const userId = req.user.id; 
    const requestedEvents = await Event.findAll({where:{createdBy:userId}});
if(!requestedEvents){
  return res.status(404).send({message:"no events found for this user"})
}
res.status(200).send({
  data:"200",
  message:"retrieved requested events sucessfully"
})
  }
  catch(e){
    res.status(500).send({message:e.message})
  }
}