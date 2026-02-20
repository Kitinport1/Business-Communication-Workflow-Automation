# 🤖 Business Communication Workflow Automation

Sistema completo de automação de workflows de comunicação empresarial com integrações multicanal, automações de marketing, análise SEO e muito mais.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![Firebase](https://img.shields.io/badge/Firebase-10.0.0-ffca28)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.0-7952b3)

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Funcionalidades](#-funcionalidades)
- [Arquitetura do Projeto](#-arquitetura-do-projeto)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Comandos Úteis](#-comandos-úteis)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Integrações](#-integrações)
- [Deploy](#-deploy)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

## 🎯 Visão Geral

O **Business Communication Workflow Automation** é uma plataforma completa para automatizar processos de comunicação empresarial. Permite criar workflows personalizados, gerenciar automações de marketing, analisar SEO, integrar múltiplos canais de comunicação e muito mais.

### Principais Diferenciais
- ✅ Interface moderna e responsiva
- ✅ Autenticação segura com Firebase
- ✅ Upload de fotos com preview
- ✅ Automações baseadas em triggers
- ✅ Monitoramento SEO em tempo real
- ✅ Integração com múltiplos canais (Email, Slack, WhatsApp)

## 🛠 Tecnologias Utilizadas

### Frontend
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| React | 18.2.0 | Biblioteca principal |
| React Router DOM | 6.14.0 | Roteamento de páginas |
| Bootstrap | 5.3.0 | Framework CSS |
| React Bootstrap | 2.8.0 | Componentes Bootstrap para React |
| Bootstrap Icons | 1.10.0 | Ícones vetoriais |

### Backend e Banco de Dados
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| Firebase | 10.0.0 | Plataforma completa |
| Firebase Auth | - | Autenticação de usuários |
| Firebase Firestore | - | Banco de dados NoSQL |
| Firebase Storage | - | Armazenamento de arquivos |
| Firebase Hosting | - | Hospedagem da aplicação |

### Ferramentas de Desenvolvimento
| Tecnologia | Descrição |
|------------|-----------|
| GitHub Actions | CI/CD automático |
| ESLint | Padronização de código |
| Prettier | Formatação de código |
| npm | Gerenciador de pacotes |

## ✨ Funcionalidades

### 🔐 **Autenticação e Usuários**
- ✅ Login com email e senha
- ✅ Registro de novos usuários
- ✅ Upload de foto de perfil
- ✅ Gerenciamento de perfil
- ✅ Histórico de login

### 📊 **Dashboard**
- ✅ Visão geral do sistema
- ✅ Estatísticas em tempo real
- ✅ Workflows em destaque
- ✅ Atividade recente
- ✅ Gráficos de performance

### ⚙️ **Workflows**
- ✅ Criar workflows personalizados
- ✅ Definir triggers e ações
- ✅ Execução manual ou automática
- ✅ Histórico de execuções
- ✅ Métricas de performance

### 🤖 **Automações**
- ✅ Automações baseadas em eventos
- ✅ Triggers configuráveis (novo usuário, aniversário, etc.)
- ✅ Canais múltiplos (Email, Slack, WhatsApp)
- ✅ Agendamento flexível
- ✅ Histórico de execuções
- ✅ Duplicar e pausar automações

### 🔍 **SEO Workflow**
- ✅ Análise de palavras-chave
- ✅ Monitoramento de rankings
- ✅ Análise de concorrentes
- ✅ Auditoria de site
- ✅ Recomendações de melhoria
- ✅ Relatórios por email

### 📧 **Marketing Channels**
- ✅ Gerenciamento de listas de email
- ✅ Integração com Slack
- ✅ Grupos de WhatsApp
- ✅ Templates de mensagem
- ✅ Campanhas agendadas
- ✅ Teste de canais

### 📈 **Analytics**
- ✅ Métricas de execução
- ✅ Taxa de sucesso
- ✅ Tempo médio de execução
- ✅ Workflows mais utilizados
- ✅ Distribuição por categoria

## 🏗 Arquitetura do Projeto
┌─────────────────────────────────────────────────────────┐
│ CLIENT SIDE │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │ React │ │ Bootstrap │ │ Context │ │
│ │ Components │ │ Styles │ │ State │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ │
└─────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────┐
│ FIREBASE │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │ Auth │ │ Firestore │ │ Storage │ │
│ │ Autenticação│ │ Banco │ │ Arquivos │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ │
└─────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────┐
│ GITHUB ACTIONS │
│ CI/CD - Deploy Automático │
└─────────────────────────────────────────────────────────┘

text

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

- [Node.js](https://nodejs.org/) (v16 ou superior)
- [npm](https://www.npmjs.com/) (v8 ou superior)
- [Git](https://git-scm.com/)
- [Firebase CLI](https://firebase.google.com/docs/cli)

```bash
# Verificar versões
node --version
npm --version
git --version
🚀 Instalação e Configuração
1️⃣ Clonar o repositório
bash
git clone https://github.com/kitinport1/Business-Communication-Workflow-Automation.git
cd Business-Communication-Workflow-Automation
2️⃣ Instalar dependências
bash
npm install
3️⃣ Configurar Firebase
3.1 Criar projeto no Firebase
Acesse Firebase Console

Clique em "Adicionar projeto"

Nome do projeto: b-c-w-automation (ou outro nome)

Siga as instruções

3.2 Ativar serviços
Authentication → Sign-in method → Ativar Email/Senha

Firestore Database → Criar banco em modo de teste

Storage → Criar storage em modo de teste

3.3 Configurar regras do Storage
No Firebase Console > Storage > Rules:

javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /avatars/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
3.4 Configurar arquivo de ambiente
Crie o arquivo .env na raiz:

env
REACT_APP_FIREBASE_API_KEY=sua_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=seu-projeto
REACT_APP_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=seu-sender-id
REACT_APP_FIREBASE_APP_ID=seu-app-id
4️⃣ Iniciar o projeto localmente
bash
npm start
Acesse: http://localhost:3000

📚 Comandos Úteis
Desenvolvimento
Comando	Descrição
npm start	Inicia o servidor de desenvolvimento
npm test	Executa os testes
npm run build	Gera build de produção
npm run eject	Ejeta as configurações do Create React App
Git e GitHub
bash
# Verificar status
git status

# Adicionar arquivos
git add .

# Commitar
git commit -m "mensagem do commit"

# Enviar para GitHub
git push origin main

# Criar branch
git checkout -b feature/nova-funcionalidade

# Voltar para main
git checkout main

# Atualizar local
git pull origin main
Firebase
bash
# Login no Firebase
firebase login

# Inicializar Firebase no projeto
firebase init

# Inicializar apenas hosting
firebase init hosting

# Inicializar hosting com GitHub Actions
firebase init hosting:github

# Deploy manual
npm run build
firebase deploy --only hosting

# Ver projetos
firebase projects:list

# Abrir console no navegador
firebase console
Deploy Automático (GitHub Actions)
bash
# Após configurar, basta fazer push
git add .
git commit -m "atualização"
git push origin main
📁 Estrutura de Pastas
text
business-workflow-automation/
├── .github/
│   └── workflows/
│       ├── firebase-hosting-merge.yml
│       └── firebase-hosting-pull-request.yml
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── main.scss
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header/
│   │   │   │   ├── index.jsx
│   │   │   │   └── Header.scss
│   │   │   └── Sidebar/
│   │   │       ├── index.jsx
│   │   │       └── Sidebar.scss
│   │   ├── seo/
│   │   │   └── SEODashboard.jsx
│   │   ├── workflows/
│   │   │   └── WorkflowBuilder.jsx
│   │   ├── PrivateRoute.jsx
│   │   └── ConnectionStatus.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── WorkflowContext.jsx
│   │   └── SEOContext.jsx
│   ├── hooks/
│   │   ├── useDatabase.js
│   │   ├── useFirebaseUpload.js
│   │   └── useFirebaseWithOffline.js
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Profile.jsx
│   │   ├── Workflows.jsx
│   │   ├── Automations.jsx
│   │   ├── SEO.jsx
│   │   ├── MarketingChannels.jsx
│   │   ├── Analytics.jsx
│   │   ├── Communications.jsx
│   │   ├── Team.jsx
│   │   ├── Schedule.jsx
│   │   └── Settings.jsx
│   ├── services/
│   │   ├── firebase.js
│   │   ├── databaseService.js
│   │   ├── connectionService.js
│   │   ├── apiService.js
│   │   └── seoService.js
│   ├── App.js
│   └── index.js
├── .env
├── .gitignore
├── firebase.json
├── .firebaserc
├── package.json
├── README.md
└── deploy-check.js
🔌 Integrações
Canais de Comunicação
Email: Integração com SendGrid/Mailgun (em desenvolvimento)

Slack: Webhooks para canais

WhatsApp: API do WhatsApp Business (em desenvolvimento)

🌐 Deploy
Deploy Manual
bash
# 1. Gerar build
npm run build

# 2. Deploy para Firebase
firebase deploy --only hosting
Deploy Automático (GitHub Actions)
Após configurar o GitHub Actions, toda push na branch main:

✅ Executa npm install

✅ Executa npm run build

✅ Deploy para Firebase Hosting

✅ URL: https://b-c-w-automation.web.app

Pull Requests
Ao abrir um PR, o GitHub Actions:

✅ Cria um preview temporário

✅ Comenta no PR com a URL de preview

✅ Facilita o teste antes do merge

🤝 Contribuição
Faça um fork do projeto

Crie sua branch (git checkout -b feature/AmazingFeature)

Commit suas mudanças (git commit -m 'Add some AmazingFeature')

Push para a branch (git push origin feature/AmazingFeature)

Abra um Pull Request

📝 Licença
Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

✨ Créditos
Desenvolvido por kitinport1

🆘 Suporte
Em caso de dúvidas ou problemas:

Abra uma issue

Consulte a documentação do Firebase

Consulte a documentação do React

⭐ Se este projeto te ajudou, dê uma estrela no GitHub!

text

## 📋 **Como adicionar ao seu projeto**

```bash
# 1. No diretório do projeto, crie o arquivo README.md
touch README.md

# 2. Abra o arquivo e cole todo o conteúdo acima
# (use seu editor de código preferido)

# 3. Adicione ao git
git add README.md
git commit -m "Add comprehensive README documentation"
git push origin main