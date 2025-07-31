import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';


const Statistics = () => {
    return (
        <View className='flex-1 justify-center items-center'>
            <FontAwesome5 name="chart-bar" size={100} color="#9AC1F0" />
        </View>
    );
}

const styles = StyleSheet.create({})

export default Statistics;
