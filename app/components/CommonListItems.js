import React from 'react';
import { Text, View, TouchableOpacity, TextInput } from 'react-native';
import { commonStyles } from '../styles/CommonStyles';
import PropTypes from 'prop-types';

export const Header = (props) => {
    let withMargin = props.withMargin
    if (withMargin === undefined) {
        withMargin = true;
    }
    return (
        <View style={commonStyles.header}>
            <Text style={[commonStyles.headerText, props.withMargin ? { marginBottom: 10 } : { marginBottom: 0 }]}>
                {props.title}
            </Text>
        </View>
    );
}

Header.propTypes = {
    title: PropTypes.string,
    withMargin: PropTypes.bool
}

export const SubHeader = (props) => {
    return (
        <View style={[commonStyles.subHeader, props.style]}>
            <Text style={commonStyles.subHeaderText}>
                {props.title}
            </Text>
        </View>
    );
}

SubHeader.propTypes = {
    title: PropTypes.string,
    style: PropTypes.object
}

export const ActionButton = (props) => {
    return (
        <TouchableOpacity style={props.style} onPress={props.onPress}>
            <Text style={commonStyles.buttonText}>{props.title}</Text>
        </TouchableOpacity>
    );
}

ActionButton.propTypes = {
    title: PropTypes.string,
    style: PropTypes.style,
    onPress: PropTypes.func
}

export const AmountInput = (props) => {
    let textInput = amountInputHelper(props.value == 0, props);
    return (
        <View style={props.containerStyle}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                <Text style={commonStyles.amountInput}>$</Text>
                {textInput}
            </View>
            <View style={{ height: 3, backgroundColor: 'black', flex: 0 }}></View>
        </View>
    );
}

function amountInputHelper(isEmpty, props) {
    if (isEmpty) {
        return (
            <TextInput
                placeholder={props.placeHolder}
                placeholderTextColor={'grey'}
                onChangeText={props.onChangeText}
                style={{ fontFamily: 'HelveticaNeue-Light', fontSize: 40, fontWeight: '500', color: 'black', width: '100%' }}
                keyboardType={props.keyboardType}
                maxLength={7}
            />
        );
    } else {
        return (
            <TextInput
                value={props.value}
                onChangeText={props.onChangeText}
                style={{ fontFamily: 'HelveticaNeue-Light', fontSize: 40, fontWeight: '500', color: 'black', width: '100%' }}
                keyboardType={props.keyboardType}
                maxLength={7}
            />
        );
    }
}

AmountInput.propTypes = {
    value: PropTypes.number,
    placeHolder: PropTypes.string,
    onChangeText: PropTypes.func,
    keyboardType: PropTypes.string,
    containerStyle: PropTypes.style
}


