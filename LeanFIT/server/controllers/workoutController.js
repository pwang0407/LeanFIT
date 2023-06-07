const Workout = require('../../database/models/workout');

function createWorkout(req, res) {
  const {date, exercise, sets, reps, weight} = req.body;
  const workout = new Workout({date, exercise, sets, reps, weight});

  workout
    .save()
    .then(result => {
      res.status(201).json(result);
    })
    .catch(error => {
      res.status(500).json({error: 'Failed to create workout'});
    });
}

function getWorkout(req, res) {
  const {date} = req.query;

  if (date) {
    Workout.find({date})
      .then(workouts => {
        res.json(workouts);
      })
      .catch(error => {
        res.status(500).json({error: 'Failed to fetch workouts'});
      });
  } else {
    Workout.find()
      .then(workouts => {
        res.json(workouts);
      })
      .catch(error => {
        res.status(500).json({error: 'Failed to fetch workouts'});
      });
  }
}

module.exports = {createWorkout, getWorkout};
