import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

import { useAuth } from "@/context/AuthContext";
import { where } from "firebase/firestore";
import useFetch from "../../hooks/useFetch";
import { UserProfile } from "../../types";

const { width } = Dimensions.get("window");

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const queryConstraints = useMemo(() => {
    return user?.uid ? [where("uid", "==", user.uid)] : null;
  }, [user?.uid]);

  const {
    data: usersData,
    loading,
    error,
  } = useFetch<UserProfile>("users", queryConstraints);

  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (usersData && usersData.length > 0) {
      setProfile(usersData[0]);
    }
  }, [usersData]);

  const formattedHeight = useMemo(() => {
    if (!profile?.height) return "--";
    const hNum = Number(profile.height);
    const totalInches = hNum / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}'${inches}"`;
  }, [profile?.height]);

  return (
    <View style={styles.container}>
      {/* Decorative Background Elements */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.screenTitle}>Profile</Text>
          </View>

          <View style={styles.profileCard}>
            <LinearGradient
              colors={["#ffffff", "#f8f9fa"]} // Subtle card gradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.profileCardGradient}
            >
              <View style={styles.avatarRow}>
                <View style={styles.avatarContainer}>
                  <LinearGradient
                    colors={["#667eea", "#764ba2"]}
                    style={styles.avatarGradient}
                  >
                    <Text style={styles.avatarText}>
                      {profile?.firstName
                        ? profile.firstName.charAt(0).toUpperCase()
                        : "U"}
                    </Text>
                  </LinearGradient>
                  <View style={styles.onlineBadge} />
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>
                    {profile?.firstName} {profile?.lastName}
                  </Text>
                  <Text style={styles.userHandle}>
                    @{profile?.username || "user"}
                  </Text>
                  {profile?.bio ? (
                    <View style={styles.bioContainer}>
                      <Text style={styles.userBio}>{profile.bio}</Text>
                    </View>
                  ) : null}
                </View>
              </View>

              {/* Profile Action - Quick Edit */}
              <TouchableOpacity
                style={styles.editIconBtn}
                onPress={() => router.push("/EditProfile")}
              >
                <MaterialCommunityIcons name="pencil" size={16} color="#fff" />
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
        {/* Stats Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Body</Text>
        </View>
        <View style={styles.statsGrid}>
          <StatTile
            label="Height"
            value={formattedHeight}
            icon="human-male-height"
            color="#667eea"
            bg="#eef2ff"
          />
          <StatTile
            label="Weight"
            value={`${profile?.weight || "--"}`}
            unit="kg"
            icon="weight-kilogram"
            color="#00b894"
            bg="#e3fcf7"
          />
          <StatTile
            label="Age"
            value={`${profile?.age || "--"}`}
            unit="yrs"
            icon="cake-variant"
            color="#fd79a8"
            bg="#fff0f6"
          />
          <StatTile
            label="Gender"
            value={profile?.gender || "--"}
            icon="gender-male-female"
            color="#e17055"
            bg="#ffece6"
          />
        </View>
        {/* Goals Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Goals</Text>
        </View>
        <View style={styles.goalsList}>
          {profile?.goals && profile.goals.length > 0 ? (
            profile.goals.map((goal, index) => (
              <View key={index} style={styles.goalRow}>
                <LinearGradient
                  colors={["#667eea", "#764ba2"]}
                  style={styles.goalIcon}
                >
                  <MaterialCommunityIcons
                    name="target"
                    size={16}
                    color="#fff"
                  />
                </LinearGradient>
                <Text style={styles.goalText}>{goal}</Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={20}
                  color="#dfe6e9"
                />
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No active goals.</Text>
          )}
        </View>
        {/* Menu Actions */}
        <View style={styles.menuContainer}>
          <MenuItem
            icon="account-edit-outline"
            label="Edit Profile Details"
            onPress={() => router.push("/EditProfile")}
            color="#6c5ce7"
          />
          <MenuItem
            icon="logout"
            label="Log Out"
            onPress={() => {
              Alert.alert("Log Out", "Are you sure you want to log out?", [
                { text: "Cancel", style: "cancel" },
                { text: "Log Out", style: "destructive", onPress: logout },
              ]);
            }}
            color="#ff7675"
            isDestructive
          />
        </View>
      </ScrollView>
    </View>
  );
};

// --- Sub Components ---

const StatTile = ({ label, value, unit, icon, color, bg }: any) => (
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

const MenuItem = ({ icon, label, onPress, color, isDestructive }: any) => (
  <TouchableOpacity
    style={styles.menuItem}
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

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // Background Decorations
  bgCircle1: {
    position: "absolute",
    top: -100,
    right: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(102, 126, 234, 0.05)",
  },
  bgCircle2: {
    position: "absolute",
    top: 100,
    left: -100,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(118, 75, 162, 0.05)",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: verticalScale(40),
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(50),
  },
  header: {
    marginBottom: verticalScale(25),
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(15),
  },
  screenTitle: {
    fontSize: moderateScale(28),
    fontWeight: "800",
    color: "#2d3436",
    letterSpacing: -0.5,
  },
  profileCard: {
    borderRadius: moderateScale(24),
    shadowColor: "#6c5ce7",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    backgroundColor: "#fff",
  },
  profileCardGradient: {
    padding: moderateScale(20),
    borderRadius: moderateScale(24),
    position: "relative",
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
  },
  avatarGradient: {
    width: moderateScale(70),
    height: moderateScale(70),
    borderRadius: moderateScale(25),
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: moderateScale(28),
    fontWeight: "bold",
  },
  onlineBadge: {
    width: 14,
    height: 14,
    backgroundColor: "#00b894",
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#fff",
    position: "absolute",
    bottom: -2,
    right: -2,
  },
  userInfo: {
    marginLeft: scale(15),
    flex: 1,
  },
  userName: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    color: "#2d3436",
  },
  userHandle: {
    fontSize: moderateScale(14),
    color: "#636e72",
    marginTop: verticalScale(2),
    fontWeight: "500",
  },
  bioContainer: {
    marginTop: verticalScale(8),
    paddingTop: verticalScale(8),
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  userBio: {
    fontSize: moderateScale(13),
    color: "#4a4a4a",
    lineHeight: verticalScale(18),
  },
  editIconBtn: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "#6c5ce7",
    padding: 6,
    borderRadius: 12,
  },
  sectionHeader: {
    marginBottom: verticalScale(12),
    marginTop: verticalScale(10),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: "700",
    color: "#2d3436",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: verticalScale(20),
  },
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
  goalsList: {
    marginBottom: verticalScale(25),
  },
  goalRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: moderateScale(15),
    borderRadius: moderateScale(16),
    marginBottom: verticalScale(10),
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  goalIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(12),
  },
  goalText: {
    flex: 1,
    fontSize: moderateScale(15),
    color: "#2d3436",
    fontWeight: "500",
  },
  emptyText: {
    color: "#b2bec3",
    fontStyle: "italic",
  },
  menuContainer: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(24),
    padding: moderateScale(10),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
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
