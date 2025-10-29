# ⚡ Como Deployar o Backend - INSTRUÇÕES SIMPLES

## 🎯 O que fazer AGORA:

### Opção 1: Railway (Recomendado - GRÁTIS)

1. **Instale o Node.js** no seu Mac:
   - Acesse: https://nodejs.org
   - Baixe e instale a versão LTS
   - Abra o Terminal e digite: `node --version` (deve mostrar v18 ou superior)

2. **Crie conta no MongoDB Atlas:**
   - Acesse: https://www.mongodb.com/cloud/atlas
   - Clique em "Try Free"
   - Crie um cluster gratuito
   - Crie usuário (username + senha)
   - Copie a connection string

3. **Deploy no Railway:**
   - Acesse: https://railway.app
   - Entre com GitHub
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Escolha: GabrielQuaresminha/EbookHub
   - Adicione variável: `MONGODB_URI` = sua connection string
   - Railway vai fazer o deploy!

4. **Atualize a API_URL no Vercel:**
   - Vá para: https://vercel.com
   - Encontre o domínio que Railway gerou
   - Copie o domínio
   - Atualize no `script.js`: linha 2, coloque o domínio do Railway

### Opção 2: Continue com localStorage (Temporário)

Se não puder fazer o deploy agora, a loja continua funcionando com localStorage.
Porém, cada navegador terá seus próprios usuários (é normal por enquanto).

## 📝 Próximos Passos:

Depois do deploy, commitar e fazer push:

```bash
git add .
git commit -m "Backend implementado - Sistema de autenticação com MongoDB"
git push origin main
```

---

**🎉 Depois do deploy, usuários poderão fazer login de qualquer navegador!**

