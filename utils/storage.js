import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "customers";

/** Load all customers */
export const loadCustomers = async () => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.error("Error loading customers:", error);
    return [];
  }
};

/** Save updated customers */
export const saveCustomersToStorage = async (customers) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  } catch (error) {
    console.error("Error saving customers:", error);
  }
};

/** Clear all customers (optional helper) */
export const clearCustomers = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing storage:", error);
  }
};
