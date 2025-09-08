import styled from 'styled-components/native';
import typography from '../../constants/typography';

export const Button = styled.TouchableOpacity`
  background-color: #22c55e;
  padding: 10px 20px;
  border-radius: 16px;
  align-items: center;
  align-self: flex-end; 
`;
export const ButtonDanger = styled.TouchableOpacity`
  background-color: #FF4848;
  padding: 10px 20px;
  border-radius: 16px;
  align-items: center;
  align-self: flex-end; 
`;

export const ButtonSpace = styled.TouchableOpacity`
  padding: 10px 20px;
  border-radius: 16px;
  align-items: center;
  align-self: flex-end; 
`;

export const ButtonText = styled.Text`
  color: white;
  font-size: ${typography['btn-2'].fontSize}px;
  font-family: ${typography['btn-2'].fontFamily};
`;

export const OutlineButton = styled.TouchableOpacity`
  border: 2px solid #22c55e;
  border-radius: 16px;
  padding: 10px 20px;
  align-items: center;
  margin-top: 40px;
`;

export const OutlineButtonText = styled.Text`
  color: #22c55e;
  font-size: ${typography["btn-2"].fontSize}px;
  font-family: ${typography["btn-2"].fontFamily};
`;