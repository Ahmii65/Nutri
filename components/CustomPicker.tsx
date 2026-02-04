import { CustomPickerProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

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
        <Ionicons
          name="chevron-down"
          size={moderateScale(20)}
          color="#838282"
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

const styles = StyleSheet.create({
  pickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
    borderRadius: moderateScale(10), // Added for consistency with other inputs if needed
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
});

export default CustomPicker;
