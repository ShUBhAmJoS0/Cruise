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
export const filterEvent =async (req, res) => {
  try {
    const { category, minPrice, maxPrice, location, date } = req.query;
    
    let query = 'SELECT * FROM "Events" WHERE 1=1';
    const params = [];
    let paramCount = 1;

  
    if (category) {
      query += ` AND category = $${paramCount++}`;
      params.push(category);
    }

 
    if (minPrice) {
      query += ` AND (SELECT MIN(value::numeric) FROM jsonb_each_text(prices)) >= $${paramCount++}`;
      params.push(minPrice);
    }
    if (maxPrice) {
      query += ` AND (SELECT MAX(value::numeric) FROM jsonb_each_text(prices)) <= $${paramCount++}`;
      params.push(maxPrice);
    }

  
    if (location) {
      query += ` AND location ILIKE $${paramCount++}`;
      params.push(`%${location}%`);
    }


    if (date) {
      const today = new Date();
      let start, end;

      switch(date) {
        case 'Today':
          start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
          end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
          break;
        case 'Tomorrow':
          start = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
          end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2);
          break;
        case 'This Week':
          start = new Date(today);
          start.setDate(today.getDate() - today.getDay()); // Sunday
          end = new Date(start);
          end.setDate(start.getDate() + 7);
          break;
        case 'This Month':
          start = new Date(today.getFullYear(), today.getMonth(), 1);
          end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          end.setHours(23, 59, 59, 999);
          break;
      }

      query += ` AND date >= $${paramCount++} AND date < $${paramCount++}`;
      params.push(start, end);
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
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