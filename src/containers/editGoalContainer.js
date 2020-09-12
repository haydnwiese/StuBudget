import { connect } from 'react-redux';
import EditGoalScreen from '../components/EditGoalScreen';

const mapStateToProps = state => (
    {
        savingsGoal: state.savingsGoal
    }
);

export default connect(mapStateToProps)(EditGoalScreen);