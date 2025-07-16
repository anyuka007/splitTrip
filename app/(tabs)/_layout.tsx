import TabBarIcon from '@/components/TabBarIcon';
import useAuthStore from '@/store/auth.store';
import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


const TabsLayout = () => {
    const { isAuthenticated } = useAuthStore();

    if (!isAuthenticated) return <Redirect href="/sign-in" />;
    return (
        <Tabs screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    borderTopLeftRadius: 50,
                    borderTopRightRadius: 50,
                    borderBottomLeftRadius: 50,
                    borderBottomRightRadius: 50,
                    marginHorizontal: 20,
                    height: 80,
                    position: 'absolute',
                    bottom: 40,
                    backgroundColor: 'white',
                    shadowColor: '#1a1a1a',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 5,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-around', 
                    alignItems: 'center',
                }
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Trips",
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon
                            //name="suitcase-rolling"
                            //name="umbrella-beach"
                            name="route"
                            title="Trips"
                            focused={focused}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="statistics"
                options={{
                    title: "Statistics",
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon
                            name="chart-bar"
                            title="Statistics"
                            focused={focused}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon
                            name="user"
                            title="Profile"
                            focused={focused}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({})

export default TabsLayout;
