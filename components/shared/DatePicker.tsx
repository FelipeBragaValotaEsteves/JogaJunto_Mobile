import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { Input } from './Input';

type DatePickerProps = {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
};

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, placeholder = 'Selecione a data' }) => {
  const [showPicker, setShowPicker] = React.useState(false);
  
  const [selectedDate, setSelectedDate] = React.useState(() => {
    if (value) {
      const [year, month, day] = value.split('-').map(Number);
      return new Date(year, month - 1, day);
    }
    return new Date();
  });

  const handleConfirm = (event: any, date?: Date) => {
    setShowPicker(false);

    if (date) {
      setSelectedDate(date);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      onChange(formattedDate);
    }
  };

  const handleInputPress = () => {
    setShowPicker(true);
  };

  const formatDate = (date: string) => {
    if (!date) return '';
    
    const [year, month, day] = date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    
    return dateObj.toLocaleDateString('pt-BR');
  };

  return (
    <Container>
      <TouchableOpacity onPress={handleInputPress}>
        <Input
          placeholder={placeholder}
          value={formatDate(value)}
          editable={false}
          pointerEvents="none"
        />
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          themeVariant="light"
          onChange={handleConfirm}
          maximumDate={new Date(2030, 11, 31)}
          minimumDate={new Date(1900, 0, 1)}
        />
      )}
    </Container>
  );
};

const Container = styled.View`
  position: relative;
`;
