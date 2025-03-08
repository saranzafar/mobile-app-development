import { Text, StyleSheet, View } from 'react-native';
import React, { Component } from 'react';

export default class Seprator extends Component {
    render() {
        return (
            <View style={styles.seprator}>
                <Text>Seprator</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    seprator: {
        height: 0.8,
        backgroundColor: '#CAD5E2',
    },
});
