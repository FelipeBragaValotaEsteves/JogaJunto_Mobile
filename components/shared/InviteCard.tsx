import { Button, ButtonDanger, ButtonText } from "@/components/shared/Button";
import { ContentContainer } from "@/components/shared/ContentContainer";
import typography from "@/constants/typography";
import { Check, MapPin, X } from "lucide-react-native";
import React from "react";
import { styled } from "styled-components/native";

interface InviteCardProps {
  date: string;
  hour: string;
  location: string;
  status: string;
  onAccept: () => void;
  onReject: () => void;
}

export const InviteCard: React.FC<InviteCardProps> = ({
  date,
  hour,
  location,
  status,
  onAccept,
  onReject,
}) => {
  const renderStatusOrButtons = () => {
    const normalizedStatus = status.toLowerCase();

    if (normalizedStatus === 'aceito' || normalizedStatus === 'aceita') {
      return (
        <StatusContainer>
          <StatusText color="#28a745">ACEITO</StatusText>
        </StatusContainer>
      );
    }

    if (normalizedStatus === 'recusado' || normalizedStatus === 'recusada') {
      return (
        <StatusContainer>
          <StatusText color="#dc3545">RECUSADO</StatusText>
        </StatusContainer>
      );
    }

    return (
      <ButtonSection>
        <Button onPress={onAccept}>
          <ButtonText style={typography["btn-2"]}><Check strokeWidth={3} color="#fff" /></ButtonText>
        </Button>
        <ButtonDanger onPress={onReject} style={{ marginTop: 10 }}>
          <ButtonText style={typography["btn-2"]}><X strokeWidth={3} color="#fff" /></ButtonText>
        </ButtonDanger>
      </ButtonSection>
    );
  };
  return (
    <ContentContainer style={{ marginBottom: 20 }}>
      <CardContainer>
        <MatchDetails>
          <MatchDate style={typography["txt-1"]}>{date}</MatchDate>
          <MatchHour style={typography["txt-1"]}>{hour}</MatchHour>
          <MatchLocation>
            <MapPin size={32} color="#2B6AE3" />
            <MatchLocationText style={typography["txt-2"]}>{location}</MatchLocationText>
          </MatchLocation>
        </MatchDetails>
        {renderStatusOrButtons()}
      </CardContainer>
    </ContentContainer>
  );
};

const CardContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-center;
`;

const MatchDetails = styled.View`
  flex: 1;
  margin-right: 10px;
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

const ButtonSection = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
`;

const StatusContainer = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
`;

const StatusText = styled.Text<{ color: string }>`
  font-size: 16px;
  font-size: ${typography['txt-2-bold'].fontSize}px;
  font-family: ${typography['txt-2-bold'].fontFamily};
  color: ${props => props.color};
  text-align: center;
`;