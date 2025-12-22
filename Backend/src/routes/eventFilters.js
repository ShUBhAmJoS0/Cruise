import express from 'express';
import { pool } from '../Database/db.js';

const router = express.Router();

// Get filtered events
router.get('/filter', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, location, date } = req.query;
    
    let query = 'SELECT * FROM "Events" WHERE 1=1';
    const params = [];
    let paramCount = 1;

    // Add category filter
    if (category) {
      query += ` AND category = $${paramCount++}`;
      params.push(category);
    }

    // Add price range filter
    if (minPrice) {
      query += ` AND (SELECT MIN(value::numeric) FROM jsonb_each_text(prices)) >= $${paramCount++}`;
      params.push(minPrice);
    }
    if (maxPrice) {
      query += ` AND (SELECT MAX(value::numeric) FROM jsonb_each_text(prices)) <= $${paramCount++}`;
      params.push(maxPrice);
    }

    // Add location filter
    if (location) {
      query += ` AND location ILIKE $${paramCount++}`;
      params.push(`%${location}%`);
    }

    // Add date filter
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
});

export default router;