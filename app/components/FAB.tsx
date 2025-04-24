import React from "react";
import { TouchableOpacity, Animated, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";

interface FABProps {
  onPress: () => void;
  icon?: string;
  style?: ViewStyle;
}

const FAB: React.FC<FABProps> = ({ onPress, icon = "add", style }) => {
  const scaleValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          bottom: 32,
          right: 32,
          zIndex: 50,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 6,
          transform: [{ scale: scaleValue }],
        },
        style,
      ]}
    >
      <TouchableOpacity
        style={{
          height: 56,
          width: 56,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 28,
          backgroundColor: Colors.primary,
        }}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <Ionicons name={icon as any} size={24} color="white" />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default FAB;
