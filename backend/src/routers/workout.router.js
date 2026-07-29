const express = require('express');
const router = express.Router();
const { getWorkouts, createWorkout } = require('../controllers/workout.controller');

router.get('/', getWorkouts);
router.post('/', createWorkout);

module.exports = router;
