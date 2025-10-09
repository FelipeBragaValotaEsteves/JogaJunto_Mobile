import { useRouter } from "expo-router";
import { CircleArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import { styled } from "styled-components/native";
import LogoJogaJunto from "../../assets/images/logo-white.svg";
import { Alert } from "../../components/shared/Alert";
import { BackButtonAuth } from "../../components/shared/BackButton";
import { OutlineButton, OutlineButtonText } from "../../components/shared/Button";
import { Input } from "../../components/shared/Input";
import { TitlePage } from "../../components/shared/TitlePage";
import BASE_URL from "../../constants/config";

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({
    type: "error",
    title: "",
    message: "",
  });

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setAlertData({
        type: "error",
        title: "Erro",
        message: "Preencha todos os campos.",
      });
      setAlertVisible(true);
      return;
    }

    if (password !== confirmPassword) {
      setAlertData({
        type: "error",
        title: "Erro",
        message: "As senhas não coincidem.",
      });
      setAlertVisible(true);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAlertData({
          type: "success",
          title: "Sucesso",
          message: "Cadastro realizado com sucesso!",
        });
        setAlertVisible(true);
        router.replace("/login");
      } else {
        setAlertData({
          type: "error",
          title: "Erro",
          message: data.message || "Erro ao cadastrar usuário.",
        });
        setAlertVisible(true);
      }
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      setAlertData({
        type: "error",
        title: "Erro",
        message: "Erro ao conectar com o servidor.",
      });
      setAlertVisible(true);
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

        <TitlePage>Cadastre-se</TitlePage>

        <Input
          placeholder="Nome"
          value={name}
          onChangeText={setName}
        />
        <Input
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
        />
        <Input
          placeholder="Confirma Senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <OutlineButton onPress={handleRegister}>
          <OutlineButtonText>CADASTRAR</OutlineButtonText>
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
  position: relative;
  padding: 24px;
  width: 85%;
  border-radius: 20px;
  box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.1);
`;
