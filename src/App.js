import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import firebase from 'firebase';
import rootReducer from './reducers';
import { initialState } from './reducers/spendingReducer'
import Navigation from './navigation';

const config = {
    databaseURL: "https://co-op-budget-app.firebaseio.com",
    projectId: "co-op-budget-app",
};
firebase.initializeApp(config, initialState);

const store = createStore(rootReducer, );

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Navigation />
      </Provider>
    );
  }
}


