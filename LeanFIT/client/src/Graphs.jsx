import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';

const Graphs = ({ data }) => {
  const [selectedExercise, setSelectedExercise] = useState('');

  // Extracting unique exercise names from the data
  const exerciseOptions = [...new Set(data.map((entry) => entry.exercise))];

  // Filter data based on the selected exercise
  const filteredData = data.filter((entry) => entry.exercise === selectedExercise);

  return (
    <div>
      <select
        value={selectedExercise}
        onChange={(e) => setSelectedExercise(e.target.value)}
      >
        <option value="">Select Exercise</option>
        {exerciseOptions.map((exercise, index) => (
          <option key={index} value={exercise}>
            {exercise}
          </option>
        ))}
      </select>
      {selectedExercise && (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Legend />
            <Line type="monotone" dataKey="weights" name="Weights" stroke="#8884d8" />
            <Line type="monotone" dataKey="reps" name="Reps" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Graphs;
