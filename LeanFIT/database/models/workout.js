const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  date: {type: Date, required: true},
  exercise: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise',
      required: true,
    },
    name: {type: String, required: true},
    notes: String,
  },
  sets: {type: Number, required: true},
  reps: {type: Number, required: true},
  weight: {type: Number, required: true},
});

module.exports = mongoose.model('Workout', workoutSchema);
