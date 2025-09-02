import styled from "styled-components/native";
import typography from "../../constants/typography";

export const TitlePage = styled.Text`
  font-size: ${typography["sub-1"].fontSize};
  line-height: ${typography["sub-1"].lineHeight};
  font-family: ${typography["sub-1"].fontFamily};
  margin-bottom: 60;
  text-align: center;
  color: #2B6AE3;
`;

export const TitlePageTabs = styled.Text`
  font-size: ${typography["sub-2"].fontSize};
  line-height: ${typography["sub-2"].lineHeight};
  font-family: ${typography["sub-2"].fontFamily};
  margin-bottom: 20;
  text-align: start;
  color: #2C2C2C;
`;

export const TitlePageIndex = styled.Text`
  font-size: ${typography["sub-2"].fontSize};
  line-height: ${typography["sub-2"].lineHeight};
  font-family: ${typography["sub-2"].fontFamily};
  margin-bottom: 12;
  text-align: start;
  color: #2C2C2C;
`;

