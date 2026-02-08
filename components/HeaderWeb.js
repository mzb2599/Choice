import React from "react";
import { DollarSign } from "lucide-react";
import { styles } from "../styles/webStyles";

export default function HeaderWeb({ totalBalance, todayBalance }) {
  return (
    <div style={styles.header}>
      <div style={styles.headerContent}>
        <div style={styles.headerTitle}>
          <div style={styles.iconBox}>
            <DollarSign size={28} color="white" />
          </div>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "22px",
                fontWeight: "700",
                color: "#212529",
              }}
            >
              Credit Manager Pro
            </h1>
            <p
              style={{
                margin: "4px 0 0 0",
                color: "#6c757d",
                fontSize: "14px",
                fontWeight: "400",
              }}
            >
              Professional Customer Order Management
            </p>
          </div>
        </div>

        <div style={styles.balanceCards}>
          <div style={styles.balanceCard}>
            <div style={styles.balanceLabel}>Total Balance</div>
            <div style={styles.balanceAmount}>₹{totalBalance.toFixed(2)}</div>
          </div>
          <div style={styles.balanceCard}>
            <div style={styles.balanceLabel}>Today's Total</div>
            <div style={styles.balanceAmount}>₹{todayBalance.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
