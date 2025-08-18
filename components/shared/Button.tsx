import styled from 'styled-components/native';
import typography from '../../constants/typography';

export const Button = styled.TouchableOpacity`
  background-color: #22c55e;
  padding: 12px 48px;
  border-radius: 16px;
  align-items: center;
  align-self: flex-end; /* substitui margin-left: auto */
`;

export const ButtonText = styled.Text`
  color: white;
  font-size: ${typography['btn-2'].fontSize}px;
  line-height: ${typography['btn-2'].lineHeight}px;
  font-family: ${typography['btn-2'].fontFamily};
`;

export const OutlineButton = styled.TouchableOpacity`
  border: 2px solid #22c55e;
  border-radius: 16px;
  padding: 12px 48px;
  align-items: center;
  margin-top: 40px;
`;

export const OutlineButtonText = styled.Text`
  color: #22c55e;
  font-size: ${typography["btn-2"].fontSize}px;
  line-height: ${typography["btn-2"].lineHeight}px;
  font-family: ${typography["btn-2"].fontFamily};
`;