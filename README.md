# 📚 EbookHub - Loja Virtual de Ebooks Multi-Nichos

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-active-success)

Uma plataforma moderna e completa para venda de ebooks digitais em múltiplos nichos de conhecimento.

## 🎯 Sobre o Projeto

**EbookHub** é uma loja virtual desenvolvida para comercialização de ebooks próprios em diversos nichos de mercado. O projeto foi criado com foco em:

- **Interface Moderna**: Design limpo e profissional
- **Experiência do Usuário**: Navegação intuitiva e responsiva
- **Performance**: Carregamento rápido e otimizado
- **Funcionalidades Completas**: Sistema de filtros, busca, carrinho e checkout

## ✨ Funcionalidades

### 🛍️ Sistema de Compras
- ✅ Carrinho de compras funcional
- ✅ Adicionar/remover produtos
- ✅ Persistência de dados (localStorage)
- ✅ Cálculo automático de total
- ✅ Modal de carrinho elegante
- ✅ Sistema de checkout

### 🔍 Navegação e Busca
- ✅ Busca em tempo real
- ✅ Filtros por categoria
- ✅ Sistema de tags
- ✅ Scroll suave entre seções
- ✅ Atalhos de teclado (ESC para fechar modal, CTRL+K para busca)

### 🎨 Interface
- ✅ Design responsivo (Desktop, Tablet, Mobile)
- ✅ Animações suaves
- ✅ Sistema de notificações
- ✅ Badges de status (Novo, Best Seller, Popular)
- ✅ Sistema de avaliações com estrelas
- ✅ Gradientes modernos

### 📱 Responsividade
- ✅ Layout adaptável para todos os dispositivos
- ✅ Menu otimizado para mobile
- ✅ Imagens responsivas
- ✅ Tipografia escalável

## 🏗️ Estrutura do Projeto

```
Corretora/
│
├── index.html          # Estrutura HTML principal
├── styles.css          # Estilos e design
├── script.js           # Funcionalidades JavaScript
├── README.md           # Documentação (este arquivo)
│
├── apartamento-morro/  # Arquivos de mídia (imagens antigas)
├── Apartamento-morro2/ # Arquivos de mídia (imagens antigas)
└── Logo-RMCorretora/   # Logotipo (arquivo antigo)
```

## 🎨 Categorias de Ebooks

A loja está organizada em 6 categorias principais:

### 1. 📚 Ensino & Educação
Ebooks focados em preparação para exames, concursos e desenvolvimento acadêmico.
- Como Tirar Nota 1000 no ENEM
- Concurso Polícia Federal - Guia Definitivo
- E muito mais...

### 2. 🍳 Culinária
Receitas, técnicas culinárias e guias gastronômicos.
- 150 Receitas de Bolos Irresistíveis
- Cozinha Brasileira Completa
- E muito mais...

### 3. 📈 Negócios & Marketing
Estratégias de negócios, marketing digital e redes sociais.
- Instagram para Negócios - Guia Completo
- Instagram Ads - Do Zero ao Avançado
- E muito mais...

### 4. 💡 Desenvolvimento Pessoal
Produtividade, mindset e crescimento pessoal.
- Produtividade Máxima
- E muito mais...

### 5. 💚 Saúde & Bem-estar
Alimentação saudável, exercícios e qualidade de vida.
- Guia da Alimentação Saudável
- E muito mais...

### 6. 💰 Finanças
Educação financeira, investimentos e gestão de dinheiro.
- Investimentos para Iniciantes
- E muito mais...

## 🚀 Como Usar

### Instalação Básica

1. **Clone ou baixe o projeto**
```bash
git clone [url-do-repositorio]
```

2. **Abra o arquivo index.html**
- Simplesmente abra o arquivo `index.html` em qualquer navegador moderno
- Não há necessidade de servidor ou instalação de dependências

### Uso do Sistema

1. **Navegação**
   - Use o menu superior para navegar entre seções
   - Clique nas categorias para filtrar produtos
   - Use a barra de busca para encontrar ebooks específicos

2. **Adicionando ao Carrinho**
   - Clique no botão "Adicionar" de qualquer produto
   - Veja a notificação de confirmação
   - O contador do carrinho será atualizado

3. **Gerenciando o Carrinho**
   - Clique no ícone do carrinho no canto superior direito
   - Visualize todos os itens adicionados
   - Remova itens clicando no X vermelho
   - Finalize a compra clicando em "Finalizar Compra"

