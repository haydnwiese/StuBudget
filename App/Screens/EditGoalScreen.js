import React from 'react';
import { View, ScrollView, Text, TextInput, StyleSheet } from 'react-native';
import firebase from 'firebase';

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
            fontWeight:'800',
        },
    };

    onSubmit = async(input) => {
        if (!input) {
            await this.setState({savingsGoal: 0});
        } else {
            await this.setState({savingsGoal: input});
        }

        let savingsGoal = this.state.savingsGoal;

        firebase.database().ref('all').update({savingsGoal: savingsGoal});
    }

    savingsGoalInput() {
        if (this.state.savingsGoal === 0) {
            return(
                <View style={styles.input}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                        <Text style={[styles.amountInput, {marginRight: 5, marginTop: 6}]}>$</Text>
                        <TextInput
                            placeholder={'0'}
                            placeholderTextColor={'grey'}
                            onChangeText={(input) => this.onSubmit(parseFloat(input))}
                            style={{fontFamily: 'HelveticaNeue-Light', fontSize: 40, fontWeight: '500', color: 'black', width: '100%'}}
                            keyboardType='number-pad'
                            maxLength={7}
                        />
                    </View>
                    <View style={{height: 3, backgroundColor: 'black', flex: 0}}></View>
                </View>

            );
        } else {
            return(
                <View style={styles.input}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                        <Text style={[styles.amountInput, {marginRight: 5, marginTop: 6}]}>$</Text>
                        <TextInput
                            value={this.state.savingsGoal.toString()}
                            onChangeText={(input) => this.onSubmit(parseFloat(input))}
                            style={{fontFamily: 'HelveticaNeue-Light', fontSize: 40, fontWeight: '500', color: 'black', width: '100%'}}
                            keyboardType='number-pad'
                            maxLength={7}
                        />
                    </View>
                    <View style={{height: 3, backgroundColor: 'black', flex: 0}}></View>
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
                {this.savingsGoalInput()}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ededed',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
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