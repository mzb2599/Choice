export const parseBulkUpdates = (bulkEntries = []) => {
  if (!Array.isArray(bulkEntries)) return [];

  return bulkEntries
    .filter((entry) => entry && entry.customerName && entry.amount !== "")
    .map((entry) => {
      const amount = Number(entry.amount);
      const normalizedType = entry.type === "credit" ? "credit" : "received";

      return {
        name: entry.customerName.trim(),
        amount,
        type: normalizedType,
      };
    })
    .filter((entry) => Number.isFinite(entry.amount) && entry.amount > 0);
};
