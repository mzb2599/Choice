// App.js
import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import CustomerCreditApp from "./screens/CustomerCreditApp";

export default function App() {
  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar style="light" />
        <CustomerCreditApp />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
