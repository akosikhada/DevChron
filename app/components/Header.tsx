import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";

interface HeaderProps {
  title: string;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  showBackButton?: boolean;
  onBackPress?: () => void;
  titleIcon?: keyof typeof Ionicons.glyphMap;
}

const Header = ({
  title,
  rightIcon,
  onRightIconPress,
  showBackButton = false,
  onBackPress,
  titleIcon,
}: HeaderProps) => {
  const statusBarHeight = StatusBar.currentHeight || 0;

  // Determine icon based on title if not provided
  const getTitleIcon = (): keyof typeof Ionicons.glyphMap => {
    if (titleIcon) return titleIcon;

    if (title.toLowerCase().includes("task")) return "list";
    if (title.toLowerCase().includes("calendar")) return "calendar";
    if (title.toLowerCase().includes("about")) return "information-circle";

    return "apps"; // Default icon
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: Platform.OS === "android" ? statusBarHeight : 0 },
      ]}
    >
      <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />

      <View style={styles.headerContent}>
        {showBackButton && (
          <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
            <Ionicons name="arrow-back" size={24} color={Colors.primary} />
          </TouchableOpacity>
        )}

        <View style={styles.titleContainer}>
          <Ionicons
            name={getTitleIcon()}
            size={24}
            color={Colors.primary}
            style={styles.titleIcon}
          />
          <Text style={styles.title}>{title}</Text>
        </View>

        {rightIcon ? (
          <TouchableOpacity
            style={styles.rightAction}
            onPress={onRightIconPress}
          >
            <Ionicons name={rightIcon} size={24} color={Colors.primary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.rightPlaceholder} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    position: "absolute",
    left: 0,
    right: 0,
  },
  titleIcon: {
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  rightAction: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  rightPlaceholder: {
    width: 40,
  },
});

export default Header;
