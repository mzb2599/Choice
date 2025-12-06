import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Plus } from "lucide-react-native";
import { styles } from "../styles/appStyles";

export default function AddCustomer({ newCustomer, setNewCustomer, handleAddCustomer }) {
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
