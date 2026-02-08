import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Plus } from "lucide-react-native";
import { Styles } from "../styles/appStyles";

export default function AddCustomer({
  newCustomer,
  setNewCustomer,
  handleAddCustomer,
  updateStatus,
}) {
  return (
    <View style={Styles.card}>
      {updateStatus && updateStatus !== "error" && (
        <View style={Styles.alert}>
          <Plus size={18} color="#0f5132" />
          <Text>{updateStatus}</Text>
        </View>
      )}

      <Text style={Styles.title}>Add New Customer</Text>

      <Text style={Styles.label}>Customer Name</Text>
      <TextInput
        style={Styles.input}
        value={newCustomer.name}
        onChangeText={(t) => setNewCustomer({ ...newCustomer, name: t })}
        placeholder="Enter customer name"
      />

      <Text style={Styles.label}>Phone Number</Text>
      <TextInput
        style={Styles.input}
        keyboardType="phone-pad"
        value={newCustomer.phone}
        onChangeText={(t) => setNewCustomer({ ...newCustomer, phone: t })}
        placeholder="Enter phone number"
      />

      <TouchableOpacity
        style={[Styles.button, Styles.buttonPrimary]}
        onPress={handleAddCustomer}
      >
        <Plus size={20} color="#fff" />
        <Text style={Styles.buttonText}>Add Customer</Text>
      </TouchableOpacity>
    </View>
  );
}
