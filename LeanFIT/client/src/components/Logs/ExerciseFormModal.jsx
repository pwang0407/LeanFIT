import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet, KeyboardAvoidingView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

function ExerciseFormModal({ isVisible, handleSubmit, exercises, setExercises, setIsModalVisible }) {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [open, setOpen] = useState(false);
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');

  const handleExerciseChange = (exerciseId) => {
    setSelectedExercise(exerciseId);
  };

  const handleFormSubmit = () => {
    if (selectedExercise) {
      handleSubmit(selectedExercise, sets, reps, weight);
      setSelectedExercise(null);
      setSets('');
      setReps('');
      setWeight('');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedExercise(null);
    setSets('');
    setReps('');
    setWeight('');
  };

  return (
    <Modal visible={isVisible} animationType="slide">
      <View style={modalStyles.container}>
        <Text style={modalStyles.headerText}>Add Exercise</Text>
        <KeyboardAvoidingView behavior="padding" style={modalStyles.formContainer}>
          <View style={modalStyles.inputContainer}>
            <Text>Select Exercise:</Text>
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
              style={modalStyles.dropDownPicker}
              containerStyle={[modalStyles.dropDownContainer, modalStyles.inputContainer]}
              textStyle={modalStyles.dropDownText}
              dropDownStyle={modalStyles.dropDown}
              scrollViewProps={{ scrollEnabled: false }}
              zIndex={5000}
            />
          </View>
          <View style={modalStyles.inputContainer}>
            <Text>Sets:</Text>
            <TextInput
              style={modalStyles.input}
              value={sets}
              onChangeText={setSets}
              keyboardType="numeric"
              required
            />
          </View>
          <View style={modalStyles.inputContainer}>
            <Text>Reps:</Text>
            <TextInput
              style={modalStyles.input}
              value={reps}
              onChangeText={setReps}
              keyboardType="numeric"
              required
            />
          </View>
          <View style={modalStyles.inputContainer}>
            <Text>Weight(kg):</Text>
            <TextInput
              style={modalStyles.input}
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              required
            />
          </View>
          <TouchableOpacity style={modalStyles.addButton} onPress={handleFormSubmit}>
            <Text style={modalStyles.addButtonText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity style={modalStyles.cancelButton} onPress={handleCancel}>
            <Text style={modalStyles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  formContainer: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    width: '100%',
  },
  dropDownPicker: {
    backgroundColor: 'white',
    borderColor: '#ccc',
  },
  dropDownContainer: {
    height: 40,
    marginBottom: 10,
    shadowColor: '#fff',
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 5,
  },
  dropDown: {
    backgroundColor: 'white',
  },
  dropDownText: {
    color: '#333',
  },
  addButton: {
    backgroundColor: '#00aaff',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default ExerciseFormModal;
