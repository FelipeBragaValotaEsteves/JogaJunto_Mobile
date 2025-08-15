import { useRouter } from 'expo-router';
import { CircleArrowLeft } from "lucide-react-native";
import React, { useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import styled from "styled-components/native";
import LogoJogaJunto from "../../assets/images/logo-white.svg";

const BASE_URL = 'http://localhost:3000/api';

export default function RecuperarSenhaScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const enviarCodigo = async () => {
        try {
            if (!email) return Alert.alert('Erro', 'Digite seu e-mail.');
            setLoading(true);

            const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Erro ao enviar código');
            }

            Alert.alert('Sucesso', 'Código de recuperação enviado para o seu e-mail.');
            router.push({ pathname: '/resetPassword', params: { email } });
        } catch (err: any) {
            Alert.alert('Erro', err.message || 'Falha ao enviar código.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Header>
                <LogoJogaJunto width={265} />
            </Header>

            <FormContainer>
                <BackButton onPress={() => router.back()}>
                    <CircleArrowLeft color="#fff" size={50} />
                </BackButton>

                <Title>Recuperação</Title>

                <StyledInput
                    placeholder="Digite seu e-mail"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />

                <SendButton onPress={enviarCodigo} disabled={loading}>
                    <SendButtonText>{loading ? <ActivityIndicator color="#fff" /> : 'ENVIAR CÓDIGO'}</SendButtonText>
                </SendButton>

            </FormContainer>
        </Container>
    );
}

const Container = styled.View`
  flex: 1;
  align-items: center;
  background-color: white;
`;

const Header = styled.View`
  width: 100%;
  background: #3b82f6;
  min-height: 50%;
  padding-top: 100px;
  border-bottom-left-radius: 40px;
  border-bottom-right-radius: 40px;
  justify-content: start;
  align-items: center;
`;

const BackButton = styled.TouchableOpacity`
  position: absolute;
  top: -60px;
  left: 0px;
  z-index: 10;
`;

const FormContainer = styled.View`
  background-color: #f5f7fa;
  margin-top: -150px;
  padding: 24px;
  width: 85%;
  border-radius: 20px;
  box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.1);
`;

const Title = styled.Text`
  text-align: center;
  color: #2563eb;
  font-size: 36px;
  font-weight: 600;
  margin-bottom: 60px;
`;

const StyledInput = styled.TextInput`
  background-color: white;
  border: 2px solid #b0bec5;
  border-radius: 16px;
  padding: 16px 20px;
  margin-bottom: 12px;
`;

const SendButton = styled.TouchableOpacity`
  border: 2px solid #22c55e;
  border-radius: 16px;
  padding: 16px 0;
  margin-top: 40px;
  align-items: center;
`;

const SendButtonText = styled.Text`
  color: #22c55e;
  font-weight: 700;
`;
