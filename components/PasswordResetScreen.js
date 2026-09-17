import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { resetPassword } from "../utils/auth";

export default function PasswordResetScreen({ token, onCompleted, onBack }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError("");

    if (password.length < 8) {
      setError("Your password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      onCompleted();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#173f5f", "#20639b", "#3caea3"]}
      style={styles.page}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.center}
      >
        <View style={styles.form}>
          <Text style={styles.brand}>CHOICE</Text>
          <Text style={styles.title}>Choose a new password</Text>
          <Text style={styles.subtitle}>
            Create a new password for your store account.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="New password (8+ characters)"
            placeholderTextColor="#78909c"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm new password"
            placeholderTextColor="#78909c"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {!!error && <Text style={styles.error}>{error}</Text>}
          <TouchableOpacity
            style={styles.submit}
            onPress={submit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Reset password</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={onBack} disabled={loading}>
            <Text style={styles.switchText}>Back to sign in</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = {
  page: { flex: 1 },
  center: { flex: 1, justifyContent: "center", padding: 24 },
  form: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 28,
    maxWidth: 460,
    width: "100%",
    alignSelf: "center",
  },
  brand: {
    color: "#20639b",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 18,
  },
  title: { color: "#102a43", fontSize: 28, fontWeight: "800", marginBottom: 8 },
  subtitle: { color: "#627d98", fontSize: 15, marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: "#d9e2ec",
    borderRadius: 9,
    padding: 14,
    marginBottom: 12,
    fontSize: 15,
    color: "#102a43",
  },
  error: { color: "#c0392b", marginBottom: 12 },
  submit: {
    backgroundColor: "#20639b",
    borderRadius: 9,
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  submitText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  switchText: {
    color: "#20639b",
    textAlign: "center",
    marginTop: 20,
    fontWeight: "600",
  },
};
