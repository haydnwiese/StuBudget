const initialState = {
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
  
  export default reducer;