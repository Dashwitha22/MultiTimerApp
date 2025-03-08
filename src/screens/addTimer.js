import {View, Text, TextInput, Button, StyleSheet, Switch} from 'react-native';
import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddTimer = ({navigation}) => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');
  const [enableAlert, setEnableAlert] = useState(false); // State for enabling alerts

  const saveTimer = async () => {
    const newTimer = {
      id: Date.now(), // Unique ID for the timer
      name,
      duration: parseInt(duration),
      category,
      status: 'Paused',
      enableAlert, // Save whether the alert is enabled
      alertTriggered: false, // Track if the alert has been triggered
    };

    // Fetch existing timers from AsyncStorage
    const existingTimers =
      JSON.parse(await AsyncStorage.getItem('timers')) || [];
    // Add the new timer to the list
    const updatedTimers = [...existingTimers, newTimer];
    // Save the updated list back to AsyncStorage
    await AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
    // Navigate back to the Home screen
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Timer</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Duration (seconds)"
        placeholderTextColor="#999"
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Category"
        placeholderTextColor="#999"
        value={category}
        onChangeText={setCategory}
      />

      {/* Switch to enable halfway alert */}
      <View style={styles.alertContainer}>
        <Text style={styles.alertText}>Enable Halfway Alert</Text>
        <Switch
          value={enableAlert}
          onValueChange={setEnableAlert}
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={enableAlert ? '#007BFF' : '#f4f3f4'}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Save" onPress={saveTimer} />
      </View>
    </View>
  );
};

export default AddTimer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff', // Background color for the page
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5, 
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  alertText: {
    fontSize: 16,
    color: '#333', 
  },
  buttonContainer: {
    marginTop: 20,
  },
});
