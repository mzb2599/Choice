import React from "react";
import { Save } from "lucide-react";
import { styles } from "../styles/webStyles";

export default function BulkUpdateWeb({
  bulkUpdates,
  setBulkUpdates,
  handleBulkUpdate,
}) {
  return (
    <div style={styles.paper}>
      <h2
        style={{
          marginTop: 0,
          marginBottom: "8px",
          fontSize: "20px",
          fontWeight: "700",
          color: "#212529",
        }}
      >
        Bulk Credit Update
      </h2>
      <p style={{ color: "#6c757d", marginBottom: "24px", fontSize: "14px" }}>
        Enter updates in the format: CustomerName Amount received/credit
      </p>

      <div style={styles.infoBox}>
        <p
          style={{
            fontWeight: "600",
            margin: "0 0 12px 0",
            fontSize: "14px",
            color: "#084298",
          }}
        >
          Example Format:
        </p>
        <pre
          style={{
            margin: 0,
            fontFamily: '"SF Mono", Monaco, monospace',
            fontSize: "13px",
            color: "#084298",
            lineHeight: "1.6",
          }}
        >
          Customer1 500 received{"\n"}Customer2 400 credit{"\n"}Customer3 1200
          received
        </pre>
        <p style={{ fontSize: "12px", color: "#6c757d", margin: "12px 0 0 0" }}>
          💡 Tip: Press Ctrl+Enter to quickly save all updates
        </p>
      </div>

      <textarea
        value={bulkUpdates}
        onChange={(e) => setBulkUpdates(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && e.ctrlKey && handleBulkUpdate()}
        style={{ ...styles.textarea, height: "320px", marginBottom: "16px" }}
        placeholder={
          "Customer1 500 received\nCustomer2 400 credit\nCustomer3 1200 received"
        }
      />

      <button
        onClick={handleBulkUpdate}
        style={{ ...styles.button, ...styles.buttonSuccess }}
      >
        <Save size={20} /> Update All Records
      </button>
    </div>
  );
}
