import typography from '@/constants/typography';
import { styled } from 'styled-components/native';

export const Divider = styled.View`
  height: 2px;
  background-color: #d6dde0ff;
`;

export const SubTitleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  margin-bottom: 20px;
`;

export const SubTitleText = styled.Text`
  font-size: ${typography['txt-2'].fontSize}px;
  font-family: ${typography['txt-2'].fontFamily};
  color: #2C2C2C;
`;

export const AddPlayerButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border-radius: 8px;
  margin-top: 12px;
`;

export const AddPlayerText = styled.Text`
  font-size: ${typography['btn-2'].fontSize}px;
  font-family: ${typography['btn-2'].fontFamily};
  color: #2B6AE3;
  margin-left: 8px;
`;

export const TopButtonsContainer = styled.View`
  flex-direction: row; 
  justify-content: space-between; 
  align-items: center; 
  margin-top: 10px; 
  margin-bottom: 10px; 
`;
export const PlayerCardTeam = styled.View`
  border-bottom-width: 2px;
  border-bottom-color: #B0BEC5;
  padding: 6px 0;
`;

export const PlayerNameSection = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

export const PlayerName = styled.Text`
  font-size: ${typography["txt-2"].fontSize}px;
  font-family: ${typography["txt-2"].fontFamily};
  color: #2C2C2C;
`;

export const PlayerPosition = styled.Text`
  font-size: ${typography["txt-3"].fontSize}px;
  font-family: ${typography["txt-3"].fontFamily};
  color: #2C2C2C;
  font-weight: bold;
`;

export const PlayerDetailsSection = styled.View`
  flex-direction: row; 
  justify-content: flex-end;
`;

export const StatsSection = styled.View`
  flex: 2;
  flex-direction: row;
  justify-content: flex-end;
  gap: 8px;
  margin-right: 16px;
`;

export const RatingSection = styled.View`
  align-items: end;
`;

export const StatIcon = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

export const Rating = styled.Text<{ rating: number }>`
  font-size: ${typography["txt-2"].fontSize}px;
  font-family: ${typography["txt-2"].fontFamily};
  color: white;
  background-color: ${({ rating }) => {
    const r = rating || 0;
    return r < 4 ? '#FF4D4D' : r <= 7 ? '#FFC107' : '#4CAF50';
  }};
  padding: 2px 8px;
  border-radius: 2px;
`;

export const Badge = styled.View`
  position: absolute;
  top: -6px;
  right: -10px;
  background-color: #FF4D4D;
  border-radius: 8px;
  padding: 2px 6px;
  margin-left: 4px;
`;

export const BadgeText = styled.Text`
  font-size: 10px;
  font-family: ${typography["txt-3"].fontFamily};
  color: white;
  font-weight: bold;
`;

export const PlayerDetailsContainer = styled.View`
  align-items: flex-start;
  width: 100%;
`;

export const PlayerImageNamePositionContainer = styled.View`
  flex-direction: row;
  gap: 16px;
  align-items: flex-start;
`;

export const PlayerImage = styled.View`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background-color: #E0E0E0;
  margin-bottom: 16px;
`;