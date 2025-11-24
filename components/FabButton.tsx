import { useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

export default function FabButton() {
  const router = useRouter();

  return (
    <Pressable 
      onPress={() => router.push({
        pathname: "/(tabs)/match",
        params: { id: null }
      })} 
      style={styles.container}
    >
      <View style={styles.button}>
        <Plus color="#fff" size={45} strokeWidth={3} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: 90, 
  },
  button: {
    width: 69,
    height: 68,
    borderRadius: 1000,
    backgroundColor: "#22c55e",
    justifyContent: "center",
    alignItems: "center",
    elevation: 12,
  },
});
