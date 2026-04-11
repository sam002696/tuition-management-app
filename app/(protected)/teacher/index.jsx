import { useEffect } from "react";
import { SafeAreaView, View, ScrollView } from "react-native";
import Header from "../../../components/Teacher/HomeScreen/Header";
import QuickSummary from "../../../components/Teacher/HomeScreen/QuickSummary";
import StatsGrid from "../../../components/Teacher/HomeScreen/StatsGrid";
import TodaysSchedule from "../../../components/Teacher/HomeScreen/TodaysSchedule";
import RecentActivity from "../../../components/Teacher/HomeScreen/RecentActivity";
import { useDispatch, useSelector } from "react-redux";

import { useCallback } from "react";
import { useFocusEffect } from "expo-router";

const HomeScreen = () => {
  const dispatch = useDispatch();

  const { overview, stats, schedule_today } = useSelector(
    (state) => state.teacherHomeData
  );

  // dispatching fetchTeacherHomeData action to load data when component mounts

  useFocusEffect(
    useCallback(() => {
      dispatch({ type: "teacherHomeData" });
    }, [dispatch])
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Decorative hero cap */}
        <View className="px-4 pt-6 pb-8 rounded-b-3xl bg-indigo-600">
          <Header />
          <QuickSummary overview={overview} />
        </View>

        {/* Lifted content wrapper so cards feel layered */}
        <View className="-mt-6 px-4">
          <StatsGrid stats={stats} />

          <View className="mt-6">
            <TodaysSchedule scheduleData={schedule_today} />
          </View>

          <View className="mt-6">
            <RecentActivity />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
