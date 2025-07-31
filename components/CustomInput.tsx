import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import cn from "clsx"
import { CustomInputProps } from '@/type';

const CustomInput = ({placeholder="Enter text", value, onChangeText, label, secureTextEntry = false, keyboardType="default", labelClassName="label"} : CustomInputProps) => {
    const [isFocused, setIsFocused] = useState(false);
   return (
        <View className='w-full '>
            <Text className={labelClassName}>{label}</Text>
            <TextInput 
            autoCapitalize='sentences'
            autoCorrect={false}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            placeholderTextColor={"#888"}
            className={cn("input", isFocused ? "border-secondary" : "border-myGray")}
            />
        </View>
    );
}

const styles = StyleSheet.create({})

export default CustomInput;
