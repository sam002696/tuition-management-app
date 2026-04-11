import { Stack, router, Redirect } from "expo-router";
import useAuth from "../../hooks/useAuth";

export default function AppLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href={"/welcome"} />;
  }

  return (
    <Stack>
      <Stack.Screen name="teacher" options={{ headerShown: false }} />
      {/* <Stack.Screen
        name="groupSelector"
        options={{ animation: "slide_from_bottom", headerShown: false }}
      /> */}
      <Stack.Screen name="student" options={{ headerShown: false }} />
      <Stack.Screen
        name="tuitionDetailsForm"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="studentDetails" options={{ headerShown: false }} />
      <Stack.Screen
        name="editStudentDetails"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="calender" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
    </Stack>
  );
}
