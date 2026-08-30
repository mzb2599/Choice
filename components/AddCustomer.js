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
  const children = [];

  if (updateStatus && updateStatus !== "error") {
    children.push(
      <View style={Styles.alert} key="alert">
        <Text style={{ color: "#0f5132", fontSize: 18, marginRight: 8 }}>
          +
        </Text>
        <Text>{String(updateStatus)}</Text>
      </View>,
    );
  }

  children.push(
    <Text style={Styles.title} key="title">
      Add New Customer
    </Text>,
  );

  children.push(
    <Text style={Styles.label} key="label-name">
      Customer Name
    </Text>,
  );

  children.push(
    <TextInput
      key="input-name"
      style={Styles.input}
      value={newCustomer.name}
      onChangeText={(t) => setNewCustomer({ ...newCustomer, name: t })}
      placeholder="Enter customer name"
    />,
  );

  children.push(
    <Text style={Styles.label} key="label-phone">
      Phone Number
    </Text>,
  );

  children.push(
    <TextInput
      key="input-phone"
      style={Styles.input}
      keyboardType="phone-pad"
      value={newCustomer.phone}
      onChangeText={(t) => setNewCustomer({ ...newCustomer, phone: t })}
      placeholder="Enter phone number"
    />,
  );

  if (validationMessage) {
    children.push(
      <Text style={{ color: "#dc3545", marginTop: 8 }} key="validation">
        {validationMessage}
      </Text>,
    );
  }

  children.push(
    <TouchableOpacity
      key="submit"
      style={[Styles.button, Styles.buttonPrimary]}
      onPress={handleSubmit}
      disabled={!newCustomer.name || !newCustomer.phone}
    >
      <Text style={{ color: "#fff", fontSize: 20, marginRight: 8 }}>+</Text>
      <Text style={Styles.buttonText}>Add Customer</Text>
    </TouchableOpacity>,
  );

  return <View style={Styles.card}>{children}</View>;
}
