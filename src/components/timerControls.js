import React, {useEffect, useState} from 'react';
import {View, Text, Button, StyleSheet, Alert} from 'react-native';
import ProgressBar from './progressBar';

const TimerControls = ({timer, onUpdate, onComplete}) => {
  // Handle start/pause button press
  const handleStartPause = () => {
    onUpdate({...timer, isRunning: !timer.isRunning});
  };

  //   handle reset button press
  const handleReset = () => {
    onUpdate({
      ...timer,
      remainingTime: timer.duration, // Reset to initial duration
      isRunning: false, // Pause the timer
      alertTriggered: false, // Reset alert
    });
  };

  // Check for halfway alert
  useEffect(() => {
    if (
      timer.enableAlert &&
      !timer.alertTriggered &&
      timer.remainingTime <= Math.floor(timer.duration / 2)
    ) {
      Alert.alert(
        'Halfway Alert',
        `You're halfway through the timer: ${timer.name}`,
      );
      onUpdate({...timer, alertTriggered: true});
    }
  }, [timer.remainingTime, timer.alertTriggered]);

  // Check for timer completion (no interval needed)
  useEffect(() => {
    if (timer.remainingTime === 0 && timer.isRunning) {
      onComplete(timer); // Trigger completion logic
      onUpdate({...timer, isRunning: false}); // Stop the timer
    }
  }, [timer.remainingTime, timer.isRunning]);

  // Calculate progress (0 to 1)
  const progress = (timer.duration - timer.remainingTime) / timer.duration;

  return (
    <View style={styles.container}>
      <Text>{timer.remainingTime}s</Text>
      <ProgressBar progress={progress} />
      <View style={styles.buttonRow}>
        <View>
          <Button
            title={timer.isRunning ? 'Pause' : 'Start'}
            onPress={handleStartPause}
          />
        </View>
        <View style={styles.resetButton}>
          <Button title="Reset" onPress={handleReset} />
        </View>
      </View>
    </View>
  );
};

export default TimerControls;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  resetButton: {
    marginLeft: 20,
  },
});
