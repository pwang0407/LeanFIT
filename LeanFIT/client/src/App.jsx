/* eslint-disable import/extensions */
import React, { useState } from 'react';
import {
  View, Text, Button, StyleSheet,
} from 'react-native';
import Logs from './components/Logs/Logs';
import Exercises from './components/Exercises/Exercises';
import Graphs from './Graphs';

function App() {
  const [activePage, setActivePage] = useState('Logs');

  const renderPage = () => {
    switch (activePage) {
      case 'Logs':
        return <Logs />;
      case 'Exercises':
        return <Exercises />;
      case 'Graphs':
        return <Graphs />;
      default:
        return null;
    }
  };
  return (
    <View style={styles.container}>
      {renderPage()}
      <View style={styles.navBar}>
        <Button title="Logs" onPress={() => setActivePage('Logs')} />
        <Button title="Exercises" onPress={() => setActivePage('Exercises')} />
        <Button title="Graphs" onPress={() => setActivePage('Graphs')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    padding: 10,
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
});

export default App;
