import { StatTileProps } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const StatTile = ({ label, value, unit, icon, color, bg }: StatTileProps) => (
  <View style={[styles.statTile, { backgroundColor: bg }]}>
    <View style={[styles.statIconContainer, { backgroundColor: "#fff" }]}>
      <MaterialCommunityIcons name={icon} size={20} color={color} />
    </View>
    <View>
      <Text style={[styles.statValue, { color: color }]}>
        {value}
        <Text style={styles.statUnit}>{unit && ` ${unit}`}</Text>
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  statTile: {
    width: "48%",
    padding: moderateScale(15),
    borderRadius: moderateScale(20),
    marginBottom: verticalScale(12),
    flexDirection: "row",
    alignItems: "center",
  },
  statIconContainer: {
    padding: 8,
    borderRadius: 12,
    marginRight: scale(10),
  },
  statValue: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
  },
  statUnit: {
    fontSize: moderateScale(12),
    fontWeight: "normal",
    opacity: 0.6,
  },
  statLabel: {
    fontSize: moderateScale(12),
    color: "#636e72",
    marginTop: 2,
  },
});

export default StatTile;
