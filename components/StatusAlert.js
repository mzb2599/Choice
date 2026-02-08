import React from "react";
import { View, Text } from "react-native";
import { Save } from "lucide-react-native";
import { Styles } from "../styles/appStyles";

export default function StatusAlert({ updateStatus }) {
  if (!updateStatus || updateStatus === "error") return null;
  return (
    <View style={Styles.alert}>
      <Save size={18} color="#0f5132" />
      <Text>{updateStatus}</Text>
    </View>
  );
}
