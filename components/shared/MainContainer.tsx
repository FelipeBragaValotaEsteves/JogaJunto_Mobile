import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import styled from "styled-components/native";

export const MainContainer = styled(ScrollView).attrs({
  contentInset: { bottom: 115 }, 
  contentInsetAdjustmentBehavior: "automatic",
  keyboardShouldPersistTaps: "handled",
  showsVerticalScrollIndicator: false,
  nestedScrollEnabled: true,
})`
  padding: 15px 20px 40px 20px;
  background-color: #F5F7FA;
  height: 100%;
  flex: 1; 
`;

export const KeyboardAwareContainer = styled(KeyboardAvoidingView).attrs({
  behavior: Platform.OS === "ios" ? "padding" : undefined,
  keyboardVerticalOffset: Platform.OS === "ios" ? 110 : 0,
})`
  flex: 1;
`;