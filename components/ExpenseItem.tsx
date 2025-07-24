import { Expense, Participant, Trip } from '@/type';
import { formatDateForDisplay } from '@/utils/helpers';
import { currencies } from '@/variables';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import * as React from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';

interface ExpenseItemProps {
    trip: Trip;
    expense: Expense;
}

const ExpenseItem = ({
    trip, expense
}: ExpenseItemProps) => {

    const currencySymbol = currencies.find(c => c.value === expense.currency)?.symbol || expense.currency;
    return (
        <Pressable className="flex-row items-center justify-between my-2" onPress={() => router.push(`/trip/${trip.$id}/expense/${expense.$id}`)}>
            <Text>{`${formatDateForDisplay(expense.date.toLocaleString())} `}</Text>
            <Text className='ellipsis'>{expense.description}</Text>
            <Text>{trip.participants.find((p: Participant) => p.$id === expense.payerId)?.name}</Text>
            <Text>{`${expense.amount}${currencySymbol} `}</Text>

        </Pressable>
    );
};

export default ExpenseItem;

const styles = StyleSheet.create({
    container: {}
});


