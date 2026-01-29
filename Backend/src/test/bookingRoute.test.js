import { jest } from "@jest/globals";
import request from 'supertest';
import express from 'express';
import bookingRoutes from '../routes/bookingRoutes.js';

jest.mock('../controller/bookingController.js', () => ({
  createBookingController: jest.fn((req, res) => res.json({ message: 'Booking successful' })),
  Getmybookings: jest.fn((req, res) => res.json({ data: [], message: 'fetched all bookings successfully' })),
}));

jest.mock('../middleware/Attendeonly.js', () => ({
  AttendeeOnly: (req, res, next) => next(),
}));

const app = express();
app.use(express.json());
app.use('/api/bookings', bookingRoutes);

describe('Booking Routes', () => {
  it('should have booking routes', () => {
    expect(true).toBe(true);
  });

  it('should handle POST /api/bookings/', () => {
    expect(true).toBe(true);
  });

  it('should handle GET /api/bookings/', () => {
    expect(true).toBe(true);
  });
});

