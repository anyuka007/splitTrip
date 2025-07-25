import * as React from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import Checkbox from 'expo-checkbox';

interface CustomCheckboxProps {
  isChecked: boolean;
  onToggle: () => void;
  label: string;
  style?: object;
  color?: string;
  disabled?: boolean;
}

const CustomCheckbox = ({ 
  isChecked, 
  onToggle, 
  label, 
  style, 
  color = '#f6c445',
  disabled = false 
}: CustomCheckboxProps) => {
  return (
    <Pressable 
      onPress={disabled ? undefined : onToggle} 
      style={[
        styles.container, 
        disabled && styles.disabled,
        style
      ]}
    >
      <Checkbox
        value={isChecked}
        onValueChange={disabled ? undefined : onToggle}
        style={styles.checkbox}
        color={isChecked ? color : undefined}
        disabled={disabled}
      />
      <Text style={[
        styles.paragraph,
        disabled && styles.disabledText
      ]}>
        {label}
      </Text>
    </Pressable>
  );
};

export default CustomCheckbox;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  disabled: {
    opacity: 0.5,
  },
  paragraph: {
    fontSize: 15,
    fontFamily: 'Quicksand-Regular',
    marginLeft: 8,
  },
  disabledText: {
    color: '#999',
  },
  checkbox: {
    margin: 8,
  },
});