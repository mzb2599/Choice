import React from "react";
import { Users, TrendingUp, TrendingDown, Search } from "lucide-react";
import { styles } from "../styles/webStyles";

export default function CustomerListWeb({
  filteredCustomers,
  searchTerm,
  setSearchTerm,
  filterDate,
  setFilterDate,
}) {
  return (
    <div>
      <div
        style={{ ...styles.paper, marginBottom: "24px", padding: "20px 24px" }}
      >
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <div style={styles.searchContainer}>
            <Search size={18} style={styles.searchIcon} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ ...styles.input, paddingLeft: "44px" }}
              placeholder="Search by name or phone..."
            />
          </div>
          <select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            style={{ ...styles.input, width: "auto", minWidth: "180px" }}
          >
            <option value="all">All Time</option>
            <option value="today">Today Only</option>
          </select>
        </div>
      </div>

      <div style={styles.paper}>
        {filteredCustomers.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              color: "#6c757d",
            }}
          >
            <Users size={56} style={{ marginBottom: "16px", opacity: 0.5 }} />
            <p style={{ fontSize: "18px", fontWeight: "500", margin: 0 }}>
              No customers found
            </p>
            <p style={{ fontSize: "14px", margin: "8px 0 0 0" }}>
              Add customers to get started
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>Phone</th>
                  <th style={{ ...styles.th, textAlign: "right" }}>
                    Total Balance
                  </th>
                  {filterDate === "today" && (
                    <th style={{ ...styles.th, textAlign: "right" }}>
                      Today's Total
                    </th>
                  )}
                  <th style={{ ...styles.th, textAlign: "center" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    style={{ transition: "background 0.15s" }}
                  >
                    <td style={styles.td}>
                      <div style={{ fontWeight: "600", color: "#212529" }}>
                        {customer.name}
                      </div>
                    </td>
                    <td style={{ ...styles.td, color: "#6c757d" }}>
                      {customer.phone}
                    </td>
                    <td style={{ ...styles.td, textAlign: "right" }}>
                      <span
                        style={{
                          fontWeight: "700",
                          fontSize: "16px",
                          color: customer.balance >= 0 ? "#198754" : "#dc3545",
                        }}
                      >
                        ₹{Math.abs(customer.balance).toFixed(2)}
                      </span>
                    </td>
                    {filterDate === "today" && (
                      <td style={{ ...styles.td, textAlign: "right" }}>
                        <span
                          style={{
                            fontWeight: "700",
                            fontSize: "16px",
                            color:
                              customer.todayTotal >= 0 ? "#198754" : "#dc3545",
                          }}
                        >
                          ₹{Math.abs(customer.todayTotal).toFixed(2)}
                        </span>
                      </td>
                    )}
                    <td style={{ ...styles.td, textAlign: "center" }}>
                      {customer.balance >= 0 ? (
                        <span style={{ ...styles.chip, ...styles.chipSuccess }}>
                          <TrendingUp size={14} /> Received
                        </span>
                      ) : (
                        <span style={{ ...styles.chip, ...styles.chipError }}>
                          <TrendingDown size={14} /> Credit
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
