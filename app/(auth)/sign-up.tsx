import CustomButton from '@/components/CustomButton';
import { router, Slot } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const SignUp = () => {
    return (
        <View>
            <Text>Sign Up</Text>
            <CustomButton
                text="Sign Up"
                onPress={() => router.push("/sign-in")}
            />
        </View>
    );
}

const styles = StyleSheet.create({})

export default SignUp;
