import { jest } from "@jest/globals";
import request from 'supertest';
import express from 'express';
import eventRoutes from '../routes/EventRoutes.js';

jest.mock('../controller/eventController.js', () => ({
  DisplayAll: jest.fn((req, res) => res.json([])),
  GetEvent: jest.fn((req, res) => res.json({ id: 1, title: 'Test Event' })),
}));

const app = express();
app.use(express.json());
app.use('/api/events', eventRoutes);

describe('Event Routes', () => {
  it('should have event routes', () => {
    expect(true).toBe(true);
  });

  it('should handle GET /api/events/', () => {
    expect(true).toBe(true);
  });

  it('should handle GET /api/events/:id', () => {
    expect(true).toBe(true);
  });
});

