import useTripsStore from '@/store/trips.store';
import { Participant } from '@/type';
import { formatDateForDisplay } from '@/utils/helpers';
import { useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface ExpenseDetailsProps {

}

const ExpenseDetails = ({ }: ExpenseDetailsProps) => {
  const { expenseId, tripId } = useLocalSearchParams();
  const { trips, getExpensesForTrip } = useTripsStore();

  const expenses = getExpensesForTrip(tripId as string);
  const expense = expenses.find(e => e.$id === expenseId);
  //console.log("expense:", JSON.stringify(expense, null, 2));

  const trip = trips.find(t => t.$id === tripId);
  const participants = trip?.participants || [];

  const payer = participants.find(p => p.$id === expense?.payerId);
  
  return (
    <View style={styles.container}>

      {!expense || !trip ? (
        <Text>Loading...</Text>
    ) : (
        <>
            <Text>{expenseId}</Text>
            <Text className='text-regular'>{trip.name}</Text>
            <Text className='text-regular'>{expense.amount}</Text>
            <Text className='text-regular'>{expense.currency}</Text>
            <Text className='text-regular'>{formatDateForDisplay(expense.date.toLocaleString())}</Text>
            <Text className='text-regular'>{trip?.participants.map(participant => participant.name).join(', ')}</Text>
            <Text className='text-regular'>Paid by: {payer?.name}</Text>
        </>
    )}
    </View>
  );
};

export default ExpenseDetails;

const styles = StyleSheet.create({
  container: {}
});
