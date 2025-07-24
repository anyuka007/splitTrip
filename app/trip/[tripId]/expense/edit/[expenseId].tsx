import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface EditExpenseProps {}

const EditExpense = (props: EditExpenseProps) => {
  return (
    <View style={styles.container}>
      <Text>EditExpense</Text>
    </View>
  );
};

export default EditExpense;

const styles = StyleSheet.create({
  container: {}
});
