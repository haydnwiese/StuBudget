import { connect } from 'react-redux';
import AddExpenseScreen from '../components/AddExpenseScreen';

const mapStateToProps = state => (
    { 
        recurringExpenses: state.recurringExpenses 
    }
);

export default connect(mapStateToProps)(AddExpenseScreen);
