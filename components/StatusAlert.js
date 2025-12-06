import React from "react";
import { View, Text } from "react-native";
import { Save } from "lucide-react-native";
import { styles } from "../styles/appStyles";

export default function StatusAlert({ updateStatus }) {
  if (!updateStatus || updateStatus === "error") return null;

  return (
    <View style={styles.alert}>
      <Save size={20} />
      <Text style={{ fontWeight: "600" }}>{updateStatus}</Text>
    </View>
  );
}
