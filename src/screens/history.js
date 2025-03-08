import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FlatList} from 'react-native-gesture-handler';

const History = () => {
  const [completedTimers, setCompletedTimers] = useState([]);

  // Load completed timers from AsyncStorage when the component mounts

  const loadCompletedTimers = async () => {
    const storedCompletedTimers =
      JSON.parse(await AsyncStorage.getItem('completedTimers')) || [];

    console.log('Stored Timers:', storedCompletedTimers);
    setCompletedTimers(storedCompletedTimers);
  };

  useEffect(() => {
    loadCompletedTimers();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Completed Timers</Text>
      <FlatList
        data={completedTimers}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.timerItem}>
            <Text style={{color: 'black', fontWeight: '700'}}>{item.name}</Text>
            <Text>Completed at: {new Date(item.id).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default History;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timerItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
