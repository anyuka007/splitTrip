import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface EditTripProps {}

const EditTrip = (props: EditTripProps) => {
  return (
    <View style={styles.container}>
      <Text>EditTrip</Text>
    </View>
  );
};

export default EditTrip;

const styles = StyleSheet.create({
  container: {}
});
