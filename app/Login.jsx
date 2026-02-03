import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
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
import Icon from "react-native-vector-icons/Ionicons";

const Login = () => {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
            <Text style={styles.title}>Welcome Back</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <View style={styles.inputContainer}>
                <Icon
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
                <Icon
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
                  <Icon
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={22}
                    color="#ADA4A5"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() => router.push("/ForgotPassword")}
            >
              <Text style={styles.forgotPassword}>Forgot your password?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionContainer}>
            <TouchableOpacity
              onPress={() => router.replace("/(tabs)")}
              style={styles.loginBtn}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#4A75F0", "#6C8DF5"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
              >
                <Text style={styles.loginBtnText}>Login</Text>
                <Icon
                  name="log-in-outline"
                  size={24}
                  color="#FFF"
                  style={{ marginLeft: 10 }}
                />
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.replace("/Registration")}>
                <Text style={styles.registerLink}>Register</Text>
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
    marginBottom: verticalScale(40),
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
    marginBottom: verticalScale(30),
  },
  inputWrapper: {
    marginBottom: verticalScale(20),
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
  forgotBtn: {
    alignSelf: "center",
  },
  forgotPassword: {
    color: "#ADA4A5",
    fontSize: moderateScale(12),
    fontFamily: "Poppins",
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  actionContainer: {
    alignItems: "center",
  },
  loginBtn: {
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
  loginBtnText: {
    color: "#FFFFFF",
    fontSize: moderateScale(18),
    fontWeight: "700",
    fontFamily: "Poppins",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    fontFamily: "Poppins",
    fontSize: moderateScale(14),
    color: "#1D1617",
  },
  registerLink: {
    fontFamily: "Poppins",
    fontSize: moderateScale(14),
    color: "#4A75F0",
    fontWeight: "700",
  },
});

export default Login;
