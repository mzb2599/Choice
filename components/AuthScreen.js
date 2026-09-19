import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  authenticate,
  requestPasswordReset,
  resetPassword,
} from "../utils/auth";

export default function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const applyResetLink = (url) => {
      const token = url?.match(/[?&]resetToken=([^&]+)/)?.[1];
      if (token) {
        setResetToken(decodeURIComponent(token));
        setMode("reset");
      }
    };

    Linking.getInitialURL().then(applyResetLink);
    const subscription = Linking.addEventListener("url", ({ url }) =>
      applyResetLink(url),
    );
    return () => subscription.remove();
  }, []);

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      if (mode === "forgot") {
        const result = await requestPasswordReset(email);
        setNotice(result.message);
      } else if (mode === "reset") {
        if (password !== confirmPassword)
          throw new Error("Passwords do not match");
        await resetPassword(resetToken, password);
        setNotice("Your password was reset. You can sign in now.");
        setMode("login");
        setPassword("");
        setConfirmPassword("");
      } else {
        const session = await authenticate(mode, { name, email, password });
        onAuthenticated(session);
      }
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
            {mode === "login"
              ? "Welcome back"
              : mode === "signup"
                ? "Open your store account"
                : mode === "forgot"
                  ? "Forgot your password?"
                  : "Choose a new password"}
          </Text>
          <Text style={styles.subtitle}>
            {mode === "forgot"
              ? "Enter your email and we will send a reset link."
              : mode === "reset"
                ? "Your new password must be at least 8 characters."
                : "Manage your grocery business from anywhere."}
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
          {mode !== "reset" && (
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#78909c"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          )}
          {mode !== "forgot" && (
            <TextInput
              style={styles.input}
              placeholder="Password (8+ characters)"
              placeholderTextColor="#78909c"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          )}
          {mode === "reset" && (
            <TextInput
              style={styles.input}
              placeholder="Confirm new password"
              placeholderTextColor="#78909c"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          )}
          {!!notice && <Text style={styles.notice}>{notice}</Text>}
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
                {mode === "login"
                  ? "Sign in"
                  : mode === "signup"
                    ? "Create account"
                    : mode === "forgot"
                      ? "Send reset link"
                      : "Reset password"}
              </Text>
            )}
          </TouchableOpacity>
          {mode === "login" && (
            <TouchableOpacity
              onPress={() => {
                setMode("forgot");
                setError("");
                setNotice("");
              }}
            >
              <Text style={styles.switchText}>Forgot password?</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => {
              setMode(mode === "signup" ? "login" : "signup");
              setError("");
              setNotice("");
            }}
          >
            {mode !== "reset" && mode !== "forgot" && (
              <Text style={styles.switchText}>
                {mode === "login"
                  ? "New store owner? Create an account"
                  : "Already have an account? Sign in"}
              </Text>
            )}
          </TouchableOpacity>
          {(mode === "reset" || mode === "forgot") && (
            <TouchableOpacity
              onPress={() => {
                setMode("login");
                setError("");
                setNotice("");
              }}
            >
              <Text style={styles.switchText}>Back to sign in</Text>
            </TouchableOpacity>
          )}
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
  notice: { color: "#18794e", marginBottom: 12 },
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
