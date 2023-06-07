const Exercise = require('../../database/models/exercise');
const mongoose = require('mongoose');
const db = require('../../database/index.js');

function createExercise(req, res) {
  const {name, notes} = req.body;
  const exercise = new Exercise({
    _id: new mongoose.Types.ObjectId(),
    name,
    notes,
  });

  exercise
    .save()
    .then(result => {
      res.status(201).json(result);
    })
    .catch(error => {
      res.status(500).json({error: 'Failed to create exercise'});
    });
}

function getAllExercises(req, res) {
  Exercise.find()
    .then(exercises => {
      res.json(exercises);
    })
    .catch(error => {
      res.status(500).json({error: 'Failed to fetch exercises'});
    });
}

function updateExercise(req, res) {
  const exerciseId = req.params.id;
  const {name, notes} = req.body;

  Exercise.findByIdAndUpdate(exerciseId, {name, notes}, {new: true})
    .then(updatedExercise => {
      if (!updatedExercise) {
        res.status(404).json({error: 'Exercise not found'});
      } else {
        res.json(updatedExercise);
      }
    })
    .catch(error => {
      res.status(500).json({error: 'Failed to update exercise'});
    });
}

function deleteExercise(req, res) {
  const exerciseId = req.params.id;

  Exercise.findByIdAndRemove(exerciseId)
    .then(deletedExercise => {
      if (!deletedExercise) {
        res.status(404).json({error: 'Exercise not found'});
      } else {
        res.json({message: 'Exercise deleted successfully'});
      }
    })
    .catch(error => {
      res.status(500).json({error: 'Failed to delete exercise'});
    });
}

module.exports = {
  createExercise,
  getAllExercises,
  updateExercise,
  deleteExercise,
};
