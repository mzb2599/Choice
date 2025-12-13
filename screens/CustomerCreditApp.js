import React, { useState, useEffect } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import Header from "../components/Header";
import Tabs from "../components/Tabs";
import TabAddCustomer from "../components/AddCustomer";
import TabBulkUpdate from "../components/BulkUpdate";
import CustomerList from "../components/CustomerList";

import { loadCustomers, saveCustomersToStorage } from "../utils/storage";

const CustomerCreditApp = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("all");

  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "" });
  const [bulkUpdates, setBulkUpdates] = useState("");
  const [updateStatus, setUpdateStatus] = useState("");

  useEffect(() => {
    (async () => {
      const stored = await loadCustomers();

      if (stored) setCustomers(stored);
    })();
  }, []);

  const saveCustomers = async (updated) => {
    setCustomers(updated);
    await saveCustomersToStorage(updated);
  };

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone) return;

    const newEntry = {
      id: Date.now(),
      name: newCustomer.name,
      phone: newCustomer.phone,
      balance: 0,
      transactions: [],
    };

    saveCustomers([...customers, newEntry]);
    setNewCustomer({ name: "", phone: "" });
    setUpdateStatus("Customer added successfully!");

    setTimeout(() => setUpdateStatus(""), 2500);
  };

  const parseBulkUpdate = () => {
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

    return updates;
  };

  const handleBulkUpdate = () => {
    const updates = parseBulkUpdate();

    if (updates.length === 0) {
      setUpdateStatus("error");
      setTimeout(() => setUpdateStatus(""), 3000);
      return;
    }

    const updatedCustomers = customers.map((customer) => {
      const update = updates.find((u) =>
        customer.name.toLowerCase().includes(u.name.toLowerCase())
      );

      if (update) {
        const newBal =
          customer.balance +
          (update.type === "received" ? update.amount : -update.amount);

        const transaction = {
          date: new Date().toISOString(),
          amount: update.amount,
          type: update.type,
          balance: newBal,
        };

        return {
          ...customer,
          balance: newBal,
          transactions: [...customer.transactions, transaction],
        };
      }

      return customer;
    });

    saveCustomers(updatedCustomers);
    setBulkUpdates("");
    setUpdateStatus(`Updated ${updates.length} customer(s)!`);
    setTimeout(() => setUpdateStatus(""), 2500);
  };

  const getTodaySummary = () => {
    const today = new Date().toDateString();

    return customers.map((customer) => {
      const todayTrans = customer.transactions.filter(
        (t) => new Date(t.date).toDateString() === today
      );

      const total = todayTrans.reduce(
        (sum, t) => sum + (t.type === "received" ? t.amount : -t.amount),
        0
      );

      return { ...customer, todayTotal: total };
    });
  };

  const filteredCustomers = () => {
    let data = customers;    
    if (searchTerm)
      data = data.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.phone.includes(searchTerm)
      );

    if (filterDate === "today") {
      return getTodaySummary().filter((c) => c.todayTotal !== 0);
    }

    return data;
  };

  const totalBalance = customers.reduce((sum, c) => sum + c.balance, 0);
  const todayBalance = getTodaySummary().reduce(
    (sum, c) => sum + c.todayTotal,
    0
  );

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 0 && (
          <TabAddCustomer
            newCustomer={newCustomer}
            setNewCustomer={setNewCustomer}
            handleAddCustomer={handleAddCustomer}
            updateStatus={updateStatus}
          />
        )}

        {activeTab === 1 && (
          <TabBulkUpdate
            bulkUpdates={bulkUpdates}
            setBulkUpdates={setBulkUpdates}
            handleBulkUpdate={handleBulkUpdate}
            updateStatus={updateStatus}
          />
        )}

        {activeTab === 2 && (
          <CustomerList
            data={filteredCustomers().length>0 ? filteredCustomers() : customers}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterDate={filterDate}
            setFilterDate={setFilterDate}
          />
        )}
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default CustomerCreditApp;
