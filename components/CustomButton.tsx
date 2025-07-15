import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CustomButtonProps {
    text: string;
    onPress?: () => void;
    classname?: string;
    color?: string;
    height?: number | string;
    width?: number | string;
}


const CustomButton = ({ text = "Click Me", onPress, color = "primary", height = 16, width = "full" }: CustomButtonProps) => {
    return (
        <TouchableOpacity onPress={onPress} className={`bg-${color} h-${height} w-${width} flex items-center justify-center rounded-xl p-2 my-2`}>
            <Text className="text-white text-center">{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({})

export default CustomButton;
