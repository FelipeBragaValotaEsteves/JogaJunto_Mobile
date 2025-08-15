import { Plus } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";

type Props = { onPress: () => void; bottom: number };

export default function FabButton({ onPress, bottom }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={{
        position: "absolute",
        alignSelf: "center",
        bottom,
        zIndex: 20,
      }}
    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
    >
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 64,
          backgroundColor: "#22c55e",
          justifyContent: "center",
          alignItems: "center",
          elevation: 12,
        }}
      >
        <Plus color="#fff" size={30} strokeWidth={3} />
      </View>
    </TouchableOpacity>
  );
}
