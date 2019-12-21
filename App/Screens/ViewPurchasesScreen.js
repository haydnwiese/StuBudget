import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, SectionList } from 'react-native';
import Modal from 'react-native-modalbox';
import { Divider } from 'react-native-elements';

export default class ViewPurchasesScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            selectedPurchase: '',
            groupedPurchases: []
        };
    }

    static navigationOptions = {
        title: 'All Purchases',
        titleStyle: {
            fontFamily: 'HelveticaNeue-Bold',
            fontSize: 25,
            fontWeight:'800',
        },
    };

    componentWillMount() {
        this.groupPurchasesByDate();
    }

    groupPurchasesByDate = () => {
        if (this.props.purchases.length > 0) {
            const monthNames = [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];

            let purchases = this.props.purchases;
            let date = 0;

            let purchaseSections = [];

            for (let i = 0; i < purchases.length; i++) {
                if (purchases[i].date !== date) {
                    let dateObj = new Date(purchases[i].date);
                    newObj = {
                        title: `${monthNames[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`,
                        data: []
                    }
                    newObj.data.push(purchases[i]);

                    date = purchases[i].date;
                    i++;

                    while (i < purchases.length && purchases[i].date === date) {
                        newObj.data.push(purchases[i]);
                        i++;
                    }
                    if (i < purchases.length)
                        date = purchases[i].length;

                    purchaseSections.push(newObj);
                    i--;
                }
            }

            this.setState({
                groupedPurchases: purchaseSections
            });
        }   
    }

    purchaseSelect = async(item) => {
        // TODO: Figure out haptic without using expo
        // Haptic.impact(Haptic.ImpactFeedbackStyle.Light);

        await this.setState({
            isOpen: true,
            selectedPurchase: item,
        });
    }

    renderSeparator() {
        return(
            <Divider style={{ height: 1}}/>
        );
    }

    renderSectionHeader(title) {
        return(
            <View style={{ backgroundColor:'#ededed', width: '100%', padding: 10 }} >
                <Text style={[styles.contentText, {fontWeight: '500'}]}>{title}</Text>
            </View>
        );
    }

    renderSectionItems(item) {
        return(
            <TouchableOpacity style={{ backgroundColor:'white', width: '100%', padding: 10 }} onPress={() => this.purchaseSelect(item)}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={[styles.expenseTitle, styles.contentText]}>{item.category}</Text>
                    <Text style={[styles.expenseAmount, styles.contentText]}>${item.amount}</Text>
                </View>
            </TouchableOpacity>
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

    render() {
        return(
            <View style={styles.container}>
                <View style={styles.card}>
                    <SectionList
                        renderItem={({item, index}) => this.renderSectionItems(item)}
                        renderSectionHeader={({section: {title}}) => this.renderSectionHeader(title)}
                        sections={this.state.groupedPurchases}
                        keyExtractor={(item, index) => item + index}
                        ItemSeparatorComponent={() => this.renderSeparator()}
                    />
                </View>
                {this.purchaseDetailsModal()}
            </View>
        );
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
    container: {
        flex: 1,
        backgroundColor: '#ededed',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    expenseTitle: {
        flex: 2,
        fontSize: 18,
        marginVertical: 8,
    },
    expenseAmount: {
        flex: 1,
        textAlign: 'right',
        fontSize: 18,
        marginVertical: 8,
    },
    contentText: {
        fontFamily: 'HelveticaNeue-Light',
        fontSize: 18
    },
    card: {
        width: '100%',
        height: '100%',
        paddingBottom: 10
    },
    termDetails: {
        flex: 2,
        marginBottom: 15,
        fontSize: 18,
        fontFamily: 'HelveticaNeue-Light'
    },
    cardView: {
        flexDirection: 'row'
    }, 
    headerText: {
        fontFamily: 'HelveticaNeue-Bold',
        fontSize: 25,
        fontWeight:'800',
        textAlign: 'left',
        marginBottom: 10,
    },
});