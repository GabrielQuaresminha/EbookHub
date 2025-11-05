# 📚 EbookHub - Loja de Ebooks Multi-Nichos

![EbookHub](logo.png)

> Sua loja de ebooks digital completa, com pagamento integrado via Mercado Pago e entrega automática!

## 🎯 Sobre o Projeto

**EbookHub** é uma plataforma de e-commerce especializada em ebooks digitais, cobrindo diversos nichos de conhecimento. Com design moderno, sistema de pagamento integrado e entrega automática, oferece uma experiência completa tanto para administradores quanto para clientes.

## ✨ Funcionalidades Principais

### 🛒 **Para Clientes**
- ✅ Navegação por categorias (Ensino, Culinária, Negócios, Desenvolvimento, Saúde, Finanças)
- ✅ Sistema de busca inteligente
- ✅ Carrinho de compras funcional
- ✅ Pagamento seguro via Mercado Pago (PIX, Cartão, Boleto)
- ✅ Biblioteca pessoal "Meus Ebooks"
- ✅ Download imediato após confirmação de pagamento
- ✅ Cadastro e login de usuários
- ✅ Design responsivo (mobile, tablet, desktop)

### 🔐 **Sistema de Autenticação**
- Cadastro com validação de email
- Login seguro
- Recuperação de senha
- Alteração de senha
- Gerenciamento de perfil

### 💳 **Pagamentos**
- Integração completa com Mercado Pago
- Suporte a PIX, Cartão de Crédito e Boleto
- Verificação automática de pagamentos
- Webhook para confirmação instantânea
- Sistema de polling para PIX

### 📚 **Catálogo Atual**
- **20 ebooks** disponíveis
- **6 categorias** diferentes
- Preço padrão: R$ 14,90

## 🛠️ Tecnologias Utilizadas

### Frontend
- HTML5
- CSS3 (Design responsivo)
- JavaScript (ES6+)
- Font Awesome (Ícones)
- Mercado Pago SDK

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Mercado Pago API
- CORS

### Deploy
- **Frontend**: Vercel
- **Backend**: Railway
- **Domínio**: lojaebookhub.com.br

## 📁 Estrutura do Projeto

```
EbookHub/
├── covers/              # Capas dos ebooks (.jpg)
├── pdfs/                # PDFs dos ebooks
├── api/                 # Endpoints do backend
├── index.html           # Página principal
├── script.js            # Lógica do frontend
├── styles.css           # Estilos
├── server.js            # Servidor backend
├── logo.png             # Logo da loja
├── sitemap.xml          # SEO - Sitemap
├── robots.txt           # SEO - Robots
└── README.md            # Este arquivo
```

## 🚀 Como Adicionar um Novo Ebook

1. **Prepare os arquivos:**
   - Converta a capa para `.jpg` e coloque em `covers/`
   - Coloque o PDF em `pdfs/`

2. **Adicione no código:**
   - Edite `index.html` (card do produto)
   - Edite `script.js` (capa, download, detalhes)
   - Atualize contador de ebooks

3. **Deploy automático:**
   ```bash
   git add .
   git commit -m "Novo ebook: [Nome do Ebook]"
   git push
   ```

## 🌐 URLs do Projeto

- **Site Principal**: https://lojaebookhub.com.br
- **Backend API**: https://ebookhub-production.up.railway.app
- **Repositório**: GitHub (privado)

## 📊 Categorias Disponíveis

| Categoria | Quantidade | Ícone |
|-----------|------------|-------|
| Ensino & Educação | 3 | 🎓 |
| Culinária | 4 | 🍳 |
| Negócios & Marketing | 4 | 💼 |
| Desenvolvimento Pessoal | 3 | 💪 |
| Saúde & Bem-estar | 3 | 💚 |
| Finanças | 3 | 💰 |

## 🔧 Configuração Local

### Pré-requisitos
- Node.js v16+
- MongoDB
- Conta Mercado Pago

### Instalação

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   ```bash
   MONGODB_URI=sua_uri_mongodb
   MP_ACCESS_TOKEN=seu_token_mercadopago
   ```

4. Execute o servidor:
   ```bash
   node server.js
   ```

## 📈 SEO e Marketing

- ✅ Sitemap configurado
- ✅ Robots.txt configurado
- ✅ Meta tags otimizadas
- ✅ URLs amigáveis
- ✅ Instagram: @loja.ebookhub

## 🎨 Design

- Design moderno e limpo
- Paleta de cores: Roxo/Azul
- Totalmente responsivo
- Animações suaves
- UX intuitiva

## 📝 Licença

© 2025 EbookHub. Todos os direitos reservados.

## 📧 Contato

- **Email**: ebookhub.vendas@gmail.com
- **Instagram**: @loja.ebookhub
- **Localização**: São Paulo, Brasil

---

**Desenvolvido com ❤️ para democratizar o conhecimento através de ebooks acessíveis!**
