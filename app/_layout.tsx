import { SplashScreen, Stack } from "expo-router";
import "./global.css";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import useAuthStore from "@/store/auth.store";

export default function RootLayout() {
  const { isLoading, fetchAuthenticatedUser } = useAuthStore();

  const [fontsLoaded, error] = useFonts({
    "Quicksand-Bold": require("../assets/fonts/Quicksand-Bold.ttf"),
    "Quicksand-Regular": require("../assets/fonts/Quicksand-Regular.ttf"),
    "Quicksand-Medium": require("../assets/fonts/Quicksand-Medium.ttf"),
    "Quicksand-SemiBold": require("../assets/fonts/Quicksand-SemiBold.ttf"),
    "Quicksand-Light": require("../assets/fonts/Quicksand-Light.ttf"),
  });

  useEffect(() => {
    if (error) {
      console.error("Error loading fonts:", error);
      throw error;
    }
    if (fontsLoaded) SplashScreen.hideAsync()
  }, [fontsLoaded, error]);

  useEffect(() => {
    fetchAuthenticatedUser();
  }, []);

  if (!fontsLoaded || isLoading) {
    return null;
  }

  return <Stack screenOptions={
    {
      contentStyle: {
        backgroundColor: "#fff",
      },
    }
  }>
    <Stack.Screen name="(tabs)" options={{
      headerShown: false,
    }} />
    <Stack.Screen name="(auth)" options={{
      headerShown: false,
    }} />
    <Stack.Screen name="participant/[id]" options={{title: "Participant Details"}} />
    <Stack.Screen name="trip/[id]" options={{title: "Trip Details"}} />
    <Stack.Screen name="trip/create" options={{title: "Create Trip"}} />
  </Stack>;
}
