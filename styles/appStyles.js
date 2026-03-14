import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
  scroll: { padding: 16 },

  header: {
    padding: 24,
    borderRadius: 18,
    overflow: "hidden",
    // subtle shadow for native platforms
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 9,
  },

  headerContent: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    flexWrap: "wrap",
  },

  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },

  menuButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.18)",
  },

  headerIcon: {
    backgroundColor: "#0d6efd",
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  headerH1: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  headerSub: { color: "#fff", fontSize: 14, opacity: 0.8 },

  balanceCards: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
  },

  balanceCard: {
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    minWidth: 160,
  },

  balanceLabel: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    marginBottom: 4,
  },

  balanceValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 0.15,
  },

  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginTop: 10,
    borderRadius: 8,
    overflow: "hidden",
  },

  menuOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  menuContainer: {
    position: "absolute",
    top: 60,
    left: 20,
    width: 220,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
  },

  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  menuItemActive: {
    backgroundColor: "rgba(102,126,234,0.12)",
  },

  menuItemText: {
    fontSize: 15,
    fontWeight: "500",
  },

  tab: {
    flex: 1,
    padding: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2,
    borderColor: "transparent",
  },

  tabActive: {
    backgroundColor: "#eef3ff",
    borderBottomColor: "#2a5298",
  },

  tabText: { fontSize: 14, marginLeft: 4 },

  alert: {
    padding: 16,
    backgroundColor: "#d4edda",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
  },

  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },

  label: { fontWeight: "600", marginBottom: 6 },

  input: {
    borderWidth: 2,
    borderColor: "#e0e0e0",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 14,
  },

  textarea: {
    borderWidth: 2,
    borderColor: "#e0e0e0",
    padding: 12,
    borderRadius: 8,
    height: 200,
    marginBottom: 16,
    fontSize: 14,
  },

  button: {
    padding: 14,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonPrimary: { backgroundColor: "#667eea" },
  buttonSuccess: { backgroundColor: "#38ef7d" },

  buttonText: { color: "#fff", fontWeight: "600" },

  paper: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
  },
});
