import { ActivityIndicator, View } from "react-native";

export function LoadingSpinner() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator />
    </View>
  );
}
