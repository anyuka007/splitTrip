import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
import { signIn } from '@/lib/appwrite';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

const SignIn = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({email: '', password: ''});

    const submit = async () => {
        const { email, password } = form;
        if(!email || !password) {
            return Alert.alert("Error", "Please fill in all fields"); }
        
        setIsSubmitting(true);
        try {
            await signIn({ email, password });

            router.replace("/");
            
        } catch (error: any) {
            console.error("Sign In Error:", error);
            Alert.alert('Error', error.message);
            
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <View className='gap-10 bg-white rounded-lg p-5 mt-5'>
            <CustomInput placeholder="Enter your email" value={form.email} label="Email" onChangeText={(text) => setForm((prev) => ({...prev, email: text}))} keyboardType='email-address'/>
            <CustomInput placeholder="Enter your password" value={form.password} label="Password" onChangeText={(text) => setForm((prev) => ({...prev, password: text}))} secureTextEntry={true}/>
            <CustomButton text="Sign In" isLoading={isSubmitting} onPress={submit}/>

            <View className='flex justify-center mt-5 flex-row gap-2'>
                <Text className='text-regular text-gray-400'>Do not have an account?</Text>
                <Link href="/sign-up" className='text-secondary text-regular font-bold'>Sign Up</Link>
            </View>
                        
        </View> 
    );
}

const styles = StyleSheet.create({})

export default SignIn;
