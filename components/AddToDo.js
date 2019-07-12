import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';
import { Feather, MaterialIcons, EvilIcons, Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { Audio } from 'expo-av';


export default class AddToDo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      changedTask: this.props.textValue,
      dataIsReady: false,
      // todos: this.props.todos,
    };
  }

  static propTypes = {
    textValue: PropTypes.string.isRequired,
    isCompleted: PropTypes.bool.isRequired,
    deleteTodo: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    inCompleteTodo: PropTypes.func.isRequired,
    completeTodo: PropTypes.func.isRequired,
    updateTodo: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.loadTodos();
  };

  async playTrack() {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(require('./button.mp3'));
      await soundObject.playAsync();
      // Your sound is playing!
    } catch (err) {
      console.error('Sound problems', err);
    }
  }

  loadTodos = async () => {
    try {
      const getTodos = await AsyncStorage.getItem('todos');
      const parsedTodos = JSON.parse(getTodos);

      this.setState({ dataIsReady: true, todos: parsedTodos || {} });
    } catch (err) {
      console.log(err);
    }
  };

  controlInput = txt => {
    this.setState({ changedTask: txt });
  };

  startEdit = () => {
    this.setState({
      isEditing: true,
    });
  };

  finishEdit = () => {
    const { changedTask } = this.state;
    const { id, updateTodo } = this.props;
    updateTodo(id, changedTask);
    this.setState({
      isEditing: false,
    });
  };

  toggleItem = () => {
    const { isCompleted, inCompleteTodo, completeTodo, id } = this.props;
    if (isCompleted) {
      inCompleteTodo(id);
    } else {
      this.playTrack();
      completeTodo(id);
    }
  };

  render() {
    const { isEditing, changedTask } = this.state;
    const { textValue, id, deleteTodo, isCompleted } = this.props;

    return (
      <View key={this.props.keyval} style={styles.container}>
        {isEditing ? (
          <View key={this.props.keyval} style={styles.buttons}>
            <TouchableOpacity onPress={this.finishEdit}>
              <View style={styles.buttonContainer}>
                <MaterialIcons name="done" size={20} color="black" />
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View key={this.props.keyval} style={styles.buttons}>
            <TouchableOpacity onPress={this.startEdit}>
              <View style={styles.buttonContainer}>
                <Feather name="edit-2" size={20} color="black" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.props.timer}
              style={styles.buttonContainer}
            >
              <Feather name="alert-circle" size={20} color="black" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => deleteTodo(id)}
              style={styles.buttonContainer}
            >
              <MaterialIcons name="clear" size={20} color="black" />
            </TouchableOpacity>
          </View>
        )}

        {isEditing ? (
          <TextInput
            style={[
              styles.editText,
              isCompleted ? styles.strikeText : styles.unstrikeText,
            ]}
            multiline={true}
            onBlur={this.finishEdit}
            onChangeText={this.controlInput}
            value={changedTask}
          />
        ) : (
          <TouchableOpacity onPress={this.toggleItem}>
            <Text
              style={[
                styles.text,
                isCompleted ? styles.strikeText : styles.unstrikeText,
              ]}
            >
              {textValue}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  text: {
    paddingLeft: 10,
    alignSelf: 'stretch',
    color: 'black',
    letterSpacing: 0,
    fontSize: 18,
    fontFamily: 'ProximaNova-Regular',
    marginRight: 60,
  },
  editText: {
    paddingLeft: 10,
    alignSelf: 'stretch',
    color: '#a9a9a9',
    letterSpacing: 0,
    fontSize: 20,
    // fontStyle: 'italic',
    fontFamily: 'ProximaNova-Regular',
    marginRight: 5,
  },
  strikeText: {
    color: '#a9a9a9',
    textDecorationLine: 'line-through',
    fontStyle: 'italic',
  },
  unstrikeText: {
    // color: 'black',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  buttonContainer: {
    marginVertical: 10,
    marginHorizontal: 5,
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
});
