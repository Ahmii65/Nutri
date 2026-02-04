import { MenuItemProps } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const MenuItem = ({
  icon,
  label,
  onPress,
  color,
  isDestructive,
  hideBorder,
}: MenuItemProps) => (
  <TouchableOpacity
    style={[styles.menuItem, hideBorder && { borderBottomWidth: 0 }]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.menuIconBox, { backgroundColor: `${color}15` }]}>
      <MaterialCommunityIcons name={icon} size={22} color={color} />
    </View>
    <Text style={[styles.menuLabel, isDestructive && { color: color }]}>
      {label}
    </Text>
    <MaterialCommunityIcons name="chevron-right" size={20} color="#b2bec3" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(15),
    paddingHorizontal: scale(10),
    borderBottomWidth: 1,
    borderBottomColor: "#f5f6fa",
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(15),
  },
  menuLabel: {
    flex: 1,
    fontSize: moderateScale(16),
    fontWeight: "600",
    color: "#2d3436",
  },
});

export default MenuItem;
