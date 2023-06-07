import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import ExerciseFormModal from './ExerciseFormModal';

function Logs({ navigation }) {
  const [workouts, setWorkouts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [allWorkouts, setAllWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/workouts')
      .then((response) => {
        setAllWorkouts(response.data);
        console.log('this is allWorkouts', allWorkouts);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (selectedDate) {
      axios
        .get('http://localhost:3000/api/workouts', {
          params: { date: selectedDate },
        })
        .then((response) => {
          setWorkouts(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [selectedDate]);

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/exercises')
      .then((response) => {
        setExercises(response.data);
        console.log('these are exercises', exercises);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date.format('YYYY-MM-DD'));
  };

  const handleAddExercise = () => {
    setIsModalVisible(true);
  };

  const handleSubmit = (exerciseId, sets, reps, weight) => {
    const selectedExercise = exercises.find((exercise) => exercise._id === exerciseId);
    const newWorkout = {
      date: selectedDate,
      exercise: {
        _id: exerciseId,
        name: selectedExercise.name,
        notes: selectedExercise.notes,
      },
      sets: parseInt(sets),
      reps: parseInt(reps),
      weight: parseFloat(weight),
    };
    console.log('THIS IS NEW WORKOUT', newWorkout);
    axios
      .post('http://localhost:3000/api/workouts', newWorkout)
      .then((response) => {
        setWorkouts([...workouts, response.data]);
        setIsModalVisible(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const renderWorkouts = () => {
    if (workouts.length === 0) {
      return (
        <View style={styles.noExerciseContainer}>
          <Text>No exercises yet</Text>
          <View style={styles.addButtonContainer}>
            <TouchableOpacity style={styles.addButton} onPress={handleAddExercise}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return workouts.map((workout) => (
      <View key={workout._id} style={styles.workoutItem}>
        <Text>Exercise: {workout.exercise.name}</Text>
        <Text>Sets: {workout.sets}</Text>
        <Text>Reps: {workout.reps}</Text>
        <Text>Weight: {workout.weight}</Text>
      </View>
    ));
  };

  const isWorkoutDay = (date) => {
    const selectedDate = new Date(date);
    const formattedDate = selectedDate.toISOString().split('T')[0];
    return allWorkouts.some((workout) => workout.date.includes(formattedDate));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerText, { flex: 1 }]}>Logs</Text>
      </View>
      {/* Calendar */}
      <View style={styles.calendarContainer}>
        <CalendarPicker
          onDateChange={handleDateChange}
          selectedDayColor="#2196F3"
          selectedDayTextColor="#fff"
          todayTextStyle={{ fontWeight: 'bold' }}
          customDatesStyles={(date) => {
            if (isWorkoutDay(date)) {
              return {
                containerStyle: {
                  backgroundColor: '#33cc33',
                },
                textStyle: {
                  color: '#fff',
                },
              };
            }
            return {};
          }}
        />
      </View>

      {/* Workouts list */}
      <View style={styles.logsContainer}>
        <ScrollView contentContainerStyle={styles.workoutsContainer}>
          {renderWorkouts()}
        </ScrollView>
      </View>

      {/* Add Exercise button */}
      {workouts.length > 0 && (
        <View style={styles.addButtonContainer}>
          <TouchableOpacity style={styles.addButton} onPress={handleAddExercise}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Exercise Form Modal */}
      <ExerciseFormModal
        isVisible={isModalVisible}
        exercises={exercises}
        handleSubmit={handleSubmit}
        setSelectedExercise={setSelectedExercise}
        setIsModalVisible={setIsModalVisible}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 40,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  calendarContainer: {
    width: '100%',
    marginBottom: 20,
    marginTop: 35,
  },
  logsContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
  },
  workoutsContainer: {
    flexGrow: 1,
  },
  noExerciseContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  workoutItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  addButtonContainer: {
    bottom: 100,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#ccc',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
  },
});

export default Logs;
