import React, { useState, useEffect } from 'react';
import { View, Dimensions, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';

const Graphs = () => {
  const [exercises, setExercises] = useState([]);
  const [workoutData, setWorkoutData] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [open, setOpen] = useState(false);

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
        const filteredWorkouts = response.data.filter((workout) => workout.exercise._id === selectedExercise);
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

  const screenWidth = Dimensions.get('window').width;

  const renderGraph = () => {
    if (workoutData.length === 0) {
      return <Text>No workout data available for the selected exercise.</Text>;
    }

    // Sort workout data by date in ascending order
    workoutData.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Extracting dates and weights from workout data
    const dates = workoutData.map((workout) =>
      new Date(workout.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })
    );
    const weights = workoutData.map((workout) => workout.weight || 0);

    const maxWeight = Math.max(...weights);
    const minWeight = Math.min(...weights);

    const graphWidth = screenWidth - 40;
    const barWidth = Math.min(20, graphWidth / workoutData.length);
    const xScale = graphWidth / (workoutData.length - 1);
    const yScale = 180 / (maxWeight - minWeight);

    return (
      <View style={styles.graphContainer}>
        {workoutData.map((workout, index) => (
          <View key={index} style={[styles.dataPoint, { left: index * xScale }]}>
            <View
              style={[
                styles.bar,
                {
                  backgroundColor: 'blue',
                  height: (workout.weight - minWeight) * yScale,
                  width: barWidth,
                },
              ]}
            />
            <View style={styles.dateLabelContainer}>
              <Text style={styles.dateLabel}>{dates[index]}</Text>
            </View>
            <Text style={styles.dataLabel}>{workout.weight || 0}</Text>
          </View>
        ))}
      </View>
    );
  };


  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Graphs</Text>
      </View>
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
      {renderGraph()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 25,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',

  },
  dropdown: {
    marginTop: 10,
    marginBottom: 20,
  },
  graphContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 200,
    paddingHorizontal: 20,
  },
  dataPoint: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  bar: {
    borderRadius: 5,
  },
  dateLabelContainer: {
    transform: [{ rotate: '270deg' }],
    marginLeft: -10,
  },
  dateLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  dataLabel: {
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
  },
});

export default Graphs;
