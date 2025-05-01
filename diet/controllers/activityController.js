const Activity = require("../models/activityModel");

exports.createActivity = async (req, res) => {
  try {
    const { activity, duration, calories } = req.body;

    const newActivity = new Activity({
      userId: req.user.id, // You need verifyToken middleware to set req.user
      activity,
      duration,
      calories,
    });

    await newActivity.save();
    res.status(201).json(newActivity);
  } catch (error) {
    console.error("Error creating activity:", error);
    res.status(500).json({ message: "Failed to create activity" });
  }
};

exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.user.id }).sort({ date: -1 });
    res.status(200).json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ message: "Failed to fetch activities" });
  }
};
