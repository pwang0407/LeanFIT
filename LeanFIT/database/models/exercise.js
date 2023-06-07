const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  notes: String,
});

module.exports = mongoose.model('Exercise', exerciseSchema);
