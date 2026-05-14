const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createTask,
  getTasks,
  updateTaskStatus,
} = require("../controllers/taskController");

// Routes
router.post("/", protect, createTask);

router.get("/", protect, getTasks);

router.put("/:id", protect, updateTaskStatus);

module.exports = router;