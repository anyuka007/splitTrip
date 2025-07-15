import { SplashScreen, Stack } from "expo-router";
import "./global.css";
import { useFonts } from "expo-font";
import { use, useEffect } from "react";

export default function RootLayout() {

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

  return <Stack screenOptions={
    {
      headerShown: false,
      contentStyle: {
        backgroundColor: "#fff",
      },
    }
  }/>;
}
