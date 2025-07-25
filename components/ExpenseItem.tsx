import { Expense, Participant, Trip } from '@/type';
import { formatDateForDisplay } from '@/utils/helpers';
import { currencies } from '@/variables';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import * as React from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import Avatar from './Avatar';

interface ExpenseItemProps {
    trip: Trip;
    expense: Expense;
}

const ExpenseItem = ({
    trip, expense
}: ExpenseItemProps) => {

    const currencySymbol = currencies.find(c => c.value === expense.currency)?.symbol || expense.currency;
    return (
        <Pressable className='bg-white rounded-xl flex justify-between p-3 mb-3'
                style={{
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 5,
                }} onPress={() => router.push(`/trip/${trip.$id}/expense/${expense.$id}`)}>
                    <View className='flex flex-row justify-between items-center'>
                        <Text>{`${formatDateForDisplay(expense.date.toLocaleString())} `}</Text>
                        <Text>{`${expense.amount}${currencySymbol} `}</Text>
                    </View>
            <Text className='text-regular' numberOfLines={1} 
    ellipsizeMode="tail">{expense.description}</Text>
            <View className='flex flex-row justify-between items-center'>
            <View className='flex flex-row gap-2 w-[49%]'>
                <Text className='text-regular text-sm '>Paid by: </Text>
                <Text>{trip.participants.find((p: Participant) => p.$id === expense.payerId)?.name}</Text>
            </View>
            <View className='flex flex-row items-center gap-2 w-[49%]'>
                <Text className='text-regular text-sm'>Shared with: </Text>
                <Text>Avatars</Text>
            </View>
            </View>

        </Pressable>
    );
};

export default ExpenseItem;

const styles = StyleSheet.create({
    container: {}
});


