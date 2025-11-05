import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import styled from 'styled-components/native';

export function Loading() {
  return (
    <LoadingContainer>
      <ActivityIndicator size="large" color="#3b82f6" />
    </LoadingContainer>
  );
}

const LoadingContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #F5F7FA;
`;
