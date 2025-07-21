// app/trip/[id].tsx
import useTripsStore from '@/store/trips.store';
import { Link, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState, useRef } from 'react';
import { Pressable, Text, TextInput, View, Alert } from 'react-native';
import { formatDate } from '@/utils/helpers';
import { UpdateTripData } from '@/type';
import { updateTrip } from '@/lib/trips';

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
                Alert.alert("Success", "Trip name updated!");
            } catch (error) {
                console.error("Error updating trip:", error);
                Alert.alert("Error", "Failed to update trip");
                // Reset to original name on error
                setUpdateTripData(prev => ({ ...prev, name: trip.name }));
            }
        }
        
        setEditingField(false);
    };

    // ✅ Cancel function (revert changes)
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
        <View className="flex h-full items-center justify-center">
            <Pressable onPress={handleDoubleTap} className="mb-4">
                {isEditingField ? (
                    <View className="items-center">
                        <TextInput
                            className="h1 text-center border border-primary rounded-lg p-2 min-w-[200px]"
                            value={updateTripData.name || ''}
                            onChangeText={(text) => {
                                setUpdateTripData({ ...updateTripData, name: text });
                            }}
                            autoFocus
                            onSubmitEditing={handleAutoSave} // ✅ Save on Enter
                            onBlur={handleAutoSave} // ✅ Save when losing focus
                            returnKeyType="done"
                            placeholder="Enter trip name"
                        />
                        {/* ✅ Simple hint - no buttons needed */}
                        <Text className="text-xs text-gray-400 mt-2">
                            Press Enter or tap outside to save
                        </Text>
                    </View>
                ) : (
                    <View className="items-center">
                        <Text className="h1 text-center">{trip.name}</Text>
                        <Text className="text-xs text-gray-400 mt-1">
                            Double-tap to edit
                        </Text>
                    </View>
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
                <View className='flex flex-row gap-2'>
                    {trip?.participants.map((participant) => (
                        <Text key={participant.$id}>{participant.name}</Text>
                    ))}
                </View>
            </View>
        </View>
    );
}

export default TripDetails;