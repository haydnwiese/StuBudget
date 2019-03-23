import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-elements';
import PieChart from 'react-native-pie-chart';
import Modal from 'react-native-modalbox';
import firebase from 'firebase';

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            selectedPurchase: '',
            isOpen: false,
        };
    }

    static navigationOptions = {
        headerStyle: {
            backgroundColor: '#ededed',
            borderBottomWidth: 0
        },
    };

    async componentWillMount() {
        this.getData();
    }

    getData = async() => {
        await firebase.database().ref('all/').on('value', (snapshot) => {
            let data = snapshot.val();
            let temp = [];

            for (var key in snapshot.val().purchases) {
                temp.push(snapshot.val().purchases[key]);
            }

            data.purchases = temp;

            this.props.dispatch({ 
                type: 'INITIAL_DATA', 
                payload: { 
                    savingsGoal: data.savingsGoal,
                    purchases: data.purchases,
                    termLength: data.termDetails.termLength,
                    weeklyHours: data.termDetails.weeklyHours,
                    hourlyPay: data.termDetails.hourlyPay,
                    recurringExpenses: data.reocurringExpenses,
                }
            });
        });

        this.setState({ loading: false });
    }

    purchaseSelect = async(item) => {
        await this.setState({
            isOpen: true,
            selectedPurchase: this.props.purchases[item.key - 1],
        });
    }

    savingsGoalCard() {
        return(
            <View style={styles.card}>
                <Text style={styles.savingsGoalText}>${this.props.savingsGoal}.00</Text>
                <Text style={[styles.contentText, {fontSize: 18, marginTop: 5, color: 'black', textAlign: 'center'}]}>Savings Goal</Text>
            </View>
        );
    }

    spendingCard() {
        return(
            <View style={styles.card}>
                <View style={styles.cardView}>
                    <Text style={[styles.termDetails, {marginTop: 5}]}>Remaining Weeks:</Text>
                    <Text style={[styles.termData, {marginTop: 5}]}>{this.props.remainingWeeks} weeks</Text>
                </View>
                <View style={styles.cardView}>
                    <Text style={styles.termDetails}>Weekly Allowance:</Text>
                    <Text style={styles.termData}>${this.props.weeklyAllowance}</Text>
                </View>
                <View style={styles.cardView}>
                    <Text style={[styles.termDetails, {marginBottom: 5}]}>Remaining Amount:</Text>
                    <Text style={[styles.termData, {marginBottom: 5}]}>${this.props.remainingAmount}</Text>
                </View>
                {this.pieChart()}
            </View>
        );
    }

    pieChart() {
        return(
            <PieChart
                style={{alignSelf: 'center', marginTop: 15}}
                chart_wh={150}
                series={[123, 321, 123, 789, 537]}
                sliceColor={['#F44336','#2196F3','#FFEB3B', '#4CAF50', '#FF9800']}
                doughnut={true}
            />
        );
    }

    purchasesCard() {
        if (this.props.purchases.length === 0) {
            return (
                <View style={[styles.card, {height: (this.props.purchases.length < 10) ? (this.props.length * 40) : 400}]}>
                    <TouchableOpacity style={[styles.button, {width: '70%'}]}>
                        <Text style={styles.buttonText} onPress={() => this.props.navigation.navigate('Purchases')}>ADD FIRST PURCHASE</Text> 
                    </TouchableOpacity>
                </View>
            );
        } else {
            return(
                <View style={[styles.card, {height: (this.props.purchases.length < 10) ? (this.props.length * 40) : 400}]}>
                    <FlatList
                        style={{padding: 10}}
                        data={this.props.purchases}
                        renderItem={({item}) => this.purchaseItem(item)}
                        ItemSeparatorComponent={this.renderSeparator}
                    />
                </View>
            );
        }
    }

    renderSeparator() {
        return(
            <Divider style={{backgroundColor: 'black', height: 1}}/>
        );
    }

    purchaseDetailsModal() {
        return(
            <Modal style={[styles.modal, { alignItems: 'left'}]} position={"center"} ref={"modal"} isOpen={this.state.isOpen}
                    onClosed={() => this.setState({isOpen: false})}
                >
                <View style={{flexDirection: 'row', justifyContent: 'flex-start', marginVertical: 10}}>
                    <Text style={[styles.headerText, {marginLeft: 15, marginRight: 45}]}>Purchase Info</Text>
                    <Button title='Remove' />
                </View>

                <View style={styles.cardView}>
                    <Text style={[styles.termDetails, {marginLeft: 15}]}>Category: {this.state.selectedPurchase.category}</Text>
                </View>
                <View style={styles.cardView}>
                    <Text style={[styles.termDetails, {marginLeft: 15}]}>Amount: ${this.state.selectedPurchase.amount}</Text>
                </View>
                <View style={styles.cardView}>
                    <Text style={[styles.termDetails, {marginLeft: 15}]}>Description: {this.state.selectedPurchase.description}</Text>
                </View>
            </Modal>
        );
    }

    purchaseItem(item) {
        return(
            <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => this.purchaseSelect(item)} >
                <Text style={[styles.expenseTitle, styles.contentText]}>{item.category}</Text>
                <Text style={[styles.expenseAmount, styles.contentText]}>${item.amount}</Text>
            </TouchableOpacity>
        );
    }

    render() {
        if (this.state.loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator style={{flex: 1}} size="large" color='black' />
            </View>
        );
        } else {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Dashboard</Text> 
                </View>

                <ScrollView 
                    style={{flex: 1, width: '90%', marginBottom: 10}} 
                    contentContainerStyle={{
                        flexGrow: 1, 
                        justifyContent: 'flex-start', 
                        backgroundColor: '#ededed',
                        alignContent: 'center'
                }}>
                    {this.savingsGoalCard()}

                    <View style={styles.subHead}>
                        <Text style={styles.subHeadText}>Spending</Text>
                    </View>
                    {this.spendingCard()}

                    <View style={styles.subHead}>
                        <Text style={styles.subHeadText}>Purchases</Text>
                    </View>
                    {this.purchasesCard()}
                </ScrollView>
                {this.purchaseDetailsModal()}
            </View>
        );
        }
    }
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: '27%',
        width: '80%',
        borderRadius: 15,
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
        marginTop: 10,
        width: '100%',
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
        width: '50%',
        marginTop: 10,
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