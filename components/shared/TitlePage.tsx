import styled from "styled-components/native";
import typography from "../../constants/typography";

export const TitlePage = styled.Text`
  font-size: ${typography["sub-1"].fontSize}px;
  font-family: ${typography["sub-1"].fontFamily};
  margin-bottom: 60px;
  text-align: center;
  color: #2B6AE3;
`;

export const TitlePageTabs = styled.Text`
  font-size: ${typography["sub-2"].fontSize}px;
  font-family: ${typography["sub-2"].fontFamily};
  margin-bottom: 20px;
  text-align: start;
  color: #2C2C2C;
`;

export const TitlePageIndex = styled.Text`
  font-size: ${typography["sub-2"].fontSize}px;
  font-family: ${typography["sub-2"].fontFamily};
  margin-bottom: 12px;
  text-align: start;
  color: #2C2C2C;
`;

