import { connect } from 'react-redux';
import DetailsScreen from '../components/DetailsScreen';

const mapStateToProps = state => (
    { 
        termLength: state.termLength,
        weeklyHours: state.weeklyHours,
        hourlyPay: state.hourlyPay,
        recurringExpenses: state.recurringExpenses,
        startDate: state.startDate,
    }
)

export default connect(mapStateToProps)(DetailsScreen);