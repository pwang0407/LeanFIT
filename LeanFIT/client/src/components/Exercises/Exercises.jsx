import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';

function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseNotes, setNewExerciseNotes] = useState('');

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = () => {
    axios
      .get('http://localhost:3000/api/exercises')
      .then((response) => {
        setExercises(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
  };

  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteExercise = (exerciseId) => {
    axios
      .delete(`http://localhost:3000/api/exercises/${exerciseId}`)
      .then(() => {
        setExercises((prevExercises) =>
          prevExercises.filter((exercise) => exercise._id !== exerciseId)
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleRenameExercise = (exerciseId, exerciseName) => {
    setSelectedExerciseId(exerciseId);
    setNewExerciseName(exerciseName);
    setIsModalVisible(true);
  };

  const handleNewExerciseNameChange = (text) => {
    setNewExerciseName(text);
  };

  const handleRename = () => {
    axios
      .put(`http://localhost:3000/api/exercises/${selectedExerciseId}`, {
        name: newExerciseName,
      })
      .then((response) => {
        const updatedExercises = exercises.map((exercise) => {
          if (exercise._id === selectedExerciseId) {
            return { ...exercise, name: newExerciseName };
          }
          return exercise;
        });

        setExercises(updatedExercises);
        setIsModalVisible(false);
        setNewExerciseName('');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setNewExerciseName('');
    setNewExerciseNotes('');
  };

  const addExercise = () => {
    axios
      .post('http://localhost:3000/api/exercises', {
        name: newExerciseName,
        notes: newExerciseNotes,
      })
      .then((response) => {
        const newExercise = response.data;
        setExercises((prevExercises) => [...prevExercises, newExercise]);
        handleCloseModal();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleAddExercise = () => {
    setIsModalVisible(true);
  };


  return (
    <View style={styles.container}>
    {/* Header */}
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>Exercises</Text>
      <TouchableOpacity style={styles.addButton} onPress={handleAddExercise}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>

    {/* Search Bar */}
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search exercises"
        value={searchTerm}
        onChangeText={handleSearch}
      />
    </View>

    {/* Exercise List */}
    <ScrollView style={styles.exerciseList}>
      {filteredExercises.map((exercise) => (
        <View key={exercise._id} style={styles.exerciseCard}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Text style={styles.exerciseNotes}>{exercise.notes}</Text>
          <View style={styles.slideButtonsContainer}>
            <TouchableOpacity
              style={styles.slideButton}
              onPress={() => handleRenameExercise(exercise._id, exercise.name)}
            >
              <Text>Rename</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.slideButton}
              onPress={() => handleDeleteExercise(exercise._id)}
            >
              <Text>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>

    {/* Modal */}
    <Modal visible={isModalVisible} animationType="slide">
      <View style={styles.modalContainer}>
        <Text style={styles.modalHeader}>Create New Exercise</Text>
        <TextInput
          style={styles.modalInput}
          placeholder="Exercise Name"
          value={newExerciseName}
          onChangeText={handleNewExerciseNameChange}
        />
        <TextInput
          style={styles.modalInput}
          placeholder="Exercise Notes"
          value={newExerciseNotes}
          onChangeText={setNewExerciseNotes}
        />
        <TouchableOpacity style={styles.modalButton} onPress={addExercise}>
          <Text style={styles.modalButtonText}>Create</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modalButton} onPress={handleCloseModal}>
          <Text style={styles.modalButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  addButton: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: '#2196F3',
  },
  searchContainer: {
    backgroundColor: '#2196F3',
    padding: 10,
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  exerciseList: {
    flex: 1,
    marginBottom: 60,
  },
  exerciseCard: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: '400',
  },
  exerciseNotes: {
    color: '#a9a9a9',
  },
  slideButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  slideButton: {
    backgroundColor: '#CCC',
    borderRadius: 5,
    padding: 5,
    width: 70,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalInput: {
    width: '80%',
    height: 40,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#2196F3',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  modalButtonText: {
    fontSize: 18,
    color: '#FFF',
    textAlign: 'center',
  },
});

export default Exercises;
