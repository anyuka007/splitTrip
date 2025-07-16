import React from 'react';
import { StyleSheet, View } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import cn from "clsx"
import { TabBarIconProps } from '@/type';
import { Text } from 'react-native';


const TabBarIcon = ({ name, title, focused, size = 24 }: TabBarIconProps) => (
    <View className="flex min-w-20 items-center justify-center min-h-full gap-1">
        <FontAwesome5
            name={name}
            size={size}
            color={focused ? "#f6c445" : "#9AC1F0"}
        />
        <Text className={cn('text-small font-semibold', focused ? 'text-[#f6c445]':'text-[#9AC1F0]')}>
            {title}
        </Text>
    </View>
);

const styles = StyleSheet.create({})

export default TabBarIcon;
