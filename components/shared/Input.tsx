import styled from "styled-components/native";
import typography from "../../constants/typography";

export const Input = styled.TextInput.attrs({
  placeholderTextColor: "#B0BEC5",
})`
  background-color: white;
  border: 2 solid #b0bec5;
  border-radius: 16;
  padding-top: 16;
  padding-bottom: 16;
  padding-right: 20;
  padding-left: 20;
  margin-bottom: 20;

  font-size: ${typography["txt-2"].fontSize};
  line-height: ${typography["txt-2"].lineHeight};
  font-family: ${typography["txt-2"].fontFamily};
  color: #111;
`;
