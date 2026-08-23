import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Plus, Save, Trash2 } from "lucide-react-native";
import { Styles } from "../styles/appStyles";

export default function BulkUpdate({
  customers,
  bulkEntries,
  setBulkEntries,
  bulkDraft,
  setBulkDraft,
  handleAddBulkEntry,
  handleBulkUpdate,
  updateStatus,
}) {
  const [customerSearch, setCustomerSearch] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(customerSearch.trim().toLowerCase());
    }, 300);

    return () => clearTimeout(timer);
  }, [customerSearch]);

  const filteredCustomers = useMemo(() => {
    const query = debouncedQuery;
    if (!query) return customers.slice(0, 10);

    return customers
      .filter((customer) => customer.name.toLowerCase().includes(query))
      .slice(0, 20);
  }, [debouncedQuery, customers]);

  const handleSelectCustomer = (customerName) => {
    setBulkDraft((prev) => ({ ...prev, customerName }));
    setCustomerSearch(customerName);
  };

  return (
    <View style={Styles.card}>
      <Text style={Styles.title}>Bulk Credit Update</Text>
      <Text style={{ color: "#6c757d", marginBottom: 12 }}>
        Pick a customer, enter an amount, choose the transaction type, and add
        it to the queue.
      </Text>
      <Text style={Styles.label}>Customer</Text>
      <View style={{ marginBottom: 8 }}>
        <TextInput
          value={customerSearch}
          onChangeText={(value) => {
            setCustomerSearch(value);
            if (!value) {
              setBulkDraft((prev) => ({ ...prev, customerName: "" }));
            }
          }}
          style={Styles.input}
          placeholder="Search customer name"
        />
        {filteredCustomers.length > 0 && (
          <View style={Styles.suggestionBox}>
            {filteredCustomers.map((customer) => (
              <TouchableOpacity
                key={customer.id}
                style={Styles.suggestionItem}
                onPress={() => handleSelectCustomer(customer.name)}
              >
                <Text style={Styles.suggestionText}>{customer.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <Text style={Styles.label}>Amount</Text>
      <TextInput
        value={bulkDraft.amount}
        onChangeText={(value) =>
          setBulkDraft((prev) => ({
            ...prev,
            amount: value.replace(/[^0-9.]/g, ""),
          }))
        }
        style={Styles.input}
        keyboardType="decimal-pad"
        placeholder="Enter amount"
      />
      <Text style={Styles.label}>Transaction Type</Text>
      <View style={{ flexDirection: "row", marginBottom: 16 }}>
        {[
          { value: "received", label: "Received" },
          { value: "credit", label: "Credit" },
        ].map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() =>
              setBulkDraft((prev) => ({ ...prev, type: option.value }))
            }
            style={[
              Styles.pill,
              bulkDraft.type === option.value && Styles.pillActive,
            ]}
          >
            <Text
              style={[
                Styles.pillText,
                bulkDraft.type === option.value && Styles.pillTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={[Styles.button, Styles.buttonPrimary]}
        onPress={handleAddBulkEntry}
      >
        <Plus size={18} color="#fff" />
        <Text style={[Styles.buttonText, { marginLeft: 8 }]}>Add to Queue</Text>
      </TouchableOpacity>
      {customerSearch && bulkEntries.length > 0 && bulkEntries.length < 5 && (
        <View style={{ marginTop: 16 }}>
          <Text style={Styles.label}>Queued Updates</Text>
          {bulkEntries.map((entry, index) => (
            <View
              key={`${entry.customerName}-${index}`}
              style={Styles.entryItem}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "600" }}>{entry.customerName}</Text>
                <Text style={{ color: "#6c757d", fontSize: 12 }}>
                  {entry.amount} • {entry.type}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  setBulkEntries((prev) => prev.filter((_, i) => i !== index))
                }
              >
                <Trash2 size={18} color="#dc3545" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      <TouchableOpacity
        style={[Styles.button, Styles.buttonSuccess, { marginTop: 16 }]}
        onPress={handleBulkUpdate}
        disabled={bulkEntries.length === 0}
      >
        <Save size={20} color="#fff" />
        <Text style={Styles.buttonText}>Update All Records</Text>
      </TouchableOpacity>
      {updateStatus && updateStatus !== "error" && (
        <View style={{ marginTop: 12 }}>
          <Text style={{ color: "#0f5132" }}>{updateStatus}</Text>
        </View>
      )}
    </View>
  );
}
