const Notification = require("@model/Notification");
const User = require("@model/User");
const { asyncWrapper } = require("@middleware/asyncWrapper");

// Get all notifications for a user
exports.getNotifications = asyncWrapper(async (req, res) => {
	const userId = req?.user?.id;
	const user = await User.findById(userId);
	if (!user) {
		return res.status(404).json({ message: `Requesting user not found` });
	}
	const notifications = await Notification.find({ userId: req?.user?.id }).populate("userFrom").populate("post");
	res.status(200).json({ message: "Get Notifications  successfully", data: notifications });
});

// Get unread notifications for a user
exports.getUnreadNotifications = async (req, res) => {
	try {
		const notifications = await Notification.find({ userId: req.user._id, read: false });
		res.json(notifications);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Mark a notification as read
exports.markAsRead = asyncWrapper(async (req, res) => {
	const { notifId } = req.params;

	const notification = await Notification.findById(notifId);
	if (!notification) {
		return res.status(404).json({ message: "Cannot find notification" });
	}

	notification.read = true;

	const updatedNotification = await notification.save();
	res.status(200).json({ message: "MarK Notification as Read", data: updatedNotification });
});

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
	try {
		const notifications = await Notification.updateMany({ userId: req.user._id }, { read: true });
		res.json(notifications);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
