import React, { useMemo } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import styled from "styled-components/native";
import typography from "../../constants/typography";
type DefaultItemType = { label: string; value: any };

const BORDER_BASE = "#b0bec5";
const FOCUS_COLOR = "#B0BEC5";
const PLACEHOLDER = "#B0BEC5";
const TEXT = "#111";

const Wrapper = styled.View<{ zIndex?: number }>`
  margin-bottom: 20px;
  ${({ zIndex }) => (zIndex ? `z-index: ${zIndex};` : "z-index: 1000;")}
`;

const Label = styled.Text`
  margin-bottom: 8px;
  color: ${TEXT};
  font-size: ${typography["txt-2"].fontSize}px;
  font-family: ${typography["txt-2"].fontFamily};
`;

const HelperText = styled.Text`
  margin-top: 6px;
  color: #607d8b;
  font-size: 12px;
`;
type SelectType = React.ComponentProps<typeof DropDownPicker> & {
    label?: string;
    helperText?: string;
    error?: boolean;
    zIndex?: number;
};

export function Select({
    label,
    helperText,
    error,
    zIndex,
    open,
    style,
    dropDownContainerStyle,
    placeholderStyle,
    textStyle,
    listItemLabelStyle,
    selectedItemLabelStyle,
    labelStyle,
    ...rest
}: SelectType) {
    const baseFont = useMemo(
        () => ({
            fontSize: typography["txt-2"].fontSize,
            lineHeight: typography["txt-2"].lineHeight,
            fontFamily: typography["txt-2"].fontFamily,
        }),
        []
    );

    const borderColor = error ? "#F44336" : open ? FOCUS_COLOR : BORDER_BASE;

    return (
        <Wrapper zIndex={zIndex}>
            {!!label && <Label>{label}</Label>}
            <DropDownPicker
                open={open}
                style={[
                    {
                        backgroundColor: "white",
                        borderColor,
                        borderWidth: 2,
                        borderRadius: 16,
                        minHeight: 55,
                        paddingHorizontal: 20,
                    },
                    style,
                ]}
                dropDownContainerStyle={[
                    {
                        backgroundColor: "white",
                        borderColor,
                        borderWidth: 2,
                        borderTopWidth: 0,
                        borderRadius: 16,
                        maxHeight: 220,
                    },
                    dropDownContainerStyle,
                ]}
                placeholderStyle={[{ color: PLACEHOLDER, ...baseFont }, placeholderStyle]}
                textStyle={[{ color: TEXT, ...baseFont }, textStyle]}
                labelStyle={[{ color: TEXT, ...baseFont }, labelStyle]}
                listItemLabelStyle={[{ color: TEXT, ...baseFont }, listItemLabelStyle]}
                selectedItemLabelStyle={[{ color: TEXT, ...baseFont }, selectedItemLabelStyle]}
                listMode="SCROLLVIEW"
                {...rest}
            />

            {!!helperText && <HelperText>{helperText}</HelperText>}
        </Wrapper>
    );
}
