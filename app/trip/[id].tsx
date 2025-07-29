// app/trip/[id].tsx
import useTripsStore from '@/store/trips.store';
import { Link, router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState, useRef } from 'react';
import { Pressable, Text, TextInput, View, Alert, ScrollView } from 'react-native';
import { formatDateForDisplay } from '@/utils/helpers';
import { Expense, ExpenseShare, Participant, UpdateTripData } from '@/type';
import { updateTrip } from '@/lib/trips';
import CustomButton from '@/components/CustomButton';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import {  getExpensesByTripId } from '@/lib/expenses';
import ExpenseItem from '@/components/ExpenseItem';

const TripDetails = () => {
    const { id } = useLocalSearchParams();
    const { trips, editTrip, fetchExpenses, getExpensesForTrip, getExpenseSharesForExpense, fetchExpenseShares, expensesLoading,  } = useTripsStore();

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

    const expenseList = getExpensesForTrip(tripId!); // Use the store's selector to get expenses for this trip

useEffect(() => {
        if (tripId && expenseList.length === 0 && !expensesLoading) {
            fetchExpenses(tripId);
            
        }
    }, [tripId]);

    // Fetch expense shares for each expense when the trip loads
    useEffect(() => {
  if (expenseList.length > 0) {
    expenseList.forEach(expense => {
      // Nur fetchen, wenn noch nicht im Store!
      if (getExpenseSharesForExpense(expense.$id).length === 0) {
        fetchExpenseShares(expense.$id);
      }
    });
  }
}, [expenseList]);

const shares = expenseList.flatMap(expense => getExpenseSharesForExpense(expense.$id));

//console.log("shares: ", JSON.stringify(shares, null, 2));

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

    const participants = trip?.participants.map(participant => participant as Participant) || [];
    const participantsIds = participants.map(participant => participant.$id) || [];

    const paidByParticipant = (participantId: string): number => {
        const expenses = expenseList.filter(expense => expense.payerId === participantId);
        if (expenses.length > 0) {
            return expenses.reduce((total, expense) => total + expense.amount, 0);
        }
        return 0;
    }


    const sharesByParticipant = (participantId: string) => {
        return shares.filter(share => share.participantId === participantId);
    };  

    const participantBalance = (participantId: string) => {
        const paid = paidByParticipant(participantId);
        const shares = sharesByParticipant(participantId);
        const totalShares = shares.reduce((total, share) => total + share.amount, 0);
        const balance = { paid, shares:totalShares, balance: paid - totalShares };
        return balance;
    };

    //console.log("share by participant:", sharesByParticipant(participantsIds[0]).map(share => share.amount));


//console.log("participantsIds:", participantsIds);
//console.log("paid by participant 1:", paidByParticipant(participantsIds[0]));

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
        <ScrollView style={{ flex: 1, height: '100%', paddingHorizontal: 16 }}>
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
                    <View className="flex-row justify-between items-center">
                        <Text className="h1 w-[85%]" numberOfLines={2} ellipsizeMode="tail">{trip.name}</Text><Pressable className="p-2 flex items-end justify-center" onPress={() => router.push(`/trip/edit/${tripId}`)}>
                <FontAwesome name="edit" size={24} color="#f6c445" />
            </Pressable>
                    </View>
                )}
            </Pressable>
            <View className='flex flex-row justify-between'>
                <Text className='text-regular text-sm'>Duration:</Text>
                <Text className="text-regular text-center">
                {`${formatDateForDisplay(trip.dateStart)} - ${formatDateForDisplay(trip.dateEnd)}`}
            </Text>
            </View>
            
            <View className='flex flex-row justify-between'>
                <Text className='text-regular text-sm'>Currency:</Text>
                <Text className='text-regular'>{trip.defaultCurrency}</Text>
            </View>
            <View className='flex flex-row justify-between'>
                <Text className='text-regular text-sm'>Participants: </Text>
                <View className='flex flex-row gap-2'>
                    <Text className='text-regular'>{participants.map(participant => participant.name).join(', ')}</Text>
                </View>
            </View>
        </View>
        <View className='flex border-b-[1px] border-primary  pb-4 mb-4 w-full '>
            <Text className='h2'>Balances</Text>

            {expenseList && expenseList.length > 0 ? (
                <View>
                    <View>
                        <Text className='text-regular font-bold'>Shared balance:</Text>
                    {participants.map((participant, index) => (
                        <View key={index} className='flex flex-row items-center gap-1'>
                            <Text className='text-regular'>{`${participant.name}: `}</Text>
                            <Text className='text-regular'>{`${participantBalance(participant.$id).balance} ${trip.defaultCurrency}`}</Text>
                        </View>
                    ))}
                    </View>
                    <View>
                        <Text className='text-regular font-bold'>Total spent:</Text>
                    {participants.map((participant, index) => (
                        <View key={index} className='flex flex-row items-center gap-1'>
                            <Text className='text-regular'>{`${participant.name}: `}</Text>
                            <Text className='text-regular'>{`${participantBalance(participant.$id).shares} ${trip.defaultCurrency}`}</Text>
                        </View>
                    ))}
                    </View>
                </View>
            ) : (
                <Text className='text-regular'>No expenses found</Text>
            )}
        </View>
        <View className='flex  pb-4 mb-4 w-full '>
             <Text className='h2'>Expenses</Text>
            

            {expenseList && expenseList.length > 0 ? (
                expenseList.map((expense: Expense) => (
                    <ExpenseItem key={expense.$id} trip={trip} expense={expense} />
                ))
            ) : (
                <Text className='text-regular'>No expenses found</Text>
            )} 
            <CustomButton text='Add Expense' onPress={() => router.push(`/trip/${tripId}/expense/create`)} />     
        </View>
    </ScrollView>
    );
}

export default TripDetails;