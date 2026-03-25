import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { IndianRupee, Menu } from "lucide-react-native";
import { Styles } from "../styles/appStyles";

const menuItems = [
  { label: "Add Customer", index: 0 },
  { label: "Bulk Update", index: 1 },
  { label: "Customers", index: 2 },
  { label: "Orders", index: 3 },
  { label: "Product Catalog", index: 4 },
  { label: "Product List", index: 5 },
];

export default function Header({
  totalBalance,
  todayBalance,
  activeTab,
  onNavigate,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSelect = (index) => {
    onNavigate?.(index);
    setMenuOpen(false);
  };

  return (
    <>
      <LinearGradient colors={["#667eea", "#764ba2"]} style={Styles.header}>
        <View style={Styles.headerContent}>
          <TouchableOpacity
            style={Styles.menuButton}
            onPress={() => setMenuOpen(true)}
            accessibilityLabel="Open navigation menu"
          >
            <Menu size={24} color="#fff" />
          </TouchableOpacity>

          <View style={Styles.headerTitle}>
            <View>
              <Text style={Styles.headerH1}>Choice Kirana</Text>
              <Text style={Styles.headerSub}>Customer Order Management</Text>
            </View>
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
      </LinearGradient>

      <Modal visible={menuOpen} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setMenuOpen(false)}>
          <View style={Styles.menuOverlay} />
        </TouchableWithoutFeedback>

        <View style={Styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.index}
              style={[
                Styles.menuItem,
                activeTab === item.index ? Styles.menuItemActive : null,
              ]}
              onPress={() => handleSelect(item.index)}
            >
              <Text style={Styles.menuItemText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </>
  );
}
