const express = require('express');
const auth = require('../auth/authMiddleware');

const {
  getTasks,
  createTask,
  toggleTask,
  deleteTask,
} = require('../controllers/taskController');

const router = express.Router();

router.get('/', auth, getTasks);
router.post('/', auth, createTask);
router.put('/:id', auth, toggleTask);
router.delete('/:id', auth, deleteTask);

module.exports = router;
