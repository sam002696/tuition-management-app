import { useCallback } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "expo-router";

import GridBackground from "../../../components/ui/GridBackground";
import Header from "../../../components/Teacher/HomeScreen/Header";
import QuickSummary from "../../../components/Teacher/HomeScreen/QuickSummary";
import StatsGrid from "../../../components/Teacher/HomeScreen/StatsGrid";
import TodaysSchedule from "../../../components/Teacher/HomeScreen/TodaysSchedule";
import RecentActivity from "../../../components/Teacher/HomeScreen/RecentActivity";
import { colors, spacing } from "../../../theme";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { overview, stats, schedule_today } = useSelector(
    (state) => state.teacherHomeData
  );

  useFocusEffect(
    useCallback(() => {
      dispatch({ type: "teacherHomeData" });
    }, [dispatch])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.offWhite }}>
      <GridBackground>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: spacing.screenPadding,
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* App bar + greeting */}
          <Header />

          {/* Hero overview card */}
          <View style={{ marginTop: spacing.xxl }}>
            <QuickSummary overview={overview} />
          </View>

          {/* 2×2 stat cards */}
          <View style={{ marginTop: spacing.xxl }}>
            <StatsGrid stats={stats} />
          </View>

          {/* Today's schedule */}
          <View style={{ marginTop: spacing.xxl }}>
            <TodaysSchedule scheduleData={schedule_today} />
          </View>

          {/* Recent activity */}
          <View style={{ marginTop: spacing.xxl }}>
            <RecentActivity />
          </View>
        </ScrollView>
      </GridBackground>
    </SafeAreaView>
  );
};

export default HomeScreen;
