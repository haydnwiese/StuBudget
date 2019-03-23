import React from 'react';
import { ScrollView, View, Text, StyleSheet, TextInput, InputAccessoryView, Button, Keyboard, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import IOSPicker from 'react-native-ios-picker';
import firebase from 'firebase';

console.disableYellowBox = true;

export default class PurchasesScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            purchaseAmount: null,
            category: 'Food',
            description: null,
        };
    }

    static navigationOptions = {
        headerStyle: {
          backgroundColor: '#ededed',
          borderBottomWidth: 0
        },
    };

    onSubmit = () => {
        if (this.state.purchaseAmount) {
            let key = (this.props.purchases.length + 1);
            let amount = this.state.purchaseAmount;
            let category = this.state.category;
            let description = this.state.description;

            firebase.database().ref('all/purchases/').push({
                amount,
                category,
                description,
                key
            })
        }
    }

    purchaseAmountInput() {
        return(
            <View style={styles.input}>
                <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                    <Text style={[styles.amountInput, {marginRight: 5, marginTop: 6}]}>$</Text>
                    <TextInput
                        placeholder={'0.00'}
                        placeholderTextColor={'grey'}
                        onChangeText={(input) => this.setState({purchaseAmount: parseFloat(input)})}
                        style={{fontFamily: 'HelveticaNeue-Light', fontSize: 40, fontWeight: '500', color: 'black', width: '100%'}}
                        keyboardType='decimal-pad'
                        maxLength={7}
                        inputAccessoryViewID={"InputAccessoryView"}
                    />
                </View>
                <View style={{height: 3, backgroundColor: 'black', flex: 0}}></View>
            </View>

        );
    }

    renderPicker() {
        const data = ['Food', 'Entertainment', 'Clothing', 'Electronics'];
        return (
            <View style={styles.input}>
                <IOSPicker 
                    data={data}
                    selectedValue={this.state.category}
                    textStyle={[styles.contentText, {fontSize: 18, fontWeight: '300'}]}
                    onValueChange={(value) => this.setState({category: value})} 
                />
            </View>
        );
    }

    descriptionInput() {
        return(
            <View style={styles.input}>
                <TextInput 
                    placeholder={'Insert Description'}
                    placeholderTextColor={'grey'}
                    onChangeText={(input) => this.setState({description: input})}
                    style={{fontFamily: 'HelveticaNeue-Light', fontSize: 18, fontWeight: '300', color: 'black', margin: 10, marginLeft: 5}}
                    maxLength={30}
                />
            </View>
        );
    }

    render() {
        return (
            <ScrollView 
                contentContainerStyle={{
                    flexGrow: 1,
                    backgroundColor: '#ededed',
                    alignItems: 'center',
                    justifyContent: 'flex-start'
                }}
                style={{
                    backgroundColor:'#ededed'
                }}
            >
                <View style={styles.header}>
                    <Text style={styles.headerText}>Add Purchase</Text>
                </View>
                <View style={styles.subHead}>
                    <Text style={styles.subHeadText}>Enter Purchase Amount</Text>
                </View>
                {this.purchaseAmountInput()}
                
                <View style={styles.subHead}>
                    <Text style={styles.subHeadText}>Select a Category</Text>
                </View>
                {this.renderPicker()}

                <View style={styles.subHead}>
                    <Text style={styles.subHeadText}>Description</Text>
                </View>
                {this.descriptionInput()}

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText} onPress={() => this.onSubmit()}>DONE</Text>
                </TouchableOpacity>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    amountInput: {
        fontFamily: 'HelveticaNeue-Light', 
        fontSize: 30, 
        fontWeight: '500', 
        color: 'black'
    },
    input: {
        width: '90%',
        marginTop: 10,
        backgroundColor: 'white',
        padding: 10,
    },
    modal: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: '30%',
        width: '80%',
        borderRadius: 10,
    },
    headerText: {
        fontFamily: 'HelveticaNeue-Bold',
        fontSize: 25,
        fontWeight:'800',
        textAlign: 'left',
        marginBottom: 10,
    },
    contentText: {
        fontFamily: 'HelveticaNeue-Light',
    },
    buttonText: {
        fontFamily: 'HelveticaNeue-Bold',
        fontSize: 18,
        fontWeight: '500',
        color: 'white',
        textAlign: 'center',
    },
    savingsGoalText: {
        fontFamily: 'HelveticaNeue-Bold',
        fontSize: 30,
        fontWeight:'600',
        textAlign: 'center',
    },
    subHead: {
        marginTop: 20,
        width: '90%',
    },
    subHeadText: {
        fontFamily: 'HelveticaNeue-Bold',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'left',
    },
    header: {
        width: '90%',
        marginTop: 0,
    },
    button: {
        alignSelf: 'center',
        width: '35%',
        marginTop: 25,
        backgroundColor: 'black',
        paddingVertical: 7,
    },
    container: {
        flex: 1,
        backgroundColor: '#ededed',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    card: {
        width: '100%',
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: 'white',
        padding: 20,
    },
    cardView: {
        flexDirection: 'row'
    }, 
    termDetails: {
        flex: 2,
        marginBottom: 15,
        fontSize: 18,
        fontFamily: 'HelveticaNeue-Light'
    },
    termData: {
        flex: 1,
        textAlign: 'right',
        fontSize: 18,
        fontFamily: 'HelveticaNeue-Light'
    },
    expenseTitle: {
        flex: 2,
        fontSize: 18,
        marginVertical: 8
    },
    expenseAmount: {
        flex: 1,
        textAlign: 'right',
        fontSize: 18,
        marginVertical: 8
    }
});