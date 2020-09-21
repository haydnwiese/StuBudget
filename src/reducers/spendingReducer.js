import { INITIAL_DATA, UPDATE_SPENDING } from '../constants/actionTypes';

export const initialState = {
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
};

function reducer(state = initialState, action) {
    switch (action.type) {
      case INITIAL_DATA:
        let { payload } = action;
        return {  
          ...state,
          savingsGoal: payload.savingsGoal || 0,
          purchases: payload.purchases,
          termLength: payload.termLength,
          weeklyHours: payload.weeklyHours,
          hourlyPay: payload.hourlyPay,
          recurringExpenses: payload.recurringExpenses || [],
          startDate: payload.startDate,
        };
      case UPDATE_SPENDING:
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
  
  export default reducer;