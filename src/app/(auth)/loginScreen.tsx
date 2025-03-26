import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  ScrollView,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons"; // Using Expo vector icons
import { router } from "expo-router";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const loginScreen = () => {
  const [empid, setEmpid] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if token exists
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        router.push("/(main)");
      } else {
        router.push("/(auth)/loginScreen");
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://app.bigwigmedia.in/LoginApi.php",
        { empid, password }
      );

      const data = response.data;

      if (data.userInfo && data.userInfo.status === 1) {
        // Store the token in Async Storage
        await AsyncStorage.setItem("username", data.userInfo.name);
        await AsyncStorage.setItem("email", data.userInfo.email);
        // Navigate to the main screen
        router.push("/(main)");
      } else {
        alert(data.error || "Login failed"); // Show error message from API
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <LinearGradient colors={["#FFFFFF", "#FFFFFF"]} style={styles.container}>
            {/* Top Section with Logo */}
            <View style={styles.topContainer}>
              <Image
                source={require("../../assets/images/logo.png")}
                style={styles.topImage}
              />
            </View>

            {/* Login Form */}
            <View style={styles.content}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Login to your account</Text>

              {/* Email Field */}
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#333" />
                <TextInput
                  placeholder="Email"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={empid}
                  onChangeText={setEmpid}
                  placeholderTextColor="#888"
                />
              </View>

              {/* Password Field */}
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#333" />
                <TextInput
                  placeholder="Password"
                  style={styles.input}
                  secureTextEntry={!passwordVisible}
                  value={password}
                  onChangeText={setPassword}
                  placeholderTextColor="#888"
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                  <Ionicons name={passwordVisible ? "eye-off-outline" : "eye-outline"} size={20} color="#333" />
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>LOGIN</Text>
                )}
              </TouchableOpacity>

              
            </View>
          </LinearGradient>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  topContainer: {
    width: "100%",
    height: height * 0.30,
    backgroundColor: "#FFFFFF",
    // borderBottomLeftRadius: 80,
    // borderBottomRightRadius: 80,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 60,
  },
  topImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    marginTop: 75
  },
  content: {
    width: width * 0.85,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#F0F0F0",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: "#333",
  },
  loginButton: {
    backgroundColor: "#D17A47",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    width: width * 0.85,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  footerLinks: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.85,
    marginTop: 15,
  },
  footerText: {
    color: "#666",
    fontSize: 14,
  },

});

export default loginScreen;
