import React from "react";
import { View, Text, FlatList } from "react-native";
import { CalendarDays } from "lucide-react-native";
import { Styles } from "../styles/Styles";

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
};

export default function CustomerOrders({ transactions }) {
  const sorted = [...(transactions || [])].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  return (
    <View style={Styles.paper}>
      {sorted.length === 0 ? (
        <View style={{ alignItems: "center", padding: 40 }}>
          <CalendarDays size={56} color="#6c757d" />
          <Text style={{ fontSize: 18, marginTop: 8 }}>No orders yet</Text>
          <Text style={{ color: "#6c757d" }}>
            Add customers and apply updates to see order history
          </Text>
        </View>
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(item, idx) =>
            `${item.customerName}-${item.date}-${idx}`
          }
          renderItem={({ item }) => (
            <View
              style={{
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: "#eee",
              }}
            >
              <Text style={{ fontWeight: "600" }}>{item.customerName}</Text>
              <Text style={{ color: "#6c757d", fontSize: 13 }}>
                {formatDate(item.date)}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 8,
                }}
              >
                <Text
                  style={{
                    fontWeight: "700",
                    color: item.type === "received" ? "#198754" : "#dc3545",
                  }}
                >
                  {item.type === "received" ? "Received" : "Credit"}
                </Text>
                <Text
                  style={{
                    fontWeight: "700",
                    color: item.type === "received" ? "#198754" : "#dc3545",
                  }}
                >
                  ₹{Math.abs(item.amount).toFixed(2)}
                </Text>
              </View>
              <Text style={{ marginTop: 6, color: "#6c757d" }}>
                Balance: ₹{item.balance.toFixed(2)}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
