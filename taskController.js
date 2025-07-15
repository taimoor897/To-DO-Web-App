const Task = require('../models/Task');

// Get all tasks for logged-in user
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (err) {
    console.error("GET /api/tasks error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create new task with optional start/end dates
exports.createTask = async (req, res) => {
  try {
    const { text, startDate, endDate } = req.body;

    if (!text || !startDate || !endDate) {
      return res.status(400).json({ message: "Please provide text, startDate, and endDate." });
    }

    const task = await Task.create({
      text,
      startDate,
      endDate,
      user: req.user.id,
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("POST /api/tasks error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Toggle task completed status
exports.toggleTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (err) {
    console.error("PUT /api/tasks error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error("DELETE /api/tasks error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
