import { getTripParticipants } from '@/lib/participants';
import { Participant, Trip } from '@/type';
import React, { useEffect, useState } from 'react';
import { Pressable, Text } from 'react-native';
import { StyleSheet, View } from 'react-native';
import Avatar from './Avatar';
import { formatDate } from '@/utils/helpers';

export interface TripCardParams {
    trip: Trip
}

const TripCard = ({ trip }: TripCardParams) => {

    const [tripParticipants, setTripParticipants] = useState<Participant[]>([]);

    // Fetch participants for the trip
    const fetchParticipants = async () => {
  try {
    const participantsData = await getTripParticipants(trip.$id);
    setTripParticipants(participantsData);
  } catch (error) {
    console.error(`Error loading participants for trip ${trip.$id}:`, error);
    setTripParticipants([]);
  }
};

    useEffect(() => {
        fetchParticipants();
    }, [trip.$id]);

    
    return (
        <View>
            <Pressable
                className='bg-white rounded-xl flex justify-between p-3 mb-3'
                style={{
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 5,
                }}
            >
                <View>
                    <Text className="h2">
                        {trip.name}
                    </Text>
                    <Text className="text-regular text-xs">
                        {`${formatDate(trip.dateStart)} - ${formatDate(trip.dateEnd)}`}
                    </Text>
                    <Text className="text-regular text-xs text-myGray mt-1">
                        Currency: {trip.defaultCurrency}
                    </Text>
                </View>

                <View className='flex flex-row items-center justify-between mt-2'>
                    <Text className='h3'>Participants:</Text>
                    <View className='flex-row justify-end items-center h-12 gap-0.5'>
                        {tripParticipants.length > 0 ? (
                            tripParticipants.slice(0, 3).map((participant, index) => (
                                <Avatar key={participant.$id} name={participant.name} />
                            ))
                        ) : (
                            <Text className="text-xs text-myGray">No participants</Text>
                        )}
                        {tripParticipants.length > 3 && (
                            <View className="bg-myGray rounded-full w-8 h-8 justify-center items-center ml-1">
                                <Text className="text-white text-xs">+{tripParticipants.length - 3}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({})

export default TripCard;
