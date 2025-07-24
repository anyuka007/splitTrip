import { useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface ExpenseProps {
    
}

const Expense = ({}: ExpenseProps) => {
  const {expenseId} = useLocalSearchParams();
  console.log("Expense ID:", expenseId);
  return (
    <View style={styles.container}>
      <Text>Expense</Text>
      <Text>{expenseId}</Text>
    </View>
  );
};

export default Expense;

const styles = StyleSheet.create({
  container: {}
});
