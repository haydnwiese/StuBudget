import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default class EditDetailsScreen extends React.Component {
    
    static navigationOptions = {
        title: 'Edit Details',
        // headerStyle: {
        //   backgroundColor: '#dddddd',
        //   borderBottomWidth: 0
        // },
        titleStyle: {
            fontFamily: 'HelveticaNeue-Bold',
            fontSize: 25,
            fontWeight:'800',
        },
    };

    render() {
        return (
            <View style={styles.container}>
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
    header: {
        width: '95%',
        marginTop: 0,
    },
    container: {
        flex: 1,
        backgroundColor: '#dddddd',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
});