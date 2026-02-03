import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { NotificationItem } from "../types";

const NotificationScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [notifications] = useState<NotificationItem[]>([
    {
      id: 1,
      title: "Congratulations, You have finished Workout",
      date: "29 May",
      color: "#92a3fd",
    },
    // ... rest of items
    {
      id: 12,
      title: "Hey, it’s time for lunch",
      date: "8 April",
      color: "#C58BF2",
    },
  ]);

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <View style={styles.notificationCard}>
      <View style={[styles.iconCircle, { backgroundColor: item.color + "20" }]}>
        <Ionicons
          name="notifications"
          size={moderateScale(20)}
          color={item.color}
        />
      </View>

      <View style={styles.textSection}>
        <Text style={styles.notificationTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.notificationDate}>{item.date}</Text>
      </View>

      <TouchableOpacity activeOpacity={0.6}>
        <Ionicons
          name="ellipsis-vertical"
          size={moderateScale(20)}
          color="#ADA4A5"
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* <StatusBar barStyle="dark-content" backgroundColor="#FFF" /> */}

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons
            name="chevron-back"
            size={moderateScale(20)}
            color="#1D1617"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Notifications</Text>

        <TouchableOpacity style={styles.headerButton} activeOpacity={0.7}>
          <Ionicons
            name="ellipsis-horizontal"
            size={moderateScale(20)}
            color="#1D1617"
          />
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(15),
    backgroundColor: "#FFF",
  },
  headerButton: {
    backgroundColor: "#F7F8F8",
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(8),
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: moderateScale(16),
    color: "#1D1617",
  },
  listContent: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(20),
  },
  notificationCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(12),
  },
  iconCircle: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    alignItems: "center",
    justifyContent: "center",
  },
  textSection: {
    flex: 1,
    marginLeft: scale(15),
    marginRight: scale(10),
  },
  notificationTitle: {
    fontFamily: "Poppins-Medium",
    fontSize: moderateScale(14),
    color: "#1D1617",
    marginBottom: verticalScale(4),
  },
  notificationDate: {
    fontFamily: "Poppins-Regular",
    fontSize: moderateScale(10),
    color: "#7B6F72",
  },
  separator: {
    height: 1,
    backgroundColor: "#DDDADA",
    marginVertical: verticalScale(5),
    opacity: 0.5,
  },
});

export default NotificationScreen;
