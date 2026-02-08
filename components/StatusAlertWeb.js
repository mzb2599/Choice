import React from "react";
import { Save } from "lucide-react";
import { styles } from "../styles/webStyles";

export default function StatusAlertWeb({ updateStatus }) {
  if (!updateStatus || updateStatus === "error") return null;
  return (
    <div style={styles.alert}>
      <Save size={20} />
      <span>{updateStatus}</span>
    </div>
  );
}