4. **Filtrando Produtos**
   - Use os botões de filtro abaixo da seção "Nossos Ebooks"
   - Clique em uma categoria para ver apenas ebooks daquele nicho
   - Use "Todos" para ver todos os produtos

5. **Buscando Ebooks**
   - Digite na barra de busca no topo
   - A busca filtra em tempo real por título, descrição e categoria
   - Use CTRL+K (ou CMD+K no Mac) para focar na busca rapidamente

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Estilização moderna com Flexbox e Grid
- **JavaScript (Vanilla)**: Funcionalidades sem frameworks

### Bibliotecas Externas
- **Font Awesome 6.4.0**: Ícones modernos e elegantes
- **Google Fonts**: Tipografia (Sistema padrão otimizada)

### Recursos
- **LocalStorage API**: Persistência de dados do carrinho
- **Intersection Observer API**: Animações ao scroll
- **CSS Grid & Flexbox**: Layout responsivo
- **CSS Variables**: Temas e cores customizáveis
- **Async/Await**: Operações assíncronas (preparado para APIs futuras)

## 🎨 Paleta de Cores

```css
--primary-color: #6366f1      /* Azul principal */
--primary-dark: #4f46e5       /* Azul escuro */
--secondary-color: #ec4899    /* Rosa */
--success-color: #10b981      /* Verde */
--warning-color: #f59e0b      /* Laranja */
--text-dark: #1f2937         /* Texto escuro */
--text-light: #6b7280        /* Texto claro */
--background: #ffffff         /* Fundo branco */
--background-light: #f9fafb   /* Fundo claro */
--border-color: #e5e7eb      /* Bordas */
```

## 📱 Responsividade

O projeto é totalmente responsivo e foi testado em:

- **Desktop**: 1920px, 1440px, 1280px
- **Tablet**: 1024px, 768px
- **Mobile**: 480px, 375px, 320px

### Breakpoints

```css
/* Tablet e abaixo */
@media (max-width: 992px)

/* Mobile e abaixo */
@media (max-width: 768px)

/* Mobile pequeno */
@media (max-width: 480px)
```

## ⚡ Performance

### Otimizações Implementadas

1. **CSS Otimizado**
   - Uso de CSS Grid e Flexbox
   - Animações com GPU (transform, opacity)
   - CSS Variables para temas

2. **JavaScript Eficiente**
   - Debounce na busca (300ms)
   - Event delegation quando possível
   - LocalStorage para cache

3. **Lazy Loading**
   - Intersection Observer para animações
   - Carregamento progressivo de conteúdo

4. **Código Limpo**
   - Funções modulares e reutilizáveis
   - Comentários detalhados
   - Sem dependências desnecessárias

## 🔧 Personalização

### Adicionar Novos Ebooks

Para adicionar um novo ebook, insira o seguinte código HTML dentro de `<div class="products-grid" id="productsGrid">`:

```html
<div class="product-card" data-category="SEU_NICHO">
    <div class="product-badge">Novo</div>
    <div class="product-image">
        <i class="fas fa-book"></i>
    </div>
    <div class="product-info">
        <span class="product-category">Categoria</span>
        <h3>Título do Ebook</h3>
        <p>Descrição do ebook...</p>
        <div class="product-rating">
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <span>(0 avaliações)</span>
        </div>
        <div class="product-footer">
            <span class="price">R$ XX,00</span>
            <button class="btn-add-cart" onclick="addToCart('Título', XX.00, 'categoria')">
                <i class="fas fa-cart-plus"></i> Adicionar
            </button>
        </div>
    </div>
</div>
```

### Adicionar Nova Categoria

1. **HTML**: Adicione o card da categoria em `#categories`:
```html
<div class="category-card" data-category="nova-categoria">
    <i class="fas fa-icon-name"></i>
    <h3>Nome da Categoria</h3>
    <p>Descrição da categoria</p>
</div>
```

2. **Filtro**: Adicione o botão de filtro:
```html
<button class="filter-btn" data-filter="nova-categoria">
    Nome da Categoria
</button>
```

### Personalizar Cores

Edite as CSS Variables no início do arquivo `styles.css`:

```css
:root {
    --primary-color: #sua-cor;
    --secondary-color: #sua-cor;
    /* ... outras cores */
}
```

## 🔐 Segurança

### Implementações Atuais
- ✅ Sanitização de inputs de busca
- ✅ Armazenamento local seguro
- ✅ Sem exposição de dados sensíveis

### Recomendações para Produção
- Implementar HTTPS
- Adicionar autenticação de usuários
- Integrar gateway de pagamento seguro (PagSeguro, Mercado Pago, Stripe)
- Implementar CSRF protection
- Adicionar rate limiting em APIs
- Validação de dados no backend

