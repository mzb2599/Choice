import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { IndianRupee } from "lucide-react-native";
import { Styles } from "../styles/appStyles";

export default function Header({ totalBalance, todayBalance }) {
  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={Styles.header}>
      <View style={Styles.headerContent}>
        <View style={Styles.headerTitle}>
          <View style={Styles.headerIcon}>
            <IndianRupee size={28} color="#fff" />
          </View>

          <View>
            <Text style={Styles.headerH1}>Choice Kirana</Text>
            <Text style={Styles.headerSub}>Customer Order Management</Text>
          </View>
        </View>

        <View style={Styles.balanceCards}>
          <View style={Styles.balanceCard}>
            <Text style={Styles.balanceLabel}>Total Balance</Text>
            <Text style={Styles.balanceValue}>₹{totalBalance.toFixed(2)}</Text>
          </View>

          <View style={Styles.balanceCard}>
            <Text style={Styles.balanceLabel}>Today's Total</Text>
            <Text style={Styles.balanceValue}>₹{todayBalance.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
