import { Button, ButtonText } from "@/components/shared/Button";
import { ContentContainer } from "@/components/shared/ContentContainer";
import typography from "@/constants/typography";
import { MapPin } from "lucide-react-native";
import React from "react";
import styled from "styled-components/native";

interface MatchCardProps {
  date: string;
  hour: string;
  location: string;
  buttonLabel: string;
  onPress?: () => void;
  isCanceled?: boolean;
  valor?: number | string | null;
}

function formatDate(dateString: string): string {
  let dateObj: Date;
  if (dateString.includes('-')) {
    const [year, month, day] = dateString.split('-').map(Number);
    dateObj = new Date(year, month - 1, day);
  } else {
    dateObj = new Date(parseInt(dateString));
  }

  let dayOfWeek = dateObj.toLocaleDateString('pt-BR', { weekday: 'long' });
  dayOfWeek = dayOfWeek.replace('-feira', '');
  dayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleDateString('pt-BR', { month: 'long' });
  return `${dayOfWeek}, ${day} de ${month}`;
}

export const MatchCard: React.FC<MatchCardProps> = ({ date, hour, location, buttonLabel, onPress, isCanceled = false, valor }) => {
  return (
    <ContentContainer style={{ marginBottom: 20 }}>
      <DateValueContainer>
        <MatchDate style={typography["txt-1"]}>{formatDate(date)}</MatchDate>
        {valor !== null && valor !== undefined && (
          <ValorText style={typography["txt-2"]}>R$ {Number(valor).toFixed(2)}</ValorText>
        )}
      </DateValueContainer>
      <MatchHour style={typography["txt-1"]}>{hour}</MatchHour>
      <LocationButtonContainer>
        <MatchLocation>
          <MapPin size={32} color="#2B6AE3" />
          <MatchLocationText style={typography["txt-2"]}>{location}</MatchLocationText>
        </MatchLocation>
        <ButtonContainer>
       
          {isCanceled ? (
            <CanceledButton>
              <CanceledButtonText style={typography["btn-2"]}>{buttonLabel}</CanceledButtonText>
            </CanceledButton>
          ) : (
            <Button onPress={onPress}>
              <ButtonText style={typography["btn-2"]}>{buttonLabel}</ButtonText>
            </Button>
          )}
        </ButtonContainer>
      </LocationButtonContainer>

    </ContentContainer>
  );
};

const DateValueContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const MatchDate = styled.Text`
  font-weight: normal;
`;

const MatchHour = styled.Text`
  margin-top: 4px;
`;

const MatchLocation = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
`;

const MatchLocationText = styled.Text`
  margin-left: 6px;
`;

const LocationButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: end;
`;

const ButtonContainer = styled.View`
  align-items: flex-end;
  gap: 4px;
`;

const ValorText = styled.Text`
  color: #2B6AE3;
  font-weight: bold;
`;

const CanceledButton = styled.View`
  background-color: #E53E3E;
  padding: 10px 20px;
  border-radius: 16px;
  align-items: center;
  align-self: flex-end;
`;

const CanceledButtonText = styled.Text`
  color: white;
  font-size: ${typography['btn-2'].fontSize}px;
  font-family: ${typography['btn-2'].fontFamily};
`;