import { ScrollView } from "react-native";
import styled from "styled-components/native";

export const MainContainer = styled(ScrollView).attrs({
  contentInset: { bottom: 115 }, 
  contentInsetAdjustmentBehavior: "automatic",
})`
  padding: 15px 20px 40px 20px;
  background-color: #F5F7FA;
  height: 100%;
  flex: 1; 
  padding-bottom: 115px; 
`;