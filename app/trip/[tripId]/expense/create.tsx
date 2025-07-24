import CustomButton from '@/components/CustomButton';
import { createExpense } from '@/lib/expenses';
import useTripsStore from '@/store/trips.store';
import { Expense } from '@/type';
import { formatDateForDisplay } from '@/utils/helpers';
import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface CreateExpenseProps {
    tripId: string;

}

export interface ExpenseData {
    description: string;
    amount: number;
    currency: string;
    date: Date;
    type: string;
    conversionRate?: number;
    convertedAmount?: number;
    tripId: string; 
    payerId: string; // Optional, if the expense is linked to a specific participant
}

const CreateExpense = () => {
  const {tripId} = useLocalSearchParams();
    const {trips} = useTripsStore();
    const trip = trips.find(t => t.$id === tripId);

  const expenseData: ExpenseData = {
        description: 'New Expense',
        amount: 30,
        currency: trip?.defaultCurrency || 'EUR',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        type: "shared",
        tripId: tripId as string,
        payerId: "68823df400278fc17ad6"
    };  

    const createExpenseHandler = async (expenseData: ExpenseData):  Promise<Expense> => {
        try {
            const expense = await createExpense(expenseData);
            router.push(`/trip/${tripId}`);
            return expense;
        } catch (error) {
            console.error("Error creating expense:", error);
            throw error;
        }
    };

  return (
    <View>
      <Text>CreateExpense</Text>
      {trip && (
        <>
          <Text>Trip Name: {trip.name}</Text>
          <Text>Trip Date: {formatDateForDisplay(trip.dateStart)} - {formatDateForDisplay(trip.dateEnd)}</Text>
          <CustomButton text="Create Expense" onPress={() => createExpenseHandler(expenseData)} /> 
        </>
      )}
    </View>
  );
};

export default CreateExpense;

const styles = StyleSheet.create({
  container: {}
});
