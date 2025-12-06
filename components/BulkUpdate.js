import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Save } from "lucide-react-native";
import { styles } from "../styles/appStyles";

export default function BulkUpdate({ bulkUpdates, setBulkUpdates, handleBulkUpdate }) {
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
