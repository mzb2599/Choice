import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

export const BACKEND_BASE =
  Platform.OS === "web" ? "http://localhost:4000" : "http://10.0.2.2:4000";
const SESSION_KEY = "choice_session";

export const getSession = async () => {
  const stored = await AsyncStorage.getItem(SESSION_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const saveSession = (session) =>
  AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));

export const clearSession = () => AsyncStorage.removeItem(SESSION_KEY);

export const authenticate = async (mode, values) => {
  const response = await fetch(`${BACKEND_BASE}/auth/${mode}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Authentication failed");
  await saveSession(data);
  return data;
};
