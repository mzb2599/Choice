import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Plus, TrendingUp, Users } from "lucide-react-native";
import { Styles } from "../styles/appStyles";

export default function Tabs({ activeTab, setActiveTab }) {
  return (
    <View style={Styles.tabsContainer}>
      <TouchableOpacity
        style={[Styles.tab, activeTab === 0 ? Styles.tabActive : null]}
        onPress={() => setActiveTab(0)}
      >
        <Plus size={18} color={activeTab === 0 ? "#2a5298" : "#6c757d"} />
        <Text style={Styles.tabText}>Add Customer</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[Styles.tab, activeTab === 1 ? Styles.tabActive : null]}
        onPress={() => setActiveTab(1)}
      >
        <TrendingUp size={18} color={activeTab === 1 ? "#2a5298" : "#6c757d"} />
        <Text style={Styles.tabText}>Bulk Update</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[Styles.tab, activeTab === 2 ? Styles.tabActive : null]}
        onPress={() => setActiveTab(2)}
      >
        <Users size={18} color={activeTab === 2 ? "#2a5298" : "#6c757d"} />
        <Text style={Styles.tabText}>View Balances</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[Styles.tab, activeTab === 3 ? Styles.tabActive : null]}
        onPress={() => setActiveTab(3)} 
      >
        <Text style={Styles.tabText}>Product catalog</Text>
      </TouchableOpacity>
    </View>
  );
}
