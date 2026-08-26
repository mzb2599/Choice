import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Styles } from "../styles/appStyles";

export default function AddCustomer({
  newCustomer,
  setNewCustomer,
  handleAddCustomer,
  updateStatus,
  customers,
}) {
  const [validationMessage, setValidationMessage] = useState("");

  const isPhoneValid = (p) => /^[0-9]{10}$/.test((p || "").trim());

  const handleSubmit = () => {
    setValidationMessage("");

    if (!newCustomer.name || !newCustomer.name.trim()) {
      setValidationMessage("Please enter a customer name.");
      return;
    }

    if (!isPhoneValid(newCustomer.phone)) {
      setValidationMessage("Please enter a valid 10-digit phone number.");
      return;
    }

    const nameExists =
      Array.isArray(customers) &&
      customers.some(
        (c) =>
          c.name &&
          c.name.trim().toLowerCase() === newCustomer.name.trim().toLowerCase(),
      );

    if (nameExists) {
      setValidationMessage("A customer with this name already exists.");
      return;
    }

    const phoneExists =
      Array.isArray(customers) &&
      customers.some((c) => c.phone === newCustomer.phone);

    if (phoneExists) {
      setValidationMessage("A customer with this phone number already exists.");
      return;
    }

    handleAddCustomer();
  };
  return (
    <View style={Styles.card}>
      {updateStatus && updateStatus !== "error" && (
        <View style={Styles.alert}>
          <Text style={{ color: "#0f5132", fontSize: 18, marginRight: 8 }}>
            +
          </Text>
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

      {validationMessage ? (
        <Text style={{ color: "#dc3545", marginTop: 8 }}>
          {validationMessage}
        </Text>
      ) : null}

      <TouchableOpacity
        style={[Styles.button, Styles.buttonPrimary]}
        onPress={handleSubmit}
        disabled={!newCustomer.name || !newCustomer.phone}
      >
        <Text style={{ color: "#fff", fontSize: 20, marginRight: 8 }}>+</Text>
        <Text style={Styles.buttonText}>Add Customer</Text>
      </TouchableOpacity>
    </View>
  );
}
