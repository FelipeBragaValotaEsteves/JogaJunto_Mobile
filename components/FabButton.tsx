import { Plus } from "lucide-react-native";
import React from "react";
import { GestureResponderEvent, Pressable, StyleSheet, View } from "react-native";

type Props = {
  onPress?: (e: GestureResponderEvent) => void;
};

export default function FabButton({ onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
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
