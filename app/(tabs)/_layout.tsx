import useAuthStore from '@/store/auth.store';
import { Redirect, Slot } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const TabsLayout = () => {
    const {isAuthenticated} = useAuthStore(); 
    
    if(!isAuthenticated) return <Redirect href="/sign-in" />;
    return (
        <Slot />
    );
}

const styles = StyleSheet.create({})

export default TabsLayout;
