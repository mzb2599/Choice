// styles/Styles.native.js
import { StyleSheet } from "react-native";
import { theme } from "./theme";

export const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.pageBg,
  },

  content: {
    padding: theme.spacing.lg,
  },

  paper: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.normal,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.subtleBorder,
    ...theme.elevation.low,
  },

  input: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.subtleBorder,
    borderRadius: theme.radii.small,
    fontSize: 15,
    backgroundColor: theme.colors.card,
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: theme.radii.pill,
  },

  chipSuccess: {
    backgroundColor: theme.colors.success + "22",
  },

  chipError: {
    backgroundColor: theme.colors.danger + "22",
  },
});

export default Styles;
