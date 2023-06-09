import React, { useState, useEffect } from 'react';
import { View, Dimensions, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import { BarChart } from 'react-native-chart-kit';

const Graphs = () => {
  const [exercises, setExercises] = useState([]);
  const [workoutData, setWorkoutData] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [open, setOpen] = useState(false);

  const screenWidth = Dimensions.get('window').width;

  const handleExerciseChange = (exerciseId) => {
    setSelectedExercise(exerciseId);
  };

  useEffect(() => {
    if (!selectedExercise) {
      return;
    }
    axios
      .get('http://localhost:3000/api/workouts')
      .then((response) => {
        const filteredWorkouts = response.data.filter(
          (workout) => workout.exercise._id === selectedExercise
        );
        setWorkoutData(filteredWorkouts);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [selectedExercise]);

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
        <BarChart
          data={{
            labels: workoutData.map((workout) => new Date(workout.date).toString()),
            datasets: [
              {
                data: workoutData.map((workout) =>
                  workout.weight !== null ? workout.weight : 0
                ),
              },
            ],
          }}
          width={screenWidth}
          height={220}
          yAxisLabel={'$'}
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
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
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default Graphs;
