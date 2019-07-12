import { createStackNavigator, createAppContainer } from 'react-navigation';
import TodoListScreen from './TodoList';
import TimerScreen from './Timer';
import { Feather, MaterialIcons, EvilIcons, Ionicons } from '@expo/vector-icons';


const NavigationStack = createStackNavigator({
  ToDoList: {
    screen: TodoListScreen,
    navigationOptions: () => ({
      title: `N O T A B L E`,
      headerBackTitle: null,
      headerTitleStyle: {
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 28,
        fontFamily: 'ProximaNova-Semibold',
        justifyContent: 'center',
        flex: 1,
        paddingBottom: 70,
      },
      headerStyle: { marginTop: 32 },
    }),
  },
  Timer: {
    screen: TimerScreen,
    navigationOptions: () => ({
      title: 'T I M E R',
      headerTitleStyle: {
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 28,
        fontFamily: 'ProximaNova-Semibold',
        justifyContent: 'center',
        flex: 0.5,
        paddingBottom: 70,
      },
      headerTintColor: 'black',
      headerStyle: { marginTop: 32 },
    }),
  },
  initialRouteName: 'TodoList',
});

const Container = createAppContainer(NavigationStack);

export default Container;