import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import styled from 'styled-components/native';

interface BackButtonProps {
  children?: React.ReactNode;
  onPress?: () => void;
  defaultRoute?: string;
}

export function BackButtonAuth({ children, onPress }: BackButtonProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <BackButtonAuthStyled onPress={handlePress}>
      {children}
    </BackButtonAuthStyled>
  );
}

export function BackButtonTab({ children, onPress, defaultRoute }: BackButtonProps) {
  const router = useRouter();
  const params = useLocalSearchParams();

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }

    console.log('BackButton clicked, going to index');
    // Por enquanto, sempre volta para a tela principal
    router.push('/(tabs)' as any);
  };

  return (
    <BackButtonTabStyled onPress={handlePress}>
      {children}
    </BackButtonTabStyled>
  );
}

const BackButtonAuthStyled = styled.TouchableOpacity`
  color: #F5F7FA;
  position: absolute;
  top: -60px;
  left: 0px;
  z-index: 10;
`;

const BackButtonTabStyled = styled.TouchableOpacity`
  color: #2B6AE3;
`;