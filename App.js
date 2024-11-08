import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Platform, SafeAreaView } from 'react-native';
import Timer from './src/components/timer';
import { useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

// Get Dimensions for Responsiveness
const { width, height } = Dimensions.get('window');

export default function App() {
  const [timers, setTimers] = useState([]);
  const [nextId, setNextId] = useState(1); // Unique IDs for each timer
  const [visibleTimerId, setVisibleTimerId] = useState(null); // Track visible timer

  useEffect(() => {
    console.log(timers);
  }, [timers]);

  // Add a new timer
  function addTimer() {
    if (timers.length < 5) {
      const newTimerId = nextId;
      setTimers((prevTimers) => [
        ...prevTimers,
        { id: newTimerId, timeLeft: 60, inputTime: 60 }
      ]);
      setNextId((id) => id + 1); // Increment ID for the next timer
      setVisibleTimerId(newTimerId); // Make new timer visible
    } else {
      alert('Max five timers allowed');
    }
  }

  // Remove a timer and adjust IDs
  function removeTimer(id) {
    setTimers((prevTimers) => {
      const newTimers = prevTimers.filter((timer) => timer.id !== id);
  
      // Reassign IDs to the remaining timers
      const reindexedTimers = newTimers.map((timer, index) => ({
        ...timer,
        id: index + 1, // Reassign ID based on position in the array
      }));
  
      // Check if the newTimers array is empty
      if (reindexedTimers.length === 0) {
        setNextId(1); // Reset nextId to 1 if no timers are left
      } else {
        // Update nextId to the max ID + 1, but ensure it doesn't exceed 5
        const newNextId = Math.min(5, Math.max(...reindexedTimers.map(t => t.id)) + 1);
        setNextId(newNextId);
      }
  
      return reindexedTimers;
    });
  
    // If the removed timer was the visible one, make the first remaining timer visible
    if (visibleTimerId === id && timers.length > 1) {
      setVisibleTimerId(timers[0].id);
    } else if (timers.length === 1) {
      setVisibleTimerId(timers[0]?.id); // Handle case when only one timer is left
    }
  }
  

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      {timers.length === 0 ? (
        // Display add button when no timers exist
        <View style={styles.centerContainer}>
          <Text style={styles.addText}>Click to Add Timer</Text>
          <Ionicons name="add-circle-sharp" size={70} color="white" onPress={addTimer} />
        </View>
      ) : (
        <>
          <View style={styles.timerContainer}>
            {timers.map((timer) => (
              <View
                key={timer.id}
                style={[
                  styles.timerWrapper,
                  {
                    opacity: visibleTimerId === timer.id ? 1 : 0,
                    zIndex: visibleTimerId === timer.id ? 1 : 0, // Bring selected timer to front
                  },
                ]}
              >
                <Timer
                  id={timer.id}
                  timeLeft={timer.timeLeft}
                  inputTime={timer.inputTime}
                  onRemove={() => removeTimer(timer.id)}
                />
              </View>
            ))}
          </View>

          {/* Dots representing each timer */}
          <View style={styles.dotsContainer}>
            {timers.map((timer) => (
              <TouchableOpacity
                key={timer.id}
                onPress={() => setVisibleTimerId(timer.id)}
              >
                <View
                  style={[
                    styles.dot,
                    visibleTimerId === timer.id && styles.activeDot,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Add button at the bottom */}
          <View style={styles.addButtonContainer}>
            <Ionicons name="add-circle-sharp" size={70} color="white" onPress={addTimer} />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,  // Dynamic padding based on screen width
    backgroundColor: 'black',
    marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,  // Adjust for iOS notches
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText: {
    color: 'white',
    fontSize: width * 0.05,  // Dynamic font size based on screen width
    marginBottom: 10,
  },
  addButtonContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: height * 0.02,  // Dynamic margin based on screen height
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Overlap all timers in center
  },
  timerWrapper: {
    position: 'absolute', // Overlay each timer on top of each other
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: height * 0.02,  // Dynamic vertical margin based on screen height
  },
  dot: {
    width: width * 0.02,  // Dynamic width based on screen width
    height: width * 0.02,  // Dynamic height based on screen width
    borderRadius: width * 0.01,  // Dynamic border radius based on screen width
    backgroundColor: 'gray',
    marginHorizontal: width * 0.02,  // Dynamic horizontal margin based on screen width
  },
  activeDot: {
    backgroundColor: 'white',
  },
});
