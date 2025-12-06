import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Search,
  Plus,
  TrendingUp,
  TrendingDown,
  Users,
  Save,
} from "lucide-react-native";

import { LinearGradient } from "expo-linear-gradient";

const CustomerCreditApp = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("all");
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "" });
  const [bulkUpdates, setBulkUpdates] = useState("");
  const [updateStatus, setUpdateStatus] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const stored = await AsyncStorage.getItem("customers");
    if (stored) setCustomers(JSON.parse(stored));
  };

  const saveCustomers = async (updated) => {
    setCustomers(updated);
    await AsyncStorage.setItem("customers", JSON.stringify(updated));
  };

  const handleAddCustomer = () => {
    if (newCustomer.name && newCustomer.phone) {
      const customer = {
        id: Date.now(),
        name: newCustomer.name,
        phone: newCustomer.phone,
        balance: 0,
        transactions: [],
      };
      saveCustomers([...customers, customer]);
      setNewCustomer({ name: "", phone: "" });
      setUpdateStatus("Customer added successfully!");
      setTimeout(() => setUpdateStatus(""), 3000);
    }
  };

  const handleBulkUpdate = () => {
    const lines = bulkUpdates.trim().split("\n");
    const updates = [];

    lines.forEach((line) => {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 3) {
        const name = parts.slice(0, -2).join(" ");
        const amount = parseFloat(parts[parts.length - 2]);
        const type = parts[parts.length - 1].toLowerCase();

        if (!isNaN(amount) && (type === "received" || type === "credit")) {
          updates.push({ name, amount, type });
        }
      }
    });

    if (updates.length === 0) {
      setUpdateStatus("error");
      setTimeout(() => setUpdateStatus(""), 4000);
      return;
    }

    const updatedCustomers = customers.map((customer) => {
      const update = updates.find(
        (u) =>
          customer.name.toLowerCase().includes(u.name.toLowerCase()) ||
          u.name.toLowerCase().includes(customer.name.toLowerCase())
      );

      if (update) {
        const transaction = {
          date: new Date().toISOString(),
          amount: update.amount,
          type: update.type,
          balance:
            customer.balance +
            (update.type === "received" ? update.amount : -update.amount),
        };

        return {
          ...customer,
          balance: transaction.balance,
          transactions: [...customer.transactions, transaction],
        };
      }
      return customer;
    });

    saveCustomers(updatedCustomers);
    setBulkUpdates("");
    setUpdateStatus(`Successfully updated ${updates.length} customer(s)!`);
    setTimeout(() => setUpdateStatus(""), 3000);
  };

  const getTodayTransactions = () => {
    const today = new Date().toDateString();
    return customers.map((customer) => {
      const todayTrans = customer.transactions.filter(
        (t) => new Date(t.date).toDateString() === today
      );
      const todayTotal = todayTrans.reduce(
        (sum, t) => sum + (t.type === "received" ? t.amount : -t.amount),
        0
      );
      return { ...customer, todayTotal };
    });
  };

  const filteredCustomers = () => {
    let filtered = customers;

    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.phone.includes(searchTerm)
      );
    }

    if (filterDate === "today") {
      return getTodayTransactions().filter((c) => c.todayTotal !== 0);
    }

    return filtered;
  };

  const totalBalance = customers.reduce((sum, c) => sum + c.balance, 0);
  const todayBalance = getTodayTransactions().reduce(
    (sum, c) => sum + c.todayTotal,
    0
  );

  // ---------------- Render Header + Balance Cards ----------------
  const renderHeader = () => (
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

  // ---------------- Render Tabs ----------------
  const renderTabs = () => (
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

  // ---------------- Render Status ----------------
  const renderStatus = () =>
    updateStatus && updateStatus !== "error" ? (
      <View style={styles.alert}>
        <Save size={20} />
        <Text style={{ fontWeight: "600" }}>{updateStatus}</Text>
      </View>
    ) : null;

  // ---------------- Render Tab 0 & 1 ----------------
  const renderTabContent = () => {
    if (activeTab === 0) {
      return (
        <View style={styles.card}>
          <Text style={styles.title}>Add New Customer</Text>

          <Text style={styles.label}>Customer Name</Text>
          <TextInput
            style={styles.input}
            value={newCustomer.name}
            onChangeText={(t) => setNewCustomer({ ...newCustomer, name: t })}
            placeholder="Enter customer name"
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            keyboardType="phone-pad"
            value={newCustomer.phone}
            onChangeText={(t) => setNewCustomer({ ...newCustomer, phone: t })}
            placeholder="Enter phone number"
          />

          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={handleAddCustomer}
          >
            <Plus size={20} color="#fff" />
            <Text style={styles.buttonText}>Add Customer</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (activeTab === 1) {
      return (
        <View style={styles.card}>
          <Text style={styles.title}>Bulk Credit Update</Text>
          <TextInput
            style={styles.textarea}
            placeholder="Customer1 500 received"
            value={bulkUpdates}
            multiline
            onChangeText={setBulkUpdates}
          />

          <TouchableOpacity
            style={[styles.button, styles.buttonSuccess]}
            onPress={handleBulkUpdate}
          >
            <Save size={20} color="#fff" />
            <Text style={styles.buttonText}>Update All Records</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null; // Tab 2 handled separately
  };

  // ---------------- Render Tab 2 FlatList ----------------
  const renderCustomerList = () => {
    const data = filteredCustomers();

    const ListHeader = () => (
      <>
        {/* Search + Filter */}
        <View style={[styles.paper, { marginBottom: 20 }]}>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <View style={{ position: "relative", justifyContent: "center" }}>
                <Search
                  size={20}
                  color="#999"
                  style={{ position: "absolute", left: 12, top: 14, zIndex: 10 }}
                />
                <TextInput
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                  placeholder="Search by name or phone..."
                  style={[styles.input, { paddingLeft: 44 }]}
                />
              </View>
            </View>

            <View style={{ width: 150 }}>
              <View style={{ borderWidth: 2, borderColor: "#e0e0e0", borderRadius: 8 }}>
                <Picker
                  selectedValue={filterDate}
                  onValueChange={setFilterDate}
                  style={{ height: 48 }}
                >
                  <Picker.Item label="All Time" value="all" />
                  <Picker.Item label="Today Only" value="today" />
                </Picker>
              </View>
            </View>
          </View>
        </View>

        {/* Table Header */}
        <View
          style={{
            flexDirection: "row",
            paddingVertical: 14,
            paddingHorizontal: 16,
            backgroundColor: "#f5f5f5",
            borderBottomWidth: 2,
            borderColor: "#e0e0e0",
          }}
        >
          <Text style={{ flex: 2, fontWeight: "600" }}>Customer</Text>
          <Text style={{ flex: 2, fontWeight: "600" }}>Phone</Text>
          <Text style={{ flex: 1, fontWeight: "600", textAlign: "right" }}>Total</Text>
          {filterDate === "today" && (
            <Text style={{ flex: 1, fontWeight: "600", textAlign: "right" }}>Today</Text>
          )}
          <Text style={{ width: 80, fontWeight: "600", textAlign: "center" }}>Status</Text>
        </View>
      </>
    );

    return (
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={ListHeader}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              paddingVertical: 14,
              paddingHorizontal: 16,
              borderBottomWidth: 1,
              borderColor: "#eee",
              backgroundColor: "white",
            }}
          >
            <Text style={{ flex: 2, fontWeight: "500" }}>{item.name}</Text>
            <Text style={{ flex: 2, color: "#555" }}>{item.phone}</Text>
            <Text
              style={{
                flex: 1,
                textAlign: "right",
                fontWeight: "bold",
                color: item.balance >= 0 ? "#155724" : "#721c24",
              }}
            >
              ₹{Math.abs(item.balance).toFixed(2)}
            </Text>
            {filterDate === "today" && (
              <Text
                style={{
                  flex: 1,
                  textAlign: "right",
                  fontWeight: "bold",
                  color: item.todayTotal >= 0 ? "#155724" : "#721c24",
                }}
              >
                ₹{Math.abs(item.todayTotal).toFixed(2)}
              </Text>
            )}
            <View style={{ width: 80, alignItems: "center" }}>
              {item.balance >= 0 ? (
                <View
                  style={{
                    backgroundColor: "#d4edda",
                    paddingVertical: 4,
                    paddingHorizontal: 10,
                    borderRadius: 16,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <TrendingUp size={14} color="#155724" />
                  <Text style={{ color: "#155724", fontSize: 12 }}>Recv</Text>
                </View>
              ) : (
                <View
                  style={{
                    backgroundColor: "#f8d7da",
                    paddingVertical: 4,
                    paddingHorizontal: 10,
                    borderRadius: 16,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <TrendingDown size={14} color="#721c24" />
                  <Text style={{ color: "#721c24", fontSize: 12 }}>Credit</Text>
                </View>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingVertical: 60, paddingHorizontal: 20 }}>
            <Users size={48} color="#999" />
            <Text style={{ fontSize: 18, color: "#999", marginTop: 12 }}>No customers found</Text>
          </View>
        }
      />
    );
  };

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={{ flex: 1, paddingTop: 40 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        {renderHeader()}
        {renderTabs()}
        {renderStatus()}

        {activeTab === 2 ? (
          renderCustomerList()
        ) : (
          <FlatList
            data={[]}
            ListHeaderComponent={renderTabContent()}
            keyExtractor={() => "tab-content"}
          />
        )}
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

// ---------------- STYLES ------------------
const styles = StyleSheet.create({
  scroll: { padding: 16 },
  header: { padding: 24 },
  headerContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" },
  headerTitle: { flexDirection: "row", alignItems: "center", gap: 12 },
  headerH1: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  headerSub: { color: "#fff", fontSize: 14, opacity: 0.8 },
  balanceCards: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  balanceCard: { backgroundColor: "rgba(255,255,255,0.2)", padding: 6, borderRadius: 8 },
  balanceLabel: { color: "#fff", fontSize: 12 },
  balanceValue: { color: "#fff", fontSize: 20, fontWeight: "bold", minWidth: 150, flexGrow: 1 },
  tabsContainer: { flexDirection: "row", backgroundColor: "#fff", marginTop: 10, borderRadius: 8, overflow: "hidden" },
  tab: { flex: 1, padding: 14, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 6, borderBottomWidth: 2, borderColor: "transparent" },
  tabActive: { backgroundColor: "#eef3ff", borderBottomColor: "#2a5298" },
  tabText: { fontSize: 14, marginLeft: 4 },
  alert: { padding: 16, backgroundColor: "#d4edda", borderRadius: 8, flexDirection: "row", gap: 8, alignItems: "center", marginVertical: 10 },
  card: { backgroundColor: "#fff", padding: 20, borderRadius: 10, marginVertical: 10 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  label: { fontWeight: "600", marginBottom: 6 },
  input: { borderWidth: 2, borderColor: "#e0e0e0", padding: 12, borderRadius: 8, marginBottom: 16 },
  textarea: { borderWidth: 2, borderColor: "#e0e0e0", padding: 12, borderRadius: 8, height: 200, marginBottom: 16 },
  button: { padding: 14, borderRadius: 8, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 },
  buttonPrimary: { backgroundColor: "#667eea" },
  buttonSuccess: { backgroundColor: "#38ef7d" },
  buttonText: { color: "#fff", fontWeight: "600" },
  paper: { backgroundColor: "#fff", padding: 16, borderRadius: 8 },
});

export default CustomerCreditApp;
