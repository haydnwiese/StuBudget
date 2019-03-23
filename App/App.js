import React from 'react';
import { View } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createAppContainer, StackViewTransitionConfigs } from "react-navigation";
import { Ionicons } from 'react-native-vector-icons';
import { createStore, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import firebase from 'firebase';

import DetailsScreen from './Screens/DetailsScreen';
import HomeScreen from './Screens/HomeScreen';
import PurchasesScreen from './Screens/PurchasesScreen';
import EditDetailsScreen from './Screens/EditDetailsScreen';

function reducer(
  state = {
    savingsGoal: 0,
    weeklyAllowance: 0,
    purchases: [],
    remainingWeeks: 0,
    remainingAmount: 0,
    termLength: 0,
    weeklyHours: 0,
    hourlyPay: 0,
    recurringExpenses: [],
  }, action
) 
{
  switch (action.type) {
    case 'INITIAL_DATA':
      return {  
        ...state,
        savingsGoal: action.payload.savingsGoal,
        weeklyAllowance: action.payload.weeklyAllowance,
        purchases: action.payload.purchases,
        remainingWeeks: action.payload.remainingWeeks,
        remainingAmount: action.payload.remainingAmount,
        termLength: action.payload.termLength,
        weeklyHours: action.payload.weeklyHours,
        hourlyPay: action.payload.hourlyPay,
        recurringExpenses: action.payload.recurringExpenses,
      };
    default:
      return state;
  }
}

var config = {
    databaseURL: "https://co-op-budget-app.firebaseio.com",
    projectId: "co-op-budget-app",
};

firebase.initializeApp(config);

let store = createStore(reducer);

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Navigation />
      </Provider>
    );
  }
}

// Connect the screens to Redux
let DetailsContainer = connect(
  state => ({ 
    termLength: state.termLength,
    weeklyHours: state.weeklyHours,
    hourlyPay: state.hourlyPay,
    recurringExpenses: state.recurringExpenses,
  })
)(DetailsScreen);

let HomeContainer = connect(
  state => ({ 
    savingsGoal: state.savingsGoal,
    weeklyAllowance: state.weeklyAllowance,
    purchases: state.purchases,
    remainingWeeks: state.remainingWeeks,
    remainingAmount: state.remainingAmount,
    termLength: state.termLength,
    weeklyHours: state.weeklyHours,
    hourlyPay: state.hourlyPay,
    recurringExpenses: state.recurringExpenses,
  })
)(HomeScreen);

let PurchasesContainer = connect(state => ({ purchases: state.purchases }))(PurchasesScreen);

let EditDetailsContainer = connect(state => ({ savingsGoal: state.savingsGoal }))(EditDetailsScreen);

const HomeStack = createStackNavigator({
  Home: HomeContainer,
});

const DetailsStack = createStackNavigator(
  {
    Details: DetailsContainer,
    EditDetails: EditDetailsContainer,
  },
  { headerMode: 'screen' },
  { initialRouteName: 'Details' },
);

const PurchasesStack = createStackNavigator({
  Purchases: PurchasesContainer,
});

let Navigation = createAppContainer(createBottomTabNavigator(
  {
    Details: { screen: DetailsStack },
    Home: { screen: HomeStack },
    Purchases: { screen: PurchasesStack },
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = 'ios-home'
        } else if (routeName === 'Details') {
          iconName = `ios-information-circle${focused ? '' : '-outline'}`;
        } else if (routeName === 'Purchases') {
          iconName = 'ios-add'
        }

        return <Ionicons name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    },
  }
));

