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
import * as AuthSession from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Styles } from "../styles/Styles";

const GOOGLE_AUTH_DISCOVERY = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
};

// TODO: Replace with your own Google OAuth2 client ID.
// For Expo Go: use OAuth client for iOS/Android with redirect URI from expo-auth-session.
const CLIENT_ID = "YOUR_GOOGLE_OAUTH_CLIENT_ID.apps.googleusercontent.com";

const STORAGE_KEYS = {
  customers: "customers",
  products: "products",
  lastBackup: "lastBackup",
};

const BackupToDrive = ({ customers, onDataRestore }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isLoadingBackups, setIsLoadingBackups] = useState(false);
  const [backups, setBackups] = useState([]);
  const [lastBackup, setLastBackup] = useState(null);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: ["https://www.googleapis.com/auth/drive.file"],
      responseType: "token",
      extraParams: {
        include_granted_scopes: "true",
      },
      redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    },
    GOOGLE_AUTH_DISCOVERY,
  );

  useEffect(() => {
    loadLastBackup();
  }, []);

  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      setAccessToken(access_token);
      Alert.alert(
        "Google Drive",
        "Authentication successful. Ready to backup and restore.",
      );
      loadBackups(access_token);
    }
  }, [response]);

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

  const uploadToDrive = async () => {
    if (!accessToken) {
      Alert.alert("Google Drive", "Please connect your Google account first.");
      return;
    }

    setIsBackingUp(true);

    try {
      const data = await gatherData();
      const fileContent = JSON.stringify(data, null, 2);
      const timestamp = new Date().toISOString();

      // 1) Create file metadata record in Drive
      const createRes = await fetch(
        "https://www.googleapis.com/drive/v3/files",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: `kirana-backup-${timestamp.replace(/[:.]/g, "-")}.json`,
            mimeType: "application/json",
            description: `Kirana app backup - ${new Date(timestamp).toLocaleString()}`,
          }),
        },
      );

      if (!createRes.ok) {
        const body = await createRes.text();
        throw new Error(`Drive create-fail: ${createRes.status} ${body}`);
      }

      const { id: fileId } = await createRes.json();

      // 2) Upload payload as media to the created file
      const uploadRes = await fetch(
        `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: fileContent,
        },
      );

      if (!uploadRes.ok) {
        const body = await uploadRes.text();
        throw new Error(`Drive upload-fail: ${uploadRes.status} ${body}`);
      }

      await saveLastBackup(timestamp);
      Alert.alert("Backup success", "Your data is backed up to Google Drive.");
      loadBackups(accessToken);
    } catch (err) {
      console.error(err);
      Alert.alert("Backup failed", err.message || "Failed to backup data.");
    } finally {
      setIsBackingUp(false);
    }
  };

  const loadBackups = async (token) => {
    if (!token) return;

    setIsLoadingBackups(true);
    try {
      // Search for backup files
      const searchRes = await fetch(
        "https://www.googleapis.com/drive/v3/files?q=name contains 'kirana-backup-' and mimeType='application/json'&orderBy=modifiedTime desc",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!searchRes.ok) {
        throw new Error(`Search failed: ${searchRes.status}`);
      }

      const { files } = await searchRes.json();
      setBackups(files || []);
    } catch (err) {
      console.error("Error loading backups:", err);
      Alert.alert("Error", "Failed to load backup list.");
    } finally {
      setIsLoadingBackups(false);
    }
  };

  const restoreFromBackup = async (fileId) => {
    if (!accessToken) {
      Alert.alert("Google Drive", "Please connect your Google account first.");
      return;
    }

    Alert.alert(
      "Restore Backup",
      "This will replace your current data with the backup. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Restore",
          style: "destructive",
          onPress: () => performRestore(fileId),
        },
      ],
    );
  };

  const performRestore = async (fileId) => {
    setIsRestoring(true);
    try {
      // Download the backup file
      const downloadRes = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!downloadRes.ok) {
        throw new Error(`Download failed: ${downloadRes.status}`);
      }

      const backupData = await downloadRes.json();

      // Validate backup data
      if (!backupData.customers || !backupData.products) {
        throw new Error("Invalid backup file format");
      }

      // Save to local storage
      await AsyncStorage.setItem(
        STORAGE_KEYS.customers,
        JSON.stringify(backupData.customers),
      );
      await AsyncStorage.setItem(
        STORAGE_KEYS.products,
        JSON.stringify(backupData.products),
      );

      // Notify parent component to refresh data
      if (onDataRestore) {
        onDataRestore(backupData);
      }

      Alert.alert(
        "Restore Complete",
        `Restored ${backupData.customers.length} customers and ${backupData.products.length} products.`,
      );
    } catch (err) {
      console.error("Restore error:", err);
      Alert.alert("Restore Failed", err.message || "Failed to restore data.");
    } finally {
      setIsRestoring(false);
    }
  };

  const deleteBackup = async (fileId) => {
    if (!accessToken) return;

    Alert.alert(
      "Delete Backup",
      "Are you sure you want to delete this backup from Google Drive?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => performDelete(fileId),
        },
      ],
    );
  };

  const performDelete = async (fileId) => {
    try {
      const deleteRes = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!deleteRes.ok) {
        throw new Error(`Delete failed: ${deleteRes.status}`);
      }

      Alert.alert("Success", "Backup deleted from Google Drive.");
      loadBackups(accessToken);
    } catch (err) {
      console.error("Delete error:", err);
      Alert.alert("Delete Failed", "Failed to delete backup.");
    }
  };

  const renderBackupItem = ({ item }) => (
    <View style={localStyles.backupItem}>
      <View style={{ flex: 1 }}>
        <Text style={localStyles.backupName}>{item.name}</Text>
        <Text style={localStyles.backupDate}>
          {new Date(item.modifiedTime).toLocaleString()}
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
          Google Drive Backup
        </Text>

        {lastBackup && (
          <Text style={{ marginBottom: 12, color: "#6c757d" }}>
            Last backup: {lastBackup.toLocaleString()}
          </Text>
        )}

        <TouchableOpacity
          style={[Styles.button, { marginBottom: 12 }]}
          onPress={() => {
            if (!request) {
              Alert.alert(
                "Google Drive",
                "Unable to start authorization request.",
              );
              return;
            }
            promptAsync({ useProxy: true });
          }}
        >
          <Text style={Styles.buttonText}>
            {accessToken
              ? "Reconnect Google Account"
              : "Connect Google Account"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            Styles.button,
            { backgroundColor: "#198754", marginBottom: 20 },
          ]}
          onPress={uploadToDrive}
          disabled={isBackingUp || !accessToken}
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
            {accessToken
              ? "No backups found"
              : "Connect your account to view backups"}
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
