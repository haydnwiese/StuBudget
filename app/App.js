import React from 'react';
import { 
  createStackNavigator, 
  createBottomTabNavigator, 
  createAppContainer } from "react-navigation";
import Ionicons from '../node_modules/react-native-vector-icons/Ionicons';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import firebase from 'firebase';

import {reducer} from './Utilities/ReduxHelper';

import DetailsScreen from './screens/DetailsScreen';
import HomeScreen from './screens/HomeScreen';
import AddPurchasesScreen from './screens/AddPurchasesScreen';
import EditDetailsScreen from './screens/EditDetailsScreen';
import AddExpenseScreen from './screens/AddExpenseScreen';
import EditGoalScreen from './screens/EditGoalScreen';
import ViewPurchasesScreen from './screens/ViewPurchasesScreen';

const config = {
    databaseURL: "https://co-op-budget-app.firebaseio.com",
    projectId: "co-op-budget-app",
};
firebase.initializeApp(config);

const store = createStore(reducer);

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

const Navigation = createAppContainer(createBottomTabNavigator(
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

