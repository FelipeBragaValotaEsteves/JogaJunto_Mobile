# 📱 JogaJunto Mobile

## 📌 Descrição

JogaJunto_Mobile é um aplicativo mobile desenvolvido com **React Native + Expo**. Ele foi configurado usando o template padrão do **create-expo-app**, permitindo que você desenvolva e execute o app tanto em dispositivos Android quanto iOS com facilidade. ([GitHub][1])

---

## 🚀 Pré-requisitos

Antes de começar, você vai precisar instalar algumas ferramentas:

### ✅ 1. Node.js

Instale a versão **LTS (recomendada)** do Node.js em: [https://nodejs.org/](https://nodejs.org/)

### ✅ 2. Expo Go (no celular — opcional para rodar no dispositivo físico)

Baixe na loja do seu celular:
📱 **Android** → Google Play
📱 **iOS** → App Store
O app **Expo Go** permite testar o projeto rodando direto no seu dispositivo em vez de correr em emulador. ([Expo][2])

### ✅ 3. Editor de Código

Recomendado: **Visual Studio Code**

---

## 📥 Passo a passo — Instalar o projeto

### 1. Clonar o repositório

Abra o terminal e rode:

```sh
git clone https://github.com/FelipeBragaValotaEsteves/JogaJunto_Mobile.git
```

Depois entre na pasta do projeto:

```sh
cd JogaJunto_Mobile
```

---

### 2. Instalar as dependências

Dentro da pasta do projeto, rode:

```sh
npm install
```

ou, se você usa **Yarn**:

```sh
yarn
```

Isso instala as bibliotecas necessárias do projeto (incluindo o Expo CLI). ([GitHub][1])

---

## ▶️ Como executar o projeto

### 💻 Rodar o servidor de desenvolvimento

No terminal, dentro da pasta do projeto, rode:

```sh
npx expo start
```

Esse comando vai iniciar o **Metro Bundler** e abrir um painel no seu navegador com um QR Code e instruções de como continuar. ([GitHub][1])

---

## 📲 Como abrir o app no celular

### 📍 Usando o aplicativo Expo Go

1. Abra o **Expo Go** no seu celular.
2. Escaneie o **QR Code** que apareceu no terminal ou no painel do navegador.
3. O app será carregado no seu celular automaticamente.

💡 Cada vez que você salvar uma mudança no código, o app será atualizado automaticamente no seu celular. ([Alura][3])

---

## 🖥️ Como abrir no emulador

Se você quiser rodar no emulador localmente:

### Android

1. Instale o **Android Studio**.
2. Configure um **emulador Android**.
3. No painel do Expo (após `npx expo start`), clique em **Run on Android device/emulator**.

### iOS (macOS)

1. Instale **Xcode**.
2. Use o **simulador iOS**.
3. No painel do Expo, clique em **Run on iOS simulator**.

> Obs.: O emulador exige mais configuração e espaço no PC/Mac, caso queira começar rápido use o **Expo Go no celular**. ([Alura][3])

---

## 📂 Estrutura do projeto

Aqui está a organização básica (a partir do que o repositório contém):

```
📁 app/             
📁 assets/  
📁 components/     ← Componentes React reutilizáveis  
📁 constants/  
📁 contexts/  
📁 hooks/  
📁 styles/  
📁 utils/  
📄 app.json  
📄 package.json  
📄 tsconfig.json  
```

---

## 💡 Dicas

✨ Se aparecerem erros após instalar dependências, tente apagar a pasta `node_modules` e rodar `npm install` novamente.

✨ Ao rodar `npx expo start`, experimente:

* Pressionar **a** → abre no emulador Android (se configurado)
* Pressionar **i** → abre no emulador iOS (macOS + Xcode)

---

## 🧑‍💻 Referências

Este projeto utiliza o **framework Expo**, que é uma plataforma para criar apps universais com React Native, facilitando instalação e execução sem necessidade imediata de Android Studio ou Xcode. ([Expo][2])

