import { Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import useAuth from "../../hooks/useAuth";

export default function ProtectedIndex() {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/welcome" />;
  }

  const home = role === "student" ? "/student" : "/teacher";

  return <Redirect href={home} />;
}
