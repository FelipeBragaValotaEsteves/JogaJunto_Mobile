import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import LogoJogaJunto from "../../assets/images/logo-white.svg";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert("Erro", "Preencha todos os campos.");
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await login(data.token); 
        router.replace("../tabs/index");
      } else {
        Alert.alert("Erro", data.message || "Usuário ou senha inválidos.");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      Alert.alert("Erro", "Erro ao conectar com o servidor.");
    }
  };

  return (
    <Container>
      <Header>
        <LogoJogaJunto width={265} />
      </Header>

      <FormContainer>
        <Title>Login</Title>

        <StyledInput
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
        />
        <StyledInput
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <LoginButton onPress={handleLogin}>
          <LoginButtonText>ENTRAR</LoginButtonText>
        </LoginButton>

        <Footer>
          <ForgotText>esqueceu senha?</ForgotText>
          <TouchableOpacity onPress={() => router.push("./register")}>
            <RegisterText>cadastre-se</RegisterText>
          </TouchableOpacity>
        </Footer>
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

const LoginButton = styled.TouchableOpacity`
  border: 2px solid #22c55e;
  border-radius: 16px;
  padding: 16px 0;
  margin-top: 40px;
  align-items: center;
`;

const LoginButtonText = styled.Text`
  color: #22c55e;
  font-weight: 700;
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
