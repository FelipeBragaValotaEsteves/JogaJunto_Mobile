import { Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import { TextInputProps, TouchableOpacity } from 'react-native';
import styled from "styled-components/native";
import typography from "../../constants/typography";

const StyledInput = styled.TextInput.attrs({
  placeholderTextColor: "#B0BEC5",
  autoComplete: "off",
  textContentType: "none",
})`
  background-color: white;
  border: 2px solid #b0bec5;
  border-radius: 16px;
  padding: 16px 20px;
  font-size: ${typography["txt-2"].fontSize}px;
  font-family: ${typography["txt-2"].fontFamily};
  color: #111;
  
  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px white inset !important;
    -webkit-text-fill-color: #111 !important;
  }
`;

const Label = styled.Text`
  font-size: 16px;
  font-family: ${typography["txt-2"].fontFamily};
  color: #111;
  margin-bottom: 8px;
`;

const InputContainer = styled.View`
    margin-bottom: 20px;
`;

const StyledInputContainer = styled.View`
  position: relative;
  width: 100%;
`;

const EyeButton = styled(TouchableOpacity)`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-10px);
  z-index: 1;
`;

interface InputProps extends TextInputProps {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, secureTextEntry, ...props }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPasswordField = secureTextEntry || props.placeholder?.toLowerCase().includes('senha');

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <InputContainer>
      {label && <Label>{label}</Label>}
      <StyledInputContainer>
        <StyledInput 
          {...props}
          secureTextEntry={isPasswordField ? !isPasswordVisible : false}
          autoComplete="off"
          textContentType="none"
          autoCorrect={false}
          spellCheck={false}
          style={[
            props.style,
            isPasswordField ? { paddingRight: 50 } : {},
            { backgroundColor: 'white' } 
          ]}
        />
        {isPasswordField && (
          <EyeButton onPress={togglePasswordVisibility}>
            {isPasswordVisible ? (
              <EyeOff size={20} color="#B0BEC5" />
            ) : (
              <Eye size={20} color="#B0BEC5" />
            )}
          </EyeButton>
        )}
      </StyledInputContainer>
    </InputContainer>
  );
};
