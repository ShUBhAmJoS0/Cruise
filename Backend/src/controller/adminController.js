import User from "../model/User.js";
import Event from "../model/Event.js";
import Booking from "../model/Booking.js";
import Order from "../model/Order.js";
import Notification from "../model/Notification.js";
import sequelize from "../Database/db.js";
import { Op } from "sequelize";

export const getDashboardStats = async (req, res) => {
  try {
    // users count cha ya
    const totalUsers = await User.count();


    const totalArtists = await User.count({
      where: { userType: "Artist" }
    });

    // pending req ya
    const pendingEventRequests = await Event.count({
      where: { status: "pending" }
    });

    // upcoming events yah
    const upcomingEvents = await Event.count({
      where: {
        status: "Approved",
        date: {
          [Op.gte]: new Date()
        }
      }
    });

    //  total events
    const totalEvents = await Event.count();

    //  total bookings/orders for revenue calculation
    const totalOrders = await Order.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('total_price')), 'totalRevenue'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalBookings']
      ],
      raw: true
    });

    const totalRevenue = totalOrders[0]?.totalRevenue || 0;
    const bookingsThisMonth = totalOrders[0]?.totalBookings || 0;

    // Get current month bookings count
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    const monthlyBookings = await Order.count({
      where: {
        createdAt: {
          [Op.gte]: firstDayOfMonth
        }
      }
    });

    res.status(200).json({
      totalUsers,
      artistsLoggedIn: totalArtists,
      upcomingEvents,
      totalEvents,
      totalRevenue: parseInt(totalRevenue) || 0,
      bookingsThisMonth: monthlyBookings || 0,
      pendingEventRequests
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
};

export const getPendingEventRequests = async (req, res) => {
  try {
    console.log("Fetching pending event requests...");
    const pendingEvents = await Event.findAll({
      where: { status: "pending" },
      include: [
        {
          model: User,
          as: "artist",
          attributes: ['id', 'name', 'email', 'profileImage']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    console.log(`Found ${pendingEvents.length} pending events.`);
    res.status(200).json({
      data: pendingEvents,
      count: pendingEvents.length,
      message: "Pending event requests retrieved successfully"
    });
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    res.status(500).json({
      message: 'Failed to fetch pending requests',
      error: error.message
    });
  }
};

export const approveEventRequest = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.status = "Approved";
    await event.save();

    res.status(200).json({
      message: 'Event request approved successfully',
      event
    });
  } catch (error) {
    console.error('Error approving event:', error);
    res.status(500).json({
      message: 'Failed to approve event request',
      error: error.message
    });
  }
};

export const rejectEventRequest = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { reason } = req.body;

    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.status = "Rejected";
    await event.save();

    res.status(200).json({
      message: 'Event request rejected successfully',
      event
    });
  } catch (error) {
    console.error('Error rejecting event:', error);
    res.status(500).json({
      message: 'Failed to reject event request',
      error: error.message
    });
  }
};

export const getUserAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const attendees = await User.count({ where: { userType: "Attendee" } });
    const artists = await User.count({ where: { userType: "Artist" } });

    // Get users created this month
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    const newUsersThisMonth = await User.count({
      where: {
        createdAt: {
          [Op.gte]: firstDayOfMonth
        }
      }
    });

    res.status(200).json({
      totalUsers,
      attendees,
      artists,
      newUsersThisMonth,
      percentage: {
        attendeePercentage: ((attendees / totalUsers) * 100).toFixed(2),
        artistPercentage: ((artists / totalUsers) * 100).toFixed(2)
      }
    });
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    res.status(500).json({
      message: 'Failed to fetch user analytics',
      error: error.message
    });
  }
};

export const getEventAnalytics = async (req, res) => {
  try {
    const totalEvents = await Event.count();
    const approvedEvents = await Event.count({ where: { status: "Approved" } });
    const pendingEvents = await Event.count({ where: { status: "pending" } });
    const rejectedEvents = await Event.count({ where: { status: "Rejected" } });

    // Get upcoming events
    const upcomingEvents = await Event.count({
      where: {
        status: "Approved",
        date: {
          [sequelize.Op.gte]: new Date()
        }
      }
    });

    res.status(200).json({
      totalEvents,
      approvedEvents,
      pendingEvents,
      rejectedEvents,
      upcomingEvents,
      percentages: {
        approvedPercentage: ((approvedEvents / totalEvents) * 100).toFixed(2),
        pendingPercentage: ((pendingEvents / totalEvents) * 100).toFixed(2),
        rejectedPercentage: ((rejectedEvents / totalEvents) * 100).toFixed(2)
      }
    });
  } catch (error) {
    console.error('Error fetching event analytics:', error);
    res.status(500).json({
      message: 'Failed to fetch event analytics',
      error: error.message
    });
  }
};

export const getRevenueAnalytics = async (req, res) => {
  try {
    const totalOrders = await Order.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('total_price')), 'totalRevenue']
      ],
      raw: true
    });

    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);

    const monthlyRevenue = await Order.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('total_price')), 'revenue']
      ],
      where: {
        createdAt: {
          [Op.gte]: firstDayOfMonth
        }
      },
      raw: true
    });

    const yearlyRevenue = await Order.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('total_price')), 'revenue']
      ],
      where: {
        createdAt: {
          [Op.gte]: firstDayOfYear
        }
      },
      raw: true
    });

    res.status(200).json({
      totalRevenue: parseInt(totalOrders[0]?.totalRevenue) || 0,
      monthlyRevenue: parseInt(monthlyRevenue[0]?.revenue) || 0,
      yearlyRevenue: parseInt(yearlyRevenue[0]?.revenue) || 0
    });
  } catch (error) {
    console.error('Error fetching revenue analytics:', error);
    res.status(500).json({
      message: 'Failed to fetch revenue analytics',
      error: error.message
    });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      order: [['createdAt', 'DESC']],
      limit: 50
    });
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }
    notification.isRead = true;
    await notification.save();
    res.status(200).json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
