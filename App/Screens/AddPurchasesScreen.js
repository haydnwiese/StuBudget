import React from 'react';

import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity, 
    DatePickerIOS,
    ScrollView,
    Picker
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import IOSPicker from 'react-native-ios-picker';
import firebase from 'firebase';
import Modal from 'react-native-modalbox';

console.disableYellowBox = true;

export default class AddPurchasesScreen extends React.Component {
    constructor(props) {
        super(props);

        let date = new Date();
        date = date.getTime();

        this.state = {
            purchaseAmount: null,
            category: 'Food',
            description: null,
            date: new Date((date - (date % 86400000)) - (20 * 3600000)),
            isOpen: false,
        };
    }

    static navigationOptions = {
        headerStyle: {
          backgroundColor: '#ededed',
          borderBottomWidth: 0
        },
    };

    onSubmit = async() => {
        let currentDate = new Date();
        currentDate = currentDate.getTime();
        currentDate = (currentDate - (currentDate % 86400000)) - (20 * 3600000);

        if (this.state.purchaseAmount && (this.state.date.getTime() <= currentDate)) {
            let amount = this.state.purchaseAmount;
            let category = this.state.category;
            let description = this.state.description;
            let purchaseDate = this.state.date.getTime();

            await firebase.database().ref('all/purchases/').push({
                amount,
                category,
                description,
                date: purchaseDate
            })

            this.setState({
                purchaseAmount: null,
                description: null,
                date: new Date(currentDate)
            });
        }
    }

    purchaseAmountInput() {
        if (!this.state.purchaseAmount) {
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
                            onChangeText={(input) => this.setState({purchaseAmount: parseFloat(input)})}
                            style={{fontFamily: 'HelveticaNeue-Light', fontSize: 40, fontWeight: '500', color: 'black', width: '100%'}}
                            keyboardType='decimal-pad'
                            maxLength={7}
                            value={this.state.purchaseAmount.toString()}
                        />
                    </View>
                    <View style={{height: 3, backgroundColor: 'black', flex: 0}}></View>
                </View>

            );
        }
    }

    dateSection() {
        const monthNames = 
            [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
        return(
            <TouchableOpacity 
                style={styles.input} 
                onPress={() => {
                    // TODO: Figure out haptic without using expo
                    // Haptic.impact(Haptic.ImpactFeedbackStyle.Light);
                    this.setState({isOpen: true});
                    }
                }
            >
                <Text 
                    style={{
                        fontFamily: 'HelveticaNeue-Light', 
                        fontSize: 18, 
                        fontWeight: '300', 
                        color: 'black', 
                        margin: 10, 
                        marginLeft: 5
                    }}
                >
                {monthNames[this.state.date.getMonth()]} {this.state.date.getDate()}, {this.state.date.getFullYear()}
                </Text>
            </TouchableOpacity>
        );
    }

    renderPicker() {
        return (
            <View style={[styles.input, {paddingVertical: 0, margin: 0}]}>
                <Picker 
                    selectedValue={this.state.category}
                    itemStyle={{fontFamily: 'HelveticaNeue-Light', fontSize: 18, fontWeight: '300'}}
                    onValueChange={(value) => this.setState({category: value})}>
                        <Picker.Item label="Food" value="Food" />
                        <Picker.Item label="Entertainment" value="Entertainment" />
                        <Picker.Item label="Clothing" value="Clothing" />
                        <Picker.Item label="Electronics" value="Electronics" />
                </Picker>
            </View>
        );
    }

    renderDatePicker() {
        return(
            <View style={styles.input}>
                <DatePickerIOS
                    date={this.state.date}
                    onDateChange={(newDate) => this.setState({date: newDate})}
                    mode='date'
                />
            </View>
        );
    }

    datePickerModal() {
        return(
            <Modal style={styles.modal} position={"center"} ref={"modal"} isOpen={this.state.isOpen}
                    onClosed={() => this.setState({isOpen: false})}
            >
                {this.renderDatePicker()}
            </Modal>
        );
    }

    descriptionInput() {
        if (!this.state.description) {
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
        } else {
            return(
                <View style={styles.input}>
                    <TextInput
                        onChangeText={(input) => this.setState({description: input})}
                        style={{fontFamily: 'HelveticaNeue-Light', fontSize: 18, fontWeight: '300', color: 'black', margin: 10, marginLeft: 5}}
                        value={this.state.description}
                        maxLength={30}
                    />
                </View>
            );
        }
    }

    render() {
        return (
            <KeyboardAwareScrollView 
                contentContainerStyle={{
                    flexGrow: 1,
                    backgroundColor: '#ededed',
                    alignItems: 'center',
                    justifyContent: 'flex-start'
                }}
                style={{
                    backgroundColor:'#ededed'
                }}
                resetScrollToCoords={{ x: 0, y: 0 }}
                scrollEnabled={true}
            >
                <View style={styles.header}>
                    <Text style={styles.headerText}>Add Purchase</Text>
                </View>
                <View style={styles.subHead}>
                    <Text style={styles.subHeadText}>Enter Purchase Amount</Text>
                </View>
                {this.purchaseAmountInput()}

                <View style={styles.subHead}>
                    <Text style={styles.subHeadText}>Enter Purchase Date</Text>
                </View>
                {this.dateSection()}
                
                <View style={styles.subHead}>
                    <Text style={styles.subHeadText}>Select a Category</Text>
                </View>
                {this.renderPicker()}

                <View style={styles.subHead}>
                    <Text style={styles.subHeadText}>Description</Text>
                </View>
                {this.descriptionInput()}

                <TouchableOpacity style={styles.button} onPress={() => this.onSubmit()}>
                    <Text style={styles.buttonText}>DONE</Text>
                </TouchableOpacity>
                {this.datePickerModal()}
            </KeyboardAwareScrollView>
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
        height: '40%',
        width: '95%',
        borderRadius: 10,
        marginBottom: 20
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
        marginBottom: 30,
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