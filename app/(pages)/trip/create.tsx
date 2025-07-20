import { Link } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
import { StyleSheet, View } from 'react-native';

const CreateTrip = () => {
    return (
        <View className="flex h-full items-center justify-center">
            <Text className="h1 text-center ">
                Create Trip
            </Text>
            <Link href="/" >
                <Text className="text-center text-primary">Home</Text>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({})

export default CreateTrip;
