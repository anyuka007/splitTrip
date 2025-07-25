import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
import DatePicker from '@/components/DatePicker';
import Dropdown from '@/components/Dropdown';
import { createExpense } from '@/lib/expenses';
import useTripsStore from '@/store/trips.store';
import { Currency, Expense, ExpenseType, Participant } from '@/type';
import { formatDateForDisplay } from '@/utils/helpers';
import { currencies, expenseTypes } from '@/variables';
import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, } from 'react-native';
import CheckBox, { Checkbox } from 'expo-checkbox';
import CustomCheckbox from '@/components/CustomCheckbox';
//import CheckBox from 'expo-checkbox';

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
  const trip = trips.find(t => t.$id === tripId);

  const [expense, setExpense] = useState<ExpenseLike>({ description: "", amount: 0, currency: trip?.defaultCurrency || "EUR", date: new Date(), type: "individual", tripId: tripId as string, payerId: "" });
  
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

  // Participant selection toggle function
  const toggleParticipant = (participantId: string) => {
    setSelectedParticipants(prev => {
      if (prev.includes(participantId)) {
        // Remove if already selected
        return prev.filter(id => id !== participantId);
      } else {
        // Add if not selected
        return [...prev, participantId];
      }
    });
  };

  // Select all participants
  const toggleAllParticipants = () => {
    if (selectedParticipants.length === trip?.participants.length) {
      // Deselect all
      setSelectedParticipants([]);
    } else {
      // Select all
      setSelectedParticipants(trip?.participants.map(p => p.$id) || []);
    }
  };

  // Add payer to selected participants if not already included
  useEffect(() => {
    if (expense.payerId && !selectedParticipants.includes(expense.payerId)) {
      setSelectedParticipants(prev => [...prev, expense.payerId]);
    }
  }, [expense.payerId]);

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
            <Text className='label'>Expence currency</Text>
            <Dropdown
              items={currencies}
              selectedValue={expense.currency}
              onValueChange={(currency) => setExpense({ ...expense, currency: currency as Currency })}
              pickerStyle={{ height: 60 }}
            />
          </View>
          <View className='flex'>
            <Text className='label'>Payer</Text>
            <Dropdown
              items={trip.participants.map(p => ({ label: p.name, value: p.$id }))}
              selectedValue={expense.payerId}
              onValueChange={(payerId) => setExpense({ ...expense, payerId })}
              placeholder="Select Payer"
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
            <View className='flex'>
            <Text className='label'>
              Select participants who should pay for this expense
            </Text>

            {/* Select All/None Button */}
            <View style={{ marginBottom: 8 }}>
              <CustomCheckbox
                isChecked={selectedParticipants.length === trip.participants.length}
                onToggle={toggleAllParticipants}
                label={`Select All (${selectedParticipants.length}/${trip.participants.length})`}
                color="#007bff"
              />
            </View>

            
           {/* Individual Participant Checkboxes */}
            {trip.participants.map((participant: Participant) => (
              <View key={participant.$id} className='flex flex-row justify-between items-center'>
                <CustomCheckbox
                
                isChecked={selectedParticipants.includes(participant.$id)}
                onToggle={() => toggleParticipant(participant.$id)}
                label={`${participant.name}${participant.$id === expense.payerId ? ' (Payer)' : ''}`}
                color={participant.$id === expense.payerId ? '#28a745' : '#f6c445'}
                disabled={participant.$id === expense.payerId} // Payer kann nicht abgewählt werden
              />
              {expense.amount && selectedParticipants.length > 0 && (
                <Text>
                  {Number((expense.amount / selectedParticipants.length).toFixed(2))}
                  {expense.currency}
                </Text>
              )}
            </View>
          ))}

            {/* Error message if no participants selected */}

            {selectedParticipants.length === 0 && (
              <Text className='text-tertiary text-regulartext-sm mt-2'>
                Please select at least one participant
              </Text>
            )}
          </View>
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
