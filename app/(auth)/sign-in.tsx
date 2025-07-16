import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
import { Link, router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const SignIn = () => {
    return (
        <View className='gap-10 bg-white rounded-lg p-5 mt-5'>
            <CustomInput placeholder="Enter your email" value="" label="Email" onChangeText={(text) => {}} keyboardType='email-address'/>
            <CustomInput placeholder="Enter your password" value="" label="Password" onChangeText={(text) => {}} secureTextEntry={true}/>
            <CustomButton text="Sign In" />

            <View className='flex justify-center mt-5 flex-row gap-2'>
                <Text className='text-regular text-gray-300'>Do not have an account?</Text>
                <Link href="/sign-up" className='text-secondary text-regular font-bold'>Sign Up</Link>
            </View>
                        
        </View> 
    );
}

const styles = StyleSheet.create({})

export default SignIn;
