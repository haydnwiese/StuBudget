import React from 'react';
import { View } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createAppContainer, StackViewTransitionConfigs } from "react-navigation";
import { Ionicons } from 'react-native-vector-icons';
import { createStore, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import firebase from 'firebase';

import DetailsScreen from './Screens/DetailsScreen';
import HomeScreen from './Screens/HomeScreen';
import AddPurchasesScreen from './Screens/AddPurchasesScreen';
import EditDetailsScreen from './Screens/EditDetailsScreen';
import AddExpenseScreen from './Screens/AddExpenseScreen';
import EditGoalScreen from './Screens/EditGoalScreen';
import ViewPurchasesScreen from './Screens/ViewPurchasesScreen';

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
    startDate: new Date()
  }, action
) 
{
  switch (action.type) {
    case 'INITIAL_DATA':
      return {  
        ...state,
        savingsGoal: action.payload.savingsGoal || 0,
        purchases: action.payload.purchases,
        termLength: action.payload.termLength,
        weeklyHours: action.payload.weeklyHours,
        hourlyPay: action.payload.hourlyPay,
        recurringExpenses: action.payload.recurringExpenses || [],
        startDate: action.payload.startDate,
      };
    case 'UPDATE_SPENDING':
      return {
        ...state,
        weeklyAllowance: action.payload.weeklyAllowance,
        remainingWeeks: action.payload.remainingWeeks,
        remainingAmount: action.payload.remainingAmount,
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
    startDate: state.startDate,
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
    startDate: state.startDate,
  })
)(HomeScreen);

let PurchasesContainer = connect(state => ({ purchases: state.purchases }))(AddPurchasesScreen);

let EditDetailsContainer = connect(state => ({ savingsGoal: state.savingsGoal }))(EditDetailsScreen);

let AddExpenseContainer = connect(state => ({ recurringExpenses: state.recurringExpenses }))(AddExpenseScreen);

let EditGoalContainer = connect(state => ({ savingsGoal: state.savingsGoal }))(EditGoalScreen);

let ViewPurchasesContainer = connect(state => ({ purchases: state.purchases }))(ViewPurchasesScreen);

const HomeStack = createStackNavigator(
  {
    Home: HomeContainer,
    EditGoal: EditGoalContainer,
    ViewPurchases: ViewPurchasesContainer,
  },
  { headerMode: 'screen' },
  { initialRouteName: 'Home' },
);

const DetailsStack = createStackNavigator(
  {
    Details: DetailsContainer,
    EditDetails: EditDetailsContainer,
    AddExpense: AddExpenseContainer,
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

