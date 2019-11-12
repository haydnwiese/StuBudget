import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-elements';

export default class DetailsScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    static navigationOptions = {
        headerStyle: {
          backgroundColor: '#ededed',
          borderBottomWidth: 0
        },
    };

    renderSeparator() {
        return(
            <Divider style={{backgroundColor: 'black', height: 1}}/>
        );
    }

    expenseListItem(item) {
        return(
            <View style={{flexDirection: 'row'}}>
                <Text style={[styles.expenseTitle, styles.contentText]}>{item.title}</Text>
                <Text style={[styles.expenseAmount, styles.contentText]}>${item.amount}</Text>
            </View>
        );
    }

    termDetailsCard() {
        const monthNames = 
            [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];

        return(
            <View style={styles.card}>
                <View style={styles.cardView}>
                    <Text style={[styles.termDetails, styles.contentText]}>Length of Co-op Term:</Text>
                    <Text style={[styles.termData, styles.contentText]}>{this.props.termLength} weeks</Text>
                </View>
                <View style={styles.cardView}>
                    <Text style={[styles.termDetails, styles.contentText]}>Weekly Working Hours:</Text>
                    <Text style={[styles.termData, styles.contentText]}>{this.props.weeklyHours} hours</Text>
                </View>
                <View style={styles.cardView}>
                    <Text style={[styles.termDetails, styles.contentText]}>Hourly Pay:</Text>
                    <Text style={[styles.termData, styles.contentText]}>${this.props.hourlyPay}</Text>
                </View>
                <View style={styles.cardView}>
                    <Text style={[styles.termDetails, {marginBottom: 5}, styles.contentText]}>Start Date:</Text>
                    <Text style={[styles.termData, styles.contentText]}>
                        {monthNames[this.props.startDate.getMonth()]} {this.props.startDate.getDate()}, {this.props.startDate.getFullYear()}
                    </Text>
                </View>
                <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('EditDetails')}>
                    <Text style={styles.buttonText}>EDIT DETAILS</Text>
                </TouchableOpacity>
            </View>
        );
    }

    recurringExpensesCard() {
        if (this.props.recurringExpenses.length === 0) {
            return (
                <View style={[styles.card]}>
                    <View>
                        <TouchableOpacity style={[styles.button, {marginTop: 0}]} onPress={() => this.props.navigation.navigate('AddExpense')}>
                            <Text style={styles.buttonText}>ADD EXPENSE</Text> 
                        </TouchableOpacity>
                    </View>
                </View>
            );
        } else {
            return(
                <View style={[styles.card, { height: '45%'}]}>
                    <FlatList
                        style={{padding: 10}}
                        data={this.props.recurringExpenses}
                        renderItem={({item}) => this.expenseListItem(item)}
                        ItemSeparatorComponent={this.renderSeparator}
                    />
                    <View>
                        <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('AddExpense')}>
                            <Text style={styles.buttonText}>ADD EXPENSE</Text> 
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
    }
    
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Term Details</Text> 
                </View>
                {this.termDetailsCard()}

                <View style={[styles.header, {marginTop: 10}]}>
                    <Text style={styles.headerText}>Recurring Expenses</Text> 
                </View>
                {this.recurringExpensesCard()}
                
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerText: {
        fontFamily: 'HelveticaNeue-Bold',
        fontSize: 25,
        fontWeight:'800',
        textAlign: 'left',
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
        width: '90%',
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
    },
    termData: {
        flex: 1,
        textAlign: 'right',
        fontSize: 18,
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
