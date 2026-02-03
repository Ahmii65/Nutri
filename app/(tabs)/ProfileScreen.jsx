import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Using vector icons for premium feel
const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  multiline = false,
}) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={[styles.input, multiline && styles.textArea]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#999"
      keyboardType={keyboardType}
      multiline={multiline}
    />
  </View>
);
const StatCard = ({ label, value, unit, icon }) => (
  <View style={styles.statCard}>
    <LinearGradient
      colors={["#ffffff", "#f8f9fa"]}
      style={styles.statCardGradient}
    >
      <Icon name={icon} size={moderateScale(24)} color="#4facfe" />
      <Text style={styles.statValue}>
        {value} <Text style={styles.statUnit}>{unit}</Text>
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </LinearGradient>
  </View>
);
const CustomPicker = ({
  selectedValue,
  onValueChange,
  options,
  placeholder,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (value) => {
    onValueChange(value);
    setModalVisible(false);
  };

  const currentLabel =
    options.find((opt) => opt.value === selectedValue)?.label || placeholder;

  return (
    <View>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setModalVisible(true)}
      >
        <Text
          style={[styles.pickerButtonText, !selectedValue && { color: "#999" }]}
        >
          {currentLabel}
        </Text>
        <Icon name="chevron-down" size={moderateScale(20)} color="#666" />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{placeholder}</Text>
              <FlatList
                data={options}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.modalItem,
                      selectedValue === item.value && styles.modalItemSelected,
                    ]}
                    onPress={() => handleSelect(item.value)}
                  >
                    <Text
                      style={[
                        styles.modalItemText,
                        selectedValue === item.value &&
                          styles.modalItemTextSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                    {selectedValue === item.value && (
                      <Icon
                        name="check"
                        size={moderateScale(20)}
                        color="#4facfe"
                      />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const ProfileScreen = () => {
  const [viewMode, setViewMode] = useState(false); // false = Edit mode, true = View mode

  // State for profile data
  const [profile, setProfile] = useState({
    fullName: "",
    username: "",
    bio: "",
    heightFeet: "",
    heightInches: "",
    weight: "",
    age: "",
    gender: "",
    goals: [],
  });

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        try {
          const profileStr = await AsyncStorage.getItem("user_profile");
          if (profileStr) {
            const userData = JSON.parse(profileStr);
            let feet = "";
            let inches = "";

            if (userData.height) {
              // Assuming height is saved in cm from Registration2
              const totalInches = userData.height / 2.54;
              feet = Math.floor(totalInches / 12).toString();
              inches = Math.round(totalInches % 12).toString();
            }

            setProfile((prev) => ({
              ...prev,
              fullName:
                userData.firstName && userData.lastName
                  ? `${userData.firstName} ${userData.lastName}`
                  : userData.firstName || prev.fullName,
              age: userData.age ? userData.age.toString() : prev.age,
              weight: userData.weight
                ? userData.weight.toString()
                : prev.weight,
              gender: userData.gender || prev.gender,
              // Only overwrite if new data exists, otherwise keep existing/user-edited
              heightFeet: feet || prev.heightFeet,
              heightInches: inches || prev.heightInches,
              username: userData.username || prev.username,
              bio: userData.bio || prev.bio,
              goals: userData.goals || prev.goals,
            }));
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      };

      fetchUserData();
    }, []),
  );

  const goalOptions = [
    { label: "Gain Weight", icon: "weight-lifter" },
    { label: "Lose Weight", icon: "run-fast" },
    { label: "Gain Muscle", icon: "arm-flex" },
    { label: "Maintain", icon: "scale-balance" },
  ];
  const handleGoalToggle = (selectedGoal) => {
    setProfile((prev) => {
      let updatedGoals = [...prev.goals];
      if (updatedGoals.includes(selectedGoal)) {
        updatedGoals = updatedGoals.filter((g) => g !== selectedGoal);
      } else {
        // Validation logic for conflicting goals
        if (selectedGoal === "Gain Weight") {
          updatedGoals = updatedGoals.filter((g) => g !== "Lose Weight");
        }
        if (selectedGoal === "Lose Weight") {
          updatedGoals = updatedGoals.filter((g) => g !== "Gain Weight");
        }
        updatedGoals.push(selectedGoal);
      }
      return { ...prev, goals: updatedGoals };
    });
  };
  const validateAndSave = async () => {
    const {
      fullName,
      username,
      bio,
      heightFeet,
      heightInches,
      weight,
      age,
      gender,
      goals,
    } = profile;
    if (
      !fullName ||
      !username ||
      !bio ||
      !heightFeet ||
      !heightInches ||
      !weight ||
      !age ||
      !gender ||
      goals.length === 0
    ) {
      Alert.alert(
        "Incomplete Profile",
        "Please fill in all fields and select at least one goal.",
      );
      return;
    }

    try {
      // Calculate total height in cm for consistency
      const totalHeightCm =
        (parseInt(heightFeet) * 12 + parseInt(heightInches)) * 2.54;

      // Split name for legacy support
      const nameParts = fullName.split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

      const updatedData = {
        firstName,
        lastName,
        username,
        bio,
        height: totalHeightCm,
        weight: parseFloat(weight),
        age: parseInt(age),
        gender,
        goals,
      };

      // Merge with existing profile
      const existingProfileStr = await AsyncStorage.getItem("user_profile");
      const existingProfile = existingProfileStr
        ? JSON.parse(existingProfileStr)
        : {};

      const finalProfile = { ...existingProfile, ...updatedData };

      await AsyncStorage.setItem("user_profile", JSON.stringify(finalProfile));
      await AsyncStorage.setItem("user_name", firstName); // Update simple name for dashboard

      Alert.alert("Success", "Your profile has been updated!");
      setViewMode(true);
    } catch (e) {
      Alert.alert("Error", "Failed to save profile locally.");
    }
  };
  return (
    <View style={styles.container}>
      {/* <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      /> */}

      {/* Premium Header Background */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={["#4facfe", "#00f2fe"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          {viewMode ? (
            <View style={styles.headerContent}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>
                  {profile.fullName
                    ? profile.fullName.charAt(0).toUpperCase()
                    : "U"}
                </Text>
              </View>
              <Text style={styles.headerName}>
                {profile.fullName || "User Name"}
              </Text>
              <Text style={styles.headerUsername}>
                @{profile.username || "username"}
              </Text>
            </View>
          ) : (
            <View style={styles.headerContent}>
              <Text style={styles.editHeaderTitle}>Edit Profile</Text>
              <Text style={styles.editHeaderSubtitle}>
                Customize your personal plan
              </Text>
            </View>
          )}
        </LinearGradient>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {viewMode ? (
          // VIEW MODE
          <View style={styles.contentSection}>
            <View style={styles.bioContainer}>
              <Text style={styles.sectionTitle}>About Me</Text>
              <Text style={styles.bioText}>{profile.bio}</Text>
            </View>

            <Text style={styles.sectionTitle}>Key Stats</Text>
            <View style={styles.statsRow}>
              <StatCard
                label="Height"
                value={`${profile.heightFeet}'${profile.heightInches}"`}
                unit=""
                icon="human-male-height"
              />
              <StatCard
                label="Weight"
                value={profile.weight}
                unit="kg"
                icon="weight-kilogram"
              />
              <StatCard
                label="Age"
                value={profile.age}
                unit="yrs"
                icon="calendar-account"
              />
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoBadge}>
                <Icon
                  name="gender-male-female"
                  size={moderateScale(16)}
                  color="#666"
                />
                <Text style={styles.infoBadgeText}>{profile.gender}</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Current Goals</Text>
            <View style={styles.goalsContainer}>
              {profile.goals.map((goal, index) => (
                <View key={index} style={styles.goalChip}>
                  <Icon
                    name="check-circle"
                    size={moderateScale(16)}
                    color="#fff"
                  />
                  <Text style={styles.goalChipText}>{goal}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setViewMode(false)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#4facfe", "#00f2fe"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Edit Profile</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          // EDIT MODE
          <View style={styles.formContainer}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Personal Details</Text>
              <InputField
                label="Full Name"
                placeholder="e.g. John Doe"
                value={profile.fullName}
                onChangeText={(t) => setProfile({ ...profile, fullName: t })}
              />
              <InputField
                label="Username"
                placeholder="e.g. johndoe123"
                value={profile.username}
                onChangeText={(t) => setProfile({ ...profile, username: t })}
              />
              <InputField
                label="Bio"
                placeholder="Tell us a bit about yourself..."
                value={profile.bio}
                onChangeText={(t) => setProfile({ ...profile, bio: t })}
                multiline
              />
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Body Stats</Text>
              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: scale(10) }}>
                  <InputField
                    label="Height (Ft)"
                    placeholder="5"
                    value={profile.heightFeet}
                    onChangeText={(t) =>
                      setProfile({ ...profile, heightFeet: t })
                    }
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <InputField
                    label="Height (In)"
                    placeholder="10"
                    value={profile.heightInches}
                    onChangeText={(t) =>
                      setProfile({ ...profile, heightInches: t })
                    }
                    keyboardType="numeric"
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: scale(10) }}>
                  <InputField
                    label="Weight (kg)"
                    placeholder="70"
                    value={profile.weight}
                    onChangeText={(t) => setProfile({ ...profile, weight: t })}
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <InputField
                    label="Age"
                    placeholder="25"
                    value={profile.age}
                    onChangeText={(t) => setProfile({ ...profile, age: t })}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>Gender</Text>
              <View style={styles.pickerContainer}>
                <CustomPicker
                  selectedValue={profile.gender}
                  onValueChange={(itemValue) =>
                    setProfile({ ...profile, gender: itemValue })
                  }
                  placeholder="Select Gender"
                  options={[
                    { label: "Male", value: "Male" },
                    { label: "Female", value: "Female" },
                    { label: "Other", value: "Other" },
                  ]}
                />
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Fitness Goals</Text>
              <View style={styles.optionsGrid}>
                {goalOptions.map((option) => (
                  <TouchableOpacity
                    key={option.label}
                    style={[
                      styles.optionCard,
                      profile.goals.includes(option.label) &&
                        styles.optionCardSelected,
                    ]}
                    onPress={() => handleGoalToggle(option.label)}
                    activeOpacity={0.7}
                  >
                    <Icon
                      name={option.icon}
                      size={moderateScale(24)}
                      color={
                        profile.goals.includes(option.label)
                          ? "#fff"
                          : "#4facfe"
                      }
                    />
                    <Text
                      style={[
                        styles.optionText,
                        profile.goals.includes(option.label) &&
                          styles.optionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={validateAndSave}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#4facfe", "#00f2fe"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Save Profile</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  headerContainer: {
    height: verticalScale(200),
    borderBottomLeftRadius: moderateScale(30),
    borderBottomRightRadius: moderateScale(30),
    overflow: "hidden",
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  headerGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: verticalScale(20),
  },
  headerContent: {
    alignItems: "center",
  },
  avatarContainer: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(10),
    borderWidth: 2,
    borderColor: "#fff",
  },
  avatarText: {
    fontSize: moderateScale(32),
    color: "#fff",
    fontWeight: "bold",
  },
  headerName: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    color: "#fff",
    marginBottom: verticalScale(2),
  },
  headerUsername: {
    fontSize: moderateScale(14),
    color: "rgba(255,255,255,0.9)",
  },
  editHeaderTitle: {
    fontSize: moderateScale(28),
    fontWeight: "bold",
    color: "#fff",
    marginBottom: verticalScale(5),
  },
  editHeaderSubtitle: {
    fontSize: moderateScale(16),
    color: "rgba(255,255,255,0.9)",
  },
  scrollContainer: {
    flex: 1,
    marginTop: verticalScale(-40), // Overlap with header
  },
  scrollContent: {
    paddingBottom: verticalScale(30),
    paddingHorizontal: scale(20),
  },
  contentSection: {
    marginTop: verticalScale(10),
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(20),
    padding: moderateScale(20),
    marginBottom: verticalScale(20),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#2d3436",
    marginBottom: verticalScale(15),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: "700",
    color: "#2d3436",
    marginBottom: verticalScale(10),
    marginTop: verticalScale(10),
    marginLeft: scale(5),
  },
  // View Mode Styles
  bioContainer: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(15),
    padding: moderateScale(20),
    marginBottom: verticalScale(15),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  bioText: {
    fontSize: moderateScale(14),
    color: "#636e72",
    lineHeight: verticalScale(20),
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(20),
  },
  statCard: {
    width: "31%",
    aspectRatio: 1,
    borderRadius: moderateScale(15),
    overflow: "hidden",
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  statCardGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: moderateScale(5),
  },
  statValue: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    color: "#2d3436",
    marginTop: verticalScale(5),
  },
  statUnit: {
    fontSize: moderateScale(12),
    color: "#b2bec3",
    fontWeight: "normal",
  },
  statLabel: {
    fontSize: moderateScale(12),
    color: "#636e72",
    marginTop: verticalScale(2),
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: verticalScale(20),
    justifyContent: "center",
  },
  infoBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
    shadowColor: "#000",
    shadowOpacity: 0.05,
    elevation: 2,
  },
  infoBadgeText: {
    marginLeft: scale(5),
    color: "#2d3436",
    fontSize: moderateScale(14),
    fontWeight: "600",
  },
  goalsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: verticalScale(30),
  },
  goalChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4facfe",
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
    marginRight: scale(10),
    marginBottom: verticalScale(10),
    shadowColor: "#4facfe",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  goalChipText: {
    color: "#fff",
    marginLeft: scale(5),
    fontWeight: "600",
    fontSize: moderateScale(13),
  },
  // Form Styles
  formContainer: {
    paddingTop: verticalScale(10),
  },
  inputContainer: {
    marginBottom: verticalScale(15),
  },
  inputLabel: {
    fontSize: moderateScale(14),
    color: "#636e72",
    marginBottom: verticalScale(8),
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderRadius: moderateScale(10),
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(12),
    fontSize: moderateScale(15),
    color: "#2d3436",
    borderWidth: 1,
    borderColor: "#e1e1e1",
  },
  textArea: {
    height: verticalScale(60),
    textAlignVertical: "top",
  },
  pickerContainer: {
    // backgroundColor: "#f8f9fa",
    // borderRadius: moderateScale(10),
    // borderWidth: 1,
    // borderColor: "#e1e1e1",
    // overflow: "hidden",
    marginBottom: verticalScale(15),
  },
  pickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: moderateScale(10),
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(14), // Match input height
    borderWidth: 1,
    borderColor: "#e1e1e1",
  },
  pickerButtonText: {
    fontSize: moderateScale(15),
    color: "#2d3436",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: scale(20),
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: moderateScale(20),
    padding: moderateScale(20),
    maxHeight: "50%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    marginBottom: verticalScale(15),
    color: "#2d3436",
    textAlign: "center",
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: verticalScale(15),
    borderBottomWidth: 1,
    borderBottomColor: "#f1f2f6",
  },
  modalItemSelected: {
    backgroundColor: "#f0fbff",
    paddingHorizontal: scale(10),
    borderRadius: moderateScale(10),
    borderBottomWidth: 0,
  },
  modalItemText: {
    fontSize: moderateScale(16),
    color: "#636e72",
  },
  modalItemTextSelected: {
    color: "#4facfe",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  optionCard: {
    width: "48%",
    backgroundColor: "#f8f9fa",
    borderRadius: moderateScale(12),
    padding: moderateScale(15),
    alignItems: "center",
    marginBottom: verticalScale(15),
    borderWidth: 2,
    borderColor: "transparent",
  },
  optionCardSelected: {
    backgroundColor: "#4facfe",
    borderColor: "#4facfe",
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  optionText: {
    marginTop: verticalScale(8),
    color: "#4facfe",
    fontWeight: "600",
    fontSize: moderateScale(13),
  },
  optionTextSelected: {
    color: "#fff",
  },
  actionButton: {
    borderRadius: moderateScale(25),
    overflow: "hidden",
    marginTop: verticalScale(10),
    marginBottom: verticalScale(60),
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: verticalScale(15),
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: moderateScale(18),
    fontWeight: "bold",
  },
});

export default ProfileScreen;
