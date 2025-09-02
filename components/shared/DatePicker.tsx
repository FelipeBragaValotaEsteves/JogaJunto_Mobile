import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { Input } from './Input';

type DatePickerProps = {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
};

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, placeholder = 'Selecione a data' }) => {
  const [showPicker, setShowPicker] = React.useState(false);

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS !== 'ios') {
      setShowPicker(false);
    }
    if (selectedDate) {
      onChange(selectedDate.toISOString().split('T')[0]);
    }
  };

  if (Platform.OS === 'web') {
    return (
      <View>
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            backgroundColor: 'white',
            border: '2 solid #b0bec5',
            borderRadius: 16,
            paddingTop: 16,
            paddingBottom: 16,
            paddingRight: 20,
            paddingLeft: 20,
            marginBottom: 20,

            fontSize: 16,
            lineHeight: 24,
            fontFamily: 'Roboto, sans-serif',
            color: '#111',
          }}
        />
      </View>
    );
  }

  return (
    <View>
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <Input
          placeholder={placeholder}
          value={value}
          editable={false}
          pointerEvents="none"
        />
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          mode="date"
          value={value ? new Date(value) : new Date()}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};
