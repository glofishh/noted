import React, { Component } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  Platform,
} from 'react-native';
import { Alert } from 'react-native';
import { Audio } from 'expo-av';
import TimeFormatter from 'minutes-seconds-milliseconds';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
momentDurationFormatSetup(moment);
import { Ionicons } from '@expo/vector-icons';

//ignoring depracation warnings LOL
import {YellowBox} from 'react-native';
YellowBox.ignoreWarnings(['Warning: ReactNative.createElement']);
console.ignoredYellowBox = ['Warning: ReactNative.createElement'];
console.disableYellowBox = true;
/////////////////////////////////////



export default class TimerScreen extends Component {
  state = {
    started: null,
    timeDifference: null,
    timer: null,
    finished: null,
    currentDate: new Date(),
    markedDate: moment(new Date()).format("YYYY-MM-DD")
  };
  constructor() {
    super();

    this.tick = this.tick.bind(this);
  }

  async playTrack() {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(require('./moo.mp3'));
      await soundObject.playAsync();
      //Your sound is playing!
    } catch (err) {
      //An error occured!
      console.error('Sound problems', err);
    }
  }
  componentWillUnmount = () => {
    clearInterval(this.timer);
  }
  handleStart = () => {
    this.setState({ started: moment() }, () => {
      this.timer = setInterval(this.tick, 1000);
    });
  }

  tick = () => {
    this.setState({ timeDifference: moment().diff(this.state.started) });
  }

  handleReset = () => {
    const PATTERN = [1, 1000, 1];
    Vibration.vibrate(PATTERN);
    this.playTrack();
    
    Alert.alert(
    `Time's up!`,
    `Your task took ${moment
        .duration(this.state.timeDifference, 'milliseconds')
        .format('h [hours], m [minutes], s [seconds]')} to complete `,
    );
    this.setState({ timeDifference: null, timer: null, started: false });
    clearInterval(this.timer);
  }

  timerText = () => {
    return (
      <Text style={styles.timerText}>
        { TimeFormatter(this.state.timeDifference).slice(0, -3) }
      </Text>
    );
  }

  render() {
    const today = this.state.currentDate;
    const day = moment(today).format("dddd").toUpperCase();
    const date = moment(today).format("MMMM D, YYYY").toUpperCase();

    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView
          enableAutomaticScroll
          keyboardOpeningTime={0}
        >
          <View style={styles.box}>
            <Text style={styles.day}>{day}</Text>
            <Text style={styles.date}>{date}</Text>
            <Text style={styles.header}>START TIMER</Text>
            <Text style={styles.timer}>{this.timerText()}</Text>
          </View>
          <View
            style={
              (styles.box, { flexDirection: 'row', alignItems: 'baseline' })
            }
          >
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => this.handleStart()}
            >
              <Ionicons name="ios-arrow-dropright" color="black" size={70} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => {
                this.handleReset();
              }}
            >
              <Ionicons
                name="ios-close-circle-outline"
                size={70}
                color="black"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.box}>
            <Text style={styles.header}>MINUTE-TIMER</Text>
            <TextInput
              style={{
                flex: 1,
                alignSelf: 'center',
                color: 'black',
                padding: 5,
                fontFamily: 'ProximaNova-Regular',
                borderBottomWidth: 3,
                fontSize: 50,
                borderTopWidth: 5,
                borderTopColor: '#fff',
                marginBottom: 10,
                width: 135,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              placeholder="+min"
              onChangeText={text => {
                this.handleStart();
                if (text > 0) {
                  setTimeout(() => {
                    this.playTrack();
                    alert(`Time's up! `);
                  }, text * 60000);
                }
                this.setState({ timeDifference: null, timer: null, started: false });
                clearInterval(this.timer);
              }}
              value={this.state.timeGoal}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'column',
  },
  header: {
    textAlign: 'left',
    color: 'black',
    fontFamily: 'ProximaNova-Semibold',
    letterSpacing: -0.5,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 0,
    marginTop: 40,
  },
  day: {
    textAlign: 'right',
    fontFamily: 'ProximaNova-Semibold',
    color: 'black',
    letterSpacing: -0.5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    textAlign: 'right',
    fontFamily: 'ProximaNova-Semibold',
    color: 'black',
    letterSpacing: -0.5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  box: {
    padding: 10,
    flex: 1,
  },
  timer: {
    fontSize: 70,
    fontFamily: 'ProximaNova-Regular',
    textAlign: 'center',
    color: 'black',
    padding: 10,
  },
  buttonContainer: {
    marginHorizontal: 30,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
});
