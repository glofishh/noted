import React, { Component } from 'react';
import uuidv1 from 'uuid/v1';
import AddToDo from './AddToDo';
import { KeyboardAvoidingView } from 'react-native';
import {
  StyleSheet,
  View,
  ScrollView,
  AsyncStorage,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';


export default class TodoListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      task: '',
      todos: {},
    };
  }
  componentDidMount() {
    this.loadTodos();
  };

  loadTodos = async () => {
    try {
      const getTodos = await AsyncStorage.getItem('todos');
      const parsedTodos = JSON.parse(getTodos);

      this.setState({ dataIsReady: true, todos: parsedTodos || {} });
    } catch (err) {
      console.log(err);
    }
  };

  taskStored = newToDos => {
    const saveToDos = AsyncStorage.setItem('todos', JSON.stringify(newToDos));

    return saveToDos;
  };

  inCompleteTodo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        todos: {
          ...prevState.todos,
          [id]: {
            ...prevState.todos[id],
            isCompleted: false,
          },
        },
      };

      this.taskStored(newState.todos);
      return { ...newState };
    });
  };

  completeTodo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        todos: {
          ...prevState.todos,
          [id]: {
            ...prevState.todos[id],
            isCompleted: true,
          },
        },
      };
      this.taskStored(newState.todos);
      return { ...newState };
    });
  };

  newTask = txt => {
    this.setState({
      task: txt,
    });
  };

  addNote() {
    const { task } = this.state;
    if (task) {
      this.setState(prevState => {
        const ID = uuidv1();
        const newToDoObject = {
          [ID]: {
            id: ID,
            isCompleted: false,
            textValue: task,
          },
        };
        const newState = {
          ...prevState,
          task: '',
          todos: {
            ...prevState.todos,
            ...newToDoObject,
          },
        };
        this.taskStored(newState.todos);
        return { ...newState };
      });
    }
  }

  updateTodo = (id, textValue) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        todos: {
          ...prevState.todos,
          [id]: {
            ...prevState.todos[id],
            textValue: textValue,
          },
        },
      };
      this.taskStored(newState.todos);
      return { ...newState };
    });
  };

  deleteTodo = id => {
    this.setState(prevState => {
      const todos = prevState.todos;
      delete todos[id];
      const newState = {
        ...prevState,
        ...todos,
      };
      this.taskStored(newState.todos);
      return { ...newState };
    });
  };

  render() {
    const { task, todos, isCompleted } = this.state;

    return (
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
          enabled
          keyboardVerticalOffset={55}
        >
        <ScrollView style={styles.scrollContainer}>
          {Object.values(todos).map(todo => (
            <AddToDo
              key={todo.id}
              {...todo}
              deleteTodo={this.deleteTodo}
              // isCompleted={isCompleted}
              inCompleteTodo={this.inCompleteTodo}
              completeTodo={this.completeTodo}
              updateTodo={this.updateTodo}
              timer={() => this.props.navigation.navigate('Timer')}
            />
          ))}
        </ScrollView>

          <TextInput
            style={styles.textInput}
            placeholder="Add something"
            placerholderTextColor="white"
            onChangeText={this.newTask}
            value={task}
          />


        <TouchableOpacity
          style={styles.addButton}
          onPress={this.addNote.bind(this)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    borderBottomWidth: 1.5,
  },
  scrollContainer: {
    marginBottom: 55,
    marginTop: 10,
  },
  textInput: {
    alignSelf: 'stretch',
    color: 'black',
    paddingLeft: 10,
    paddingBottom: 5,
    borderBottomWidth: 3,
    fontSize: 18,
    fontFamily: 'ProximaNova-Regular',
    borderTopWidth: 5,
    borderTopColor: 'white',
    marginBottom: 60,
  },
  addButton: {
    position: 'absolute',
    zIndex: 11,
    right: 7,
    bottom: 88,
    backgroundColor: 'black',
    width: 80,
    height: 80,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset:{ width: 2,  height: 2, },
    shadowColor: 'black',
    shadowOpacity: .15,
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
  },
});