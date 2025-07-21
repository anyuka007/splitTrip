// app/trip/[id].tsx
import useTripsStore from '@/store/trips.store';
import { Link, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState, useRef } from 'react';
import { Pressable, Text, TextInput, View, Alert } from 'react-native';
import { formatDate } from '@/utils/helpers';
import { UpdateTripData } from '@/type';
import { updateTrip } from '@/lib/trips';
import CustomButton from '@/components/CustomButton';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const TripDetails = () => {
    const { id } = useLocalSearchParams();
    const { trips, editTrip } = useTripsStore();

    // Handle id type properly
    const tripId = Array.isArray(id) ? id[0] : id;
    const trip = trips.find(trip => trip.$id === tripId);

    const [isEditingField, setEditingField] = useState(false);
    const [updateTripData, setUpdateTripData] = useState<UpdateTripData>({
        name: '',
        dateStart: '',
        dateEnd: '',
        defaultCurrency: 'EUR'
    });

    // *** Double-tap implementation
    const tapCount = useRef(0);
    const tapTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    // Initialize updateTripData when trip loads
    useEffect(() => {
        if (trip) {
            setUpdateTripData({
                name: trip.name,
                dateStart: trip.dateStart,
                dateEnd: trip.dateEnd,
                defaultCurrency: trip.defaultCurrency || 'EUR'
            });
        }
    }, [trip]);

    //Double-tap handler
    const handleDoubleTap = () => {
        tapCount.current += 1;

        if (tapCount.current === 1) {
            tapTimer.current = setTimeout(() => {
                tapCount.current = 0;
                // Single tap - do nothing or show hint
            }, 300);
        } else if (tapCount.current === 2) {
            if (tapTimer.current) {
                clearTimeout(tapTimer.current);
            }
            tapCount.current = 0;
            // Double tap - toggle edit mode
            setEditingField(!isEditingField);
        }
    };

    // Auto-save function
    const handleAutoSave = async () => {
        if (!updateTripData.name?.trim()) {
            Alert.alert('Error', 'Trip name cannot be empty');
            // Reset to original name if empty
            if (trip) {
                setUpdateTripData(prev => ({ ...prev, name: trip.name }));
            }
            setEditingField(false);
            return;
        }

        // Only save if name actually changed
        if (trip && updateTripData.name.trim() !== trip.name) {
            try {
                await editTrip(tripId!, { name: updateTripData.name.trim() });
            } catch (error) {
                console.error("Error updating trip:", error);
                Alert.alert("Error", "Failed to update trip");
                // Reset to original name on error
                setUpdateTripData(prev => ({ ...prev, name: trip.name }));
            }
        }
        
        setEditingField(false);
    };

    // Cancel function (revert changes)
    const handleCancel = () => {
        if (trip) {
            setUpdateTripData(prev => ({ ...prev, name: trip.name }));
        }
        setEditingField(false);
    };

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
        <View className="flex h-full items-center  px-4">
            <View className='flex border-b-[1px] border-primary  pb-4 mb-4 w-full '>
            <Pressable onPress={handleDoubleTap} className="mb-4">
                {isEditingField ? (
                    <View className="items-center">
                        <TextInput
                            className="h1 text-center border-b-1 border-primary rounded-lg p-2 min-w-[200px]"
                            value={updateTripData.name || ''}
                            onChangeText={(text) => {
                                setUpdateTripData({ ...updateTripData, name: text });
                            }}
                            autoFocus
                            onSubmitEditing={handleAutoSave} //  Save on Enter
                            onBlur={handleAutoSave} // Save when losing focus
                            returnKeyType="done"
                            placeholder="Enter trip name"
                        />
                    </View>
                ) : (
                    <View className="items-center">
                        <Text className="h1 text-center">{trip.name}</Text>
                    </View>
                )}
            </Pressable>
            <Pressable className="bg-tertiary rounded-full p-2" onPress={() => alert('Update')}>
                        <FontAwesome5 name="edit" size={24} color="white" />
                      </Pressable>
            <Text className="text-regular text-center">
                {`${formatDate(trip.dateStart)} - ${formatDate(trip.dateEnd)}`}
            </Text>
            <View className='flex flex-row justify-between'>
                <Text>Currency:</Text>
                <Text>{trip.defaultCurrency}</Text>
            </View>
            <View className='flex flex-row justify-between'>
                <Text>Participants: </Text>
                <View className='flex flex-row gap-2'>
                    <Text>{trip?.participants.map(participant => participant.name).join(', ')}</Text>
                </View>
            </View>
        </View>
        <View className='flex border-b-[1px] border-primary  pb-4 mb-4 w-full '>
            <Text>Balance</Text>
        </View>
        <View className='flex  pb-4 mb-4 w-full '>
             <Text className='h2'>Expenses</Text>
            <CustomButton text='Add Expense' onPress={() => {Alert.alert('Add Expense Pressed');}} />
            <Text>Expense 1</Text>
            <Text>Expense 2</Text>
            <Text>Expense 3</Text>
        </View>
        </View>
    );
}

export default TripDetails;