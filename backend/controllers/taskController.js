const Task = require("../models/Task");

// Create Task
const createTask = async (req, res) => {
  try {

    const {
      title,
      description,
      dueDate,
      assignedTo,
      project,
    } = req.body;

    const task = await Task.create({
      title,
      description,
      dueDate,
      assignedTo,
      project,
      createdBy: req.user.id,
    });

    res.status(201).json(task);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Tasks
const getTasks = async (req, res) => {
  try {

    const tasks = await Task.find()
      .populate("assignedTo", "name email")
      .populate("project", "title");

    res.status(200).json(tasks);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Task Status
const updateTaskStatus = async (req, res) => {
  try {

    const { status } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.status(200).json(task);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTaskStatus,
};