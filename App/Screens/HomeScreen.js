import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView, ActivityIndicator, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Divider } from 'react-native-elements';
import PieChart from 'react-native-pie-chart';
import Modal from 'react-native-modalbox';
import firebase from 'firebase';
import { Haptic } from 'expo';
import Carousel from 'react-native-snap-carousel';

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

    static navigationOptions = {
        headerStyle: {
            backgroundColor: '#ededed',
            borderBottomWidth: 0
        },
    };

    async componentWillMount() {
        await this.getData();
    }

    calculateDetails = () => {
        let taxAdjustment = 0.821256;
        let purchasesTotal = 0;
        let expensesTotal = 0;
        let totalEarnings = Math.round(((this.props.hourlyPay * this.props.weeklyHours) * this.props.termLength) * taxAdjustment);
        let remainingAmount = totalEarnings;

        for (let purchase of this.props.purchases) {
            purchasesTotal += purchase.amount;
        }

        for (let expense of this.props.recurringExpenses) {
            expensesTotal += expense.amount;
        }
        expensesTotal *= Math.round(this.props.termLength / 4);

        let today = new Date();
        today = today.getTime();
        let remainingWeeks = this.props.termLength - parseInt((today - this.props.startDate) / 604800000);

        remainingAmount -= this.props.savingsGoal + purchasesTotal + expensesTotal;
        let weeklyAllowance = Math.floor((remainingAmount / remainingWeeks) * 100) / 100;

        let currentSavings = totalEarnings - (purchasesTotal + expensesTotal);

        let currentWeekPurchases = this.getPurchasesForWeek();
        let remainingWeekly = weeklyAllowance - currentWeekPurchases;

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

        this.getPurchasesByCategory();
    }

    getPurchasesForWeek = () => {
        let currentDate = new Date();
        currentDate = currentDate.getTime();
        currentDate = new Date((currentDate - (currentDate % 86400000)) - (20 * 3600000));

        let weekStart = currentDate - (currentDate.getDay() * 86400000);
        
        let totalAmount = 0;
        let purchasesLength = this.props.purchases.length;
        for (let i = 0; i < purchasesLength; i++) {
            if (this.props.purchases[i].date >= weekStart) {
                totalAmount += this.props.purchases[i].amount;
            } else {
                return totalAmount;
            }
        }
        return totalAmount;
    }

    getPurchasesByCategory = () => {
        let totals = [0, 0, 0, 0];
        let colours = ['#F44336','#2196F3','#FFEB3B', '#4CAF50', '#FF9800'];
        let totalByCategory = [];

        for (let i = 0; i < this.props.purchases.length; i++) {
            switch(this.props.purchases[i].category) {
                case 'Food':
                    totals[0] += this.props.purchases[i].amount;
                    break;
                case 'Entertainment':
                    totals[1] += this.props.purchases[i].amount;
                    break;
                case 'Clothing':
                    totals[2] += this.props.purchases[i].amount;
                    break;
                case 'Electronics':
                    totals[3] += this.props.purchases[i].amount;
                    break;
            }
        }

        for (let i = 0; i < totals.length; i++) {
            totalByCategory.push({
                total: totals[i],
                colour: colours[i]
            });
        }

        this.setState({
            totalByCategory
        })
    }

    getData = async() => {
        await firebase.database().ref('all/').on('value', async (snapshot) => {
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

            await this.props.dispatch({ 
                type: 'INITIAL_DATA', 
                payload: { 
                    savingsGoal: data.savingsGoal,
                    purchases: data.purchases,
                    termLength: data.termDetails.termLength,
                    weeklyHours: data.termDetails.weeklyHours,
                    hourlyPay: data.termDetails.hourlyPay,
                    recurringExpenses: data.recurringExpenses,
                    startDate: new Date(data.termDetails.startDate)
                }
            });

            this.calculateDetails();

            this.setState({ loading: false });
        });

    }

    deletePurchase = async(deleteKey) => {
        await firebase.database().ref('all/purchases').on('child_added', function(data) {
            if(data.val()==deleteKey){
                bookings.child(data.key()).remove();
            }
        });
    }

    purchaseSelect = async(item, index) => {
        Haptic.impact(Haptic.ImpactFeedbackStyle.Light);

        await this.setState({
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
            let colours = [], keyRenders= [], availableCategories = ['Food', 'Entertainment', 'Clothing', 'Electronics'], categories = [];

            for (let i = 0; i < this.state.totalByCategory.length; i++) {
                if (this.state.totalByCategory[i].total > 0) {
                    colours.push(this.state.totalByCategory[i].colour);
                    categories.push(availableCategories[i]);
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

    purchasesCard() {
        let purchasesRender = [];
        
        for (let i = 0; i < this.props.purchases.length && i < 5; i++) {
            purchasesRender.push(this.purchaseItem(this.props.purchases[i], i));

            if (i !== (this.props.purchases.length - 1) && i !== 4)
                purchasesRender.push(this.renderSeparator());
        }

        if (this.props.purchases.length === 0) {
            return (
                <View style={[styles.card, {height: (this.props.purchases.length < 10) ? (this.props.length * 40) : 400}]} >
                    <TouchableOpacity style={[styles.button, {width: '70%'}]} onPress={() => this.props.navigation.navigate('Purchases')} >
                        <Text style={styles.buttonText}>ADD FIRST PURCHASE</Text> 
                    </TouchableOpacity>
                </View>
            );
        } else {
            return(
                <View style={styles.card}>
                    {purchasesRender}
                    <TouchableOpacity style={[styles.button, {width: '60%'}]} onPress={() => this.props.navigation.navigate('ViewPurchases')}>
                        <Text style={styles.buttonText}>ALL PURCHASES</Text> 
                    </TouchableOpacity>
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
                    <Carousel
                        data={this.state.spendingData}
                        renderItem={(item) => this.spendingCard(item)}
                        sliderWidth={Dimensions.get('window').width}
                        itemWidth={Dimensions.get('window').width * 0.9}
                        activeSlideAlignment='start'
                    />

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
        height: '28%',
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