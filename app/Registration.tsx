import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
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
import { useAuth } from "../context/AuthContext";

const Registration = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [fName, setFName] = useState("");
  const [sName, setSName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fName || !sName || !email || !password || !cPassword) {
      alert("Please fill all fields");
      return;
    }
    if (password !== cPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    setLoading(true);
    try {
      // Navigate to next step to complete profile (pass password too)
      router.push({
        pathname: "/Register2",
        params: { firstName: fName, lastName: sName, email, password },
      });
    } catch (error: any) {
      alert(error.message || "Navigation failed");
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
            <Text style={styles.subTitle}>Hey there,</Text>
            <Text style={styles.title}>Create an Account</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={22}
                  color="#4A75F0"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  placeholderTextColor="#ADA4A5"
                  value={fName}
                  onChangeText={setFName}
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={22}
                  color="#4A75F0"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  placeholderTextColor="#ADA4A5"
                  value={sName}
                  onChangeText={setSName}
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={22}
                  color="#4A75F0"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  keyboardType="email-address"
                  placeholderTextColor="#ADA4A5"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={22}
                  color="#4A75F0"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#ADA4A5"
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={22}
                    color="#ADA4A5"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={22}
                  color="#4A75F0"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  secureTextEntry={!showCPassword}
                  placeholderTextColor="#ADA4A5"
                  value={cPassword}
                  onChangeText={setCPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowCPassword(!showCPassword)}
                >
                  <Ionicons
                    name={showCPassword ? "eye-outline" : "eye-off-outline"}
                    size={22}
                    color="#ADA4A5"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.actionContainer}>
            <TouchableOpacity
              onPress={handleRegister}
              style={styles.registerBtn}
              activeOpacity={0.8}
              disabled={loading}
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
                    <Text style={styles.registerText}>Register</Text>
                    <Ionicons
                      name="arrow-forward-outline"
                      size={24}
                      color="#FFF"
                      style={{ marginLeft: 10 }}
                    />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.replace("/Login")}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
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
  actionContainer: {
    alignItems: "center",
    marginTop: verticalScale(10),
  },
  registerBtn: {
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
    flexDirection: "row",
    paddingVertical: verticalScale(16),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: moderateScale(30),
  },
  registerText: {
    color: "#FFFFFF",
    fontSize: moderateScale(18),
    fontWeight: "700",
    fontFamily: "Poppins",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontFamily: "Poppins",
    fontSize: moderateScale(14),
    color: "#1D1617",
  },
  loginLink: {
    fontFamily: "Poppins",
    fontSize: moderateScale(14),
    color: "#4A75F0",
    fontWeight: "700",
  },
});

export default Registration;
