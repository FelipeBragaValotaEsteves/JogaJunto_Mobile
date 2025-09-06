import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import typography from '../../constants/typography';
import { Input } from './Input';

type DatePickerProps = {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
};

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, placeholder = 'Selecione a data' }) => {
  const [showPicker, setShowPicker] = React.useState(false);
  const [tempDate, setTempDate] = React.useState<Date | null>(null);

  const [selectedDate, setSelectedDate] = React.useState(() => {
    if (value) {
      const [year, month, day] = value.split('-').map(Number);
      return new Date(year, month - 1, day);
    }
    return new Date();
  });

  const handleConfirm = () => {
    if (tempDate) {
      setSelectedDate(tempDate);

      const year = tempDate.getFullYear();
      const month = String(tempDate.getMonth() + 1).padStart(2, '0');
      const day = String(tempDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      onChange(formattedDate);
    }
    setShowPicker(false);
  };

  const handleCancel = () => {
    setTempDate(null);
    setShowPicker(false);
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (date) {
      setTempDate(date);
    }
    if (Platform.OS !== 'ios') {
      setShowPicker(false);
    }
  };

  const handleInputPress = () => {
    setTempDate(selectedDate);
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
        <>
          <DateTimePicker
            value={tempDate || selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            themeVariant="light"
            onChange={handleDateChange}
            maximumDate={new Date(2030, 11, 31)}
            minimumDate={new Date(1900, 0, 1)}
          />
          {Platform.OS === 'ios' && (
            <IOSActions>
              <ActionButton outline onPress={handleCancel}>
                <ActionText outline>Cancelar</ActionText>
              </ActionButton>
              <ActionButton onPress={handleConfirm}>
                <ActionText>Confirmar</ActionText>
              </ActionButton>
            </IOSActions>
          )}
        </>
      )}
    </Container>
  );
};

const Container = styled.View`
  position: relative;
`;

const IOSActions = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
`;

const ActionButton = styled.TouchableOpacity<{ outline?: boolean }>`
  padding: 10px 20px;
  border-radius: 16px;
  margin-bottom: 20px;
`;

const ActionText = styled.Text<{ outline?: boolean }>`
  color: ${({ outline }) => (outline ? '#949494' : '#007bff')};
  font-size: ${typography['btn-2'].fontSize}px;
  font-family: ${typography['btn-2'].fontFamily};
`;
