import { StyleSheet } from "react-native";
import { theme } from "./theme";

export const Styles = StyleSheet.create({
  scroll: { padding: theme.spacing.lg },

  header: {
    padding: theme.spacing.xl,
    borderRadius: theme.radii.large,
    overflow: "hidden",
    ...theme.elevation.med,
    backgroundColor: theme.colors.primary,
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
    marginLeft: theme.spacing.md,
  },

  menuButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.radii.small,
    backgroundColor: theme.colors.primaryDark + "66",
  },

  headerIcon: {
    backgroundColor: theme.colors.accent,
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  headerH1: {
    color: theme.colors.textOnPrimary,
    fontSize: 24,
    fontWeight: "800",
  },
  headerSub: { color: theme.colors.textOnPrimary, fontSize: 14, opacity: 0.9 },

  balanceCards: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: theme.spacing.sm,
  },

  balanceCard: {
    backgroundColor: theme.colors.primaryDark + "22",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radii.small,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    minWidth: 160,
  },

  balanceLabel: {
    color: theme.colors.textOnPrimary,
    fontSize: 12,
    marginBottom: 4,
  },

  balanceValue: {
    color: theme.colors.textOnPrimary,
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  tabsContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.card,
    marginTop: theme.spacing.sm,
    borderRadius: theme.radii.small,
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
    width: 240,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.large,
    paddingVertical: 8,
    ...theme.elevation.med,
  },

  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  menuItemActive: {
    backgroundColor: theme.colors.primary + "10",
  },

  menuItemText: {
    fontSize: 15,
    fontWeight: "600",
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
    backgroundColor: theme.colors.primary + "06",
    borderBottomColor: theme.colors.primary,
  },

  tabText: { fontSize: 14, marginLeft: 4 },

  alert: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.success + "12",
    borderRadius: theme.radii.small,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: theme.spacing.sm,
  },

  card: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: theme.radii.normal,
    marginVertical: theme.spacing.md,
  },

  title: { fontSize: 22, fontWeight: "700", marginBottom: theme.spacing.lg },

  label: { fontWeight: "600", marginBottom: theme.spacing.sm },

  input: {
    borderWidth: 1,
    borderColor: theme.colors.subtleBorder,
    padding: theme.spacing.sm,
    borderRadius: theme.radii.small,
    marginBottom: theme.spacing.md,
    fontSize: 14,
    backgroundColor: theme.colors.card,
  },

  textarea: {
    borderWidth: 1,
    borderColor: theme.colors.subtleBorder,
    padding: theme.spacing.sm,
    borderRadius: theme.radii.small,
    height: 200,
    marginBottom: theme.spacing.md,
    fontSize: 14,
    backgroundColor: theme.colors.card,
  },

  suggestionBox: {
    borderWidth: 1,
    borderColor: theme.colors.subtleBorder,
    borderRadius: theme.radii.small,
    backgroundColor: theme.colors.card,
    marginTop: -8,
    marginBottom: 12,
    maxHeight: 180,
  },

  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f3f5",
  },

  suggestionText: {
    color: theme.colors.muted,
    fontSize: 14,
  },

  pill: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: theme.colors.subtleBorder,
    borderRadius: theme.radii.pill,
    marginRight: 8,
    backgroundColor: theme.colors.card,
  },

  pillActive: {
    backgroundColor: theme.colors.primary + "10",
    borderColor: theme.colors.primary,
  },

  pillText: {
    color: theme.colors.text,
    fontWeight: "600",
  },

  pillTextActive: {
    color: theme.colors.primary,
  },

  entryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.pageBg,
    borderRadius: theme.radii.small,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.subtleBorder,
  },

  button: {
    padding: 14,
    borderRadius: theme.radii.small,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonPrimary: { backgroundColor: theme.colors.primary },
  buttonSuccess: { backgroundColor: theme.colors.success },

  buttonText: { color: "#fff", fontWeight: "600" },

  paper: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: theme.radii.small,
  },
});
