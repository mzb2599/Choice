import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Plus, TrendingUp, Users } from "lucide-react-native";
import { styles } from "../styles/appStyles";

export default function Tabs({ activeTab, setActiveTab }) {
  return (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        onPress={() => setActiveTab(0)}
        style={[styles.tab, activeTab === 0 && styles.tabActive]}
      >
        <Plus size={16} />
        <Text style={styles.tabText}>Add Customer</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setActiveTab(1)}
        style={[styles.tab, activeTab === 1 && styles.tabActive]}
      >
        <TrendingUp size={16} />
        <Text style={styles.tabText}>Bulk Update</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setActiveTab(2)}
        style={[styles.tab, activeTab === 2 && styles.tabActive]}
      >
        <Users size={16} />
        <Text style={styles.tabText}>View Balances</Text>
      </TouchableOpacity>
    </View>
  );
}
