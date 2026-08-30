export const theme = {
  colors: {
    background: "#0f172a", // deep navy background for headers
    surface: "#0f172a",
    pageBg: "#f7fafc",
    card: "#ffffff",
    primary: "#4f46e5",
    primaryDark: "#3730a3",
    accent: "#06b6d4",
    success: "#10b981",
    danger: "#ef4444",
    muted: "#6b7280",
    text: "#0f172a",
    textOnPrimary: "#ffffff",
    subtleBorder: "#e6eef8",
  },
  radii: {
    small: 6,
    normal: 10,
    large: 16,
    pill: 999,
  },
  spacing: {
    xs: 6,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  elevation: {
    low: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      // Web-friendly boxShadow equivalent
      boxShadow: "0px 4px 8px rgba(0,0,0,0.06)",
      elevation: 6,
    },
    med: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      // Web-friendly boxShadow equivalent
      boxShadow: "0px 8px 16px rgba(0,0,0,0.08)",
      elevation: 10,
    },
  },
};

export default theme;
