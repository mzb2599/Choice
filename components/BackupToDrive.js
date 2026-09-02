import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Styles } from "../styles/Styles";

const STORAGE_KEYS = {
  customers: "customers",
  products: "products",
  lastBackup: "lastBackup",
};

// Backend base URL - change to your deployed server or set via env in native config
const BACKEND_BASE = "http://10.0.2.2:4000"; // Android emulator loopback to host

const BackupToDrive = ({ customers, onDataRestore }) => {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isLoadingBackups, setIsLoadingBackups] = useState(false);
  const [backups, setBackups] = useState([]);
  const [lastBackup, setLastBackup] = useState(null);

  useEffect(() => {
    loadLastBackup();
    loadBackups();
  }, []);

  const loadLastBackup = async () => {
    try {
      const lastBackupStr = await AsyncStorage.getItem(STORAGE_KEYS.lastBackup);
      if (lastBackupStr) {
        setLastBackup(new Date(lastBackupStr));
      }
    } catch (err) {
      console.error("Error loading last backup:", err);
    }
  };

  const saveLastBackup = async (timestamp) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.lastBackup, timestamp);
      setLastBackup(new Date(timestamp));
    } catch (err) {
      console.error("Error saving last backup:", err);
    }
  };

  const gatherData = async () => {
    const productJson =
      (await AsyncStorage.getItem(STORAGE_KEYS.products)) || "[]";
    const productData = JSON.parse(productJson);

    const customerData = customers || [];

    return {
      timestamp: new Date().toISOString(),
      customers: customerData,
      products: productData,
      version: "1.0",
    };
  };
  const uploadToBackend = async () => {
    setIsBackingUp(true);
    try {
      const data = await gatherData();
      const res = await fetch(`${BACKEND_BASE}/backup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customers: data.customers,
          products: data.products,
          meta: { timestamp: data.timestamp, version: data.version },
        }),
      });
      if (!res.ok) throw new Error("Failed to upload backup to server");
      await saveLastBackup(new Date().toISOString());
      Alert.alert("Backup success", "Your data is backed up to cloud.");
      loadBackups();
    } catch (err) {
      console.error("Backup error:", err);
      Alert.alert("Backup failed", err.message || "Failed to backup data.");
    } finally {
      setIsBackingUp(false);
    }
  };

  const loadBackups = async () => {
    setIsLoadingBackups(true);
    try {
      const res = await fetch(`${BACKEND_BASE}/backups`);
      if (!res.ok) throw new Error("Failed to load backups");
      const list = await res.json();
      setBackups(list || []);
    } catch (err) {
      console.error("Error loading backups:", err);
      Alert.alert("Error", "Failed to load backup list.");
    } finally {
      setIsLoadingBackups(false);
    }
  };

  const restoreFromBackup = async (id) => {
    Alert.alert(
      "Restore Backup",
      "This will replace your current data with the backup. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Restore",
          style: "destructive",
          onPress: () => performRestore(id),
        },
      ],
    );
  };

  const performRestore = async (id) => {
    setIsRestoring(true);
    try {
      const res = await fetch(`${BACKEND_BASE}/backup/${id}`);
      if (!res.ok) throw new Error("Failed to download backup");
      const data = await res.json();

      if (!data.customers || !data.products)
        throw new Error("Invalid backup format");

      await AsyncStorage.setItem(
        STORAGE_KEYS.customers,
        JSON.stringify(data.customers),
      );
      await AsyncStorage.setItem(
        STORAGE_KEYS.products,
        JSON.stringify(data.products),
      );
      if (onDataRestore) onDataRestore(data);
      Alert.alert(
        "Restore Complete",
        `Restored ${data.customers.length} customers and ${data.products.length} products.`,
      );
    } catch (err) {
      console.error("Restore error:", err);
      Alert.alert("Restore Failed", err.message || "Failed to restore data.");
    } finally {
      setIsRestoring(false);
    }
  };

  const deleteBackup = async (id) => {
    Alert.alert("Delete Backup", "Delete this backup from cloud?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => performDelete(id),
      },
    ]);
  };

  const performDelete = async (id) => {
    try {
      const res = await fetch(`${BACKEND_BASE}/backup/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete backup");
      Alert.alert("Success", "Backup deleted from cloud.");
      loadBackups();
    } catch (err) {
      console.error("Delete error:", err);
      Alert.alert("Delete Failed", "Failed to delete backup.");
    }
  };

  const renderBackupItem = ({ item }) => (
    <View style={localStyles.backupItem}>
      <View style={{ flex: 1 }}>
        <Text style={localStyles.backupName}>
          Backup {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        <Text style={localStyles.backupDate}>
          {new Date(item.createdAt).toLocaleString()} -{" "}
          {item.counts?.customers || 0} customers, {item.counts?.products || 0}{" "}
          products
        </Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          style={[localStyles.actionButton, { backgroundColor: "#0d6efd" }]}
          onPress={() => restoreFromBackup(item.id)}
          disabled={isRestoring}
        >
          <Text style={localStyles.actionButtonText}>Restore</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            localStyles.actionButton,
            { backgroundColor: "#dc3545", marginLeft: 8 },
          ]}
          onPress={() => deleteBackup(item.id)}
        >
          <Text style={localStyles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={Styles.container}>
      <View style={Styles.paper}>
        <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 12 }}>
          Cloud Backup
        </Text>

        {lastBackup && (
          <Text style={{ marginBottom: 12, color: "#6c757d" }}>
            Last backup: {lastBackup.toLocaleString()}
          </Text>
        )}

        <TouchableOpacity
          style={[
            Styles.button,
            { backgroundColor: "#198754", marginBottom: 20 },
          ]}
          onPress={uploadToBackend}
          disabled={isBackingUp}
        >
          {isBackingUp ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={Styles.buttonText}>Backup Now</Text>
          )}
        </TouchableOpacity>

        <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 12 }}>
          Backup History
        </Text>

        {isLoadingBackups ? (
          <ActivityIndicator size="large" color="#0d6efd" />
        ) : backups.length === 0 ? (
          <Text style={{ textAlign: "center", color: "#6c757d", padding: 20 }}>
            No cloud backups found
          </Text>
        ) : (
          <FlatList
            data={backups}
            keyExtractor={(item) => item.id}
            renderItem={renderBackupItem}
            style={{ maxHeight: 300 }}
          />
        )}
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  backupItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  backupName: {
    fontSize: 14,
    fontWeight: "600",
  },
  backupDate: {
    fontSize: 12,
    color: "#6c757d",
    marginTop: 2,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default BackupToDrive;
