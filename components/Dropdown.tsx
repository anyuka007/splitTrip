import React from 'react';
import { Picker } from '@react-native-picker/picker';
import { View, Text, ViewStyle, TextStyle } from 'react-native';

interface DropdownItem {
  label: string;
  value: string;
}

interface DropdownProps {
  // Required props
  items: DropdownItem[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  
  // Optional props
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  
  // Style props
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  pickerStyle?: ViewStyle;
  dropdownStyle?: ViewStyle;
}

const Dropdown = ({
  items,
  selectedValue,
  onValueChange,
  label,
  placeholder = "Select an option",
  disabled = false,
  containerStyle,
  labelStyle,
  pickerStyle,
  dropdownStyle
}: DropdownProps) => {
  return (
    <View style={[{ marginVertical: 8 }, containerStyle]}>
      {/* Label */}
      {label && (
        <Text 
          className="label" 
          style={[
            { marginBottom: 8, fontSize: 16, fontWeight: '500' }, 
            labelStyle
          ]}
        >
          {label}
        </Text>
      )}
      
      {/* Dropdown Container */}
      <View style={[
        {
          borderBottomWidth: 1,
          backgroundColor: disabled ? '#f5f5f5' : 'white',
        },
        dropdownStyle
      ]}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={(itemValue) => onValueChange(itemValue)}
          enabled={!disabled}
          style={[
            { height: 50,
              color: disabled ? '#999' : '#000'
            }, 
          ]}
        >
          {/* Placeholder Item */}
          {/* {placeholder && (
            <Picker.Item 
              label={placeholder} 
              value="" 
              color="#999"
            />
          )} */}
          
          {/* Dynamic Items */}
          {items.map((item) => (
            <Picker.Item 
              key={item.value}
              label={item.label} 
              value={item.value}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

export default Dropdown;