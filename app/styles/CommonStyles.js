import { StyleSheet } from 'react-native';

export const commonNavigationOptions = {
    headerStyle: {
        backgroundColor: '#ededed',
        borderBottomWidth: 0,
        height: 10
    }
};

export const commonStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ededed',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    header: {
        width: '90%',
        marginTop: 0,
    },
    headerText: {
        fontFamily: 'HelveticaNeue-Bold',
        fontSize: 25,
        fontWeight: '800',
        textAlign: 'left',
        marginBottom: 10,
    },
    subHeader: {
        marginTop: 20,
        width: '90%',
    },
    subHeaderText: {
        fontFamily: 'HelveticaNeue-Bold',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'left',
    },
    buttonText: {
        fontFamily: 'HelveticaNeue-Bold',
        fontSize: 18,
        fontWeight: '500',
        color: 'white',
        textAlign: 'center',
    },
    scrollViewContainer: {
        flexGrow: 1,
        backgroundColor: '#ededed',
        justifyContent: 'flex-start',
        alignContent: 'center'
    },
    amountInput: {
        fontFamily: 'HelveticaNeue-Light',
        fontSize: 30,
        fontWeight: '500',
        color: 'black',
        marginRight: 5,
        marginTop: 6
    },
});