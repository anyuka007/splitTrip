import { CustomButtonProps } from '@/type';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const DEFAULT_BUTTON_LABEL = "Click Me";
const DEFAULT_BUTTON_CLASSNAME = "bg-primary w-full h-12 flex items-center justify-center rounded-xl my-2";

const CustomButton = ({ text = DEFAULT_BUTTON_LABEL, onPress, classname, disabled=false, isLoading=false }: CustomButtonProps) => {

    const buttonClassName = classname || DEFAULT_BUTTON_CLASSNAME;

    return (
         <TouchableOpacity 
            onPress={onPress} 
            className={buttonClassName}
            disabled={disabled}
            style={{ opacity: disabled ? 0.5 : 1 }}
        >
            <Text className="h3 text-white text-center ">{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({})

export default CustomButton;
