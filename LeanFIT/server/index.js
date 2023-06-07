const express = require('express');
const exerciseRoutes = require('./routes/exerciseRoutes');
const workoutRoutes = require('./routes/workoutRoutes');

const app = express();

app.use(express.json());

app.use('/api/exercises', exerciseRoutes);
app.use('/api/workouts', workoutRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
