import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CustomButtonProps {
    text: string;
    onPress?: () => void;
    classname?: string;
    disabled?: boolean
    isLoading?: boolean;
}


const CustomButton = ({ text = "Click Me", onPress, classname, disabled=false, isLoading=false }: CustomButtonProps) => {

    const defaultClassName = "bg-primary w-full h-12 flex items-center justify-center rounded-xl my-2";

    const buttonClassName = classname || defaultClassName;

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
