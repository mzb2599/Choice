export const parseBulkUpdates = (bulkText) => {
  if (!bulkText || !bulkText.trim()) return [];

  const lines = bulkText
    .trim()
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const updates = [];

  lines.forEach((line) => {
    const parts = line.split(/\s+/);
    if (parts.length < 3) return;

    const type = parts[parts.length - 1].toLowerCase();
    const amount = parseFloat(parts[parts.length - 2]);
    const name = parts.slice(0, -2).join(" ");

    if (!isNaN(amount) && (type === "received" || type === "credit")) {
      updates.push({ name, amount, type });
    }
  });

  return updates;
};
