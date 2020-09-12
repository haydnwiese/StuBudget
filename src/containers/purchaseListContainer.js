import { connect } from 'react-redux';
import PurchaseListScreen from '../components/PurchaseListScreen';

const mapStateToProps = state => (
    {
        purchases: state.purchases
    }
);

export default connect(mapStateToProps)(PurchaseListScreen);