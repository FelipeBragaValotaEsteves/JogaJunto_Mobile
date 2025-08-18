import { useRouter } from "expo-router";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import LogoJogaJunto from "../../assets/images/logo-white.svg";
import { Alert } from "../../components/shared/Alert";
import { OutlineButton, OutlineButtonText } from "../../components/shared/Button";
import { Input } from "../../components/shared/Input";
import { TitlePage } from "../../components/shared/TitlePage";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({
    type: "error",
    title: "",
    message: "",
  });

  const handleLogin = async () => {
    if (!email || !password) {
      setAlertData({
        type: "error",
        title: "Erro",
        message: "Preencha todos os campos.",
      });
      setAlertVisible(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await login(data.token);
        router.replace("../tabs/index");
      } else {
        setAlertData({
          type: "error",
          title: "Erro",
          message: data.message || "Usuário ou senha inválidos.",
        });
        setAlertVisible(true);
      }
    } catch (error) {
      console.error("Erro no login:", error);
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
        <TitlePage>Login</TitlePage>

        <Input
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <OutlineButton onPress={handleLogin}>
          <OutlineButtonText>ENTRAR</OutlineButtonText>
        </OutlineButton>

        <Footer>
          <TouchableOpacity onPress={() => router.push("/forgotPassword")}>
            <ForgotText>esqueceu senha?</ForgotText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("./register")}>
            <RegisterText>cadastre-se</RegisterText>
          </TouchableOpacity>
        </Footer>
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

const Footer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
  margin-bottom: 100px;
`;

const ForgotText = styled.Text`
  color: #b0bec5;
  font-size: 16px;
`;

const RegisterText = styled.Text`
  color: #22c55e;
  font-size: 16px;
  font-weight: 600;
`;
