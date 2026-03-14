import React from "react";
import { View, Text, TextInput, FlatList } from "react-native";
import { Users, TrendingUp, TrendingDown } from "lucide-react-native";
import { Styles } from "../styles/Styles";

export default function CustomerList({
  data,
  searchTerm,
  setSearchTerm,
  filterDate,
  setFilterDate,
}) {
  console.log("Rendering CustomerList with data:", data);
  return (
    <View>
      <View style={{ ...Styles.paper, marginBottom: 12 }}>
        <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
          <View style={{ flex: 1 }}>
            <TextInput
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChangeText={(t) => setSearchTerm(t)}
              style={{ ...Styles.input, paddingLeft: 12 }}
            />
          </View>
        </View>
      </View>

      <View style={Styles.paper}>
        {data && data.length === 0 ? (
          <View style={{ alignItems: "center", padding: 40 }}>
            <Users size={56} color="#6c757d" />
            <Text style={{ fontSize: 18, marginTop: 8 }}>
              No customers found
            </Text>
            <Text style={{ color: "#6c757d" }}>
              Add customers to get started
            </Text>
          </View>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <View
                style={{
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: "#eee",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontWeight: "600" }}>{item.name}</Text>
                <Text style={{ color: "#6c757d" }}>{item.phone}</Text>
                <Text
                  style={{
                    fontWeight: "700",
                    textAlign: "right",
                    color: item.balance >= 0 ? "#198754" : "#dc3545",
                  }}
                >
                  ₹{Math.abs(item.balance).toFixed(2)}
                </Text>
               
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}
