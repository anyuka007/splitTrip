import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
import DatePicker from '@/components/DatePicker';
import Dropdown from '@/components/Dropdown';
import { createExpense } from '@/lib/expenses';
import useTripsStore from '@/store/trips.store';
import { Currency, Expense, ExpenseType } from '@/type';
import { formatDateForDisplay } from '@/utils/helpers';
import { currencies, expenseTypes } from '@/variables';
import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface CreateExpenseProps {
  tripId: string;

}

export type ExpenseLike = Pick<Expense, 'description' | 'amount' | 'currency' | 'date' | 'type' | 'conversionRate' | 'convertedAmount' | 'tripId' | 'payerId'>;

export interface ExpenseData {
  description: string;
  amount: number;
  currency: string;
  date: Date;
  type: ExpenseType;
  conversionRate?: number;
  convertedAmount?: number;
  tripId: string;
  payerId: string;
}

const CreateExpense = () => {
  const { tripId } = useLocalSearchParams();
  const { trips } = useTripsStore();

  const [expense, setExpense] = useState<ExpenseLike>({ description: "", amount: 0, currency: "EUR", date: new Date(), type: "individual", tripId: tripId as string, payerId: "" });

  const trip = trips.find(t => t.$id === tripId);

  const expenseData: ExpenseLike = {
    description: 'New Expense',
    amount: 2000,
    // currency: trip?.defaultCurrency || 'EUR',
    currency: 'USD', // Fixed: no more empty string
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    type: "shared",
    tripId: tripId as string,
    payerId: "68823df400278fc17ad6"
  };

  const createExpenseHandler = async (expenseData: ExpenseLike): Promise<Expense> => {
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
    <ScrollView className='flex gap-4 bg-white  p-5 mt-3' contentContainerStyle={{ gap: 16 }}>
      <Text className='text-regular'>CreateExpense</Text>
      {trip && (
        <>
          <Text className='text-regular'>Trip Name: {trip.name}</Text>
          <Text className='text-regular'>Trip Date: {formatDateForDisplay(trip.dateStart)} - {formatDateForDisplay(trip.dateEnd)}</Text>
          <CustomInput
            placeholder="Enter expense description"
            label='Expense Description'
            value={expense.description}
            onChangeText={(text) => setExpense({ ...expense, description: text })}
          />
          <View>
            <Text className="label">Date</Text>
            <DatePicker
              value={expense.date}
              onDateChange={(date) => setExpense({ ...expense, date })}
            />
          </View>
          <CustomInput
            placeholder="Enter expense amount"
            label='Amount'
            value={expense.amount.toString()}
            onChangeText={(text) => setExpense({ ...expense, amount: Number(text) })}
          />
          <View className='flex'>
            <Text className='label'>Trip currency</Text>
            <Dropdown
              items={currencies}
              selectedValue={expense.currency}
              onValueChange={(currency) => setExpense({ ...expense, currency: currency as Currency })}
              pickerStyle={{ height: 60 }}
            />
          </View>
          <View className='flex'>
            <Text className='label'>Type of expense</Text>
            <Dropdown
              items={expenseTypes}
              selectedValue={expense.type}
              onValueChange={(type) => setExpense({ ...expense, type: type as ExpenseType })}
              pickerStyle={{ height: 60 }}
            />
          </View>
          <CustomButton text="Create Expense" onPress={() => createExpenseHandler(expenseData)} />
        </>
      )}
    </ScrollView>
  );
};

export default CreateExpense;

const styles = StyleSheet.create({
  container: {}
});
