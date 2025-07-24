// app/trip/[id].tsx
import useTripsStore from '@/store/trips.store';
import { Link, router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState, useRef } from 'react';
import { Pressable, Text, TextInput, View, Alert } from 'react-native';
import { formatDateForDisplay } from '@/utils/helpers';
import { Expense, UpdateTripData } from '@/type';
import { updateTrip } from '@/lib/trips';
import CustomButton from '@/components/CustomButton';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import {  getExpensesByTripId } from '@/lib/expenses';

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

    const [expenseList, setExpenseList] = useState<Expense[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const result = await getExpensesByTripId(tripId); // Call the function
            setExpenseList(result);
        } catch (error) {
            console.error("Error fetching expenses:", error);
        } finally {
            setLoading(false);
        }
    };

    if (tripId) {
        fetchExpenses();
    }
}, [tripId]);



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
            <Pressable className="bg-tertiary rounded-full p-2" onPress={() => router.push(`/trip/edit/${tripId}`)}>
                        <FontAwesome name="edit" size={24} color="white" />
                      </Pressable>
            <Text className="text-regular text-center">
                {`${formatDateForDisplay(trip.dateStart)} - ${formatDateForDisplay(trip.dateEnd)}`}
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
            

            {expenseList && expenseList.length > 0 ? (
                expenseList.map((expense: Expense, index: number) => (
                    <View key={index} className="flex-row items-center justify-between my-2">
                        <Text>{expense.description}</Text>
                        <Text>{`${formatDateForDisplay(expense.date.toLocaleString())} `}</Text>
                        <Text>{`${expense.amount} `}</Text>
                        <Text>{`${expense.payerId}`}</Text>
                        <Pressable onPress={() => router.push(`/trip/${tripId}/expense/${expense.$id}`)}>
                            <FontAwesome name="eye" size={24} color="gray-500" />
                        </Pressable>
                    </View>
                ))
            ) : (
                <Text>No expenses found</Text>
            )} 
            <CustomButton text='Add Expense' onPress={() => router.push(`/trip/${tripId}/expense/create`)} />     
        </View>
    </View>
    );
}

export default TripDetails;