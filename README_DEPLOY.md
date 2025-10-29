# 🚀 Deploy EbookHub - Guia Completo

## 📋 Pré-requisitos

1. Node.js instalado (versão 18+)
2. Conta no MongoDB Atlas (banco de dados grátis)
3. Conta no Railway (hosting grátis para backend)

## 🔧 Passo 1: Configurar MongoDB Atlas

1. Acesse: https://www.mongodb.com/cloud/atlas
2. Crie uma conta grátis
3. Crie um cluster (Free tier)
4. Crie um usuário de banco de dados
5. Conecte e pegue a connection string

## 🌐 Passo 2: Deploy Backend no Railway

1. Acesse: https://railway.app
2. Criar novo projeto
3. Conectar com GitHub
4. Selecionar repositório: GabrielQuaresminha/EbookHub
5. Adicionar variável de ambiente:
   - Nome: `MONGODB_URI`
   - Valor: `mongodb+srv://usuario:senha@cluster.mongodb.net/ebookhub`
6. Railway vai fazer o deploy automático!

## 📱 Passo 3: Atualizar Frontend

O arquivo `script.js` já está configurado para usar a API_URL.
Quando o backend estiver no ar, atualizar o domínio no Vercel.

## ✅ Teste

1. Cadastre um usuário
2. Faça login em outro navegador
3. Deve funcionar! 🎉

---

**IMPORTANTE:** Atualize a `API_URL` no `script.js` com o domínio do Railway após o deploy!

