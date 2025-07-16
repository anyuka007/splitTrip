import CustomButton from '@/components/CustomButton';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const SignIn = () => {
    return (
        <View>
            <Text>Sign In</Text>
            <CustomButton
                text="Sign In"
                onPress={() => router.push("/sign-up")}
            />
        </View>
    );
}

const styles = StyleSheet.create({})

export default SignIn;
