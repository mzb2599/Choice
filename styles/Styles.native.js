// styles/Styles.native.js
import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  content: {
    padding: 16,
  },

  paper: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },

  input: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 6,
    fontSize: 15,
    backgroundColor: "#fff",
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },

  chipSuccess: {
    backgroundColor: "#d1e7dd",
  },

  chipError: {
    backgroundColor: "#f8d7da",
  },
});

export default Styles;
