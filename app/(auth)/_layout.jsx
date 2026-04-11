import { Redirect, Stack } from "expo-router";
import useAuth from "../../hooks/useAuth";

export default function AuthRoutesLayout() {
  const { user } = useAuth();

  if (user) {
    return <Redirect href={"/"} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerBackButtonDisplayMode: "minimal",
        contentStyle: { backgroundColor: "white" },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="signIn" />
      <Stack.Screen name="signUp" />
      <Stack.Screen name="forgotPassword" />
    </Stack>
  );
}
