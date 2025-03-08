import {
  StyleSheet,
  Text,
  View,
  SectionList,
  Button,
  Modal,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TimerControls from '../components/timerControls';
import ProgressBar from '../components/progressBar';
import {useFocusEffect} from '@react-navigation/native';

const Home = ({navigation}) => {
  const [timers, setTimers] = useState([]);
  const [completedTimers, setCompletedTimers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [completedTimer, setCompletedTimer] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({}); //Track expanded/collapsed categories

  // Load timers from AsyncStorage when the component mounts
  useEffect(() => {
    loadTimers();
    loadCompletedTimers();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prevTimers =>
        prevTimers.map(timer => {
          if (timer.isRunning && timer.remainingTime > 0) {
            const newRemainingTime = timer.remainingTime - 1;

            // Check for halfway alert
            if (
              timer.enableAlert &&
              !timer.alertTriggered &&
              newRemainingTime <= Math.floor(timer.duration / 2)
            ) {
              Alert.alert(
                'Halfway Alert',
                `You're halfway through the timer: ${timer.name}`,
              );
              timer.alertTriggered = true; // Mark alert as triggered
            }

            // Return updated timer
            return {...timer, remainingTime: newRemainingTime};
          } else if (timer.remainingTime === 0 && timer.isRunning) {
            handleTimerComplete(timer); // Handle completion
            return {...timer, isRunning: false}; // Stop the timer
          }
          return timer;
        }),
      );
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [timers]);

  const loadTimers = async () => {
    const storedTimers = JSON.parse(await AsyncStorage.getItem('timers')) || [];

    // Reset alertTriggered for ALL timers
    const updatedTimers = storedTimers.map(timer => ({
      ...timer,
      remainingTime: timer.duration,
      alertTriggered: false,
      isRunning: timer.isRunning || false,
    }));

    setTimers(updatedTimers);
  };

  const loadCompletedTimers = async () => {
    const storedCompletedTimers =
      JSON.parse(await AsyncStorage.getItem('completedTimers')) || [];
    setCompletedTimers(storedCompletedTimers);
  };

  useFocusEffect(
    useCallback(() => {
      loadTimers();
      loadCompletedTimers();
    }, []),
  );

  // Handle timer completion
  const handleTimerComplete = async timer => {
    setCompletedTimer(timer);
    setModalVisible(true);

    // Create a new entry for the completed timer
    const newCompletedTimer = {
      ...timer,
      id: Date.now(),
      status: 'Completed',
    };

    // Add the new entry to the timers array
    const updatedCompletedTimers = [...completedTimers, newCompletedTimer];
    setCompletedTimers(updatedCompletedTimers);

    // Save the updated timers to AsyncStorage
    await AsyncStorage.setItem(
      'completedTimers',
      JSON.stringify(updatedCompletedTimers),
    );

    // Update the timer status in the main timers list
    setTimers(prevTimers =>
      prevTimers.map(t =>
        t.id === timer.id ? {...t, status: 'Completed'} : t,
      ),
    );
  };

  const updateTimer = async updatedTimer => {
    // Determine the status based on the timer's state
    let status = updatedTimer.isRunning ? 'Running' : 'Paused';
    if (updatedTimer.remainingTime === 0) {
      status = 'Completed';
    }

    const updatedTimers = timers.map(timer =>
      timer.id === updatedTimer.id ? {...updatedTimer, status} : timer,
    );
    setTimers(updatedTimers);

    // Save updated timers to AsyncStorage
    await AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
  };

  //   Toggle expand/collapse for a category
  const toggleCategory = category => {
    setExpandedCategories(prevState => ({
      ...prevState,
      [category]: !prevState[category], //Toggle the expanded state
    }));
  };

  // Bulk actions for a category
  const startAllTimersInCategory = category => {
    setTimers(prevTimers =>
      prevTimers.map(timer =>
        timer.category === category
          ? {
              ...timer,
              isRunning: true,
              alertTriggered: false,
              status: 'Running',
            }
          : timer,
      ),
    );
  };

  const pauseAllTimersInCategory = category => {
    setTimers(prevTimers =>
      prevTimers.map(timer =>
        timer.category === category
          ? {...timer, isRunning: false, status: 'Paused'}
          : timer,
      ),
    );
  };

  const resetAllTimersInCategory = category => {
    setTimers(prevTimers =>
      prevTimers.map(timer =>
        timer.category === category
          ? {
              ...timer,
              remainingTime: timer.duration,
              isRunning: false,
              alertTriggered: false,
              status: 'Paused',
            }
          : timer,
      ),
    );
  };

  // Group timers by category
  const groupedTimers = timers.reduce((acc, timer) => {
    if (!acc[timer.category]) acc[timer.category] = [];
    acc[timer.category].push(timer);
    return acc;
  }, {});

  // Convert grouped timers into sections for SectionList
  const sections = Object.keys(groupedTimers).map(category => ({
    title: category,
    data: groupedTimers[category],
  }));

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.timerItem}>
            <Text style={{color: 'black', fontWeight:'700'}}>{item.name}</Text>
            <Text>{item.duration}s</Text>
            <Text style={{alignItems:'center',}}>
              Status:{' '}
              <Text
                style={[
                  styles.statusText,
                  item.status === 'Completed' && styles.completedStatus,
                ]}>
                {item.status}
              </Text>
            </Text>
            
            {/* Timer controls (start, pause, reset) */}
            <TimerControls
              timer={item}
              onUpdate={updateTimer}
              onComplete={handleTimerComplete}
            />
          </View>
        )}
        renderSectionHeader={({section}) => (
          <View style={styles.sectionHeaderContainer}>
            <TouchableOpacity
              onPress={() => toggleCategory(section.title)}
              style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{section.title}</Text>
              <Text style={styles.toggleIcon}>
                {expandedCategories[section.title] ? '▼' : '▶'}
              </Text>
            </TouchableOpacity>
            {expandedCategories[section.title] && (
              <View style={styles.bulkActions}>
                <Button
                  title="Start All"
                  onPress={() => startAllTimersInCategory(section.title)}
                />
                <Button
                  title="Pause All"
                  onPress={() => pauseAllTimersInCategory(section.title)}
                />
                <Button
                  title="Reset All"
                  onPress={() => resetAllTimersInCategory(section.title)}
                />
              </View>
            )}
          </View>
        )}
        SectionSeparatorComponent={() => <View style={styles.sectionSeparator} />}
      />

      <View style={{marginTop: 20}}>
        <Button
          title="Add Timer"
          onPress={() => navigation.navigate('AddTimer')}
        />
      </View>

      {/* Button to navigate to the History screen */}
      <View style={{marginTop: 10}}>
        <Button
          title="View History"
          onPress={() => navigation.navigate('History')}
        />
      </View>

      {/* Modal for timer completion */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Congratulations! Timer {completedTimer?.name} has completed.
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  sectionHeaderContainer: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  sectionSeparator: {
    height: 20,
    backgroundColor: 'transparent',
  },
  toggleIcon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bulkActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  timerItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  statusText: {
    color: 'black',
  },
  completedStatus: {
    color: 'blue',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
