import { Slot } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const PagesLayout = () => {
    return (
        <View>
            <Text >Pages</Text>
            <Slot />
        </View>
    );
}

const styles = StyleSheet.create({})

export default PagesLayout;
