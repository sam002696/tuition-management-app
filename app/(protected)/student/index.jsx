import { View, Text, SafeAreaView, ScrollView } from "react-native";
import React from "react";

const index = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text>student home</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default index;
