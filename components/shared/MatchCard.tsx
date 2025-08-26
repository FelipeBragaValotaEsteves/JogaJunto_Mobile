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
}

function formatDate(dateString: string): string {
  const dateObj = new Date(dateString);
  let dayOfWeek = dateObj.toLocaleDateString('pt-BR', { weekday: 'long' });
  dayOfWeek = dayOfWeek.replace('-feira', '');
  dayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleDateString('pt-BR', { month: 'long' });
  return `${dayOfWeek}, ${day} de ${month}`;
}

export const MatchCard: React.FC<MatchCardProps> = ({ date, hour, location, buttonLabel, onPress }) => {
  return (
    <ContentContainer style={{ marginBottom: 20 }}>
      <MatchDate style={typography["txt-1"]}>{formatDate(date)}</MatchDate>
      <MatchHour style={typography["txt-1"]}>{hour}</MatchHour>
      <LocationButtonContainer>
        <MatchLocation>
          <MapPin size={32} color="#2B6AE3" />
          <MatchLocationText style={typography["txt-2"]}>{location}</MatchLocationText>
        </MatchLocation>
        <Button onPress={onPress}>
          <ButtonText style={typography["btn-2"]}>{buttonLabel}</ButtonText>
        </Button>
      </LocationButtonContainer>

    </ContentContainer>
  );
};

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