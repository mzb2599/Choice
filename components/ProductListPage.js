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
import { Package, Search, Pencil, Check, X } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Styles } from "../styles/Styles";

const STORAGE_KEY = "products";

const EmptyState = () => (
  <View style={localStyles.emptyContainer}>
    <Package size={48} color="#6c757d" />
    <Text style={localStyles.emptyTitle}>No products found</Text>
    <Text style={localStyles.emptySub}>Add products in Product Catalog</Text>
  </View>
);

const ProductRow = ({
  item,
  isEditing,
  priceDraft,
  onEditStart,
  onEditChange,
  onEditSave,
  onEditCancel,
}) => (
  <View style={localStyles.row}>
    <View style={{ flex: 1 }}>
      <Text style={localStyles.rowTitle}>{item.name}</Text>
    </View>

    {isEditing ? (
      <View style={localStyles.editorWrap}>
        <TextInput
          value={priceDraft}
          onChangeText={onEditChange}
          keyboardType="decimal-pad"
          style={localStyles.priceInput}
          placeholder="0.00"
          autoFocus
          onSubmitEditing={onEditSave}
        />
        <TouchableOpacity style={localStyles.saveBtn} onPress={onEditSave}>
          <Check size={14} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={localStyles.cancelBtn} onPress={onEditCancel}>
          <X size={14} color="#fff" />
        </TouchableOpacity>
      </View>
    ) : (
      <>
        <Text style={localStyles.price}>₹{Number(item.price).toFixed(2)}</Text>
        <TouchableOpacity style={localStyles.editBtn} onPress={onEditStart}>
          <Pencil size={14} color="#fff" />
          <Text style={localStyles.editText}>Edit Price</Text>
        </TouchableOpacity>
      </>
    )}
  </View>
);

const ProductListPage = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [priceDraft, setPriceDraft] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        const parsed = json ? JSON.parse(json) : [];
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

  const handleEditStart = (item) => {
    setEditingId(item.id);
    setPriceDraft(String(item.price));
  };

  const handleEditSave = () => {
    if (editingId === null) return;

    const nextPrice = Number(priceDraft);
    if (!Number.isFinite(nextPrice) || nextPrice < 0) {
      Alert.alert("Validation", "Please enter a valid price (0 or greater).");
      return;
    }

    const nextItems = items.map((item) =>
      item.id === editingId ? { ...item, price: nextPrice } : item,
    );

    saveItems(nextItems);
    setEditingId(null);
    setPriceDraft("");
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setPriceDraft("");
  };

  const filtered = search
    ? items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))
    : items;

  return (
    <View>
      <View style={[Styles.paper, { marginBottom: 12 }]}>
        <Text style={localStyles.listTitle}>
          Product List ({filtered.length})
        </Text>
      </View>

      <View style={[Styles.paper, { marginBottom: 12 }]}>
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

      <View style={[Styles.paper]}>
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <ProductRow
                item={item}
                isEditing={editingId === item.id}
                priceDraft={priceDraft}
                onEditStart={() => handleEditStart(item)}
                onEditChange={(value) =>
                  setPriceDraft(value.replace(/[^0-9.]/g, ""))
                }
                onEditSave={handleEditSave}
                onEditCancel={handleEditCancel}
              />
            )}
          />
        )}
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
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
  listTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
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
  editorWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
  },
  priceInput: {
    width: 90,
    borderWidth: 1,
    borderColor: "#d0d7de",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    textAlign: "right",
    marginRight: 8,
  },
  editBtn: {
    backgroundColor: "#0d6efd",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  editText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
  },
  saveBtn: {
    backgroundColor: "#198754",
    padding: 8,
    borderRadius: 6,
    marginRight: 6,
  },
  cancelBtn: {
    backgroundColor: "#6c757d",
    padding: 8,
    borderRadius: 6,
  },
});

export default ProductListPage;
