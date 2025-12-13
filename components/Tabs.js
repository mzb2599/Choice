import React, { useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Animated,
  StyleSheet,
  Easing,
  Pressable,
  Modal,
} from "react-native";
import { Plus, TrendingUp, Users } from "lucide-react-native";

export default function Tabs({ activeTab, setActiveTab }) {
  const anim = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(false); // Modal visibility
  const [open, setOpen] = useState(false); // logical open state for accessibility
  const DRAWER_WIDTH = 260;

  const openDrawer = () => {
    setVisible(true);
    Animated.timing(anim, {
      toValue: 1,
      duration: 250,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => setOpen(true));
  };

  const closeDrawer = (cb) => {
    Animated.timing(anim, {
      toValue: 0,
      duration: 200,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      setOpen(false);
      if (typeof cb === "function") cb();
    });
  };

  const toggle = () => {
    if (visible) closeDrawer();
    else openDrawer();
  };

  const onSelect = (index) => {
    setActiveTab(index);
    closeDrawer();
  };

  const rotateTop = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });
  const rotateBottom = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "-45deg"],
  });
  const translateTop = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 6],
  });
  const translateBottom = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -6],
  });
  const middleOpacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const menuTranslate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-DRAWER_WIDTH, 0],
  });
  const backdropOpacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  return (
    <View style={localStyles.container} pointerEvents="box-none">
      <View style={localStyles.row}>
        <Pressable
          onPress={toggle}
          accessibilityLabel={open ? "Close menu" : "Open menu"}
          accessibilityRole="button"
          style={localStyles.hamburgerTouch}
        >
          <Animated.View
            style={[
              localStyles.line,
              {
                transform: [
                  { translateY: translateTop },
                  { rotate: rotateTop },
                ],
              },
            ]}
          />
          <Animated.View
            style={[localStyles.line, { opacity: middleOpacity }]}
          />
          <Animated.View
            style={[
              localStyles.line,
              {
                transform: [
                  { translateY: translateBottom },
                  { rotate: rotateBottom },
                ],
              },
            ]}
          />
        </Pressable>
      </View>

      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={() => closeDrawer()}
      >
        {/* Backdrop */}
        <Pressable
          style={localStyles.backdropTouchable}
          onPress={() => closeDrawer()}
          accessibilityLabel="Close menu"
        >
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: "#000", opacity: backdropOpacity },
            ]}
          />
        </Pressable>

        {/* Drawer panel */}
        <Animated.View
          pointerEvents={open ? "auto" : "none"}
          style={[
            localStyles.drawer,
            { transform: [{ translateX: menuTranslate }], opacity: anim },
          ]}
        >
          <TouchableOpacity
            style={localStyles.menuItem}
            onPress={() => onSelect(0)}
            accessibilityRole="menuitem"
          >
            <Plus size={16} color="#000" />
            <Text style={localStyles.menuText}>Add Customer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={localStyles.menuItem}
            onPress={() => onSelect(1)}
            accessibilityRole="menuitem"
          >
            <TrendingUp size={16} color="#000" />
            <Text style={localStyles.menuText}>Bulk Update</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={localStyles.menuItem}
            onPress={() => onSelect(2)}
            accessibilityRole="menuitem"
          >
            <Users size={16} color="#000" />
            <Text style={localStyles.menuText}>View Balances</Text>
          </TouchableOpacity>
        </Animated.View>
      </Modal>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    padding: 8,
    paddingTop: 35,
    backgroundColor: "transparent",
  },
  row: { flexDirection: "row", alignItems: "center" },
  hamburgerTouch: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  line: {
    width: 22,
    height: 2,
    backgroundColor: "#111827",
    marginVertical: 3,
    borderRadius: 2,
  },
  drawer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 260,
    backgroundColor: "white",
    borderRadius: 0,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 20,
    paddingTop: 26,
    paddingHorizontal: 8,
    paddingBottom: 20,
    zIndex: 9999,
  },
  backdropTouchable: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 14,
    color: "black",
  },
});
