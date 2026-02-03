import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
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

import { useAuth } from "@/context/AuthContext";
import { where } from "firebase/firestore";
import { ActivityIndicator } from "react-native";
import useFetch from "../hooks/useFetch";
import { UserService } from "../services/userService";
import {
  CustomPickerProps,
  InputFieldProps,
  ProfileState,
  UserProfile,
} from "../types";

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  multiline = false,
}: InputFieldProps) => (
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

const CustomPicker = ({
  selectedValue,
  onValueChange,
  options,
  placeholder,
}: CustomPickerProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (value: string) => {
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
        <MaterialCommunityIcons
          name="chevron-down"
          size={moderateScale(20)}
          color="#666"
        />
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
                      <MaterialCommunityIcons
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

const EditProfile = () => {
  const { user } = useAuth();
  const router = useRouter();

  // State for profile data
  const [profile, setProfile] = useState<ProfileState>({
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

  const constraints = useMemo(
    () => (user?.uid ? [where("uid", "==", user.uid)] : null),
    [user?.uid],
  );

  const { data: usersData } = useFetch<UserProfile>("users", constraints);

  useEffect(() => {
    if (usersData && usersData.length > 0) {
      const userData = usersData[0];
      let feet = "";
      let inches = "";

      if (userData.height) {
        const heightVal = Number(userData.height);
        const totalInches = heightVal / 2.54;
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
        weight: userData.weight ? userData.weight.toString() : prev.weight,
        gender: userData.gender || prev.gender,
        heightFeet: feet || prev.heightFeet,
        heightInches: inches || prev.heightInches,
        username: userData.username || prev.username,
        bio: userData.bio || prev.bio,
        goals: userData.goals || prev.goals,
      }));
    }
  }, [usersData]);

  const goalOptions = [
    { label: "Gain Weight", icon: "weight-lifter" },
    { label: "Lose Weight", icon: "run-fast" },
    { label: "Gain Muscle", icon: "arm-flex" },
    { label: "Maintain", icon: "scale-balance" },
  ];

  const handleGoalToggle = (selectedGoal: string) => {
    setProfile((prev) => {
      let updatedGoals = [...prev.goals];
      if (updatedGoals.includes(selectedGoal)) {
        updatedGoals = updatedGoals.filter((g) => g !== selectedGoal);
      } else {
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

  const [saving, setSaving] = useState(false);

  const validateAndSave = async () => {
    // ... existing validation ...

    setSaving(true);
    try {
      // ... existing save logic ...
      // ensure we await async calls properly

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

      const totalHeightCm =
        (parseInt(heightFeet) * 12 + parseInt(heightInches)) * 2.54;

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

      if (user?.uid) {
        await UserService.updateUserProfile(user.uid, updatedData);
      }

      Alert.alert("Success", "Your profile has been updated!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={["#4facfe", "#00f2fe"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
            <Text style={styles.editHeaderTitle}>Edit Profile</Text>
            <Text style={styles.editHeaderSubtitle}>
              Customize your personal plan
            </Text>
          </View>
        </LinearGradient>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
                  <MaterialCommunityIcons
                    name={option.icon as any}
                    size={moderateScale(24)}
                    color={
                      profile.goals.includes(option.label) ? "#fff" : "#4facfe"
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
            disabled={saving}
          >
            <LinearGradient
              colors={["#4facfe", "#00f2fe"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Save Profile</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  headerContainer: {
    height: verticalScale(150),
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
    paddingTop: verticalScale(20),
  },
  headerContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: scale(20),
    top: verticalScale(5),
    padding: moderateScale(5),
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
    marginTop: verticalScale(-30),
  },
  scrollContent: {
    paddingBottom: verticalScale(30),
    paddingHorizontal: scale(20),
  },
  formContainer: {
    paddingTop: verticalScale(10),
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
    borderWidth: 1,
    borderColor: "#e1e1e1",
    fontSize: moderateScale(16),
    color: "#2d3436",
  },
  textArea: {
    height: verticalScale(100),
    textAlignVertical: "top",
  },
  pickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: moderateScale(10),
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(14),
    borderWidth: 1,
    borderColor: "#e1e1e1",
  },
  pickerButtonText: {
    fontSize: moderateScale(15),
    color: "#2d3436",
  },
  pickerContainer: {
    marginTop: verticalScale(5),
  },
  row: {
    flexDirection: "row",
    marginBottom: verticalScale(15),
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  optionCard: {
    width: "48%",
    backgroundColor: "#f8f9fa",
    borderRadius: moderateScale(15),
    padding: moderateScale(15),
    alignItems: "center",
    marginBottom: verticalScale(15),
    borderWidth: 1,
    borderColor: "#e1e1e1",
  },
  optionCardSelected: {
    backgroundColor: "#4facfe",
    borderColor: "#4facfe",
  },
  optionText: {
    marginTop: verticalScale(10),
    fontSize: moderateScale(14),
    color: "#636e72",
    fontWeight: "600",
  },
  optionTextSelected: {
    color: "#fff",
  },
  actionButton: {
    borderRadius: moderateScale(25),
    overflow: "hidden",
    marginTop: verticalScale(10),
    marginBottom: verticalScale(40),
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: verticalScale(15),
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: moderateScale(18),
    fontWeight: "bold",
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: moderateScale(20),
    padding: moderateScale(20),
    maxHeight: "60%",
  },
  modalTitle: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    marginBottom: verticalScale(15),
    textAlign: "center",
    color: "#2d3436",
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
    backgroundColor: "#f8f9fa",
  },
  modalItemText: {
    fontSize: moderateScale(16),
    color: "#636e72",
  },
  modalItemTextSelected: {
    color: "#4facfe",
    fontWeight: "bold",
  },
});
