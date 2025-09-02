import styled from "styled-components/native";
import typography from "../../constants/typography";

export const Input = styled.TextInput.attrs({
  placeholderTextColor: "#B0BEC5",
})`
  background-color: white;
  border: 2px solid #b0bec5;
  border-radius: 16px;
  padding: 16px 20px;
  margin-bottom: 20px;

  font-size: ${typography["txt-2"].fontSize}px;
  line-height: ${typography["txt-2"].lineHeight}px;
  font-family: ${typography["txt-2"].fontFamily};
  color: #111;
`;
