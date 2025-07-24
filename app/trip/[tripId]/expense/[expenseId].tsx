import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface ExpenseProps {
    description: string;
    amount: number;
    currency: "EUR" | "USD" | "UAH" | "PLN";
    date: Date;
    type: "shared" | "individual" | "sponsored";
    conversionRate?: number; // Optional
    convertedAmount?: number; // Optional
}

const Expense = ({description, amount, currency, date, type, conversionRate, convertedAmount}: ExpenseProps) => {
  return (
    <View style={styles.container}>
      <Text>Expense</Text>
    </View>
  );
};

export default Expense;

const styles = StyleSheet.create({
  container: {}
});
