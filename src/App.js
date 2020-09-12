import React from 'react';
import { 
  createStackNavigator, 
  createBottomTabNavigator, 
  createAppContainer } from "react-navigation";
import Ionicons from '../node_modules/react-native-vector-icons/Ionicons';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import firebase from 'firebase';

import rootReducer from './reducers';

import DetailsContainer from './containers/detailsContainer';
import HomeContainer from './containers/homeContainer';
import AddPurchasesScreen from './components/AddPurchasesScreen';
import EditDetailsScreen from './components/EditDetailsScreen';
import AddExpenseContainer from './containers/addExpenseContainer';
import EditGoalContainer from './containers/editGoalContainer';
import PurchaseListContainer from './containers/purchaseListContainer';

const config = {
    databaseURL: "https://co-op-budget-app.firebaseio.com",
    projectId: "co-op-budget-app",
};
firebase.initializeApp(config);

const store = createStore(rootReducer);

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Navigation />
      </Provider>
    );
  }
}

const HomeStack = createStackNavigator(
  {
    Home: HomeContainer,
    EditGoal: EditGoalContainer,
    ViewPurchases: PurchaseListContainer,
  },
  { headerMode: 'screen' },
  { initialRouteName: 'Home' },
);

const DetailsStack = createStackNavigator(
  {
    Details: DetailsContainer,
    EditDetails: EditDetailsScreen,
    AddExpense: AddExpenseContainer,
  },
  { headerMode: 'screen' },
  { initialRouteName: 'Details' },
);

const PurchasesStack = createStackNavigator({
  Purchases: AddPurchasesScreen,
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

