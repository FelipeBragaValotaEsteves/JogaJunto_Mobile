import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";


type AlertProps = {
    visible: boolean;
    type?: String;
    title: string;
    message: string;
    onClose: () => void;
    onConfirm?: () => void;
};

export const Alert = ({
    visible,
    type = "success",
    title,
    message,
    onClose,
    onConfirm,
}: AlertProps) => {
    const getIcon = () => {
        switch (type) {
            case "success":
                return { name: "checkmark-circle", color: "#4CAF50" };
            case "error":
                return { name: "close-circle", color: "#F44336" };
            case "warning":
                return { name: "warning", color: "#FF9800" };
            default:
                return { name: "information-circle", color: "#2196F3" };
        }
    };

    const icon = getIcon();

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Ionicons name={icon.name as any} size={28} color={icon.color} />
                        <Text style={[styles.title, { color: icon.color }]}>{title}</Text>
                    </View>

                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.button} onPress={onClose}>
                            <Text style={styles.buttonText}>Fechar</Text>
                        </TouchableOpacity>
                        {onConfirm && (
                            <TouchableOpacity
                                style={[styles.button, styles.confirmButton]}
                                onPress={() => {
                                    onClose();
                                    onConfirm();
                                }}
                            >
                                <Text style={[styles.buttonText, { color: "white" }]}>OK</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        width: 80,
        backgroundColor: "white",
        borderRadius: 16,
        padding: 20,
        elevation: 5,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        marginLeft: 8,
    },
    message: {
        fontSize: 16,
        marginBottom: 20,
        color: "#444",
    },
    actions: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginLeft: 10,
        backgroundColor: "#eee",
    },
    confirmButton: {
        backgroundColor: "#6200ee",
    },
    buttonText: {
        fontSize: 14,
        fontWeight: "500",
    },
});
