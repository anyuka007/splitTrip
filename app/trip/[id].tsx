import useTripsStore from '@/store/trips.store';
import { Link, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, Text, TextInput } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { formatDate } from '@/utils/helpers';
import { Trip, UpdateTripData } from '@/type';

const TripDetails = () => {
    const { id } = useLocalSearchParams();
    const { trips } = useTripsStore();
    const [isEditingField, setEditingField] = useState(false);
    const [updateTripData, setUpdateTripData] = useState<UpdateTripData>({});

    //const navigation = useNavigation();

    const trip = trips.find(trip => trip.$id === id);

    // Set the title of the screen based on the trip name
    /* useEffect(() => {
        navigation.setOptions({
            title: trip!.name,
        });
        return () => {
            
        };
    }, [trip]); */

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
            <Pressable onPress={() => setEditingField(!isEditingField)} className="mb-4">
            {isEditingField ? (
                <TextInput
                    className="h1 text-center"
                    value={updateTripData.name || trip.name}
                    onChangeText={(text) => {
                        setUpdateTripData({ ...updateTripData, name: text });
                        console.log("Editing trip name:", text);
                    }}
                />
            ) : (
                <Text className="h1 text-center ">
                    {trip.name}
                </Text>
            )}
            </Pressable>
            <Text className="text-regular text-xs">
                {`${formatDate(trip.dateStart)} - ${formatDate(trip.dateEnd)}`}
            </Text>
            <Text className="text-regular text-xs text-myGray mt-1">
                Currency: {trip.defaultCurrency}
            </Text>
            <View className='flex flex-row justify-between'>
                <Text>Participants: </Text>
                <View className='flex flex-row gap-2'>{trip?.participants.map((participant) => (
                    <Text key={participant.$id}>{participant.name}</Text>
                ))}
                </View>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({})

export default TripDetails;
