import { Minus, Plus } from 'lucide-react-native';
import React from 'react';
import styled from 'styled-components/native';

interface NumberInputProps {
    value: number;
    onDecrease: () => void;
    onIncrease: () => void;
    isFloat?: boolean;
}

export const NumberInput = ({ value, onDecrease, onIncrease, isFloat = false }: NumberInputProps) => (
    <NumberInputContainer>
        <NumberButton onPress={onDecrease}>
            <Minus color="#2B6AE3" size={20} />
        </NumberButton>
        <NumberValue>{isFloat ? value.toFixed(1) : value}</NumberValue>
        <NumberButton onPress={onIncrease}>
            <Plus color="#2B6AE3" size={20} />
        </NumberButton>
    </NumberInputContainer>
);

const NumberInputContainer = styled.View`
    flex-direction: row;
    align-items: center;
`;

const NumberButton = styled.TouchableOpacity`
    padding: 8px;
    border-radius: 8px;
    background-color: #F0F0F0;
`;

const NumberValue = styled.Text`
    font-size: 18px;
    font-weight: bold;
    margin: 0 16px;
    min-width: 40px;
    text-align: center;
`;