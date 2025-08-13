import { useRouter } from "expo-router";
import { CircleArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import { Alert } from "react-native";
import styled from "styled-components/native";
import LogoJogaJunto from "../../assets/images/logo-white.svg";

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      return Alert.alert("Erro", "Preencha todos os campos.");
    }

    if (password !== confirmPassword) {
      return Alert.alert("Erro", "As senhas não coincidem.");
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
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
        Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
        router.replace("/login");
      } else {
        Alert.alert("Erro", data.message || "Erro ao cadastrar usuário.");
      }
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      Alert.alert("Erro", "Erro ao conectar com o servidor.");
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

        <Title>Cadastre-se</Title>

        <StyledInput
          placeholder="Nome"
          value={name}
          onChangeText={setName}
        />
        <StyledInput
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <StyledInput
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <StyledInput
          placeholder="Confirma Senha"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <SubmitButton onPress={handleRegister}>
          <SubmitButtonText>CADASTRAR</SubmitButtonText>
        </SubmitButton>
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
  position: relative;
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

const BackButton = styled.TouchableOpacity`
  position: absolute;
  top: -60px;
  left: 0px;
  z-index: 10;
`;

const SubmitButton = styled.TouchableOpacity`
  border: 2px solid #22c55e;
  border-radius: 16px;
  padding: 16px 0;
  margin-top: 12px;
  align-items: center;
  margin-bottom: 40px;
`;

const SubmitButtonText = styled.Text`
  color: #22c55e;
  font-weight: 700;
`;
