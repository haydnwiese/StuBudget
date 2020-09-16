import React from 'react';
import firebase from 'firebase';
import { View, ScrollView, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { ActionButton } from '../components/CommonListItems';

class AddExpenseScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: null,
            amount: null,
        };
    }

    static navigationOptions = {
        title: 'Add Expense',
        titleStyle: {
            fontFamily: 'HelveticaNeue-Bold',
            fontSize: 25,
            fontWeight:'800',
        },
    };

    onSubmit = () => {
        if (this.state.title && this.state.amount) {
            let key = this.props.recurringExpenses.length + 1;
            let title = this.state.title;
            let amount = this.state.amount;

            firebase.database().ref('all/recurringExpenses/').push({
                title,
                amount,
                key
            })

            this.setState({
                title: null,
                amount: null,
            });
        }
    }

    titleInput() {
        if (!this.state.title) {
            return(
                <View style={[styles.field, {marginBottom: 25}]}>
                    <TextInput 
                        style={[styles.expenseAmount, styles.contentText]} 
                        placeholder='Title'
                        onChangeText={(input) => this.setState({title: input})}
                    />
                </View>
            );
        } else {
            return(
                <View style={[styles.field, {marginBottom: 25}]}>
                    <TextInput 
                        style={[styles.expenseAmount, styles.contentText]} 
                        value={this.state.title}
                        onChangeText={(input) => this.setState({title: input})}
                    />
                </View>
            );
        }
    }

    amountInput() {
        if (!this.state.amount) {
            return(
                <View style={styles.field}>
                    <TextInput 
                        style={[styles.expenseAmount, styles.contentText]} 
                        placeholder='Amount'
                        onChangeText={(input) => this.setState({amount: parseFloat(input)})}
                        keyboardType='number-pad'
                    />
                </View>
            );
        } else {
            return(
                <View style={styles.field}>
                    <TextInput 
                        style={[styles.expenseAmount, styles.contentText]}
                        value={this.state.amount.toString()}
                        onChangeText={(input) => this.setState({amount: parseFloat(input)})}
                        keyboardType='number-pad'
                    />
                </View>
            );
        }
    }

    render() {
        return(
            <ScrollView 
                contentContainerStyle={{
                    flexGrow: 1,
                    backgroundColor: '#ededed',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    paddingTop: 20,
                }}
                style={{
                    backgroundColor:'#ededed'
                }}
            >
                {this.titleInput()}
                {this.amountInput()}

                <ActionButton title="DONE" style={styles.button} onPress={() => this.onSubmit()} />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    expenseAmount: {
        textAlign: 'left',
        fontSize: 18,
        marginVertical: 8
    },
    contentText: {
        fontFamily: 'HelveticaNeue-Light',
    },
    field: {
        width: '100%',
        backgroundColor: 'white', 
        paddingHorizontal: 30, 
        paddingVertical: 5, 
        borderColor: '#aaacaf',
        borderBottomWidth: 0.5,
        borderTopWidth: 0.5,
    },
    button: {
        alignSelf: 'center',
        width: '35%',
        marginTop: 25,
        backgroundColor: 'black',
        paddingVertical: 7,
    },
});

export default AddExpenseScreen;