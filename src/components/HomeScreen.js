import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView, ActivityIndicator, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Divider } from 'react-native-elements';
import PieChart from 'react-native-pie-chart';
import Modal from 'react-native-modalbox';
import firebase from 'firebase';
import Carousel from 'react-native-snap-carousel';
import { submitInitialData } from '../actions';

import {Header, ActionButton, SubHeader} from '../components/CommonListItems';
import { commonStyles, commonNavigationOptions } from '../styles/CommonStyles';

import { purchaseCategory } from '../constants';
const TAX_ADJUSTMENT = 0.821256;
const PURCHASE_PREVIEW_MAX = 5;
const WEEK_IN_MS = 604800000, DAY_IN_MS = 86400000, HOUR_IN_MS = 3600000;

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            selectedPurchase: '',
            isOpen: false,
            purchasesTotal: 0,
            spendingData: [
                {
                    id: 'week',
                    weeklyAllowance: 0,
                    remainingWeekly: 0,
                    remainingWeeks: 0,
                },
                {
                    id: 'total',
                    remainingTotal: 0,
                    currentSavings: 0,
                    totalMiscSpending: 0,
                    totalEarnings: 0,
                }
            ],
            totalByCategory: []
        };
    }

    static navigationOptions = commonNavigationOptions;

    componentWillMount() {
        this.getData();
    }

    calculateDetails = () => {
        const {
            hourlyPay,
            weeklyHours,
            termLength,
            purchases,
            recurringExpenses,
            startDate,
            savingsGoal
        } = this.props;
        let purchasesTotal = 0;
        let expensesTotal = 0;
        const totalEarnings = Math.round(((hourlyPay * weeklyHours) * termLength) * TAX_ADJUSTMENT);
        let remainingAmount = totalEarnings;

        for (let purchase of purchases) {
            purchasesTotal += purchase.amount;
        }

        for (let expense of recurringExpenses) {
            expensesTotal += expense.amount;
        }
        expensesTotal *= Math.round(termLength / 4);

        // Find today's date and caculate number of weeks remaining in term
        let today = new Date();
        today = today.getTime();
        const remainingWeeks = termLength - parseInt((today - startDate) / WEEK_IN_MS);

        // Calculate the weekly allowance for the rest of the term
        remainingAmount -= savingsGoal + purchasesTotal + expensesTotal;
        const weeklyAllowance = Math.floor((remainingAmount / remainingWeeks) * 100) / 100;

        const currentSavings = totalEarnings - (purchasesTotal + expensesTotal);

        // Calculate the remaining allowance for the current week
        const currentWeekPurchases = this.getPurchasesForWeek();
        const remainingWeekly = weeklyAllowance - currentWeekPurchases;

        this.setState({
            spendingData: [
                {
                    id: 'week',
                    weeklyAllowance,
                    remainingWeekly: +remainingWeekly.toFixed(2),
                    remainingWeeks,
                },
                {
                    id: 'total',
                    remainingTotal: remainingAmount,
                    totalMiscSpending: purchasesTotal,
                    currentSavings,
                    totalEarnings,
                }
            ]
        });

        // Update purchases in each category for spending breakdown
        this.getPurchasesByCategory();
    }

    getPurchasesForWeek = () => {
        let { purchases } = this.props;
        let currentDate = new Date();
        currentDate = currentDate.getTime();
        currentDate = new Date((currentDate - (currentDate % DAY_IN_MS)) - (20 * HOUR_IN_MS));

        let weekStart = currentDate - (currentDate.getDay() * DAY_IN_MS);
        
        let totalAmount = 0;
        let purchasesLength = purchases.length;
        for (let i = 0; i < purchasesLength; i++) {
            if (purchases[i].date >= weekStart) {
                totalAmount += purchases[i].amount;
            } else {
                return totalAmount;
            }
        }
        return totalAmount;
    }

    getPurchasesByCategory = () => {
        let totals = [0, 0, 0, 0];
        let colours = ['#F44336','#2196F3','#FFEB3B', '#4CAF50', '#FF9800'];
        let totalByCategory = {};
        let { purchases } = this.props;

        for (let i = 0; i < this.props.purchases.length; i++) {
            switch(this.props.purchases[i].category) {
                case purchaseCategory.FOOD:
                    totals[purchaseCategory.FOOD] += purchases[i].amount;
                    break;
                case purchaseCategory.ENTERTAINMENT:
                    totals[purchaseCategory.ENTERTAINMENT] += purchases[i].amount;
                    break;
                case purchaseCategory.CLOTHING:
                    totals[purchaseCategory.CLOTHING] += purchases[i].amount;
                    break;
                case purchaseCategory.ELECTRONICS:
                    totals[purchaseCategory.ELECTRONICS] += purchases[i].amount;
                    break;
            }
        }

        for (const [index, key] of Object.keys(totals).entries()) {
            totalByCategory.push({
                total: totals[key],
                colour: colours[index]
            });
        }

        this.setState({
            totalByCategory
        })
    }

    getData = () => {
        firebase.database().ref('all/').on('value', async (snapshot) => {
            let data = snapshot.val();
            let temp = [];
            let temp2 = [];

            for (var key in snapshot.val().purchases) {
                temp.push(snapshot.val().purchases[key]);
            }
            data.purchases = temp;
            
            data.purchases.sort(function(a, b){return b.date - a.date});
            
            for (var key in snapshot.val().recurringExpenses) {
                temp2.push(snapshot.val().recurringExpenses[key])
            }
            data.recurringExpenses = temp2;

            this.props.dispatch(submitInitialData({ 
                savingsGoal: data.savingsGoal,
                purchases: data.purchases,
                termLength: data.termDetails.termLength,
                weeklyHours: data.termDetails.weeklyHours,
                hourlyPay: data.termDetails.hourlyPay,
                recurringExpenses: data.recurringExpenses,
                startDate: new Date(data.termDetails.startDate)
            }));

            this.calculateDetails();

            this.setState({ loading: false });
        });

    }

    deletePurchase = async(deleteKey) => {
        firebase.database().ref('all/purchases').on('child_added', function(data) {
            if(data.val()==deleteKey){
                bookings.child(data.key()).remove();
            }
        });
    }

    purchaseSelect = async(item, index) => {
        // TODO: Figure out haptic without using expo
        // Haptic.impact(Haptic.ImpactFeedbackStyle.Light);

        this.setState({
            isOpen: true,
            selectedPurchase: this.props.purchases[index],
        });
    }

    savingsGoalCard() {
        return(
            <TouchableOpacity style={styles.card} onPress={() => this.props.navigation.navigate('EditGoal')}>
                <Text style={styles.savingsGoalText}>${this.props.savingsGoal}.00</Text>
                <Text style={[styles.contentText, {fontSize: 18, marginTop: 5, color: 'black', textAlign: 'center'}]}>Savings Goal</Text>
            </TouchableOpacity>
        );
    }

    spendingCard(item) {
        if (item.item.id === 'week') {
            return(
                <View style={styles.card}>
                    <View style={styles.cardView}>
                        <Text style={[styles.termDetails, {marginTop: 5}]}>Remaining Weeks:</Text>
                        <Text style={[styles.termData, {marginTop: 5}]}>{item.item.remainingWeeks} weeks</Text>
                    </View>
                    <View style={styles.cardView}>
                        <Text style={styles.termDetails}>Weekly Allowance:</Text>
                        <Text style={styles.termData}>${item.item.weeklyAllowance}</Text>
                    </View>
                    <View style={styles.cardView}>
                        <Text style={[styles.termDetails, {marginBottom: 5}]}>Remaining Amount:</Text>
                        <Text style={[styles.termData, {marginBottom: 5}]}>${item.item.remainingWeekly}</Text>
                    </View>
                    {this.pieChart()}
                    {this.pieChartKey()}
                </View>
            );
        } else {
            return(
                <View style={styles.card}>
                    <View style={styles.cardView}>
                        <Text style={[styles.termDetails, {marginTop: 5}]}>Total Term Earnings:</Text>
                        <Text style={[styles.termData, {marginTop: 5}]}>$ {item.item.totalEarnings}</Text>
                    </View>
                    <View style={styles.cardView}>
                        <Text style={styles.termDetails}>Current Savings:</Text>
                        <Text style={styles.termData}>$ {item.item.currentSavings}</Text>
                    </View>
                    <View style={styles.cardView}>
                        <Text style={styles.termDetails}>Total Remaining Spending:</Text>
                        <Text style={styles.termData}>$ {item.item.remainingTotal}</Text>
                    </View>
                    <View style={styles.cardView}>
                        <Text style={styles.termDetails}>Total Misc. Purchases:</Text>
                        <Text style={styles.termData}>$ {item.item.totalMiscSpending}</Text>
                    </View>
                </View>
            );
        }
    }

    pieChart() {
        if (this.state.totalByCategory.length > 0) {
            let colours = [];
            let totals = [];

            for (let i = 0; i < this.state.totalByCategory.length; i++) {
                colours.push(this.state.totalByCategory[i].colour);
                totals.push(this.state.totalByCategory[i].total);
            }

            return(
                <PieChart
                    style={{alignSelf: 'center', marginTop: 15}}
                    chart_wh={150}
                    series={totals}
                    sliceColor={colours}
                    doughnut={true}
                />
            );
        }
    }

    pieChartKey() {
        if (this.state.totalByCategory.length > 0) {
            let colours = [], keyRenders= [], categories = [];

            for (let i = 0; i < this.state.totalByCategory.length; i++) {
                if (this.state.totalByCategory[i].total > 0) {
                    colours.push(this.state.totalByCategory[i].colour);
                    let category = Object.keys(purchaseCategory)[i];
                    categories.push(purchaseCategory[category]);
                }
            }

            for (let i = 0; i < colours.length; i++) {
                keyRenders.push(
                    <View style={{flexDirection:'row'}}>
                        <View style={[shapes.square, {backgroundColor:colours[i], marginRight: 5}]}/>
                        <Text style={[styles.contentText, {marginRight: 5}]}>{categories[i]}</Text>
                    </View>
                );
            }

            return(
                <View style={{flexDirection:'row', marginTop:20, justifyContent:'center'}}>
                    {keyRenders}
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
        const {
            isOpen,
            selectedPurchase
        } = state;
        return(
            <Modal style={[styles.modal, { alignItems: 'left'}]} position={"center"} ref={"modal"} isOpen={isOpen}
                    onClosed={() => this.setState({isOpen: false})}
                >
                <View style={{flexDirection: 'row', justifyContent: 'flex-start', marginVertical: 10}}>
                    <Text style={[commonStyles.headerText, {marginLeft: 15, marginRight: 45}]}>Purchase Info</Text>
                    <Button title='Remove' />
                </View>

                <View style={styles.cardView}>
                    <Text style={[styles.termDetails, {marginLeft: 15}]}>Category: {selectedPurchase.category}</Text>
                </View>
                <View style={styles.cardView}>
                    <Text style={[styles.termDetails, {marginLeft: 15}]}>Amount: ${selectedPurchase.amount}</Text>
                </View>
                <View style={styles.cardView}>
                    <Text style={[styles.termDetails, {marginLeft: 15}]}>Description: {selectedPurchase.description}</Text>
                </View>
            </Modal>
        );
    }

    purchasesCard() {
        let { purchases, navigation } = this.props;
        let purchasesRender = [];
        
        for (let i = 0; i < purchases.length && i < PURCHASE_PREVIEW_MAX; i++) {
            purchasesRender.push(this.purchaseItem(purchases[i], i));

            if (i !== (purchases.length - 1) && i !== PURCHASE_PREVIEW_MAX - 1)
                purchasesRender.push(this.renderSeparator());
        }

        if (purchases.length === 0) {
            return (
                <View style={[styles.card, {height: (purchases.length < 10) ? (purchases.length * 40) : 400}]} >
                    <ActionButton title="ADD FIRST PURCHASE" style={styles.button} onPress={() => navigation.navigate('Purchases')} />
                </View>
            );
        } else {
            return(
                <View style={styles.card}>
                    {purchasesRender}
                    <ActionButton title="ALL PURCHASES" style={styles.button} onPress={() => navigation.navigate('ViewPurchases')} />
                </View>
            );
        }
    }

    purchaseItem(item, index) {
        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        let date = new Date(item.date);

        return(
            <TouchableOpacity onPress={() => this.purchaseSelect(item, index)} >
                <View style={{flexDirection: 'row'}}>
                    <Text style={[styles.expenseTitle, styles.contentText]}>{item.category}</Text>
                    <Text style={[styles.expenseAmount, styles.contentText]}>${item.amount}</Text>
                </View>
                <Text style={[styles.purchaseDate, styles.contentText]}>{monthNames[date.getMonth()]} {date.getDate()}, {date.getFullYear()}</Text>
            </TouchableOpacity>
        );
    }

    render() {
        if (this.state.loading) {
        return (
            <View style={commonStyles.container}>
                <ActivityIndicator style={{flex: 1}} size="large" color='black' />
            </View>
        );
        } else {
        return (
            <View style={commonStyles.container}>
                <Header title="Dashboard" withMargin={true} />

                <ScrollView 
                    style={{flex: 1, width: '90%'}} 
                    contentContainerStyle={commonStyles.scrollViewContainer}>
                    {this.savingsGoalCard()}

                    <SubHeader title="Spending" />
                    <Carousel
                        data={this.state.spendingData}
                        renderItem={(item) => this.spendingCard(item)}
                        sliderWidth={Dimensions.get('window').width}
                        itemWidth={Dimensions.get('window').width * 0.9}
                        activeSlideAlignment='start'
                    />

                    <SubHeader title="Purchases" />
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
        height: '28%',
        width: '80%',
        borderRadius: 15,
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
    button: {
        alignSelf: 'center',
        width: '60%',
        marginTop: 10,
        backgroundColor: 'black',
        paddingVertical: 7,
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
        marginTop: 8,
        marginBottom: 2,
    },
    purchaseDate: {
        fontSize: 13,
        marginBottom: 8,
    },
    expenseAmount: {
        flex: 1,
        textAlign: 'right',
        fontSize: 18,
        marginTop: 8,
        marginBottom: 2,
    }
});

const shapes = StyleSheet.create({
    square: {
        height: 20,
        width: 20
    }
});