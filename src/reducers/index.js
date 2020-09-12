import { combineReducers } from 'redux';
import spendingReducer from './spendingReducer';

const rootReducer = combineReducers({
    spending: spendingReducer
});

export default rootReducer;