import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface CustomInputProps {
    placeholder?: string;
    value?: string;    
    label: string;
    secureTextEntry?: boolean;
    keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";onChangeText?: (text: string) => void;
}

const CustomInput = ({placeholder="Enter text", value, onChangeText, label, secureTextEntry = false, keyboardType="default"} : CustomInputProps) => {
    const [isFocused, setIsFocused] = useState(false);
   return (
        <View className='w-full '>
            <Text className='label'>{label}</Text>
            <TextInput 
            autoCapitalize='none'
            autoCorrect={false}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            placeholderTextColor={"#888"}
            /* className={cn("input", isFocused ? "border-secondary" : "border-myGray")} *//>
        </View>
    );
}

const styles = StyleSheet.create({})

export default CustomInput;
