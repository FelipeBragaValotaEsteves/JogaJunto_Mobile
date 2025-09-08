import { ContentContainer } from "@/components/shared/ContentContainer";
import typography from "@/constants/typography";
import { ArrowRight } from "lucide-react-native";
import React from "react";
import styled from "styled-components/native";
import { ButtonSpace } from "./Button";

interface NotificationCardProps {
    message: string;
    onPress: () => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
    message,
    onPress,
}) => {
    return (
        <ContentContainer style={{ marginBottom: 20 }}>
            <CardContainer>
                <MessageSection>
                    <MessageText>{message}</MessageText>
                </MessageSection>

                <ButtonSection>
                    <ButtonSpace onPress={onPress}>
                        <ArrowRight size={20} color="#22c55e" />
                    </ButtonSpace>
                </ButtonSection>
            </CardContainer>
        </ContentContainer>
    );
};

const CardContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const MessageSection = styled.View`
  flex: 1;
  margin-right: 10px;
`;

const MessageText = styled.Text`
  font-size: ${typography["txt-2"].fontSize}px;
  font-family: ${typography["txt-2"].fontFamily};
  color: #111;
`;

const ButtonSection = styled.View`
  justify-content: center;
  align-items: flex-end;
`;