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
            <Text>{trip.name}</Text>
            <Text>{expense.amount}</Text>
            <Text>{expense.currency}</Text>
            <Text>{formatDateForDisplay(expense.date.toLocaleString())}</Text>
            <Text>{trip?.participants.map(participant => participant.name).join(', ')}</Text>
            <Text>Paid by: {payer?.name}</Text>
        </>
    )}
    </View>
  );
};

export default ExpenseDetails;

const styles = StyleSheet.create({
  container: {}
});
