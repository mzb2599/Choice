import React from "react";
import { Plus } from "lucide-react";
import { styles } from "../styles/webStyles";

export default function AddCustomerWeb({
  newCustomer,
  setNewCustomer,
  handleAddCustomer,
}) {
  return (
    <div style={styles.paper}>
      <h2
        style={{
          marginTop: 0,
          marginBottom: "24px",
          fontSize: "20px",
          fontWeight: "700",
          color: "#212529",
        }}
      >
        Add New Customer
      </h2>

      <div style={styles.formGroup}>
        <label style={styles.label}>Customer Name</label>
        <input
          type="text"
          value={newCustomer.name}
          onChange={(e) =>
            setNewCustomer({ ...newCustomer, name: e.target.value })
          }
          style={styles.input}
          placeholder="Enter customer name"
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Phone Number</label>
        <input
          type="tel"
          value={newCustomer.phone}
          onChange={(e) =>
            setNewCustomer({ ...newCustomer, phone: e.target.value })
          }
          style={styles.input}
          placeholder="Enter phone number"
        />
      </div>

      <button
        onClick={handleAddCustomer}
        style={{ ...styles.button, ...styles.buttonPrimary }}
      >
        <Plus size={20} /> Add Customer
      </button>
    </div>
  );
}
