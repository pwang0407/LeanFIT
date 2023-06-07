const express = require('express');
const workoutController = require('../controllers/workoutController');

const router = express.Router();

router.post('/', workoutController.createWorkout);
router.get('/', workoutController.getWorkout);

module.exports = router;
