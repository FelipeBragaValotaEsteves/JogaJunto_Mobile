import React from 'react';
import { Switch, SwitchProps } from 'react-native';
import styled from 'styled-components/native';

interface CheckboxProps extends SwitchProps {
  label?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, ...props }) => {
  return (
    <Container>
      <Switch {...props} />
      {label && <Label>{label}</Label>}
    </Container>
  );
};

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

const Label = styled.Text`
  margin-left: 8px;
  font-size: 16px;
  color: #111;
`;