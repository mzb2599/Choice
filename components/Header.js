import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "../styles/appStyles";

export default function Header({ totalBalance, todayBalance }) {
  return (
    <LinearGradient colors={["#1e3c72", "#2a5298"]} style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.headerTitle}>
          <View>
            <Text style={styles.headerH1}>Credit Manager Pro</Text>
            <Text style={styles.headerSub}>Customer Order Management</Text>
          </View>
        </View>

        <View style={styles.balanceCards}>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceValue}>₹{totalBalance.toFixed(2)}</Text>
          </View>

          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Today's Total</Text>
            <Text style={styles.balanceValue}>₹{todayBalance.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
