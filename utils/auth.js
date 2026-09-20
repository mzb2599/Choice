import AsyncStorage from "@react-native-async-storage/async-storage";

export const BACKEND_BASE = process.env.EXPO_PUBLIC_BACKEND_BASE;

if (!BACKEND_BASE) {
  throw new Error("EXPO_PUBLIC_BACKEND_BASE is not configured");
}
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

const requestAuth = async (path, values) => {
  const response = await fetch(`${BACKEND_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  const body = await response.text();
  let data;
  try {
    data = JSON.parse(body);
  } catch {
    throw new Error(
      "Unable to reach the Choice server. Please start the backend and try again.",
    );
  }
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
};

export const requestPasswordReset = (email) =>
  requestAuth("/auth/forgot-password", { email });

export const resetPassword = (token, password) =>
  requestAuth("/auth/reset-password", { token, password });