## 🚀 Próximos Passos (Roadmap)

### Fase 1 - Backend (Recomendado)
- [ ] Integrar com Node.js/Express ou PHP
- [ ] Banco de dados (MySQL/PostgreSQL/MongoDB)
- [ ] API REST para produtos
- [ ] Sistema de autenticação
- [ ] Painel administrativo

### Fase 2 - Pagamentos
- [ ] Integração com Mercado Pago
- [ ] Integração com PagSeguro
- [ ] Integração com PayPal
- [ ] Sistema de cupons de desconto
- [ ] Controle de estoque

### Fase 3 - Funcionalidades Extras
- [ ] Sistema de reviews e comentários
- [ ] Lista de desejos
- [ ] Recomendações personalizadas
- [ ] Newsletter
- [ ] Blog integrado
- [ ] Sistema de afiliados

### Fase 4 - SEO & Marketing
- [ ] Otimização SEO
- [ ] Meta tags dinâmicas
- [ ] Sitemap
- [ ] Google Analytics
- [ ] Facebook Pixel
- [ ] Rich Snippets

### Fase 5 - Melhorias
- [ ] PWA (Progressive Web App)
- [ ] Modo escuro
- [ ] Multi-idiomas
- [ ] Chat ao vivo
- [ ] Sistema de notificações
- [ ] Área do cliente

## 🐛 Resolução de Problemas

### Carrinho não está salvando
- Verifique se o localStorage está habilitado no navegador
- Limpe o cache do navegador
- Teste em modo anônimo

### Produtos não aparecem
- Verifique o console do navegador (F12)
- Confirme que todos os arquivos estão no mesmo diretório
- Verifique se o JavaScript está habilitado

### Layout quebrado
- Limpe o cache do navegador
- Verifique a conexão CDN do Font Awesome
- Teste em navegador diferente

## 📊 Estatísticas do Projeto

- **Linhas de Código**: ~2.500+
- **Arquivos**: 3 principais (HTML, CSS, JS)
- **Produtos Cadastrados**: 9 ebooks
- **Categorias**: 6 nichos
- **Responsivo**: 100%
- **Performance**: Otimizado

## 🤝 Contribuindo

Este é um projeto pessoal, mas sugestões são bem-vindas!

### Como Contribuir
1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 📞 Contato

- **Email**: contato@ebookhub.com
- **Telefone**: (11) 99999-9999
- **Website**: [ebookhub.com](https://ebookhub.com)
- **Instagram**: [@ebookhub](https://instagram.com/ebookhub)

## 🙏 Agradecimentos

- Font Awesome pela biblioteca de ícones
- Comunidade web por inspirações de design
- Todos que apoiam o projeto

---

## 📝 Notas do Desenvolvedor

### Arquitetura do Código

**HTML (index.html)**
- Estrutura semântica
- Separação clara de seções
- Acessibilidade com ARIA labels (pode ser melhorado)
- SEO-friendly

**CSS (styles.css)**
- Mobile-first approach
- BEM-like naming convention
- CSS Variables para customização fácil
- Animações performáticas

**JavaScript (script.js)**
- Vanilla JS (sem dependências)
- Código modular e comentado
- Event delegation
- LocalStorage para persistência
- Debounce para performance

### Boas Práticas Implementadas

1. **Código Limpo**: Funções pequenas e específicas
2. **Comentários**: Documentação inline detalhada
3. **Responsividade**: Mobile-first design
4. **Performance**: Otimizações de rendering
5. **UX**: Feedback visual para todas as ações
6. **Acessibilidade**: Atalhos de teclado e navegação

### Considerações Técnicas

- **Sem jQuery**: Uso de JavaScript puro para melhor performance
- **Sem frameworks**: Simplicidade e leveza
- **Progressive Enhancement**: Funciona sem JS (parcialmente)
- **Graceful Degradation**: Fallbacks para navegadores antigos

---

## 🎉 Pronto para Usar!

Este projeto está completo e pronto para uso imediato. Basta abrir o `index.html` em qualquer navegador moderno e começar a vender seus ebooks!

Para ambiente de produção, considere:
1. Hospedar em serviço de hospedagem (Vercel, Netlify, GitHub Pages)
2. Registrar um domínio personalizado
3. Implementar backend para vendas reais
4. Adicionar SSL/HTTPS
5. Integrar com gateway de pagamento

**Desenvolvido com ❤️ para vender conhecimento!**

---

*Última atualização: Outubro 2025*
*Versão: 1.0.0*
