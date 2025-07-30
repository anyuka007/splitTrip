import CustomButton from '@/components/CustomButton';
import { updateExpense } from '@/lib/expenses';
import useTripsStore from '@/store/trips.store';
import { ExpenseLike } from '@/type';
import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';

interface EditExpenseProps {}

const EditExpense = (props: EditExpenseProps) => {

  const { tripId, expenseId } = useLocalSearchParams();
  const { trips, fetchExpenses } = useTripsStore();
  const trip = trips.find(t => t.$id === tripId);

  const [expense, setExpense] = React.useState<ExpenseLike>({ description: "test 222", amount: 300, currency: trip?.defaultCurrency || "EUR", date: new Date(), type: "individual", tripId: tripId as string, payerId: trip?.participants[0].$id || "" });

const submit = async () => {
    try {
      await updateExpense(expenseId as string, expense);
      await fetchExpenses(tripId as string);
      Alert.alert("Expense updated successfully!");
      router.back();
    } catch (error) {
      console.error("Error updating expense:", error);
      
    }
  }

  return (
    <View style={styles.container}>
      <Text>EditExpense</Text>
      <CustomButton text="Save" onPress={submit} />  
    </View>
  );
};

export default EditExpense;

const styles = StyleSheet.create({
  container: {}
});
