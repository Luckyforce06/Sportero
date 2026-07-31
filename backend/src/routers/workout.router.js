const express = require('express');
const router = express.Router();
const { getWorkouts, createWorkout, getWorkoutById } = require('../controllers/workout.controller');
const authMiddleware = require('../middlewares/auth.js');

router.get('/', authMiddleware, getWorkouts);
router.post('/', authMiddleware, createWorkout);
router.get('/:id', authMiddleware, getWorkoutById);

module.exports = router;
