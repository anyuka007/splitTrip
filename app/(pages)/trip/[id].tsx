import useTripsStore from '@/store/trips.store';
import { Link, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { formatDate } from '@/utils/helpers';

const TripInfo = () => {
    const { id } = useLocalSearchParams();
    const { trips } = useTripsStore();

    const trip = trips.find(trip => trip.$id === id);

    if (!trip) {
        return (
            <View className="flex h-full items-center justify-center">
                <Text className="text-regular text-myGray">Trip not found</Text>
                <Link href="/">
                    <Text className="text-center text-primary mt-4">Go Home</Text>
                </Link>
            </View>
        );
    }

    return (
        <View className="flex h-full items-center justify-center">
            <Text className="h1 text-center ">
                TripInfo:
            </Text>
            <Text>{trip!.name}</Text>
            <Text>{formatDate(trip?.dateStart!)}</Text>
            <Text>{formatDate(trip?.dateEnd!)}</Text>
            <Text>{trip?.defaultCurrency}</Text>
            <View className='flex flex-row justify-between'>
                <Text>Participants: </Text>
                <View className='flex flex-row gap-2'>{trip?.participants.map((participant) => (
                    <Text key={participant.$id}>{participant.name}</Text>
                ))}
                </View>
            </View>

            <Link href="/" >
                <Text className="text-center text-primary">Home</Text>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({})

export default TripInfo;
