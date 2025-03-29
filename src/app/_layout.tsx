import { View, StatusBar, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Redirect, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { Slot } from "expo-router";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import * as Device from "expo-device";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const RootNavigation = () => {
  const [appReady, setAppReady] = useState(false);
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  async function registerForPushNotificationsAsync() {
    try {
      let token;
      if (!Device.isDevice) {
        alert("Must use a physical device for push notifications");
        return;
      }
  
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
  
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
  
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
  
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("Expo Push Token:", token);
          // Send token to your API
          // Extract only the actual token part
    // const extractedToken = token.replace("ExponentPushToken[", "").replace("]", "");
    // console.log("Extracted Token:", extractedToken);
       await saveTokenToDatabase(token);
    } catch (error) {
      console.error("Error getting push token:", error);
    }
  }

  // Function to send the token to your API
async function saveTokenToDatabase(token: string) {
  try {
    const response = await fetch("https://app.bigwigmedia.in/TockenApi.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tocken_number: token }),
    });

    const data = await response.json();
    console.log("Token saved response:", data);
  } catch (error) {
    console.error("Error saving token to database:", error);
  }
}
  
  useEffect(() => {
    registerForPushNotificationsAsync()
  }, []);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const token = await AsyncStorage.getItem("email");
        setHasToken(!!token);
      } catch (error) {
        console.error("Error reading token from AsyncStorage:", error);
        setHasToken(false);
      } finally {
        // Increase splash screen duration (e.g., 2 seconds)
        setTimeout(async () => {
          setAppReady(true);
          await SplashScreen.hideAsync();
        }, 2000);
      }
    };

    initializeApp();
  }, []);

  if (!appReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Provider store={store}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />
      <Stack screenOptions={{ headerShown: false }}>
        <Slot />
      </Stack>
      {hasToken !== null && <AuthRedirect hasToken={hasToken} />}
    </Provider>
  );
};

const AuthRedirect = ({ hasToken }: { hasToken: boolean }) => {
  return hasToken ? <Redirect href="/(main)" /> : <Redirect href="/(auth)" />;
};

export default RootNavigation;
