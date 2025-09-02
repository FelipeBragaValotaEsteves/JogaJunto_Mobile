import { useRouter } from 'expo-router';
import { CircleArrowLeft } from "lucide-react-native";
import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import styled from "styled-components/native";
import LogoJogaJunto from "../../assets/images/logo-white.svg";
import { Alert } from "../../components/shared/Alert";
import { BackButtonAuth } from "../../components/shared/BackButton";
import { OutlineButton, OutlineButtonText } from "../../components/shared/Button";
import { Input } from "../../components/shared/Input";
import { TitlePage } from "../../components/shared/TitlePage";
import BASE_URL from "../../constants/config";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({
    type: "error",
    title: "",
    message: "",
  });

  const enviarCodigo = async () => {
    if (!email) {
      setAlertData({
        type: "error",
        title: "Erro",
        message: "Digite seu e-mail.",
      });
      setAlertVisible(true);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Erro ao enviar código");
      }

      setAlertData({
        type: "success",
        title: "Sucesso",
        message: "Código de recuperação enviado para o seu e-mail.",
      });
      setAlertVisible(true);
      router.push({ pathname: "/resetPassword", params: { email } });
    } catch (err: any) {
      setAlertData({
        type: "error",
        title: "Erro",
        message: err.message || "Falha ao enviar código.",
      });
      setAlertVisible(true);
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
        <BackButtonAuth onPress={() => router.back()}>
          <CircleArrowLeft color="#f5f7fa" size={50} />
        </BackButtonAuth>
        <TitlePage>Recuperação</TitlePage>

        <Input
          placeholder="Digite seu e-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <OutlineButton onPress={enviarCodigo} disabled={loading}>
          <OutlineButtonText>
            {loading ? <ActivityIndicator color="#22c55e" /> : "ENVIAR CÓDIGO"}
          </OutlineButtonText>
        </OutlineButton>
      </FormContainer>

      <Alert
        visible={alertVisible}
        type={alertData.type}
        title={alertData.title}
        message={alertData.message}
        onClose={() => setAlertVisible(false)}
      />
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

const FormContainer = styled.View`
  background-color: #f5f7fa;
  margin-top: -150px;
  padding: 24px;
  width: 85%;
  border-radius: 20px;
  box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.1);
`;
