export const loadCustomers = () => {
  try {
    const stored =
      typeof window !== "undefined" && localStorage.getItem("customers");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading customers:", error);
    return [];
  }
};

export const saveCustomers = (customers) => {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem("customers", JSON.stringify(customers));
    }
  } catch (error) {
    console.error("Error saving customers:", error);
  }
};
