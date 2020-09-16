import { connect } from 'react-redux';
import HomeScreen from '../components/HomeScreen';

// const mapStateToProps = state => (
//     { 
//         savingsGoal: state.savingsGoal,
//         weeklyAllowance: state.weeklyAllowance,
//         purchases: state.purchases,
//         remainingWeeks: state.remainingWeeks,
//         remainingAmount: state.remainingAmount,
//         termLength: state.termLength,
//         weeklyHours: state.weeklyHours,
//         hourlyPay: state.hourlyPay,
//         recurringExpenses: state.recurringExpenses,
//         startDate: state.startDate,
//     }
// );

const mapStateToProps = state => {
    console.log('container', state);
    return (
        {
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
        }
    );
}

export default connect(mapStateToProps)(HomeScreen);

