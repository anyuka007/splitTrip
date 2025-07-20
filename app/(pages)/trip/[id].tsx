import { getTripsWithParticipants } from '@/lib/trips';
import { Link, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
import { StyleSheet, View } from 'react-native';

const TripInfo = () => {
    const {id} = useLocalSearchParams();

    
    return (
        <View className="flex h-full items-center justify-center">
                    <Text className="h1 text-center ">
                        TripInfo: {id}
                    </Text>
                    <Link href="/" >
                        <Text className="text-center text-primary">Home</Text>
                    </Link>
                </View>
    );
}

const styles = StyleSheet.create({})

export default TripInfo;
