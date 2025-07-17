import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import TestTrip from '@/components/testDB/TestTrip';

const Statistics = () => {
    return (
        <View className='flex-1 justify-center items-center'>
            <FontAwesome5 name="chart-bar" size={100} color="#9AC1F0" />
            <TestTrip />
        </View>
    );
}

const styles = StyleSheet.create({})

export default Statistics;
