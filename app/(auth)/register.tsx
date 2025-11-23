import { useRouter } from "expo-router";
import { CircleArrowLeft } from "lucide-react-native";
import React, { useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
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
  const scrollViewRef = useRef<ScrollView>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    upperLower: false,
    number: false,
    special: false,
  });
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({
    type: "error",
    title: "",
    message: "",
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkPasswordStrength = (pass: string) => {
    if (!pass) {
      setPasswordStrength("");
      setPasswordCriteria({
        length: false,
        upperLower: false,
        number: false,
        special: false,
      });
      return;
    }

    const criteria = {
      length: pass.length >= 8,
      upperLower: /[a-z]/.test(pass) && /[A-Z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[^a-zA-Z0-9]/.test(pass),
    };

    setPasswordCriteria(criteria);

    const strength = Object.values(criteria).filter(Boolean).length;

    if (strength <= 1) setPasswordStrength("Fraca");
    else if (strength === 2) setPasswordStrength("Média");
    else if (strength === 3) setPasswordStrength("Boa");
    else setPasswordStrength("Forte");
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    checkPasswordStrength(text);
    
    if (confirmPassword) {
      setPasswordsMatch(text === confirmPassword);
    }

    if (text.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: 250, animated: true });
      }, 100);
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    
    if (password) {
      setPasswordsMatch(text === password);
    } else {
      setPasswordsMatch(null);
    }
  };

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

    if (name.length > 15) {
      setAlertData({
        type: "error",
        title: "Erro",
        message: "O nome deve ter no máximo 15 caracteres.",
      });
      setAlertVisible(true);
      return;
    }

    if (!validateEmail(email)) {
      setAlertData({
        type: "error",
        title: "Erro",
        message: "Digite um email válido.",
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
      setAlertData({
        type: "error",
        title: "Erro",
        message: "Erro ao conectar com o servidor.",
      });
      setAlertVisible(true);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
      keyboardVerticalOffset={0}
    >
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }} 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Container>
          <Header>
            <LogoJogaJunto width={265} />
          </Header>

          <FormContainer>

            <BackButtonAuth onPress={() => router.back()}>
              <CircleArrowLeft color="#f5f7fa" size={50} />
            </BackButtonAuth>

            <TitlePage>Cadastre-se</TitlePage>

            <CharacterCount>{name.length}/15</CharacterCount>

            <Input
              placeholder="Nome"
              value={name}
              onChangeText={setName}
              maxLength={15}
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
              onChangeText={handlePasswordChange}
              secureTextEntry
            />
            
            {password.length > 0 && (
              <PasswordValidationContainer>
                <PasswordStrengthHeader>
                  <PasswordStrengthText strength={passwordStrength}>
                    Força: {passwordStrength}
                  </PasswordStrengthText>
                  <StrengthBar strength={passwordStrength} />
                </PasswordStrengthHeader>
                
                <CriteriaList>
                  <CriteriaItem met={passwordCriteria.length}>
                    <CriteriaIcon>{passwordCriteria.length ? "✓" : "○"}</CriteriaIcon>
                    <CriteriaText met={passwordCriteria.length}>
                      Mínimo 8 caracteres
                    </CriteriaText>
                  </CriteriaItem>
                  
                  <CriteriaItem met={passwordCriteria.upperLower}>
                    <CriteriaIcon>{passwordCriteria.upperLower ? "✓" : "○"}</CriteriaIcon>
                    <CriteriaText met={passwordCriteria.upperLower}>
                      Letras maiúsculas e minúsculas
                    </CriteriaText>
                  </CriteriaItem>
                  
                  <CriteriaItem met={passwordCriteria.number}>
                    <CriteriaIcon>{passwordCriteria.number ? "✓" : "○"}</CriteriaIcon>
                    <CriteriaText met={passwordCriteria.number}>
                      Pelo menos 1 número
                    </CriteriaText>
                  </CriteriaItem>
                  
                  <CriteriaItem met={passwordCriteria.special}>
                    <CriteriaIcon>{passwordCriteria.special ? "✓" : "○"}</CriteriaIcon>
                    <CriteriaText met={passwordCriteria.special}>
                      Caractere especial (!@#$%...)
                    </CriteriaText>
                  </CriteriaItem>
                </CriteriaList>
              </PasswordValidationContainer>
            )}
            
            <Input
              placeholder="Confirma Senha"
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              secureTextEntry
            />
            
            {confirmPassword.length > 0 && (
              <PasswordMatchContainer>
                {passwordsMatch === true && (
                  <PasswordMatchText match={true}>
                    ✓ As senhas coincidem
                  </PasswordMatchText>
                )}
                {passwordsMatch === false && (
                  <PasswordMatchText match={false}>
                    ✗ As senhas não coincidem
                  </PasswordMatchText>
                )}
              </PasswordMatchContainer>
            )}

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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const Container = styled.View`
  flex: 1;
  align-items: center;
  background-color: white;
  min-height: 100%;
`;

const Header = styled.View`
  width: 100%;
  background: #3b82f6;
  padding-top: 100px;
  padding-bottom: 200px;
  border-bottom-left-radius: 40px;
  border-bottom-right-radius: 40px;
  justify-content: start;
  align-items: center;
`;

const FormContainer = styled.View`
  background-color: #f5f7fa;
  margin-top: -150px;
  margin-bottom: 50px;
  padding: 24px;
  width: 85%;
  border-radius: 20px;
  box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.1);
`;

const CharacterCount = styled.Text`
  font-size: 12px;
  color: #666;
  text-align: right;
  margin-top: -8px;
  margin-bottom: 8px;
`;

const PasswordValidationContainer = styled.View`
  background-color: #fff;
  border-radius: 12px;
  padding: 12px;
  margin-top: 8px;
  margin-bottom: 12px;
  border: 1px solid #e5e7eb;
`;

const PasswordStrengthHeader = styled.View`
  margin-bottom: 12px;
`;

const PasswordStrengthText = styled.Text<{ strength: string }>`
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 6px;
  color: ${
    (props) => {
      switch (props.strength) {
        case 'Fraca': return '#ef4444';
        case 'Média': return '#f59e0b';
        case 'Boa': return '#10b981';
        case 'Forte': return '#059669';
        default: return '#666';
      }
    }
  };
`;

const StrengthBar = styled.View<{ strength: string }>`
  height: 4px;
  border-radius: 2px;
  background-color: #e5e7eb;
  overflow: hidden;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${
      (props) => {
        switch (props.strength) {
          case 'Fraca': return '25%';
          case 'Média': return '50%';
          case 'Boa': return '75%';
          case 'Forte': return '100%';
          default: return '0%';
        }
      }
    };
    background-color: ${
      (props) => {
        switch (props.strength) {
          case 'Fraca': return '#ef4444';
          case 'Média': return '#f59e0b';
          case 'Boa': return '#10b981';
          case 'Forte': return '#059669';
          default: return '#e5e7eb';
        }
      }
    };
  }
`;

const CriteriaList = styled.View`
  gap: 8px;
`;

const CriteriaItem = styled.View<{ met: boolean }>`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const CriteriaIcon = styled.Text`
  font-size: 14px;
  font-weight: bold;
  width: 18px;
`;

const CriteriaText = styled.Text<{ met: boolean }>`
  font-size: 12px;
  color: ${props => props.met ? '#10b981' : '#6b7280'};
  font-weight: ${props => props.met ? '600' : '400'};
`;

const PasswordMatchContainer = styled.View`
  margin-top: 8px;
  margin-bottom: 8px;
`;

const PasswordMatchText = styled.Text<{ match: boolean }>`
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.match ? '#10b981' : '#ef4444'};
`;
