import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";

interface HomeStatusCardProps {
  title: string;
  value?: string | number;
  label?: string;
  icon: any;
  iconColor: string;
  gradientColors: [string, string];
  onPress: () => void;
}

const HomeStatusCard = ({
  title,
  value,
  label,
  icon,
  iconColor,
  gradientColors,
  onPress,
}: HomeStatusCardProps) => {
  return (
    <TouchableOpacity
      style={styles.statusCard}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statusGradient}
      >
        <View style={styles.iconCircle}>
          <Ionicons name={icon} size={moderateScale(24)} color={iconColor} />
        </View>
        <Text style={styles.statusTitleLight}>{title}</Text>
        {value !== undefined && (
          <Text style={styles.statusValueLight}>{value}</Text>
        )}
        {label && <Text style={styles.statusLabelLight}>{label}</Text>}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  statusCard: {
    width: "31%",
    height: verticalScale(130),
    borderRadius: moderateScale(20),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  statusGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: moderateScale(10),
  },
  iconCircle: {
    width: moderateScale(45),
    height: moderateScale(45),
    borderRadius: moderateScale(22.5),
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(10),
    elevation: 2,
  },
  statusTitleLight: {
    fontSize: moderateScale(13),
    fontWeight: "700",
    color: "#fff",
    marginBottom: verticalScale(2),
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statusValueLight: {
    fontSize: moderateScale(15),
    fontWeight: "800",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statusLabelLight: {
    fontSize: moderateScale(11),
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
  },
});

export default HomeStatusCard;
