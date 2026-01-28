// backend/src/routes/adminRoutes.js

import express from 'express';
import {
  getDashboardStats,
  getAllEventRequests,
  approveEventRequest,
  rejectEventRequest,
  getUserAnalytics,
  getEventAnalytics,
  getRevenueAnalytics,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from '../controller/adminController.js';

const router = express.Router();

// Dashboard stats - main dashboard overview (any authenticated user can access for now)
router.get('/dashboard-stats', getDashboardStats);

// Notifications
router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationAsRead);
router.put('/notifications/mark-all-read', markAllNotificationsAsRead);

// Event requests management
router.get('/event-requests', getAllEventRequests);
router.post('/event-requests/:eventId/approve', approveEventRequest);
router.post('/event-requests/:eventId/reject', rejectEventRequest);

// Analytics endpoints
router.get('/analytics/users', getUserAnalytics);
router.get('/analytics/events', getEventAnalytics);
router.get('/analytics/revenue', getRevenueAnalytics);

export default router;
