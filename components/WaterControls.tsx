import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

interface WaterControlsProps {
  onAdd: () => void;
  onRemove: () => void;
  customGoal: string;
  setCustomGoal: (val: string) => void;
  onSetNewGoal: () => void;
  onReset: () => void;
}

const WaterControls = ({
  onAdd,
  onRemove,
  customGoal,
  setCustomGoal,
  onSetNewGoal,
  onReset,
}: WaterControlsProps) => {
  return (
    <View>
      {/* Controls */}
      <View style={styles.controlsCard}>
        <Text style={styles.sectionTitle}>Quick Adds</Text>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtnSmall} onPress={onRemove}>
            <Ionicons name="remove" size={moderateScale(24)} color="#ff6b6b" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addGlassBtn}
            onPress={onAdd}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#4facfe", "#00f2fe"]}
              style={styles.addGlassGradient}
            >
              <Ionicons name="water" size={moderateScale(30)} color="#fff" />
              <Text style={styles.addGlassText}>+250ml</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtnSmall} onPress={onAdd}>
            <Ionicons name="add" size={moderateScale(24)} color="#4facfe" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Settings / Goals */}
      <View style={styles.settingsCard}>
        <Text style={styles.sectionTitle}>Daily Goal</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="8"
            placeholderTextColor="#ccc"
            keyboardType="numeric"
            value={customGoal}
            onChangeText={setCustomGoal}
          />
          <TouchableOpacity style={styles.updateBtn} onPress={onSetNewGoal}>
            <Text style={styles.btnText}>Set Goal</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.resetBtn} onPress={onReset}>
          <Text style={styles.resetText}>Reset Daily Intake</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  controlsCard: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(20),
    padding: moderateScale(20),
    marginBottom: verticalScale(20),
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: "#2d3436",
    marginBottom: verticalScale(15),
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionBtnSmall: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(15),
    backgroundColor: "#f1f2f6",
    justifyContent: "center",
    alignItems: "center",
  },
  addGlassBtn: {
    flex: 1,
    marginHorizontal: scale(15),
    height: verticalScale(60),
    borderRadius: moderateScale(20),
    // overflow: 'hidden',
  },
  addGlassGradient: {
    flex: 1,
    borderRadius: moderateScale(20),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  addGlassText: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#fff",
    marginLeft: scale(8),
  },
  settingsCard: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(20),
    padding: moderateScale(20),
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: verticalScale(15),
  },
  input: {
    flex: 1,
    backgroundColor: "#f1f2f6",
    borderRadius: moderateScale(12),
    paddingHorizontal: scale(15),
    fontSize: moderateScale(16),
    marginRight: scale(10),
    color: "#2d3436",
  },
  updateBtn: {
    backgroundColor: "#4facfe",
    borderRadius: moderateScale(12),
    paddingHorizontal: scale(20),
    justifyContent: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: moderateScale(14),
  },
  resetBtn: {
    padding: moderateScale(10),
    alignItems: "center",
  },
  resetText: {
    color: "#ff6b6b",
    fontSize: moderateScale(14),
    fontWeight: "600",
  },
});

export default WaterControls;
