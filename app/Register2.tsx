import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { useAuth } from "../context/AuthContext";

const CustomPicker = ({
  selectedValue,
  onValueChange,
  options,
  placeholder,
}: {
  selectedValue: string;
  onValueChange: (val: string) => void;
  options: { label: string; value: string }[];
  placeholder: string;
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (value: string) => {
    onValueChange(value);
    setModalVisible(false);
  };

  const currentLabel =
    options.find((opt) => opt.value === selectedValue)?.label || placeholder;

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setModalVisible(true)}
      >
        <Text
          style={[
            styles.pickerButtonText,
            !selectedValue && { color: "#838282" },
          ]}
        >
          {currentLabel}
        </Text>
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
                      <Ionicons
                        name="checkmark"
                        size={moderateScale(20)}
                        color="#4A75F0"
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

// ... CustomPicker ...

const getErrorMessage = (error: any) => {
  if (error.code === "auth/email-already-in-use") {
    return "This email is already registered.";
  }
  if (error.code === "auth/invalid-email") {
    return "Please enter a valid email address.";
  }
  if (error.code === "auth/weak-password") {
    return "Password should be at least 6 characters.";
  }
  return "Something went wrong. Please try again later.";
};

const Register2 = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  // const insets = { top: 0, bottom: 0 };
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const { saveUserProfile, user } = useAuth();
  const [loading, setLoading] = useState(false);

  const genderTextColor = useMemo(() => {
    return gender ? "#1D1617" : "#ADA4A5";
  }, [gender]);

  const { firstName, lastName, email } = params || {};

  const handleNext = async () => {
    if (!gender || !age || !height || !weight) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (!user || !user.uid) {
      Alert.alert("Error", "User not found. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      await saveUserProfile(user.uid, {
        firstName: firstName as string,
        lastName: lastName as string,
        email: email as string,
        gender,
        age,
        height,
        weight,
      });
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Save Failed", error.message || getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#ffffff", "#f5f7fa"]}
        style={styles.backgroundGradient}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoiding}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top, paddingBottom: insets.bottom + 20 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerContainer}>
            <Text style={styles.subTitle}>Let’s finish up,</Text>
            <Text style={styles.title}>Complete your profile</Text>
            <Text style={styles.subtitle}>
              This helps us personalize your experience.
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="male-female-outline"
                  size={22}
                  color="#4A75F0"
                  style={styles.inputIcon}
                />
                <View style={styles.pickerWrapper}>
                  <CustomPicker
                    selectedValue={gender}
                    onValueChange={setGender}
                    placeholder="Select Gender"
                    options={[
                      { label: "Male", value: "Male" },
                      { label: "Female", value: "Female" },
                      { label: "Other", value: "Other" },
                    ]}
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="calendar-outline"
                  size={22}
                  color="#4A75F0"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Age"
                  placeholderTextColor="#ADA4A5"
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                  returnKeyType="next"
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="resize-outline"
                  size={22}
                  color="#4A75F0"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Height"
                  placeholderTextColor="#ADA4A5"
                  keyboardType="numeric"
                  value={height}
                  onChangeText={setHeight}
                  returnKeyType="next"
                />
                <Text style={styles.unitText}>cm</Text>
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="barbell-outline"
                  size={22}
                  color="#4A75F0"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Weight"
                  placeholderTextColor="#ADA4A5"
                  keyboardType="numeric"
                  value={weight}
                  onChangeText={setWeight}
                  returnKeyType="done"
                />
                <Text style={styles.unitText}>kg</Text>
              </View>
            </View>
          </View>

          <View style={styles.actionContainer}>
            <TouchableOpacity
              onPress={handleNext}
              style={styles.nextBtn}
              activeOpacity={0.4}
            >
              <LinearGradient
                colors={["#4A75F0", "#6C8DF5"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <>
                    <Text style={styles.nextText}>Complete Registration</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backgroundGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: scale(30),
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: verticalScale(30),
  },
  subTitle: {
    fontFamily: "Poppins",
    fontSize: moderateScale(18),
    color: "#1D1617",
    marginBottom: verticalScale(5),
  },
  title: {
    fontFamily: "Poppins",
    fontWeight: "800",
    fontSize: moderateScale(26),
    color: "#1D1617",
    marginBottom: verticalScale(5),
  },
  subtitle: {
    fontFamily: "Poppins",
    fontSize: moderateScale(14),
    color: "#7B6F72",
    textAlign: "center",
    marginBottom: verticalScale(20),
  },
  formContainer: {
    marginBottom: verticalScale(20),
  },
  inputWrapper: {
    marginBottom: verticalScale(15),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: "#DEDEDE",
    paddingHorizontal: scale(15),
    height: verticalScale(55),
  },
  inputIcon: {
    marginRight: scale(10),
  },
  input: {
    flex: 1,
    fontFamily: "Poppins",
    fontSize: moderateScale(14),
    color: "#1D1617",
    height: "100%",
  },
  unitText: {
    fontFamily: "Poppins",
    fontSize: moderateScale(14),
    color: "#7B6F72",
    marginLeft: scale(8),
    fontWeight: "500",
  },
  pickerWrapper: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
  },
  pickerButton: {
    flex: 1,
    justifyContent: "center",
    height: "100%",
  },
  pickerButtonText: {
    fontFamily: "Poppins",
    fontSize: moderateScale(14),
    color: "#1D1617",
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
    fontFamily: "Poppins",
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
    fontFamily: "Poppins",
  },
  modalItemTextSelected: {
    color: "#4A75F0",
    fontWeight: "bold",
  },
  actionContainer: {
    alignItems: "center",
    marginTop: verticalScale(20),
  },
  nextBtn: {
    width: "100%",
    borderRadius: moderateScale(30),
    marginBottom: verticalScale(20),
    shadowColor: "#4A75F0",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  gradient: {
    paddingVertical: verticalScale(16),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: moderateScale(30),
  },
  nextText: {
    color: "#FFFFFF",
    fontSize: moderateScale(18),
    fontWeight: "700",
    fontFamily: "Poppins",
    marginRight: scale(8),
  },
});

export default Register2;
