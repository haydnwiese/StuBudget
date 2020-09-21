import { connect } from 'react-redux';
import HomeScreen from '../components/HomeScreen';

const mapStateToProps = state => (
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

const mapDispatchToProps = (dispatch) => ({
    fetchData: () => dispatch(fetchData()),
});

export default connect(mapStateToProps)(HomeScreen);

