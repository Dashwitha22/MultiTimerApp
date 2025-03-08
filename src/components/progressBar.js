import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import * as Progress from 'react-native-progress';

const ProgressBar = ({progress}) => {
  return (
    <View style={styles.container}>
      <Progress.Bar
        progress={progress}
        width={200}
        color="#007BFF"
        unfilledColor="#e0e0e0"
        borderWidth={1}
        borderColor='blue'
        borderRadius={5}
      />
    </View>
  )
}

export default ProgressBar;

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        alignItems: 'center',
    },
});