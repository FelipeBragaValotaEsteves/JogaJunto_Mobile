import React from 'react';
import { Input } from './Input';

type TimePickerProps = {
    value: string;
    onChange: (time: string) => void;
    placeholder?: string;
    label?: string;
};

export const TimePicker: React.FC<TimePickerProps> = ({ value, onChange, placeholder = 'Selecione o horário', label }) => {

    const handleTimeChange = (text: string) => {
        const cleanedText = text.replace(/[^0-9]/g, '');

        if (cleanedText.length <= 2) {
            onChange(cleanedText);
        } else {
            const hours = cleanedText.substring(0, 2);
            const minutes = cleanedText.substring(2, 4);
            onChange(`${hours}:${minutes}`);
        }
    };

    return (
        <Input
            label={label}
            placeholder={placeholder}
            value={value}
            onChangeText={handleTimeChange}
            keyboardType="numeric"
            maxLength={5}
        />
    );
};
