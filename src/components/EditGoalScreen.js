import React from 'react';
import { View, ScrollView, Text, TextInput, StyleSheet } from 'react-native';
import firebase from 'firebase';
import { commonStyles } from '../styles/CommonStyles';
import { AmountInput } from '../components/CommonListItems';

class EditGoalScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            savingsGoal: this.props.savingsGoal,
        }
    }

    static navigationOptions = {
        title: 'Savings Goal',
        titleStyle: {
            fontFamily: 'HelveticaNeue-Bold',
            fontSize: 25,
            fontWeight: '800',
        },
    };

    onSubmit = async (input) => {
        if (!input) {
            this.setState({ savingsGoal: 0 });
        } else {
            this.setState({ savingsGoal: input });
        }

        let savingsGoal = this.state.savingsGoal;

        firebase.database().ref('all').update({ savingsGoal: savingsGoal });
    }

    savingsGoalInput() {
        return (
            <AmountInput
                value={this.state.savingsGoal.toString()}
                placeHolder='0'
                onChangeText={(input) => this.onSubmit(parseFloat(input))}
                keyboardType='number-pad'
                containerStyle={styles.input}
            />
        );
    }

    render() {
        return (
            <ScrollView
                contentContainerStyle={[commonStyles.scrollViewContainer, { paddingTop: 20 }]}
                style={{ backgroundColor: '#ededed' }}>
                {this.savingsGoalInput()}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    input: {
        width: '100%',
        marginTop: 10,
        backgroundColor: 'white',
        padding: 10,
    },
    amountInput: {
        fontFamily: 'HelveticaNeue-Light',
        fontSize: 30,
        fontWeight: '500',
        color: 'black'
    },
    button: {
        alignSelf: 'center',
        width: '35%',
        marginTop: 25,
        backgroundColor: 'black',
        paddingVertical: 7,
    },
    buttonText: {
        fontFamily: 'HelveticaNeue-Bold',
        fontSize: 18,
        fontWeight: '500',
        color: 'white',
        textAlign: 'center',
    },
});

export default EditGoalScreen;