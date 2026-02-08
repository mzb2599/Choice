import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
  scroll: { padding: 16 },

  header: { padding: 24 },

  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },

  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerH1: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  headerSub: { color: "#fff", fontSize: 14, opacity: 0.8 },

  balanceCards: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  balanceCard: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 6,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 6,
  },

  balanceLabel: { color: "#fff", fontSize: 12 },

  balanceValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    minWidth: 150,
  },

  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginTop: 10,
    borderRadius: 8,
    overflow: "hidden",
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
