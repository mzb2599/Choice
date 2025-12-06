import React from "react";
import { View, Text, TextInput, FlatList } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Search, TrendingUp, TrendingDown, Users } from "lucide-react-native";
import { styles } from "../styles/appStyles";

export default function CustomerList({
  data,
  searchTerm,
  setSearchTerm,
  filterDate,
  setFilterDate,
}) {
  const ListHeader = () => (
    <>
      <View style={[styles.paper, { marginBottom: 20 }]}>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Search
              size={20}
              color="#999"
              style={{ position: "absolute", left: 12, top: 14, zIndex: 10 }}
            />
            <TextInput
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="Search by name or phone..."
              style={[styles.input, { paddingLeft: 44 }]}
            />
          </View>

          <View style={{ width: 150 }}>
            <View style={{ borderWidth: 2, borderColor: "#e0e0e0", borderRadius: 8 }}>
              <Picker selectedValue={filterDate} onValueChange={setFilterDate} style={{ height: 48 }}>
                <Picker.Item label="All Time" value="all" />
                <Picker.Item label="Today Only" value="today" />
              </Picker>
            </View>
          </View>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          paddingVertical: 14,
          paddingHorizontal: 16,
          backgroundColor: "#f5f5f5",
          borderBottomWidth: 2,
          borderColor: "#e0e0e0",
        }}
      >
        <Text style={{ flex: 2, fontWeight: "600" }}>Customer</Text>
        <Text style={{ flex: 2, fontWeight: "600" }}>Phone</Text>
        <Text style={{ flex: 1, fontWeight: "600", textAlign: "right" }}>Total</Text>
        {filterDate === "today" && (
          <Text style={{ flex: 1, fontWeight: "600", textAlign: "right" }}>Today</Text>
        )}
        <Text style={{ width: 80, fontWeight: "600", textAlign: "center" }}>Status</Text>
      </View>
    </>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={ListHeader}
      renderItem={({ item }) => (
        <View
          style={{
            flexDirection: "row",
            paddingVertical: 14,
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderColor: "#eee",
            backgroundColor: "white",
          }}
        >
          <Text style={{ flex: 2 }}>{item.name}</Text>
          <Text style={{ flex: 2 }}>{item.phone}</Text>
          <Text
            style={{
              flex: 1,
              textAlign: "right",
              fontWeight: "bold",
              color: item.balance >= 0 ? "#155724" : "#721c24",
            }}
          >
            ₹{Math.abs(item.balance).toFixed(2)}
          </Text>

          {filterDate === "today" && (
            <Text
              style={{
                flex: 1,
                textAlign: "right",
                fontWeight: "bold",
                color: item.todayTotal >= 0 ? "#155724" : "#721c24",
              }}
            >
              ₹{Math.abs(item.todayTotal).toFixed(2)}
            </Text>
          )}

          <View style={{ width: 80, alignItems: "center" }}>
            {item.balance >= 0 ? (
              <View
                style={{
                  backgroundColor: "#d4edda",
                  paddingVertical: 4,
                  paddingHorizontal: 10,
                  borderRadius: 16,
                  flexDirection: "row",
                  gap: 4,
                }}
              >
                <TrendingUp size={14} color="#155724" />
                <Text style={{ fontSize: 12, color: "#155724" }}>Recv</Text>
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: "#f8d7da",
                  paddingVertical: 4,
                  paddingHorizontal: 10,
                  borderRadius: 16,
                  flexDirection: "row",
                  gap: 4,
                }}
              >
                <TrendingDown size={14} color="#721c24" />
                <Text style={{ fontSize: 12, color: "#721c24" }}>Credit</Text>
              </View>
            )}
          </View>
        </View>
      )}
      ListEmptyComponent={
        <View style={{ alignItems: "center", marginTop: 50 }}>
          <Users size={48} color="#999" />
          <Text style={{ fontSize: 18, color: "#999", marginTop: 10 }}>No customers found</Text>
        </View>
      }
    />
  );
}
