# 🔓 Como Liberar o IP do Railway no MongoDB Atlas

## ❌ O Problema:
O Railway está recebendo "timeout" ao tentar conectar com o MongoDB. Isso acontece porque o IP do Railway não está liberado no banco de dados.

## ✅ SOLUÇÃO:

### 1. Acesse o MongoDB Atlas:
https://cloud.mongodb.com

### 2. Vá em "Network Access":
- No menu lateral esquerdo, clique em **"Network Access"**
- Ou clique direto neste link: https://cloud.mongodb.com/v2

### 3. Liberar TODOS os IPs:
- Clique no botão **"+ ADD IP ADDRESS"**
- Clique em **"ALLOW ACCESS FROM ANYWHERE"**
- Adicione: `0.0.0.0/0`
- Clique em **"Confirm"**

### 4. Aguarde 1-2 minutos:
O MongoDB precisa processar a mudança.

### 5. Teste novamente:
Depois de liberar, tente criar a conta novamente.

---

**⚠️ IMPORTANTE:**
Isso libera o acesso de QUALQUER IP. Está seguro porque:
- Precisa do usuário e senha (que você tem)
- Está protegido por autenticação
- É normal para aplicações em produção

---

**Depois que liberar, me avise!** 🚀

