import { 
    createStackNavigator, 
    createBottomTabNavigator, 
    createAppContainer 
} from "react-navigation";
import Ionicons from '../node_modules/react-native-vector-icons/Ionicons';
import DetailsContainer from './containers/detailsContainer';
import HomeContainer from './containers/homeContainer';
import AddPurchasesScreen from './components/AddPurchasesScreen';
import EditDetailsScreen from './components/EditDetailsScreen';
import AddExpenseContainer from './containers/addExpenseContainer';
import EditGoalContainer from './containers/editGoalContainer';
import PurchaseListContainer from './containers/purchaseListContainer';

const routes = {
    HOME: 'Home',
    DETAILS: 'Details',
    PURCHASES: 'Purchases'
}

const HomeStack = createStackNavigator(
    {
      Home: HomeContainer,
      EditGoal: EditGoalContainer,
      ViewPurchases: PurchaseListContainer,
    },
    { headerMode: 'screen' },
    { initialRouteName: routes.HOME },
  );
  
  const DetailsStack = createStackNavigator(
    {
      Details: DetailsContainer,
      EditDetails: EditDetailsScreen,
      AddExpense: AddExpenseContainer,
    },
    { headerMode: 'screen' },
    { initialRouteName: routes.DETAILS },
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
      initialRouteName: routes.HOME,
      defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) => {
          const { routeName } = navigation.state;
          let iconName;
          switch (routeName) {
            case routes.HOME:
                iconName = 'ios-home';
                break;
            case routes.DETAILS:
                iconName = `ios-information-circle${focused ? '' : '-outline'}`;
                break;
            case routes.PURCHASES:
                iconName = 'ios-add';
                break;
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

  export default Navigation;
  