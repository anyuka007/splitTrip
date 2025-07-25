import React, { useState } from 'react';
import { View, Button, Text, Platform, Pressable } from 'react-native';
import DateTimePicker, { DateTimePickerEvent, DatePickerOptions } from '@react-native-community/datetimepicker';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { formatDateForDisplay } from '@/utils/helpers';

interface DatePickerProps {
  // Required props
  value: Date;
  onDateChange: (date: Date) => void;
  
  // Optional props with defaults
  mode?: 'date' | 'time' | 'datetime';
  display?: 'default' | 'spinner' | 'compact';
  displayFormat?: 'german' | 'us' | 'short';
  placeholder?: string;
  format?: 'short' | 'long' | 'full';
  disabled?: boolean;
  minimumDate?: Date;
  maximumDate?: Date;
  
  // Style props
  iconName?: keyof typeof FontAwesome.glyphMap;
  iconSize?: number;
  iconColor?: string;
  containerStyle?: any;
  textStyle?: any;
  
  // Labels
  doneButtonTitle?: string;
}

export default function DatePicker({
  value,
  onDateChange,
  mode = 'date',
  display = 'default',
  placeholder = 'Select date',
  displayFormat = 'german', 
  format,
  disabled = false,
  minimumDate,
  maximumDate,
  iconName = 'calendar',
  iconSize = 24,
  iconColor = 'black',
  containerStyle,
  textStyle,
  doneButtonTitle = 'Done'
}: DatePickerProps) {
  const [show, setShow] = useState(false);

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // console.log('Raw event:', event);
    // console.log('Selected date:', selectedDate);

    // Handle dismissed event
    if (event && event.type === 'dismissed') {
        setShow(false);
        return;
    }
    
    // Platform specific behavior
    setShow(Platform.OS === 'ios');
    
    if (selectedDate) {
        onDateChange(selectedDate);
    }
  };

   const getDisplayValue = (): string => {
    if (!value || !(value instanceof Date) || isNaN(value.getTime())) {
      return placeholder;
    }
    
    switch (mode) {
      case 'time':
        return value.toLocaleTimeString('de-DE');
      case 'datetime':
        return `${formatDateForDisplay(value.toISOString().split('T')[0])} ${value.toLocaleTimeString('de-DE')}`;
      case 'date':
      default:
        switch (displayFormat) {
          case 'german':
            // Convert Date to ISO string
            const isoString = value.toISOString().split('T')[0];
            return formatDateForDisplay(isoString); // "22.07.2025"
          case 'us':
            return value.toLocaleDateString('en-US'); // "7/22/2025"
          case 'short':
            return value.toLocaleDateString('de-DE', { 
              day: 'numeric', 
              month: 'short' 
            }); // "22. Jul"
          default:
            const defaultIsoString = value.toISOString().split('T')[0];
            return formatDateForDisplay(defaultIsoString);
        }
    }
  };

  return (
    <Pressable 
      style={[
        { padding: 10 }, 
        containerStyle
      ]} 
      className="flex flex-row justify-between items-center createTrip_border" 
      onPress={() => !disabled && setShow(true)}
      disabled={disabled}
    >
      
      
      <Text style={[
        { flex: 1,  color: disabled ? '#999' : '#000' }, 
        textStyle
      ]}>
        {getDisplayValue()}
      </Text>
      <FontAwesome name={iconName} size={iconSize} color={iconColor} />
      
      {show && (
        <View>
          <DateTimePicker
            value={value}
            mode={mode}
            display={display}
            onChange={onChange}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
          />
          {Platform.OS === 'ios' && (
            <Button title={doneButtonTitle} onPress={() => setShow(false)} />
          )}
        </View>
      )}
    </Pressable>
  );
}