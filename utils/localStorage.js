import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "customers";

export const loadCustomers = async () => {
  try {
    const stored = await AsyncStorage.getItem(KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading customers:", error);
    return [];
  }
};

export const saveCustomers = async (customers) => {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(customers));
  } catch (error) {
    console.error("Error saving customers:", error);
  }
};
