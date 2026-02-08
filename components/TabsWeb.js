import React from "react";
import { Plus, TrendingUp, Users } from "lucide-react";
import { styles } from "../styles/webStyles";

export default function TabsWeb({ activeTab, setActiveTab }) {
  return (
    <div style={styles.tabs}>
      <div style={styles.tabsContainer}>
        <button
          onClick={() => setActiveTab(0)}
          style={{
            ...styles.tab,
            ...(activeTab === 0 ? styles.tabActive : {}),
          }}
        >
          <Plus size={18} /> Add Customer
        </button>

        <button
          onClick={() => setActiveTab(1)}
          style={{
            ...styles.tab,
            ...(activeTab === 1 ? styles.tabActive : {}),
          }}
        >
          <TrendingUp size={18} /> Bulk Update
        </button>

        <button
          onClick={() => setActiveTab(2)}
          style={{
            ...styles.tab,
            ...(activeTab === 2 ? styles.tabActive : {}),
          }}
        >
          <Users size={18} /> View Balances
        </button>
      </div>
    </div>
  );
}
