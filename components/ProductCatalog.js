import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { Plus, Package, Trash2, Search } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Styles } from "../styles/Styles";

const STORAGE_KEY = "products";

const ProductForm = ({ newItem, setNewItem, onAddItem }) => (
  <View style={[Styles.paper, localStyles.formContainer]}>
    <Text style={localStyles.title}>Add New Product</Text>

    <Text style={localStyles.label}>Product Name</Text>
    <TextInput
      style={Styles.input}
      placeholder="Enter product name"
      value={newItem.name}
      onChangeText={(t) => setNewItem({ ...newItem, name: t })}
    />

    <Text style={[localStyles.label, { marginTop: 12 }]}>Price (₹)</Text>
    <TextInput
      style={Styles.input}
      placeholder="Enter price"
      value={String(newItem.price)}
      onChangeText={(t) => setNewItem({ ...newItem, price: t })}
      keyboardType="numeric"
    />

    <TouchableOpacity style={[localStyles.addButton]} onPress={onAddItem}>
      <Plus size={18} color="#fff" />
      <Text style={localStyles.addButtonText}>Add Product</Text>
    </TouchableOpacity>
  </View>
);

const EmptyState = () => (
  <View style={localStyles.emptyContainer}>
    <Package size={48} color="#6c757d" />
    <Text style={localStyles.emptyTitle}>No products found</Text>
    <Text style={localStyles.emptySub}>Add products to build your catalog</Text>
  </View>
);

const ProductRow = ({ item, onDelete }) => (
  <View style={localStyles.row}>
    <View style={{ flex: 1 }}>
      <Text style={localStyles.rowTitle}>{item.name}</Text>
    </View>

    <Text style={localStyles.price}>₹{Number(item.price).toFixed(2)}</Text>

    <TouchableOpacity
      style={localStyles.deleteBtn}
      onPress={() => onDelete(item.id)}
    >
      <Trash2 size={14} color="#fff" />
      <Text style={localStyles.deleteText}>Delete</Text>
    </TouchableOpacity>
  </View>
);

const ProductCatalog = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", price: "" });
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        const parsed = json ? JSON.parse(json) : [];
        // Ensure price is numeric
        const normalized = parsed.map((p) => ({
          ...p,
          price: Number(p.price),
        }));
        setItems(Array.isArray(normalized) ? normalized : []);
      } catch (err) {
        console.error("Error loading products:", err);
      }
    };

    load();
  }, []);

  const saveItems = async (next) => {
    try {
      setItems(next);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (err) {
      console.error("Error saving products:", err);
    }
  };

  const handleAddItem = () => {
    const trimmed = newItem.name.trim();
    const price = parseFloat(newItem.price);
    if (!trimmed) {
      Alert.alert("Validation", "Please enter a product name.");
      return;
    }
    if (isNaN(price) || price < 0) {
      Alert.alert("Validation", "Please enter a valid price (0 or greater).");
      return;
    }

    const item = { id: Date.now().toString(), name: trimmed, price };
    saveItems([...items, item]);
    setNewItem({ name: "", price: "" });
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Delete product",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => saveItems(items.filter((i) => i.id !== id)),
        },
      ],
    );
  };

  const filtered = search
    ? items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))
    : items;

  return (
    <View>
      <ProductForm
        newItem={newItem}
        setNewItem={setNewItem}
        onAddItem={handleAddItem}
      />

      <View style={[Styles.paper, { marginTop: 16 }]}>
        <View style={localStyles.headerRow}>
          <Text style={localStyles.listTitle}>
            Product List ({filtered.length})
          </Text>
          <View style={localStyles.searchBox}>
            <Search size={16} color="#6c757d" />
            <TextInput
              style={[Styles.input, { marginLeft: 8, flex: 1 }]}
              placeholder="Search products..."
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <ProductRow item={item} onDelete={handleDelete} />
            )}
          />
        )}
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  formContainer: {
    paddingBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  label: {
    marginTop: 6,
    marginBottom: 6,
    fontWeight: "600",
    color: "#212529",
  },
  addButton: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    backgroundColor: "#0d6efd",
    borderRadius: 6,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },
  emptyContainer: {
    padding: 28,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#495057",
    marginTop: 8,
  },
  emptySub: {
    color: "#6c757d",
    marginTop: 6,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    width: 260,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  price: {
    width: 100,
    textAlign: "right",
    color: "#198754",
    fontWeight: "700",
    marginRight: 12,
  },
  deleteBtn: {
    backgroundColor: "#dc3545",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default ProductCatalog;
