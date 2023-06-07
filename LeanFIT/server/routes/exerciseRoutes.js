const express = require('express');
const exerciseController = require('../controllers/exerciseController');

const router = express.Router();

router.post('/', exerciseController.createExercise);
router.put('/:id', exerciseController.updateExercise);
router.get('/', exerciseController.getAllExercises);
router.delete('/:id', exerciseController.deleteExercise);

module.exports = router;
