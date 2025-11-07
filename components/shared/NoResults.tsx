import React from "react";
import { Text, View } from "react-native";
import styled from "styled-components/native";

export function NoResults({ message }: { message: string }) {
  return (
    <Container>
      <Message>{message}</Message>
    </Container>
  );
}

const Container = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const Message = styled(Text)`
  margin-top: 10px;
  font-size: 16px;
  color: #A0AEC0;
  text-align: center;
`;