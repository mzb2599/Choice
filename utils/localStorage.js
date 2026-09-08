import AsyncStorage from "@react-native-async-storage/async-storage";

const keyForUser = (userId) => `customers:${userId}`;

export const loadCustomers = async (userId) => {
  try {
    const stored = await AsyncStorage.getItem(keyForUser(userId));
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading customers:", error);
    return [];
  }
};

export const saveCustomers = async (customers, userId) => {
  try {
    await AsyncStorage.setItem(keyForUser(userId), JSON.stringify(customers));
  } catch (error) {
    console.error("Error saving customers:", error);
  }
};
