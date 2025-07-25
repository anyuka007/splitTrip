import { Pressable, Text } from 'react-native';
import { StyleSheet, View } from 'react-native';
import Avatar from './Avatar';
import { formatDateForDisplay } from '@/utils/helpers';
import { router } from 'expo-router';
import { TripWithParticipants } from '@/type';

export interface TripCardParams {
    trip: TripWithParticipants;
}

const TripCard = ({ trip }: TripCardParams) => {
       
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
                onPress={() => router.push(`/trip/${trip.$id}`)}
            >
                <View>
                    <Text className="h2" numberOfLines={1} 
    ellipsizeMode="tail">
                        {trip.name}
                    </Text>
                    <Text className="text-regular text-xs">
                        {`${formatDateForDisplay(trip.dateStart)} - ${formatDateForDisplay(trip.dateEnd)}`}
                    </Text>
                    <Text className="text-regular text-xs text-myGray mt-1">
                        Currency: {trip.defaultCurrency}
                    </Text>
                </View>

                <View className='flex flex-row items-center justify-between mt-2'>
                    <Text className='h3'>Participants:</Text>
                    <View className='flex-row justify-end items-center h-12 gap-0.5'>
                        {trip.participants.length > 0 ? (
                            trip.participants.slice(0, 3).map((participant, index) => (
                                <Avatar key={participant.$id} name={participant.name} />
                            ))
                        ) : (
                            <Text className="text-xs text-myGray">No participants</Text>
                        )}
                        {trip.participants.length > 3 && (
                            <View className="bg-myGray rounded-full w-8 h-8 justify-center items-center ml-1">
                                <Text className="text-white text-xs">+{trip.participants.length - 3}</Text>
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
