import styled from 'styled-components/native';
import typography from '../../constants/typography';

export const Button = styled.TouchableOpacity`
  background-color: #22c55e;
  padding-top: 10;
  padding-bottom: 10;
  padding-right: 20;
  padding-left: 20;
  border-radius: 16;
  align-items: center;
  align-self: flex-end; 
`;

export const ButtonText = styled.Text`
  color: white;
  font-size: ${typography['btn-2'].fontSize};
  line-height: ${typography['btn-2'].lineHeight};
  font-family: ${typography['btn-2'].fontFamily};
`;

export const OutlineButton = styled.TouchableOpacity`
  border: 2 solid #22c55e;
  border-radius: 16;
  padding-top: 10;
  padding-bottom: 10;
  padding-right: 20;
  padding-left: 20;
  align-items: center;
  margin-top: 40;
`;

export const OutlineButtonText = styled.Text`
  color: #22c55e;
  font-size: ${typography["btn-2"].fontSize};
  line-height: ${typography["btn-2"].lineHeight};
  font-family: ${typography["btn-2"].fontFamily};
`;