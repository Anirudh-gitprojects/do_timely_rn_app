import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, TextInput, Pressable, Modal, Button, TouchableOpacity, Dimensions } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';

// Dimensions api for responsiveness
const { width, height } = Dimensions.get('window');

const Timer = (props) => {
  
  // Timer states and properties
  const [timers, setTimers] = useState([
    { id: props.id, timeLeft: props.timeLeft, isRunning: false, inputTime: props.inputTime, isVisible: props.isVisible },
  ]);
  const [selectedTimerId, setSelectedTimerId] = useState(timers[0].id);
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Start countdown for timers
useEffect(() => {
  const intervals = timers.map((timer) => {
    if (timer.isRunning && timer.timeLeft > 0) {
      return setInterval(() => {
        setTimers(prevTimers => 
          prevTimers.map(t => 
            t.id === timer.id ? { ...t, timeLeft: t.timeLeft - 1 } : t
          )
        );
      }, 1000);
    } else if (timer.timeLeft === 0 && timer.isRunning) {
      Alert.alert(`Timer ${timer.id} has finished!`);
      setTimers(prevTimers =>
        prevTimers.map(t =>
          t.id === timer.id ? { ...t, isRunning: false } : t
        )
      );
    }
  });

  return () => intervals.forEach(interval => clearInterval(interval));
}, [timers]);

  // Pause Timer
  const toggleTimer = (id) => {
    setTimers(timers.map(t => 
      t.id === id ? { ...t, isRunning: !t.isRunning } : t
    ));
  };


  // Reset Timer
  const resetTimer = (id) => setTimers(timers.map(t => t.id === id ? { ...t, timeLeft: t.inputTime, isRunning: false } : t));


  //  Open Edit Timer Modal
  const openModal = (id) => {
    setSelectedTimerId(id);
    setIsModalVisible(true);
  };

  // Update time for the Timer
  const handleUpdateTime = () => {
    const totalSeconds = (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0);
    if (minutes > 60 || seconds > 60) {

      // Check for valid time input
      return Alert.alert("Please enter a valid time.");
    }
    if (totalSeconds > 0) {
      const updatedTimers = timers.map(t => 
        t.id === selectedTimerId ? { ...t, inputTime: totalSeconds, timeLeft: totalSeconds, isRunning: false } : t
      ); // Set updated value for the selected timer.
      setTimers(updatedTimers);
      setIsModalVisible(false);
      setMinutes('');
      setSeconds('');
    } else {
      Alert.alert("Please enter a valid time.");
    }
  };


  // Get the selected timer
  const selectTimer = (id) => setSelectedTimerId(id);

  return (
    <View style={styles.container}>
      {/* Delete icon at the top right corner */}
      <AntDesign name="delete" size={width * 0.08} color="white" style={styles.deleteIcon} onPress={() => props.onRemove(selectedTimerId)} />

      {timers.map(timer => (
        timer.id === selectedTimerId && (
          <View key={timer.id} style={styles.timerContainer}>
            <Pressable style={styles.timerDisplay} onPress={() => openModal(timer.id)}>
              <Text style={styles.timerText}>{formatTime(timer.timeLeft)}</Text>
            </Pressable>
            <View style={styles.iconRow}>
                 {/* Buttons for controlling the timer operations */}
              {timer.isRunning ? (
                <AntDesign name="pausecircle" size={width * 0.1} color="white" onPress={() => toggleTimer(timer.id)} />
              ) : (
                <AntDesign name="play" size={width * 0.1} color="white" onPress={() => toggleTimer(timer.id)} />
              )}
              <Entypo name="back-in-time" size={width * 0.12} color="white" onPress={() => resetTimer(timer.id)} />
            </View>
          </View>
        )
      ))}

      <View style={styles.dotsContainer}>

           {/* Move between timers by clicking on dots */}
        {timers.map(timer => (
          
          <TouchableOpacity key={timer.id} onPress={() => selectTimer(timer.id)}>
            <View style={[styles.dot, selectedTimerId === timer.id && styles.activeDot]} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Modal for changing the timer */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Enter new time:</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Minutes"
                value={minutes}
                onChangeText={setMinutes}
              />
              <Text style={styles.colon}>:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Seconds"
                value={seconds}
                onChangeText={setSeconds}
              />
            </View>
            <View style={styles.buttonRow}>
              <Button title="Confirm" onPress={handleUpdateTime} />
              <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Timer;

const styles = StyleSheet.create({
  container: {
    flex: 3, 
    padding: 20,
  },
  timerContainer: {
    marginVertical: 10,
    padding: 15,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerTitle: {
    fontSize: width * 0.05, // Adjust font size based on screen width
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',
    marginBottom: 10,
  },
  deleteIcon: {
    position: 'absolute',
    top: height * -0.10, // -10% from the top
    right: width * 0.02, // 2% from the right
    zIndex: 1,
  },
  timerDisplay: {
    backgroundColor: 'black',
    marginBottom: 15,
    padding: 10,
  },
  timerText: {
    textAlign: 'center',
    fontSize: width * 0.25, // Adjust timer text size based on screen width
    color: '#fff',
    marginBottom: 10,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '80%',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  dot: {
    width: 50,
    height: 0,
    borderRadius: 5,
    backgroundColor: 'gray',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: 'black',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    width: width * 0.8, // Modal width responsive to screen width
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    width: 60,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    textAlign: 'center',
    marginHorizontal: 5,
  },
  colon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});
