import { Frown } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import styled from "styled-components/native";

export function NoResults({ message }: { message: string }) {
  return (
    <Container>
      <Frown color="#A0AEC0" size={60} />
      <Message>{message}</Message>
    </Container>
  );
}

const Container = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-top: 20;
`;

const Message = styled(Text)`
  margin-top: 10;
  font-size: 16;
  color: #A0AEC0;
  text-align: center;
`;