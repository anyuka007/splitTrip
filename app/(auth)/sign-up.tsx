import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
import { createUser } from '@/lib/appwrite';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

const SignUp = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({ name: "", email: '', password: '' });

    const submit = async () => {
        const { name, email, password } = form;
        if (!name || !email || !password) {
            return Alert.alert("Error", "Please fill in all fields");
        }

        setIsSubmitting(true);

        try {
            await createUser({ email, password, name });

            //Alert.alert("Success", "You have successfully signed up!");
            //console.log("Sign Up Success:", form);
            router.replace("/");

        } catch (error: any) {
            console.error("Sign Up Error:", error);
            Alert.alert('Error', error.message);

        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <View className='gap-10 bg-white rounded-lg p-5 mt-5'>
            <CustomInput
                placeholder="Enter your full name"
                value={form.name} label="Full Name"
                onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))} />
            <CustomInput
                placeholder="Enter your email"
                value={form.email} label="Email"
                onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
                keyboardType='email-address' />
            <CustomInput
                placeholder="Enter your password"
                value={form.password} label="Password"
                onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
                secureTextEntry={true} />

            <CustomButton text="Sign Up" isLoading={isSubmitting} onPress={submit} />

            <View className='flex justify-center mt-5 flex-row gap-2'>
                <Text className='text-regular text-gray-400'>Already have an account?</Text>
                <Link href="/sign-in" className='text-secondary text-regular font-bold'>Sign In</Link>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({})

export default SignUp;
