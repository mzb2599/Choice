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
import { authenticate } from "../utils/auth";

export default function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      const session = await authenticate(mode, { name, email, password });
      onAuthenticated(session);
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
          <Text style={styles.title}>
            {mode === "login" ? "Welcome back" : "Open your store account"}
          </Text>
          <Text style={styles.subtitle}>
            Manage your grocery business from anywhere.
          </Text>

          {mode === "signup" && (
            <TextInput
              style={styles.input}
              placeholder="Your name"
              placeholderTextColor="#78909c"
              value={name}
              onChangeText={setName}
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor="#78909c"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password (8+ characters)"
            placeholderTextColor="#78909c"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
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
              <Text style={styles.submitText}>
                {mode === "login" ? "Sign in" : "Create account"}
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError("");
            }}
          >
            <Text style={styles.switchText}>
              {mode === "login"
                ? "New store owner? Create an account"
                : "Already have an account? Sign in"}
            </Text>
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
