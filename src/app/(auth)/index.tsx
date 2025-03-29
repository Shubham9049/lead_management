import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
const { width, height } = Dimensions.get("window");

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

const index = () => {
  useWarmUpBrowser();

  return (
    <View style={styles.container}>
      {/* Top Image */}
      <Image
        source={require("../../assets/images/house.png")} // Replace with actual image
        style={styles.backgroundImage}
      />

      {/* Content Section */}
      <View style={styles.contentContainer}>
        <Text style={styles.HeadTitle}>UNIFY</Text>
        <Text style={styles.title}>Perfect choice for your future</Text>
        <Text style={styles.subtitle}>
          Our properties are the masterpiece for every client with lasting value.
        </Text>

        {/* Continue Button */}
        <TouchableOpacity
          onPress={() => router.replace("/(auth)/loginScreen")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        {/* Floating Icon Button */}
        {/* <TouchableOpacity style={styles.floatingButton}>
          <Text style={styles.floatingButtonText}>G</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  backgroundImage: {
    width: "100%",
    height: height*0.72,
    // resizeMode: "cover",
  },
  contentContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    alignItems: "center",
    elevation: 5, // Shadow effect
    gap:10
  },
  HeadTitle:{
    fontSize: 25,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#D17A47",
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    width: width * 0.75,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#567A5D",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  floatingButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default index;
