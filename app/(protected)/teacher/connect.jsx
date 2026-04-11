import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AddStudentForm from "../../../components/Teacher/ConnectStudentScreen/AddStudentForm";
import StudentDetails from "../../../components/Teacher/ConnectStudentScreen/StudentDetails";
import TuitionDetails from "../../../components/Teacher/ConnectStudentScreen/TuitionDetails";
import { useSelector } from "react-redux";

const METHODS = [
  {
    key: "id",
    title: "Student ID",
    description: "Enter 6-digit student ID",
    iconType: "ion",
    icon: "link-outline",
  },
  {
    key: "qr",
    title: "QR Code",
    description: "Scan student QR code",
    iconType: "mci",
    icon: "qrcode-scan",
  },
];

const ConnectScreen = () => {
  const [studentDigits, setStudentDigits] = useState("");
  const { studentDetails } = useSelector((state) => state.connectStudents);
  const [activeKey, setActiveKey] = useState("id");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          persistentScrollbar={true}
          scrollIndicatorInsets={{ right: 1 }}
          // stickyHeaderIndices={[0]}
        >
          {/* Header (sticky) */}
          <View className="bg-blue-600 px-4 pt-6 pb-7 rounded-b-3xl">
            <View className="flex-row items-center gap-3 mb-4">
              <View className="w-12 h-12 bg-white/15 rounded-2xl items-center justify-center">
                <Ionicons name="person-add" size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-semibold text-2xl">
                  Connect Student
                </Text>
                <Text className="text-white/85">
                  Expand your teaching network
                </Text>
              </View>
            </View>

            {/* Methods */}
            <View className="flex-row gap-3">
              {METHODS.map((m) => {
                const isActive = activeKey === m.key;
                return (
                  <TouchableOpacity
                    key={m.key}
                    onPress={() => setActiveKey(m.key)}
                    className={`flex-1 p-4 rounded-2xl ${
                      isActive
                        ? "bg-white/20 ring-1 ring-white"
                        : "bg-white/10 ring-1 ring-white/30"
                    } shadow-sm`}
                    activeOpacity={0.85}
                  >
                    <View className="mb-2">
                      {m.iconType === "ion" ? (
                        <Ionicons name={m.icon} size={22} color="white" />
                      ) : (
                        <MaterialCommunityIcons
                          name={m.icon}
                          size={22}
                          color="white"
                        />
                      )}
                    </View>
                    <Text className="text-white font-medium">{m.title}</Text>
                    <Text className="text-white/75 text-xs mt-0.5">
                      {m.description}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Body */}
          <View className="px-4 mt-4">
            <View className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <View className="flex-row items-center mb-3">
                {activeKey === "id" ? (
                  <Ionicons name="link-outline" size={18} color="#111827" />
                ) : (
                  <MaterialCommunityIcons
                    name="qrcode-scan"
                    size={18}
                    color="#111827"
                  />
                )}
                <Text className="ml-2 font-semibold text-gray-900">
                  {activeKey === "id" ? "Add by Student ID" : "Add by QR Code"}
                </Text>
              </View>

              <AddStudentForm
                studentDigits={studentDigits}
                setStudentDigits={setStudentDigits}
              />
              {studentDetails && studentDigits && (
                <>
                  <StudentDetails />
                  <TuitionDetails />
                </>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ConnectScreen;
