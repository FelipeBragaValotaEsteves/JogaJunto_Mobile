import { Button, ButtonDanger, ButtonText } from "@/components/shared/Button";
import { ContentContainer } from "@/components/shared/ContentContainer";
import typography from "@/constants/typography";
import { MapPin } from "lucide-react-native";
import React from "react";
import styled from "styled-components/native";

interface InviteCardProps {
    date: string;
    hour: string;
    location: string;
    acceptLabel: string;
    rejectLabel: string;
    onAccept: () => void;
    onReject: () => void;
}

export const InviteCard: React.FC<InviteCardProps> = ({
    date,
    hour,
    location,
    acceptLabel,
    rejectLabel,
    onAccept,
    onReject,
}) => {
    return (
        <ContentContainer style={{ marginBottom: 20 }}>
            <CardContainer>
                <MatchDetails>
                    <MatchDate style={typography["txt-1"]}>{date}</MatchDate>
                    <MatchHour style={typography["txt-1"]}>{hour}</MatchHour>
                    <MatchLocation>
                        <MapPin size={20} color="#2B6AE3" />
                        <MatchLocationText style={typography["txt-2"]}>{location}</MatchLocationText>
                    </MatchLocation>
                </MatchDetails>
                <ButtonSection>
                    <Button onPress={onAccept}>
                        <ButtonText style={typography["btn-2"]}>{acceptLabel}</ButtonText>
                    </Button>
                    <ButtonDanger onPress={onReject} style={{ marginTop: 10 }}>
                        <ButtonText style={typography["btn-2"]}>{rejectLabel}</ButtonText>
                    </ButtonDanger>
                </ButtonSection>
            </CardContainer>
        </ContentContainer>
    );
};

const CardContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
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