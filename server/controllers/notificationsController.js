const Notification = require("@model/Notification");


// Get all notifications for a user
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user._id });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get unread notifications for a user
exports.getUnreadNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user._id, read: false });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (notification == null) {
            return res.status(404).json({ message: 'Cannot find notification' });
        }

        if (req.body.read != null) {
            notification.read = req.body.read;
        }

        const updatedNotification = await notification.save();
        res.json(updatedNotification);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
    try {
        const notifications = await Notification.updateMany({ userId: req.user._id }, { read: true });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
