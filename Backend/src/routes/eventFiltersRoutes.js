import express from 'express';
import Event from '../model/Event.js';
import sequelize from '../Database/db.js';
import { Op, literal } from 'sequelize';
import { buildEventFilters } from '../utils/eventFilters.js';

const router = express.Router();


router.get('/filter', async (req, res) => {
  try {
    const whereClause = buildEventFilters(req.query);
    const events = await Event.findAll({ where: whereClause });
    res.json(events);
  } catch (err) {
    console.error('Error fetching filtered events:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
