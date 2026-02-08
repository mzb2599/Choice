import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Save } from "lucide-react-native";
import { Styles } from "../styles/appStyles";

export default function BulkUpdate({
  bulkUpdates,
  setBulkUpdates,
  handleBulkUpdate,
  updateStatus,
}) {
  return (
    <View style={Styles.card}>
      <Text style={Styles.title}>Bulk Credit Update</Text>
      <Text style={{ color: "#6c757d", marginBottom: 12 }}>
        Enter updates in the format: CustomerName Amount received/credit
      </Text>

      <View
        style={{
          backgroundColor: "#eef6ff",
          padding: 12,
          borderRadius: 8,
          marginBottom: 12,
        }}
      >
        <Text style={{ fontWeight: "600", color: "#084298" }}>
          Example Format:
        </Text>
        <Text
          style={{ fontFamily: "monospace", color: "#084298", marginTop: 6 }}
        >
          {
            "Customer1 500 received\nCustomer2 400 credit\nCustomer3 1200 received"
          }
        </Text>
        <Text style={{ color: "#6c757d", marginTop: 8, fontSize: 12 }}>
          💡 Tip: Press Ctrl+Enter to quickly save all updates
        </Text>
      </View>

      <TextInput
        value={bulkUpdates}
        onChangeText={(t) => setBulkUpdates(t)}
        style={Styles.textarea}
        multiline
        placeholder={
          "Customer1 500 received\nCustomer2 400 credit\nCustomer3 1200 received"
        }
      />

      <TouchableOpacity
        style={[Styles.button, Styles.buttonSuccess]}
        onPress={handleBulkUpdate}
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
