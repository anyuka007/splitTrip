import { Redirect, Slot } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const TabsLayout = () => {
    const isAuthenticated = false; 
    
    if(!isAuthenticated) return <Redirect href="/sign-in" />;
    return (
        <Slot />
    );
}

const styles = StyleSheet.create({})

export default TabsLayout;
