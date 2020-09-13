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
import firebase from 'firebase';
import Modal from 'react-native-modalbox';
import { commonStyles, commonNavigationOptions } from '../styles/CommonStyles';
import { Header, SubHeader, ActionButton, AmountInput } from '../components/CommonListItems';
import { purchaseCategory } from '../constants'

console.disableYellowBox = true;

const DAY_IN_MILLISECONDS = 86400000;
const HOUR_IN_MILLISECONDS = 3600000;

export default class AddPurchasesScreen extends React.Component {
    constructor(props) {
        super(props);

        let date = new Date();
        date = date.getTime();

        this.state = {
            purchaseAmount: 0,
            category: purchaseCategory.FOOD,
            description: null,
            date: new Date((date - (date % DAY_IN_MILLISECONDS)) - (20 * HOUR_IN_MILLISECONDS)),
            isOpen: false,
        };
    }

    static navigationOptions = commonNavigationOptions;

    onSubmit = async () => {
        let currentDate = new Date();
        currentDate = currentDate.getTime();
        currentDate = (currentDate - (currentDate % DAY_IN_MILLISECONDS)) - (20 * HOUR_IN_MILLISECONDS);

        if (this.state.purchaseAmount !== 0 && (this.state.date.getTime() <= currentDate)) {
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
                purchaseAmount: 0,
                description: null,
                date: new Date(currentDate)
            });
        }
    }

    purchaseAmountInput() {
        return (
            <AmountInput
                value={this.state.purchaseAmount.toString()}
                placeHolder='0.00'
                onChangeText={(input) => this.setState({ purchaseAmount: parseFloat(input) || 0})}
                keyboardType='decimal-pad'
                containerStyle={styles.input}
            />
        );
    }

    dateSection() {
        const monthNames =
            [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
        return (
            <TouchableOpacity
                style={styles.input}
                onPress={() => {
                    // TODO: Figure out haptic without using expo
                    // Haptic.impact(Haptic.ImpactFeedbackStyle.Light);
                    this.setState({ isOpen: true });
                }}>
                <Text
                    style={{
                        fontFamily: 'HelveticaNeue-Light',
                        fontSize: 18,
                        fontWeight: '300',
                        color: 'black',
                        margin: 10,
                        marginLeft: 5
                    }}>
                    {monthNames[this.state.date.getMonth()]} {this.state.date.getDate()}, {this.state.date.getFullYear()}
                </Text>
            </TouchableOpacity>
        );
    }

    renderPicker() {
        return (
            <View style={[styles.input, { paddingVertical: 0, margin: 0 }]}>
                <Picker
                    selectedValue={this.state.category}
                    itemStyle={{ fontFamily: 'HelveticaNeue-Light', fontSize: 18, fontWeight: '300' }}
                    onValueChange={(value) => this.setState({ category: value })}>
                    {
                        Object.keys(purchaseCategory).map(key => (
                            <Picker.Item label={purchaseCategory[key]} value={purchaseCategory[key]} />
                        ))
                    }
                </Picker>
            </View>
        );
    }

    renderDatePicker() {
        return (
            <View style={styles.input}>
                <DatePickerIOS
                    date={this.state.date}
                    onDateChange={(newDate) => this.setState({ date: newDate })}
                    mode='date'
                />
            </View>
        );
    }

    datePickerModal() {
        return (
            <Modal style={styles.modal} position={"center"} ref={"modal"} isOpen={this.state.isOpen}
                onClosed={() => this.setState({ isOpen: false })}
            >
                {this.renderDatePicker()}
            </Modal>
        );
    }

    descriptionInput() {
        if (!this.state.description) {
            return (
                <View style={styles.input}>
                    <TextInput
                        placeholder={'Insert Description'}
                        placeholderTextColor={'grey'}
                        onChangeText={(input) => this.setState({ description: input })}
                        style={styles.descriptionInput}
                        maxLength={30}
                    />
                </View>
            );
        } else {
            return (
                <View style={styles.input}>
                    <TextInput
                        onChangeText={(input) => this.setState({ description: input })}
                        style={styles.descriptionInput}
                        value={this.state.description}
                        maxLength={30}
                    />
                </View>
            );
        }
    }

    render() {
        return (
            <View style={commonStyles.container}>
                <Header title="Add Purchase" withMargin={true} />

                <KeyboardAwareScrollView
                    contentContainerStyle={[commonStyles.scrollViewContainer, { alignItems: 'center' }]}
                    style={{
                        backgroundColor: '#ededed',
                        width: "100%"
                    }}
                    resetScrollToCoords={{ x: 0, y: 0 }}
                    scrollEnabled={true}>

                    <SubHeader title="Enter Purchase Amount" style={{marginTop: 0}} />
                    {this.purchaseAmountInput()}

                    <SubHeader title="Enter Purchase Date" />
                    {this.dateSection()}

                    <SubHeader title="Select a Category" />
                    {this.renderPicker()}

                    <SubHeader title="Description" />
                    {this.descriptionInput()}

                    <ActionButton title="DONE" style={styles.button} onPress={() => this.onSubmit()} />
                    {this.datePickerModal()}
                </KeyboardAwareScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    amountInput: {
        fontFamily: 'HelveticaNeue-Light',
        fontSize: 30,
        fontWeight: '500',
        color: 'black',
        marginRight: 5,
        marginTop: 6
    },
    amountInputText: {
        fontFamily: 'HelveticaNeue-Light',
        fontSize: 40,
        fontWeight: '500',
        color: 'black',
        width: '100%'
    },
    descriptionInput: {
        fontFamily: 'HelveticaNeue-Light',
        fontSize: 18,
        fontWeight: '300',
        color: 'black',
        margin: 10,
        marginLeft: 5
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
    button: {
        alignSelf: 'center',
        marginTop: 25,
        backgroundColor: 'black',
        paddingVertical: 7,
        marginBottom: 30,
        width: '35%'
    },
});