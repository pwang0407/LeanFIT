import React, { useState, useEffect } from 'react';
import { View, Dimensions, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import { LineChart } from "react-native-charts-wrapper";
import { Bar } from 'react-native-pathjs-charts'

const Graphs = () => {
  const [exercises, setExercises] = useState([]);
  const [workoutData, setWorkoutData] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState({});
  const [open, setOpen] = useState(false);

  const screenWidth = Dimensions.get('window').width;

  const handleExerciseChange = (exerciseId) => {
    console.log('THIS IS SELECTED EXERCISE');
    setSelectedExercise(exerciseId);
  };

  useEffect(() => {
    if (selectedExercise === null) {
      return;
    }
    axios
      .get('http://localhost:3000/api/workouts')
      .then((response) => {
        console.log('this is response', response.data);
        console.log('selectedExercise._id', selectedExercise);
        const filteredWorkouts = response.data.filter((workout) => workout.exercise._id === selectedExercise);
        setWorkoutData(filteredWorkouts);

      })
      .catch((error) => {
        console.error(error);
      });
  }, [selectedExercise]);
  console.log('this is workoutData', workoutData);

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/exercises')
      .then((response) => {
        setExercises(response.data);

      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  console.log('Workout Dates:');
  workoutData.map((workout) => console.log(new Date(workout.date).toString()));

  console.log('Workout Weights:');
  workoutData.map((workout) =>
    console.log(workout.weight !== null ? workout.weight.toString() : '0')
  );

  return (
    <View style={styles.container}>
      <DropDownPicker
        placeholder="Select an exercise"
        open={open}
        value={selectedExercise}
        items={exercises.map((exercise) => ({
          label: exercise.name,
          value: exercise._id,
        }))}
        setOpen={setOpen}
        setValue={setSelectedExercise}
        setItems={setExercises}
        style={styles.dropdown}
      />
      {workoutData.length === 0 ? (
        <Text>No workout data available for the selected exercise.</Text>
      ) : (
        <LineChart
        data={{
          datasets: [
            {
              data: workoutData.map((workout) => ({
                x: new Date(workout.date),
                y: workout.weight !== null ? workout.weight : 0,
              })),
              color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
            },
          ],
        }}
        width={screenWidth}
        height={200}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        bezier
        style={styles.chart}
      />
    )}
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdown: {
    width: 200,
  },
});

export default Graphs;
