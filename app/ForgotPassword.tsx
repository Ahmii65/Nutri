import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const ForgotPassword = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      {/* <StatusBar barStyle="dark-content" backgroundColor="#fff" /> */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoiding}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back-outline" size={24} color="#1D1617" />
          </TouchableOpacity>
          <Text style={styles.title}>Recover Your Account</Text>
          <Text style={styles.description}>
            Enter the email address associated with your account and we'll send
            you a link to reset your password.
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#5e5c5cff"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              placeholderTextColor="#5e5c5cff"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <TouchableOpacity
            onPress={handleResetPassword}
            style={styles.resetBtn}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#4A75F0", "#6C8DF5"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradient}
            >
              <Text style={styles.resetText}>Reset Password</Text>
            </LinearGradient>
          </TouchableOpacity>
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
  scrollContent: {
    paddingHorizontal: scale(30),
    paddingBottom: verticalScale(30),
    paddingTop: verticalScale(10),
  },
  backButton: {
    marginBottom: verticalScale(20),
    alignSelf: "flex-start",
  },
  subTitle: {
    fontFamily: "Poppins",
    fontSize: moderateScale(16),
    color: "#1D1617",
    marginBottom: verticalScale(5),
    textAlign: "center",
  },
  title: {
    fontFamily: "Poppins",
    fontWeight: "700",
    fontSize: moderateScale(20),
    lineHeight: verticalScale(30),
    color: "#120a0c",
    textAlign: "center",
    marginBottom: verticalScale(10), // Adjusted margin
  },
  description: {
    fontFamily: "Poppins",
    fontSize: moderateScale(12),
    color: "#7B6F72", // Grayish text for description
    marginBottom: verticalScale(30),
    lineHeight: verticalScale(20),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: moderateScale(14),
    paddingHorizontal: scale(15),
    marginBottom: verticalScale(15),
    height: verticalScale(50),
    borderWidth: 1,
    borderColor: "#E8E8E8",
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
  resetBtn: {
    width: "100%",
    borderRadius: moderateScale(99),
    marginBottom: verticalScale(20),
    shadowColor: "#92a3fd",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 5,
    overflow: "hidden",
  },
  gradient: {
    paddingVertical: verticalScale(15),
    justifyContent: "center",
    alignItems: "center",
  },
  resetText: {
    color: "#FFFFFF",
    fontSize: moderateScale(16),
    fontWeight: "700",
    fontFamily: "Poppins",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: verticalScale(10),
  },
  loginText: {
    fontFamily: "Poppins",
    fontSize: moderateScale(14),
    color: "#1D1617",
  },
  loginLink: {
    fontFamily: "Poppins",
    fontSize: moderateScale(14),
    color: "#378ff4ff",
    fontWeight: "700",
  },
  keyboardAvoiding: {
    flex: 1,
  },
});

export default ForgotPassword;
