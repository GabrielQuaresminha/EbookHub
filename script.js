// ===== API Configuration =====
// Backend URL from Railway - v3.0
const API_URL = 'https://ebookhub-production.up.railway.app';

// ===== Mercado Pago Configuration =====
// CREDENCIAIS DE PRODUÇÃO (para vendas reais) - v2.2
const MP_PUBLIC_KEY = 'APP_USR-616a169c-90a7-4996-99be-4d91a55a1419';
const MP_ACCESS_TOKEN = 'APP_USR-92158868421375-101718-37ad7e8f5bef84a15fd3995af1d2ea25-1964064467';

// Initialize Mercado Pago
const mp = new MercadoPago(MP_PUBLIC_KEY, {
    locale: 'pt-BR',
    advancedFraudPrevention: true
});

// ===== User Authentication =====
let currentUser = null;

// Load user from localStorage
function loadUser() {
    const savedUser = localStorage.getItem('ebookhub_current_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForLoggedInUser();
    } else {
        updateUIForLoggedOutUser();
    }
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
    document.getElementById('userNotLoggedIn').style.display = 'none';
    document.getElementById('userLoggedIn').style.display = 'flex';
    const displayName = currentUser.nickname || currentUser.name.split(' ')[0];
    document.getElementById('userGreeting').innerHTML = `Olá, <strong>${displayName}</strong>`;
    loadMyEbooks();
    loadCart();
}

// Update UI for logged out user
function updateUIForLoggedOutUser() {
    document.getElementById('userNotLoggedIn').style.display = 'flex';
    document.getElementById('userLoggedIn').style.display = 'none';
    myEbooks = [];
    cart = [];
    updateMyEbooksCount();
    updateCartCount();
}

// ===== Cart Management =====
let cart = [];
let myEbooks = [];

// Load cart from API
async function loadCart() {
    if (!currentUser || !currentUser.id) {
        cart = [];
        updateCartCount();
        return;
    }
    try {
        const response = await fetch(`${API_URL}/api/cart/${currentUser.id}`);
        const data = await response.json();
        if (data.items) {
            cart = data.items;
            updateCartCount();
        }
    } catch (error) {
        console.error('Load cart error:', error);
        cart = [];
    updateCartCount();
    }
}

// Load my ebooks from API
async function loadMyEbooks() {
    if (!currentUser || !currentUser.id) {
        myEbooks = [];
        updateMyEbooksCount();
        return;
    }
    try {
        const response = await fetch(`${API_URL}/api/my-ebooks/${currentUser.id}`);
        const data = await response.json();
        if (data.ebooks) {
            myEbooks = data.ebooks;
            updateMyEbooksCount();
        }
    } catch (error) {
        console.error('Load my ebooks error:', error);
        myEbooks = [];
        updateMyEbooksCount();
    }
}

// Save my ebooks to API
async function saveMyEbooks() {
    if (!currentUser || !currentUser.id) return;
    // This will be updated when purchase is saved
}

// Save cart to API
async function saveCart() {
    if (!currentUser || !currentUser.id) return;
    try {
        await fetch(`${API_URL}/api/cart/${currentUser.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: cart })
        });
    } catch (error) {
        console.error('Save cart error:', error);
    }
}

// Add item to cart
function addToCart(name, price, category) {
    // Check if user is logged in
    if (!currentUser) {
        showNotification('Você precisa estar logado para adicionar ao carrinho!', 'warning');
        openAuthModal();
        return;
    }
    
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        showNotification('Este ebook já está no carrinho!', 'warning');
        return;
    }
    
    // Get image from the product card
    let image = 'images/default-ebook.svg';
    
    // Check for specific ebook and use its cover
    if (name === 'Guia Completo para Tirar Nota 1000 na Redação do ENEM') {
        image = 'covers/redacao-enem-1000.jpg';
    } else if (name === 'Do Zero ao Controle: Como Organizar Suas Finanças e Parar de Viver no Aperto') {
        image = 'covers/do-zero-ao-controle.jpg';
    } else if (name === 'Guia do Investidor Iniciante em Fundos Imobiliários') {
        image = 'covers/investidor-fundos-imobiliarios.jpg';
    } else if (name === 'O Cérebro de Alta Performance: Como Usar a Neurociência Para Estudar Melhor') {
        image = 'covers/cerebro-alta-performance.jpg';
    } else if (name === 'DISCIPLINA E CONSTÂNCIA: Como Criar Força Mental e Hábito Diário de Sucesso') {
        image = 'covers/disciplina-constancia.jpg';
    } else if (name === 'Desbloqueie Sua Mente: Hábitos Que Mudam Vidas') {
        image = 'covers/desbloqueie-sua-mente.jpg';
    } else if (name === 'Mentalidade de Empreendedor: Como Pensar Como Quem Ganha Dinheiro e Transforma Ideias em Resultados') {
        image = 'covers/mentalidade-empreendedor.jpg';
    } else if (name === 'INSTAGRAM LUCRATIVO: Como Vender Todos os Dias e Transformar Seguidores em Clientes') {
        image = 'covers/instagram-lucrativo.jpg';
    } else if (name === 'Durma Melhor, Viva Melhor de Forma Natural: O Segredo do Sono Restaurador') {
        image = 'covers/durma-melhor-viva-melhor.jpg';
    } else if (name === 'Doces de Festa em Casa: Ganhe Dinheiro ou Surpreenda Sua Família com Receitas Fáceis e Deliciosas') {
        image = 'covers/doces-de-festa-em-casa.jpg';
    } else if (name === 'Desafio dos 21 Dias: Corpo e Mente em Equilíbrio') {
        image = 'covers/desafio-21-dias.jpg';
    } else if (name === 'Receitas Com 3 Ingredientes: Simples, Baratas e Irresistíveis') {
        image = 'covers/receitas-3-ingredientes.jpg';
    } else if (name === 'O Código Das Vendas Online: A Estratégia Que Faz Pessoas Comprarem de Você') {
        image = 'covers/codigo-vendas-online.jpg';
    } else if (name === 'Método 4x4 de Estudos: Foco, Revisão, Constância e Resultado') {
        image = 'covers/metodo-4x4-estudos.jpg';
    } else if (name === 'A Mente Inabalável: Como Ter Controle Emocional em Qualquer Situação') {
        image = 'covers/mente-inabalavel.jpg';
    } else if (name === 'Mentalidade Antifrágil: Como Usar as Dificuldades a Seu Favor') {
        image = 'covers/MENTALIDADE_ANTIFRAGIL.jpg';
    } else if (name === 'Receitas Fit e Saborosas: Comer Bem Nunca Foi Tão Fácil') {
        image = 'covers/receitas-fit-saborosas.jpg';
    } else if (name === 'Sem Dívidas: Como Sair do Vermelho e Reconstruir Sua Vida Financeira') {
        image = 'covers/SEM_DIVIDAS.png';
    } else if (name === 'Liberdade Financeira Passo a Passo: Como Construir Riqueza Mesmo Ganhando Pouco') {
        image = 'covers/LIBERDADE_FINANCEIRA_PASSO_A_PASSO.jpg';
    } else if (name === '7 Pilares da Saúde: O Método Para Viver com Mais Energia e Vitalidade') {
        image = 'covers/7_PILARES_DA_SAUDE.png';
    } else if (name === 'Energia Total: Como Acabar com o Cansaço e Ter Disposição Todos os Dias') {
        image = 'covers/ENERGIA_TOTAL.jpg';
    } else if (name === 'O Poder da Autoridade Digital: Como Ser Reconhecido e Vender Mais') {
        image = 'covers/O_PODER_DA_AUTORIDADE_DIGITAL.jpeg';
    } else if (name === 'Sabores do Mundo: Receitas Fáceis Inspiradas em Diversos Países') {
        image = 'covers/SABORES_DO_MUNDO.jpg';
    }
    
    // Try to get image from the product card if not found above
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const cardTitle = card.querySelector('h3')?.textContent;
        if (cardTitle === name) {
            const img = card.querySelector('img');
            if (img && img.src) {
                image = img.src;
            }
        }
    });
    
    const item = {
        id: Date.now(),
        name: name,
        price: price,
        category: category,
        image: image
    };
    
    cart.push(item);
    saveCart();
    updateCartCount();
    updateCartDisplay();
    showNotification('Ebook adicionado ao carrinho!', 'success');
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartCount();
    updateCartDisplay();
    showNotification('Ebook removido do carrinho', 'info');
}

// Update cart count badge
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    cartCount.textContent = cart.length;
    
    // Add animation
    cartCount.style.transform = 'scale(1.3)';
    setTimeout(() => {
        cartCount.style.transform = 'scale(1)';
    }, 200);
}

// Update my ebooks count badge
function updateMyEbooksCount() {
    const myEbooksCount = document.getElementById('myEbooksCount');
    myEbooksCount.textContent = myEbooks.length;
    
    // Add animation
    myEbooksCount.style.transform = 'scale(1.3)';
    setTimeout(() => {
        myEbooksCount.style.transform = 'scale(1)';
    }, 200);
}

// Update cart display in modal
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Seu carrinho está vazio</p>
            </div>
        `;
        cartTotal.textContent = 'R$ 0,00';
        return;
    }
    
    let total = 0;
    let html = '';
    
    cart.forEach(item => {
        total += item.price;
        html += `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image || 'images/default-ebook.svg'}" alt="${item.name}" onerror="this.src='images/default-ebook.svg'">
                </div>
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span>${getCategoryName(item.category)}</span>
                </div>
                <div class="cart-item-actions">
                    <span class="cart-item-price">R$ ${item.price.toFixed(2)}</span>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    cartItems.innerHTML = html;
    cartTotal.textContent = `R$ ${total.toFixed(2)}`;
}

// Checkout function
// Checkout function with Mercado Pago
async function checkout() {
    if (cart.length === 0) {
        showNotification('Seu carrinho está vazio!', 'warning');
        return;
    }
    
    if (!currentUser) {
        showNotification('Você precisa estar logado para finalizar a compra!', 'error');
        return;
    }

    try {
        showNotification('Iniciando pagamento...', 'info');
        
        // Calculate total
    const total = cart.reduce((sum, item) => sum + item.price, 0);
        
        // Create preference for Mercado Pago
        const externalReference = `EBOOKHUB-${currentUser.id}-${Date.now()}`;
        
        const preference = {
            items: cart.map(item => ({
                id: item.id,
                title: item.name,
                quantity: 1,
                unit_price: item.price,
                currency_id: 'BRL',
                description: `Ebook: ${item.name} - ${item.category}`
            })),
            payer: {
                name: currentUser.nickname || currentUser.name,
                email: currentUser.email
            },
            external_reference: externalReference,
            payment_methods: {
                excluded_payment_methods: [],
                excluded_payment_types: [],
                installments: 12
            },
            back_urls: {
                success: window.location.href + '?status=approved&payment_id=MP-' + Date.now(),
                failure: window.location.href + '?status=rejected',
                pending: window.location.href + '?status=pending'
            },
            auto_return: 'approved',
            notification_url: `${API_URL}/api/mercadopago/webhook`
        };

        // Store payment info for verification
        const paymentInfo = {
            payment_id: 'MP-' + Date.now(),
            timestamp: Date.now(),
            items: cart,
            userId: currentUser.id,
            userEmail: currentUser.email
        };
        localStorage.setItem('ebookhub_pending_payment', JSON.stringify(paymentInfo));

        // Snapshot the current cart to restore after redirect (used when page reloads)
        try {
            localStorage.setItem('ebookhub_cart_snapshot', JSON.stringify(cart));
        } catch (_) {}

        // Create preference using Mercado Pago API
        const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MP_ACCESS_TOKEN}`
            },
            body: JSON.stringify(preference)
        });

        const data = await response.json();

        if (data.id && data.init_point) {
            // Log available payment methods for debugging
            console.log('Preference created:', data);
            
            // Store preference_id and external_reference for payment verification
            const paymentData = {
                preferenceId: data.id,
                externalReference: externalReference,
                userId: currentUser.id,
                items: cart,
                timestamp: Date.now()
            };
            localStorage.setItem('ebookhub_payment_data', JSON.stringify(paymentData));
            
            // Start payment verification polling
            startPaymentVerification(data.id, externalReference, currentUser.id, cart);
            
            // Redirect directly to Mercado Pago checkout
            window.location.href = data.init_point;

        } else {
            throw new Error('Erro ao criar preferência de pagamento');
        }

    } catch (error) {
        console.error('Checkout error:', error);
        showNotification('Erro ao processar pagamento. Tente novamente.', 'error');
    }
}

// Handle successful payment
async function handleSuccessfulPayment(result) {
    console.log('🔍 handleSuccessfulPayment chamado!', result);
    console.log('🔍 currentUser:', currentUser);
    console.log('🔍 cart:', cart);
    
    // Try to load user from localStorage if not logged in
    if (!currentUser) {
        console.log('⚠️ Usuário não identificado, tentando carregar do localStorage...');
        const savedUser = localStorage.getItem('ebookhub_current_user');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            console.log('✅ Usuário recuperado do localStorage:', currentUser);
        }
    }
    
    if (!currentUser || !currentUser.id) {
        console.error('❌ Usuário não identificado');
        showNotification('Erro: usuário não identificado', 'error');
        return;
    }

    // If cart is empty (common after redirect), recover from snapshot
    if (cart.length === 0) {
        try {
            const snapshot = JSON.parse(localStorage.getItem('ebookhub_cart_snapshot') || '[]');
            if (Array.isArray(snapshot) && snapshot.length > 0) {
                cart = snapshot;
                console.log('🧩 Cart recuperado do snapshot com', cart.length, 'itens');
            }
        } catch (e) {
            console.warn('Falha ao recuperar snapshot do carrinho', e);
        }
    }

    // Save purchase to API FIRST
    try {
        console.log('📡 Salvando compra no backend...');
        const response = await fetch(`${API_URL}/api/purchase`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: currentUser.id,
                items: cart,
                paymentId: result.payment_id || 'MP-' + Date.now(),
                status: 'approved'
            })
        });
        
        console.log('📡 Response status:', response.status);
        
        if (response.ok) {
            console.log('✅ Compra salva no backend!');
            // Move items from cart to myEbooks AFTER successful save
            const purchaseDate = new Date().toLocaleString('pt-BR');
            cart.forEach(item => {
                const ebook = {
                    ...item,
                    purchaseDate: purchaseDate,
                    downloadUrl: item.name, // Use ebook name for download reference
                    transactionId: result.payment_id || 'MP-' + Date.now()
                };
                myEbooks.push(ebook);
                console.log('➕ Ebook adicionado ao myEbooks:', ebook.name);
            });
            console.log('📚 Total de ebooks em myEbooks:', myEbooks.length);
        } else {
            console.error('❌ Erro ao salvar compra:', response.status);
        }
    } catch (error) {
        console.error('❌ Save purchase error:', error);
    }
    
    // Clear cart
    cart = [];
    await saveCart();
    updateCartCount();
    updateMyEbooksCount();
    updateMyEbooksDisplay();
    // refresh from backend to ensure consistency
    try { await loadMyEbooks(); } catch (_) {}
    try { localStorage.removeItem('ebookhub_cart_snapshot'); } catch (_) {}
    updateCartDisplay();
    
    showNotification('Pagamento aprovado! Ebooks adicionados à sua biblioteca! 🎉', 'success');
    closeCartModal();
}

// ===== Modal Management =====
const cartModal = document.getElementById('cartModal');
const cartBtn = document.getElementById('cartBtn');
const closeCart = document.getElementById('closeCart');

const myEbooksModal = document.getElementById('myEbooksModal');
const myEbooksBtn = document.getElementById('myEbooksBtn');
const closeMyEbooks = document.getElementById('closeMyEbooks');

// Open cart modal
cartBtn.addEventListener('click', () => {
    cartModal.classList.add('active');
    updateCartDisplay();
});

// Close cart modal
closeCart.addEventListener('click', closeCartModal);

function closeCartModal() {
    cartModal.classList.remove('active');
}

// Close modal when clicking outside
cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        closeCartModal();
    }
});

// Open my ebooks modal
myEbooksBtn.addEventListener('click', () => {
    if (!currentUser) {
        showNotification('Você precisa estar logado!', 'warning');
        openAuthModal();
        return;
    }
    myEbooksModal.classList.add('active');
    updateMyEbooksDisplay();
});

// Close my ebooks modal
closeMyEbooks.addEventListener('click', closeMyEbooksModal);

function closeMyEbooksModal() {
    myEbooksModal.classList.remove('active');
}

// Close modal when clicking outside
myEbooksModal.addEventListener('click', (e) => {
    if (e.target === myEbooksModal) {
        closeMyEbooksModal();
    }
});

// ===== Ebook Details Modal =====
const ebookDetailsModal = document.getElementById('ebookDetailsModal');
const closeEbookDetails = document.getElementById('closeEbookDetails');

// Close ebook details modal
closeEbookDetails.addEventListener('click', closeEbookDetailsModal);

function closeEbookDetailsModal() {
    ebookDetailsModal.classList.remove('active');
}

// Close modal when clicking outside
ebookDetailsModal.addEventListener('click', (e) => {
    if (e.target === ebookDetailsModal) {
        closeEbookDetailsModal();
    }
});

// ===== Auth Modal Management =====
const authModal = document.getElementById('authModal');
const loginBtn = document.getElementById('loginBtn');
const closeAuth = document.getElementById('closeAuth');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');
const logoutBtn = document.getElementById('logoutBtn');

// Open auth modal
function openAuthModal() {
    authModal.classList.add('active');
    showLoginForm();
}

loginBtn.addEventListener('click', openAuthModal);

// Close auth modal
closeAuth.addEventListener('click', closeAuthModal);

function closeAuthModal() {
    authModal.classList.remove('active');
    // Reset forms
    loginForm.reset();
    registerForm.reset();
}

// Close modal when clicking outside
authModal.addEventListener('click', (e) => {
    if (e.target === authModal) {
        closeAuthModal();
    }
});

// Switch between login and register forms
function showLoginForm() {
    loginForm.style.display = 'flex';
    registerForm.style.display = 'none';
    document.getElementById('authModalTitle').textContent = 'Entrar na sua conta';
}

function showRegisterForm() {
    loginForm.style.display = 'none';
    registerForm.style.display = 'flex';
    document.getElementById('authModalTitle').textContent = 'Criar sua conta';
}

showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    showRegisterForm();
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    showLoginForm();
});

// Handle Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        // Login via API
        const response = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            // Fallback to localStorage if backend is down
            console.warn('Backend not available, using localStorage fallback');
            
            const users = JSON.parse(localStorage.getItem('ebookhub_users') || '{}');
            
            if (users[email] && users[email].password === password) {
                currentUser = {
                    name: users[email].name,
                    nickname: users[email].nickname,
                    email: email
                };
                localStorage.setItem('ebookhub_current_user', JSON.stringify(currentUser));
                updateUIForLoggedInUser();
                closeAuthModal();
                const displayName = currentUser.nickname || currentUser.name.split(' ')[0];
                showNotification(`Bem-vindo(a) de volta, ${displayName}!`, 'success');
                return;
            }
            
            showNotification(data.error || 'E-mail ou senha incorretos!', 'error');
            return;
        }

        // Login successful
        currentUser = data.user;
        localStorage.setItem('ebookhub_current_user', JSON.stringify(currentUser));
        updateUIForLoggedInUser();
        closeAuthModal();
        const displayName = currentUser.nickname || currentUser.name.split(' ')[0];
        showNotification(`Bem-vindo(a) de volta, ${displayName}!`, 'success');
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Erro ao conectar com o servidor', 'error');
    }
});

// Handle Register
// Email validation function
function validateEmail(email) {
    // Basic email regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        return { valid: false, message: 'Por favor, insira um e-mail válido!' };
    }
    
    // Check for common typos in domains
    const commonDomains = [
        'gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 
        'live.com', 'icloud.com', 'uol.com.br', 'bol.com.br'
    ];
    
    const emailParts = email.toLowerCase().split('@');
    if (emailParts.length !== 2) {
        return { valid: false, message: 'E-mail inválido!' };
    }
    
    const domain = emailParts[1];
    
    // Check for common typos
    const typos = {
        'gmial.com': 'gmail.com',
        'gmai.com': 'gmail.com',
        'gmil.com': 'gmail.com',
        'gmail.con': 'gmail.com',
        'gmail.cm': 'gmail.com',
        'hotmail.con': 'hotmail.com',
        'hotmail.cm': 'hotmail.com',
        'hotmal.com': 'hotmail.com',
        'outlook.con': 'outlook.com',
        'outlook.cm': 'outlook.com',
        'yahoo.con': 'yahoo.com',
        'yahoo.cm': 'yahoo.com'
    };
    
    if (typos[domain]) {
        return { 
            valid: false, 
            message: `Você quis dizer ${emailParts[0]}@${typos[domain]}?`,
            suggestion: `${emailParts[0]}@${typos[domain]}`
        };
    }
    
    // Check if domain has at least 2 characters after the dot
    const domainParts = domain.split('.');
    if (domainParts.length < 2 || domainParts[domainParts.length - 1].length < 2) {
        return { valid: false, message: 'Domínio do e-mail inválido!' };
    }
    
    return { valid: true };
}

// Add real-time email validation
const registerEmailInput = document.getElementById('registerEmail');
const emailHint = document.getElementById('emailHint');

if (registerEmailInput && emailHint) {
    registerEmailInput.addEventListener('blur', () => {
        const email = registerEmailInput.value.trim();
        if (email) {
            const validation = validateEmail(email);
            if (!validation.valid) {
                emailHint.textContent = validation.message;
                emailHint.style.display = 'block';
                emailHint.style.color = '#ff6b6b';
                
                // If there's a suggestion, make it clickable
                if (validation.suggestion) {
                    emailHint.innerHTML = `${validation.message} <a href="#" style="color: #4CAF50; text-decoration: underline;">Corrigir</a>`;
                    emailHint.querySelector('a').addEventListener('click', (e) => {
                        e.preventDefault();
                        registerEmailInput.value = validation.suggestion;
                        emailHint.style.display = 'none';
                    });
                }
            } else {
                emailHint.style.display = 'none';
            }
        }
    });
}

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value.trim();
    const nickname = document.getElementById('registerNickname').value.trim();
    const email = document.getElementById('registerEmail').value.trim().toLowerCase();
    const emailConfirm = document.getElementById('registerEmailConfirm').value.trim().toLowerCase();
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
    
    // Validate email format
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
        showNotification(emailValidation.message, 'error');
        return;
    }
    
    // Validate emails match
    if (email !== emailConfirm) {
        showNotification('Os e-mails não coincidem! Digite o mesmo e-mail nos dois campos.', 'error');
        return;
    }
    
    // Validate passwords match
    if (password !== passwordConfirm) {
        showNotification('As senhas não coincidem!', 'error');
        return;
    }
    
    try {
        // Register via API
        const response = await fetch(`${API_URL}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, nickname, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            // Fallback to localStorage if backend is down
            console.warn('Backend not available, using localStorage fallback');
            
            const users = JSON.parse(localStorage.getItem('ebookhub_users') || '{}');
            
            if (users[email]) {
                showNotification('Este e-mail já está cadastrado!', 'warning');
                return;
            }
            
            users[email] = {
                name,
                nickname,
                password,
                createdAt: new Date().toISOString()
            };
            
            localStorage.setItem('ebookhub_users', JSON.stringify(users));
            
            currentUser = { name, nickname, email };
            localStorage.setItem('ebookhub_current_user', JSON.stringify(currentUser));
            updateUIForLoggedInUser();
            closeAuthModal();
            showNotification(`Conta criada com sucesso! Bem-vindo(a), ${nickname}!`, 'success');
            return;
        }

        // Auto login after register
        currentUser = data.user;
        localStorage.setItem('ebookhub_current_user', JSON.stringify(currentUser));
        updateUIForLoggedInUser();
        closeAuthModal();
        showNotification(`Conta criada com sucesso! Bem-vindo(a), ${nickname}!`, 'success');
    } catch (error) {
        console.error('Register error:', error);
        showNotification('Erro ao conectar com o servidor', 'error');
    }
});

// Handle Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('ebookhub_current_user');
    currentUser = null;
    updateUIForLoggedOutUser();
    showNotification('Você saiu da sua conta', 'info');
});

// ===== Change Password =====
const changePasswordModal = document.getElementById('changePasswordModal');
const settingsBtn = document.getElementById('settingsBtn');
const closeChangePassword = document.getElementById('closeChangePassword');
const changePasswordForm = document.getElementById('changePasswordForm');

// Open change password modal
settingsBtn.addEventListener('click', () => {
    changePasswordModal.classList.add('active');
});

// Close change password modal
closeChangePassword.addEventListener('click', () => {
    changePasswordModal.classList.remove('active');
    changePasswordForm.reset();
});

// Close modal when clicking outside
changePasswordModal.addEventListener('click', (e) => {
    if (e.target === changePasswordModal) {
        changePasswordModal.classList.remove('active');
        changePasswordForm.reset();
    }
});

// Handle Change Password
changePasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
    // Validate new passwords match
    if (newPassword !== confirmNewPassword) {
        showNotification('As novas senhas não coincidem!', 'error');
        return;
    }
    
    // Validate new password is different from current
    if (currentPassword === newPassword) {
        showNotification('A nova senha deve ser diferente da senha atual!', 'warning');
        return;
    }
    
    if (!currentUser || !currentUser.email) {
        showNotification('Erro ao verificar usuário!', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/api/change-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: currentUser.email,
                currentPassword,
                newPassword
            })
        });

        const data = await response.json();

        if (!response.ok) {
            showNotification(data.error || 'Erro ao alterar senha', 'error');
            return;
        }

        // Close modal and reset form
        changePasswordModal.classList.remove('active');
        changePasswordForm.reset();
        
        showNotification('Senha alterada com sucesso!', 'success');
    } catch (error) {
        console.error('Change password error:', error);
        showNotification('Erro ao conectar com o servidor', 'error');
    }
});

// ===== Forgot Password =====
const forgotPasswordModal = document.getElementById('forgotPasswordModal');
const forgotPasswordLink = document.getElementById('forgotPassword');
const closeForgotPassword = document.getElementById('closeForgotPassword');
const verifyAccountForm = document.getElementById('verifyAccountForm');
const resetPasswordForm = document.getElementById('resetPasswordForm');
const backToLoginLink = document.getElementById('backToLogin');

let verifiedEmail = null; // Store verified email for password reset

// Open forgot password modal
forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    closeAuthModal();
    forgotPasswordModal.classList.add('active');
    verifyAccountForm.style.display = 'flex';
    resetPasswordForm.style.display = 'none';
    verifiedEmail = null;
});

// Back to login
backToLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    forgotPasswordModal.classList.remove('active');
    verifyAccountForm.reset();
    resetPasswordForm.reset();
    openAuthModal();
});

// Close forgot password modal
closeForgotPassword.addEventListener('click', () => {
    forgotPasswordModal.classList.remove('active');
    verifyAccountForm.reset();
    resetPasswordForm.reset();
    verifyAccountForm.style.display = 'flex';
    resetPasswordForm.style.display = 'none';
    verifiedEmail = null;
});

// Close modal when clicking outside
forgotPasswordModal.addEventListener('click', (e) => {
    if (e.target === forgotPasswordModal) {
        forgotPasswordModal.classList.remove('active');
        verifyAccountForm.reset();
        resetPasswordForm.reset();
        verifyAccountForm.style.display = 'flex';
        resetPasswordForm.style.display = 'none';
        verifiedEmail = null;
    }
});

// Step 1: Verify account
verifyAccountForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('recoverEmail').value.trim().toLowerCase();
    const name = document.getElementById('recoverName').value.trim();
    
    try {
        const response = await fetch(`${API_URL}/api/verify-account`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, name })
        });

        const data = await response.json();

        if (!response.ok) {
            showNotification(data.error || 'Erro ao verificar conta', 'error');
            return;
        }

        // Success! Show password reset form
        verifiedEmail = email;
        verifyAccountForm.style.display = 'none';
        resetPasswordForm.style.display = 'flex';
        showNotification('Dados verificados! Crie sua nova senha.', 'success');
    } catch (error) {
        console.error('Verify account error:', error);
        showNotification('Erro ao conectar com o servidor', 'error');
    }
});

// Step 2: Reset password
resetPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newPassword = document.getElementById('resetNewPassword').value;
    const confirmPassword = document.getElementById('resetConfirmPassword').value;
    
    // Validate passwords match
    if (newPassword !== confirmPassword) {
        showNotification('As senhas não coincidem!', 'error');
        return;
    }
    
    if (!verifiedEmail) {
        showNotification('Erro ao processar recuperação!', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/api/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: verifiedEmail, newPassword })
        });

        const data = await response.json();

        if (!response.ok) {
            showNotification(data.error || 'Erro ao resetar senha', 'error');
            return;
        }

        // Close modal and reset forms
        forgotPasswordModal.classList.remove('active');
        verifyAccountForm.reset();
        resetPasswordForm.reset();
        verifyAccountForm.style.display = 'flex';
        resetPasswordForm.style.display = 'none';
        verifiedEmail = null;
        
        // Show success and open login modal
        showNotification('Senha resetada com sucesso! Faça login com a nova senha.', 'success');
        setTimeout(() => {
            openAuthModal();
        }, 1000);
    } catch (error) {
        console.error('Reset password error:', error);
        showNotification('Erro ao conectar com o servidor', 'error');
    }
});

// Open ebook details
function openEbookDetails(name, price, category, description, rating, reviews, badge, highlights) {
    const categoryName = getCategoryName(category);
    const starsHtml = generateStars(rating);
    const highlightsHtml = highlights ? highlights.map(h => `
        <div class="ebook-highlight">
            <i class="fas fa-check-circle"></i>
            <span>${h}</span>
        </div>
    `).join('') : '';
    
    const badgeHtml = badge ? `<div class="ebook-details-badge ${badge.toLowerCase() === 'best seller' ? 'bestseller' : ''}">${badge}</div>` : '';
    
    // Get cover image for this ebook
    let coverImage = 'images/default-ebook.svg';
    if (name === 'Guia Completo para Tirar Nota 1000 na Redação do ENEM') {
        coverImage = 'covers/redacao-enem-1000.jpg';
    } else if (name === 'Do Zero ao Controle: Como Organizar Suas Finanças e Parar de Viver no Aperto') {
        coverImage = 'covers/do-zero-ao-controle.jpg';
    } else if (name === 'Guia do Investidor Iniciante em Fundos Imobiliários') {
        coverImage = 'covers/investidor-fundos-imobiliarios.jpg';
    } else if (name === 'O Cérebro de Alta Performance: Como Usar a Neurociência Para Estudar Melhor') {
        coverImage = 'covers/cerebro-alta-performance.jpg';
    } else if (name === 'DISCIPLINA E CONSTÂNCIA: Como Criar Força Mental e Hábito Diário de Sucesso') {
        coverImage = 'covers/disciplina-constancia.jpg';
    } else if (name === 'Desbloqueie Sua Mente: Hábitos Que Mudam Vidas') {
        coverImage = 'covers/desbloqueie-sua-mente.jpg';
    } else if (name === 'Mentalidade de Empreendedor: Como Pensar Como Quem Ganha Dinheiro e Transforma Ideias em Resultados') {
        coverImage = 'covers/mentalidade-empreendedor.jpg';
    } else if (name === 'INSTAGRAM LUCRATIVO: Como Vender Todos os Dias e Transformar Seguidores em Clientes') {
        coverImage = 'covers/instagram-lucrativo.jpg';
    } else if (name === 'Durma Melhor, Viva Melhor de Forma Natural: O Segredo do Sono Restaurador') {
        coverImage = 'covers/durma-melhor-viva-melhor.jpg';
    } else if (name === 'Doces de Festa em Casa: Ganhe Dinheiro ou Surpreenda Sua Família com Receitas Fáceis e Deliciosas') {
        coverImage = 'covers/doces-de-festa-em-casa.jpg';
    } else if (name === 'Desafio dos 21 Dias: Corpo e Mente em Equilíbrio') {
        coverImage = 'covers/desafio-21-dias.jpg';
    } else if (name === 'Receitas Com 3 Ingredientes: Simples, Baratas e Irresistíveis') {
        coverImage = 'covers/receitas-3-ingredientes.jpg';
    } else if (name === 'O Código Das Vendas Online: A Estratégia Que Faz Pessoas Comprarem de Você') {
        coverImage = 'covers/codigo-vendas-online.jpg';
    } else if (name === 'Método 4x4 de Estudos: Foco, Revisão, Constância e Resultado') {
        coverImage = 'covers/metodo-4x4-estudos.jpg';
    } else if (name === 'A Mente Inabalável: Como Ter Controle Emocional em Qualquer Situação') {
        coverImage = 'covers/mente-inabalavel.jpg';
    } else if (name === 'Mentalidade Antifrágil: Como Usar as Dificuldades a Seu Favor') {
        coverImage = 'covers/MENTALIDADE_ANTIFRAGIL.jpg';
    } else if (name === 'Receitas Fit e Saborosas: Comer Bem Nunca Foi Tão Fácil') {
        coverImage = 'covers/receitas-fit-saborosas.jpg';
    } else if (name === 'Sem Dívidas: Como Sair do Vermelho e Reconstruir Sua Vida Financeira') {
        coverImage = 'covers/SEM_DIVIDAS.png';
    } else if (name === 'Liberdade Financeira Passo a Passo: Como Construir Riqueza Mesmo Ganhando Pouco') {
        coverImage = 'covers/LIBERDADE_FINANCEIRA_PASSO_A_PASSO.jpg';
    } else if (name === '7 Pilares da Saúde: O Método Para Viver com Mais Energia e Vitalidade') {
        coverImage = 'covers/7_PILARES_DA_SAUDE.png';
    } else if (name === 'Energia Total: Como Acabar com o Cansaço e Ter Disposição Todos os Dias') {
        coverImage = 'covers/ENERGIA_TOTAL.jpg';
    } else if (name === 'O Poder da Autoridade Digital: Como Ser Reconhecido e Vender Mais') {
        coverImage = 'covers/O_PODER_DA_AUTORIDADE_DIGITAL.jpeg';
    } else if (name === 'Sabores do Mundo: Receitas Fáceis Inspiradas em Diversos Países') {
        coverImage = 'covers/SABORES_DO_MUNDO.jpg';
    }
    
    const ebookDetailsBody = document.getElementById('ebookDetailsBody');
    ebookDetailsBody.innerHTML = `
        <div class="ebook-details-container">
            <div class="ebook-details-image">
                ${badgeHtml}
                <img src="${coverImage}" alt="${name}" style="width: 100%; height: 100%; object-fit: contain; background-color: #f8f9fa;">
            </div>
            <div class="ebook-details-info">
                <span class="ebook-details-category">${categoryName}</span>
                <h1 class="ebook-details-title">${name}</h1>
                <div class="ebook-details-rating">
                    <div class="stars">
                        ${starsHtml}
                    </div>
                    <span>(${reviews} avaliações)</span>
                </div>
                <div class="ebook-details-description">
                    <h4>Sobre este ebook:</h4>
                    <p>${description}</p>
                </div>
                ${highlights ? `
                    <div class="ebook-details-highlights">
                        <h4>O que você vai aprender:</h4>
                        ${highlightsHtml}
                    </div>
                ` : ''}
                <div class="ebook-details-price-section">
                    <div class="ebook-details-price">R$ ${price.toFixed(2)}</div>
                    <button class="btn-add-to-cart-large" onclick="addToCart('${name}', ${price}, '${category}'); closeEbookDetailsModal();">
                        <i class="fas fa-cart-plus"></i> Adicionar ao Carrinho
                    </button>
                </div>
            </div>
        </div>
    `;
    
    ebookDetailsModal.classList.add('active');
}

// Generate stars HTML
function generateStars(rating) {
    let starsHtml = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star"></i>';
    }
    
    return starsHtml;
}

// ===== My Ebooks Display =====
function updateMyEbooksDisplay() {
    const myEbooksItems = document.getElementById('myEbooksItems');
    
    if (myEbooks.length === 0) {
        myEbooksItems.innerHTML = `
            <div class="empty-ebooks">
                <i class="fas fa-book-open"></i>
                <h3>Você ainda não comprou nenhum ebook</h3>
                <p>Explore nossa loja e adquira ebooks incríveis!</p>
                <button class="btn-browse" onclick="closeMyEbooksModal(); document.getElementById('products').scrollIntoView({behavior: 'smooth'})">
                    <i class="fas fa-search"></i> Explorar Ebooks
                </button>
            </div>
        `;
        return;
    }
    
    let html = '';
    
    myEbooks.forEach(ebook => {
        const categoryName = getCategoryName(ebook.category);
        
        // Get ebook cover image
        let coverImage = 'covers/default-ebook.jpg';
        
        // First try to get from ebookDetails
        const ebookInfo = ebookDetails[ebook.name];
        if (ebookInfo && ebookInfo.cover) {
            coverImage = ebookInfo.cover;
        } 
        // Then try ebook.image field
        else if (ebook.image) {
            coverImage = ebook.image;
        }
        // Fallback: try to get from product card
        else {
            const name = ebook.name;
            if (name === 'Do Zero ao Controle: Como Organizar Suas Finanças e Parar de Viver no Aperto') {
                coverImage = 'covers/do-zero-ao-controle.jpg';
            } else if (name === 'DISCIPLINA E CONSTÂNCIA: Como Criar Força Mental e Hábito Diário de Sucesso') {
                coverImage = 'covers/disciplina-constancia.jpg';
            } else if (name === 'Desbloqueie Sua Mente: Hábitos Que Mudam Vidas') {
                coverImage = 'covers/desbloqueie-sua-mente.jpg';
            } else if (name === 'Mentalidade de Empreendedor: Como Pensar Como Quem Ganha Dinheiro e Transforma Ideias em Resultados') {
                coverImage = 'covers/mentalidade-empreendedor.jpg';
            } else if (name === 'INSTAGRAM LUCRATIVO: Como Vender Todos os Dias e Transformar Seguidores em Clientes') {
                coverImage = 'covers/instagram-lucrativo.jpg';
            } else if (name === 'Durma Melhor, Viva Melhor de Forma Natural: O Segredo do Sono Restaurador') {
                coverImage = 'covers/durma-melhor-viva-melhor.jpg';
            } else if (name === 'Doces de Festa em Casa: Ganhe Dinheiro ou Surpreenda Sua Família com Receitas Fáceis e Deliciosas') {
                coverImage = 'covers/doces-de-festa-em-casa.jpg';
            } else if (name === 'Desafio dos 21 Dias: Corpo e Mente em Equilíbrio') {
                coverImage = 'covers/desafio-21-dias.jpg';
            } else if (name === 'Receitas Com 3 Ingredientes: Simples, Baratas e Irresistíveis') {
                coverImage = 'covers/receitas-3-ingredientes.jpg';
            } else if (name === 'O Código Das Vendas Online: A Estratégia Que Faz Pessoas Comprarem de Você') {
                coverImage = 'covers/codigo-vendas-online.jpg';
            } else if (name === 'Método 4x4 de Estudos: Foco, Revisão, Constância e Resultado') {
                coverImage = 'covers/metodo-4x4-estudos.jpg';
            } else if (name === 'A Mente Inabalável: Como Ter Controle Emocional em Qualquer Situação') {
                coverImage = 'covers/mente-inabalavel.jpg';
            } else if (name === 'Mentalidade Antifrágil: Como Usar as Dificuldades a Seu Favor') {
                coverImage = 'covers/MENTALIDADE_ANTIFRAGIL.jpg';
            } else if (name === 'O Cérebro de Alta Performance: Como Usar a Neurociência Para Estudar Melhor') {
                coverImage = 'covers/cerebro-alta-performance.jpg';
            } else if (name === 'Guia Completo para Tirar Nota 1000 na Redação do ENEM') {
                coverImage = 'covers/redacao-enem-1000.jpg';
            } else if (name === 'Guia do Investidor Iniciante em Fundos Imobiliários') {
                coverImage = 'covers/investidor-fundos-imobiliarios.jpg';
            } else if (name === 'Receitas Fit e Saborosas: Comer Bem Nunca Foi Tão Fácil') {
                coverImage = 'covers/receitas-fit-saborosas.jpg';
            } else if (name === 'Sem Dívidas: Como Sair do Vermelho e Reconstruir Sua Vida Financeira') {
                coverImage = 'covers/SEM_DIVIDAS.png';
            } else if (name === 'Liberdade Financeira Passo a Passo: Como Construir Riqueza Mesmo Ganhando Pouco') {
                coverImage = 'covers/LIBERDADE_FINANCEIRA_PASSO_A_PASSO.jpg';
            } else if (name === '7 Pilares da Saúde: O Método Para Viver com Mais Energia e Vitalidade') {
                coverImage = 'covers/7_PILARES_DA_SAUDE.png';
            } else if (name === 'Energia Total: Como Acabar com o Cansaço e Ter Disposição Todos os Dias') {
                coverImage = 'covers/ENERGIA_TOTAL.jpg';
            } else if (name === 'O Poder da Autoridade Digital: Como Ser Reconhecido e Vender Mais') {
                coverImage = 'covers/O_PODER_DA_AUTORIDADE_DIGITAL.jpeg';
            } else if (name === 'Sabores do Mundo: Receitas Fáceis Inspiradas em Diversos Países') {
                coverImage = 'covers/SABORES_DO_MUNDO.jpg';
            }
        }
        
        // Format purchase date - GMT-3 and only date, no time
        let purchaseDateText = '';
        if (ebook.purchaseDate && ebook.purchaseDate !== 'undefined') {
            // Remove time from date (format: DD/MM/YYYY, HH:MM:SS -> DD/MM/YYYY)
            const dateOnly = ebook.purchaseDate.split(',')[0].trim();
            purchaseDateText = dateOnly;
        } else {
            // Use GMT-3 timezone
            const now = new Date();
            const options = { 
                timeZone: 'America/Sao_Paulo', 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
            };
            purchaseDateText = now.toLocaleDateString('pt-BR', options);
        }
        
        html += `
            <div class="my-ebook-item">
                <div class="my-ebook-cover">
                    <img src="${coverImage}" alt="${ebook.name}">
                </div>
                <div class="my-ebook-info">
                    <h4>${ebook.name}</h4>
                    <span class="ebook-category">${categoryName}</span>
                    <div class="purchase-date">
                        <i class="fas fa-calendar"></i> Comprado em: ${purchaseDateText}
                    </div>
                </div>
                <div class="my-ebook-actions">
                    <button class="btn-download" onclick="downloadEbook('${ebook.name}')">
                        <i class="fas fa-download"></i> Baixar PDF
                    </button>
                </div>
            </div>
        `;
    });
    
    myEbooksItems.innerHTML = html;
}

// Get category display name
function getCategoryName(category) {
    const categories = {
        'ensino': 'Ensino & Educação',
        'culinaria': 'Culinária',
        'negocios': 'Negócios & Marketing',
        'desenvolvimento': 'Desenvolvimento Pessoal',
        'saude': 'Saúde & Bem-estar',
        'financas': 'Finanças'
    };
    return categories[category] || category;
}

// Download ebook function
function downloadEbook(name) {
    // Get the actual PDF path based on ebook name
    let pdfPath = '';
    
    if (name === 'Guia Completo para Tirar Nota 1000 na Redação do ENEM') {
        pdfPath = 'pdfs/GUIA-COMPLETO-PARA-TIRAR-NOTA-1000-NA-REDACAO-DO-ENEM.pdf';
    } else if (name === 'Do Zero ao Controle: Como Organizar Suas Finanças e Parar de Viver no Aperto') {
        pdfPath = 'pdfs/DO-ZERO-AO-CONTROLE.pdf';
    } else if (name === 'Guia do Investidor Iniciante em Fundos Imobiliários') {
        pdfPath = 'pdfs/GUIA-DO-INVESTIDOR-INICIANTE-EM-FUNDOS-IMOBILIARIOS.pdf';
    } else if (name === 'O Cérebro de Alta Performance: Como Usar a Neurociência Para Estudar Melhor') {
        pdfPath = 'pdfs/O-CEREBRO-DE-ALTA-PERFORMANCE.pdf';
    } else if (name === 'DISCIPLINA E CONSTÂNCIA: Como Criar Força Mental e Hábito Diário de Sucesso') {
        pdfPath = 'pdfs/DISCIPLINA-E-CONSTANCIA.pdf';
    } else if (name === 'Desbloqueie Sua Mente: Hábitos Que Mudam Vidas') {
        pdfPath = 'pdfs/DESBLOQUEIE-SUA-MENTE-HABITOS-QUE-MUDAM-SUA-VIDA.pdf';
    } else if (name === 'Mentalidade de Empreendedor: Como Pensar Como Quem Ganha Dinheiro e Transforma Ideias em Resultados') {
        pdfPath = 'pdfs/MENTALIDADE-DE-EMPREENDEDOR.pdf';
    } else if (name === 'INSTAGRAM LUCRATIVO: Como Vender Todos os Dias e Transformar Seguidores em Clientes') {
        pdfPath = 'pdfs/INSTAGRAM-LUCRATIVO.pdf';
    } else if (name === 'Durma Melhor, Viva Melhor de Forma Natural: O Segredo do Sono Restaurador') {
        pdfPath = 'pdfs/DURMA-MELHOR-VIVA-MELHOR-DE-FORMA-NATURAL.pdf';
    } else if (name === 'Doces de Festa em Casa: Ganhe Dinheiro ou Surpreenda Sua Família com Receitas Fáceis e Deliciosas') {
        pdfPath = 'pdfs/DOCES-DE-FESTA-EM-CASA.pdf';
    } else if (name === 'Desafio dos 21 Dias: Corpo e Mente em Equilíbrio') {
        pdfPath = 'pdfs/DESAFIO-DOS-21-DIAS.pdf';
    } else if (name === 'Receitas Com 3 Ingredientes: Simples, Baratas e Irresistíveis') {
        pdfPath = 'pdfs/RECEITAS-COM-3-INGREDIENTES.pdf';
    } else if (name === 'O Código Das Vendas Online: A Estratégia Que Faz Pessoas Comprarem de Você') {
        pdfPath = 'pdfs/O-CODIGO-DAS-VENDAS-ONLINE.pdf';
    } else if (name === 'Método 4x4 de Estudos: Foco, Revisão, Constância e Resultado') {
        pdfPath = 'pdfs/METODO-4x4-DE-ESTUDOS.pdf';
    } else if (name === 'A Mente Inabalável: Como Ter Controle Emocional em Qualquer Situação') {
        pdfPath = 'pdfs/A-MENTE-INABALAVEL.pdf';
    } else if (name === 'Mentalidade Antifrágil: Como Usar as Dificuldades a Seu Favor') {
        pdfPath = 'pdfs/MENTALIDADE_ANTIFRAGIL.pdf';
    } else if (name === 'Receitas Fit e Saborosas: Comer Bem Nunca Foi Tão Fácil') {
        pdfPath = 'pdfs/RECEITAS-FIT-E-SABOROSAS.pdf';
    } else if (name === 'Sem Dívidas: Como Sair do Vermelho e Reconstruir Sua Vida Financeira') {
        pdfPath = 'pdfs/SEM-DIVIDAS.pdf';
    } else if (name === 'Liberdade Financeira Passo a Passo: Como Construir Riqueza Mesmo Ganhando Pouco') {
        pdfPath = 'pdfs/LIBERDADE_FINANCEIRA_PASSO_A_PASSO.pdf';
    } else if (name === '7 Pilares da Saúde: O Método Para Viver com Mais Energia e Vitalidade') {
        pdfPath = 'pdfs/7-PILARES-DA-SAUDE.pdf';
    } else if (name === 'Energia Total: Como Acabar com o Cansaço e Ter Disposição Todos os Dias') {
        pdfPath = 'pdfs/ENERGIA_TOTAL.pdf';
    } else if (name === 'O Poder da Autoridade Digital: Como Ser Reconhecido e Vender Mais') {
        pdfPath = 'pdfs/O_PODER_DA_AUTORIDADE_DIGITAL.pdf';
    } else if (name === 'Sabores do Mundo: Receitas Fáceis Inspiradas em Diversos Países') {
        pdfPath = 'pdfs/SABORES_DO_MUNDO.pdf';
    }
    
    if (!pdfPath) {
        showNotification('PDF não encontrado para este ebook.', 'error');
        return;
    }
    
    showNotification(`Iniciando download de "${name}"...`, 'success');
    
    // Create temporary link to download
    const link = document.createElement('a');
    link.href = pdfPath;
    link.download = `${name}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ===== Product Filtering =====
const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        const filter = button.getAttribute('data-filter');
        
        // Filter products
        productCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filter === 'todos' || category === filter) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeIn 0.5s ease-out';
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// ===== Category Cards Filtering =====
const categoryCards = document.querySelectorAll('.category-card');

categoryCards.forEach(card => {
    card.addEventListener('click', () => {
        const category = card.getAttribute('data-category');
        
        // Scroll to products section
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        
        // Wait for scroll, then filter
        setTimeout(() => {
            // Find and click the corresponding filter button
            const filterBtn = document.querySelector(`.filter-btn[data-filter="${category}"]`);
            if (filterBtn) {
                filterBtn.click();
            }
        }, 500);
    });
});

// ===== Search Functionality =====
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    productCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const category = card.querySelector('.product-category').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm) || category.includes(searchTerm)) {
            card.classList.remove('hidden');
            card.style.animation = 'fadeIn 0.5s ease-out';
        } else {
            card.classList.add('hidden');
        }
    });
    
    // If search is empty, show all products from current filter
    if (searchTerm === '') {
        const activeFilter = document.querySelector('.filter-btn.active');
        if (activeFilter) {
            activeFilter.click();
        }
    }
});

// ===== Smooth Scrolling =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href && href !== '#' && href.length > 1) {
            const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            }
        }
    });
});

// ===== Notification System =====
function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 0.8rem;
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
        border-left: 4px solid ${getNotificationColor(type)};
    `;
    
    notification.querySelector('i').style.color = getNotificationColor(type);
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        warning: 'exclamation-triangle',
        error: 'times-circle',
        info: 'info-circle'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#6366f1'
    };
    return colors[type] || colors.info;
}

// Add notification animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .notification {
        font-weight: 500;
        font-size: 0.95rem;
    }
`;
document.head.appendChild(style);

// ===== Ebook Data (Detailed Information) =====
const ebookDetails = {
    'Guia Completo para Tirar Nota 1000 na Redação do ENEM': {
        description: 'Você sabia que a redação é o diferencial mais poderoso do ENEM? Com ela, você pode garantir sua vaga na universidade dos sonhos — e este guia foi feito exatamente para te mostrar como chegar lá. Neste eBook, você vai aprender o passo a passo completo para dominar a redação e conquistar a nota máxima: 1000 pontos. Nada de fórmulas mágicas — aqui você vai entender a estratégia real usada por quem atinge o topo.',
        rating: 5,
        reviews: 0,
        badge: 'Novo',
        highlights: [
            'Explicação detalhada das 5 competências avaliadas pelo ENEM',
            'Estrutura perfeita da redação (introdução, desenvolvimento e conclusão)',
            'Técnicas de argumentação e uso inteligente de repertórios socioculturais',
            'Modelo completo de proposta de intervenção nota máxima',
            'Cronograma prático para treinar e evoluir semana após semana',
            'Exemplos reais e análises de redações nota 1000'
        ]
    },
    'Do Zero ao Controle: Como Organizar Suas Finanças e Parar de Viver no Aperto': {
        description: 'Você sente que o dinheiro some e não sabe pra onde vai? Está sempre apertado, mesmo ganhando bem? Então este guia é pra você. Neste eBook, você vai aprender como sair do caos financeiro e assumir o controle total da sua vida econômica, passo a passo. Nada de teorias complicadas — aqui você vai ver métodos simples, planilhas práticas, metas inteligentes e rotinas que realmente funcionam.',
        rating: 5,
        reviews: 0,
        badge: 'Novo',
        highlights: [
            'Como entender sua situação financeira atual',
            'Como criar um orçamento realista e funcional',
            'Como eliminar dívidas e evitar novos gastos desnecessários',
            'Como montar uma planilha de controle mensal',
            'Como definir metas financeiras e alcançar liberdade econômica',
            'Como construir o hábito de poupar e investir com constância'
        ]
    },
    'Guia do Investidor Iniciante em Fundos Imobiliários': {
        description: 'Você sabia que é possível investir no mercado imobiliário com pouco dinheiro e sem precisar comprar um imóvel? Neste guia completo, você vai aprender tudo o que um investidor iniciante precisa saber para começar a lucrar com Fundos Imobiliários (FIIs) e construir renda passiva todos os meses — de forma simples, segura e acessível. Nada de termos complicados ou promessas milagrosas — aqui você vai entender como investir com estratégia e transformar pequenos aportes em grandes resultados.',
        rating: 5,
        reviews: 0,
        badge: 'Novo',
        highlights: [
            'O que são Fundos Imobiliários e como eles funcionam',
            'Tipos de FIIs e como escolher os melhores para começar',
            'Como investir com pouco dinheiro e de forma segura',
            'Como receber dividendos mensais e reinvestir com inteligência',
            'Quais são os principais riscos e como evitá-los',
            'Estratégias práticas para montar sua carteira e viver de renda'
        ]
    },
    'O Cérebro de Alta Performance: Como Usar a Neurociência Para Estudar Melhor': {
        description: 'Você estuda por horas e sente que não aprende nada? A neurociência explica o porquê — e também ensina como mudar isso. Neste guia prático, você vai descobrir como o cérebro realmente aprende, como funciona a memória, a concentração e o foco, e como aplicar esses conhecimentos científicos para estudar de forma mais eficiente, rápida e duradoura. Nada de decorar conteúdo ou perder tempo com métodos ultrapassados. Aqui você vai entender o funcionamento real da mente humana e aprender a ativar o seu potencial máximo de aprendizado.',
        rating: 5,
        reviews: 0,
        badge: 'Novo',
        highlights: [
            'Como o cérebro aprende e memoriza informações',
            'Os principais neurotransmissores que influenciam a aprendizagem',
            'Estratégias científicas para turbinar foco e concentração',
            'Como combater a procrastinação com base na neurociência',
            'O papel do sono e da alimentação na performance mental',
            'Técnicas práticas de estudo baseadas em evidências científicas'
        ]
    },
    'DISCIPLINA E CONSTÂNCIA: Como Criar Força Mental e Hábito Diário de Sucesso': {
        description: 'Você já começou algo com empolgação e parou no meio do caminho? Se sim, saiba que o problema não é falta de motivação — é falta de disciplina e constância. Este eBook é o seu guia prático para criar força mental, foco e hábitos diários que levam ao sucesso, mesmo quando você não está motivado. Aqui, você vai entender como o cérebro constrói (e destrói) hábitos, e aprenderá estratégias reais para manter o ritmo, alcançar suas metas e transformar sua mentalidade.',
        rating: 5,
        reviews: 0,
        badge: 'Novo',
        highlights: [
            'O que é disciplina e como desenvolvê-la',
            'Como transformar pequenas ações em grandes resultados',
            'Estratégias para manter constância mesmo nos dias difíceis',
            'Como criar hábitos que duram e eliminam a procrastinação',
            'O poder da mentalidade e da autodisciplina',
            'Técnicas comprovadas para aumentar foco, energia e resiliência'
        ]
    },
    'Desbloqueie Sua Mente: Hábitos Que Mudam Vidas': {
        description: 'Você já tentou mudar um hábito, mas acabou desistindo no meio do caminho? A ciência mostra que o problema não é falta de força de vontade, e sim usar a estratégia errada. Neste guia prático e transformador, você vai aprender como sua mente realmente funciona, e como usar a neurociência e a psicologia dos hábitos para substituir comportamentos ruins por hábitos poderosos — de forma leve, natural e permanente. Nada de fórmulas mágicas. Aqui você vai descobrir como pequenas mudanças diárias criam resultados extraordinários, e como reprogramar sua mente para alcançar seus objetivos mais ambiciosos.',
        rating: 5,
        reviews: 0,
        badge: 'Novo',
        highlights: [
            'Como os hábitos são formados no cérebro',
            'O poder dos pequenos hábitos e do progresso constante',
            'Como eliminar hábitos ruins e criar novos comportamentos positivos',
            'Técnicas práticas para manter a consistência',
            'O papel do ambiente, da disciplina e da identidade pessoal',
            'Como desenvolver a mentalidade de crescimento e viver em alta performance'
        ]
    },
    'Mentalidade de Empreendedor: Como Pensar Como Quem Ganha Dinheiro e Transforma Ideias em Resultados': {
        description: 'Você já percebeu que algumas pessoas parecem atrair oportunidades, enquanto outras vivem reclamando da sorte? A diferença não está no dinheiro, no diploma ou nas conexões — está na mentalidade. Este guia foi criado para te mostrar como pensa, age e enxerga o mundo um verdadeiro empreendedor. Você vai descobrir como desenvolver uma mente vencedora, transformar ideias em ações lucrativas e criar o tipo de mentalidade que constrói riqueza e liberdade. Nada de fórmulas mágicas — aqui você vai entender como pensar como quem ganha dinheiro de verdade: com estratégia, visão e atitude.',
        rating: 5,
        reviews: 0,
        badge: 'Novo',
        highlights: [
            'O que define a mentalidade empreendedora',
            'Como transformar desafios em oportunidades',
            'O poder da ação e da aprendizagem contínua',
            'Como lidar com o medo, o erro e o fracasso',
            'A importância da visão de longo prazo',
            'Hábitos e atitudes de quem cria riqueza',
            'Como tirar ideias do papel e gerar resultados reais'
        ]
    },
    'INSTAGRAM LUCRATIVO: Como Vender Todos os Dias e Transformar Seguidores em Clientes': {
        description: 'Você já percebeu que muita gente tem milhares de seguidores, mas quase nenhuma venda? Isso acontece porque seguir não é o mesmo que comprar. O segredo dos perfis que lucram todos os dias está em estratégia, posicionamento e relacionamento verdadeiro com o público. Neste guia, você vai descobrir como transformar seu Instagram em uma vitrine poderosa de vendas, mesmo que ainda tenha poucos seguidores. Aprenderá como criar conteúdo que atrai, engaja e converte — tudo com estratégias simples, práticas e aplicáveis.',
        rating: 5,
        reviews: 0,
        badge: 'Novo',
        highlights: [
            'Como criar um perfil profissional que atrai clientes automaticamente',
            'Como planejar e produzir conteúdo que desperta desejo e gera engajamento',
            'O passo a passo do funil de vendas no Instagram',
            'Estratégias de relacionamento para criar uma base fiel de seguidores',
            'Como usar o Direct, os Stories e o Reels para vender',
            'Métricas e ferramentas que transformam dados em resultados',
            'Transforme seu Instagram em uma máquina de engajamento e vendas'
        ]
    },
    'Durma Melhor, Viva Melhor de Forma Natural: O Segredo do Sono Restaurador': {
        description: 'Você já acordou cansado, mal humorado ou com a sensação de "não descansei direito"? A verdade é que a qualidade do seu sono não é luxo — é base para seu corpo, humor, mente e resultados. Neste guia natural e prático, você vai entender como o sono realmente funciona, de que forma ele impacta seu desempenho diário, seu humor, seu corpo e sua produtividade — e como aplicar hábitos simples e eficazes para dormir melhor, de forma restauradora e natural. Sem remédios, sem jargões complicados. Só ciência aplicada + estratégias simples para toda pessoa que deseja acordar renovado(a), produtivo(a) e saudável.',
        rating: 5,
        reviews: 0,
        badge: 'Novo',
        highlights: [
            'Por que o sono é tão importante para o seu corpo, cérebro e emoções',
            'Como a privação de sono impacta humor, memória, foco e produtividade',
            'Como criar um ambiente natural e saudável para o sono',
            'Hábitos noturnos e diurnos que promovem sono de qualidade',
            'Estratégias práticas para dormir melhor sem depender de remédios',
            'Como acordar renovado(a) e transformar seu dia com energia e foco'
        ]
    },
    'Doces de Festa em Casa: Ganhe Dinheiro ou Surpreenda Sua Família com Receitas Fáceis e Deliciosas': {
        cover: 'covers/doces-de-festa-em-casa.jpg',
        description: 'Quem resiste a um bom doce de festa? Neste guia prático e saboroso, você vai aprender como preparar doces deliciosos e lucrativos sem sair de casa — seja para vender e faturar um dinheiro extra ou para encantar sua família e amigos com sobremesas irresistíveis. Nada de receitas complicadas: aqui você vai encontrar passo a passo detalhado, dicas de conservação, decoração e apresentação, além de técnicas simples que deixam seus doces com aparência profissional.',
        rating: 5,
        reviews: 0,
        badge: 'Novo',
        highlights: [
            'Como preparar brigadeiros, beijinhos, trufas, bolos no pote e outros clássicos',
            'Dicas de ingredientes e ponto perfeito para cada doce',
            'Como montar uma pequena produção caseira para vender',
            'Técnicas de decoração e armazenamento',
            'Ideias criativas para embalar e apresentar seus doces',
            'Cálculo de custo e lucro para começar a empreender'
        ]
    },
    'Desafio dos 21 Dias: Corpo e Mente em Equilíbrio': {
        cover: 'covers/desafio-21-dias.jpg',
        description: 'Você se sente cansado, estressado ou sem energia para o dia a dia? Então este eBook foi feito pra você. Em apenas 21 dias, você vai aplicar um programa simples e natural que vai restaurar o equilíbrio entre corpo e mente, aumentando sua disposição, melhorando o sono e elevando seu humor. Nada de dietas radicais ou rotinas impossíveis — este desafio foi criado para caber na sua vida real, com hábitos pequenos que geram resultados grandes e duradouros.',
        rating: 5,
        reviews: 0,
        badge: 'Novo',
        highlights: [
            'Como reprogramar corpo e mente com pequenas ações diárias',
            'Como melhorar o sono, reduzir o estresse e aumentar a energia',
            'Como criar hábitos saudáveis que duram além dos 21 dias',
            'Estratégias de alimentação, movimento e respiração conscientes',
            'Técnicas simples de autocuidado e equilíbrio emocional',
            '21 dias para transformar sua vida com equilíbrio e bem-estar'
        ]
    },
    'Receitas Com 3 Ingredientes: Simples, Baratas e Irresistíveis': {
        cover: 'covers/receitas-3-ingredientes.jpg',
        description: 'Você adora comer bem, mas não tem tempo (ou paciência) para receitas complicadas? Então este eBook é pra você! Aqui, você vai descobrir as melhores receitas com apenas 3 ingredientes, perfeitas para quem quer praticidade, sabor e economia. São receitas rápidas, baratas e deliciosas — ideais para o dia a dia, para vender ou até impressionar a família. Nada de complicação. Com poucos ingredientes, você vai ver que é possível criar verdadeiras maravilhas na cozinha!',
        rating: 5,
        reviews: 0,
        badge: 'Novo',
        highlights: [
            'Receitas doces e salgadas com apenas 3 ingredientes',
            'Dicas para economizar e aproveitar o que tem em casa',
            'Truques para deixar suas receitas mais saborosas',
            'Sugestões para montar cardápios rápidos e versáteis',
            'Receitas que funcionam até pra quem não sabe cozinhar',
            'Menos ingredientes. Mais sabor. Simples assim.'
        ]
    },
    'O Código Das Vendas Online: A Estratégia Que Faz Pessoas Comprarem de Você': {
        cover: 'covers/codigo-vendas-online.jpg',
        description: 'Você já se perguntou por que algumas pessoas vendem qualquer coisa na internet — e outras não conseguem sair do zero? A diferença está no código invisível das vendas online. Este eBook revela os segredos psicológicos e estratégicos por trás das marcas e empreendedores que vendem todos os dias, mesmo sem milhares de seguidores. Você vai aprender como ativar o gatilho certo na mente do seu cliente, construir autoridade real e multiplicar suas conversões. Nada de truques vazios ou promessas mágicas. Aqui você vai entender como as pessoas pensam, o que as faz comprar e como aplicar isso de forma ética e inteligente.',
        rating: 5,
        reviews: 0,
        badge: 'Novo',
        highlights: [
            'Como funciona a mente do comprador online',
            'Os 7 gatilhos mentais que mais vendem',
            'Como construir autoridade e confiança digital',
            'O poder das palavras: técnicas de copywriting persuasivo',
            'Como criar ofertas irresistíveis que convertem',
            'Estratégias de funil e jornada de compra',
            'Como vender todos os dias, mesmo com poucos seguidores'
        ]
    },
    'Método 4x4 de Estudos: Foco, Revisão, Constância e Resultado': {
        cover: 'covers/metodo-4x4-estudos.jpg',
        description: 'Você estuda horas, mas sente que o conteúdo não "fica na cabeça"? Ou começa animado, mas perde o foco e acaba desistindo no meio do caminho? Este eBook apresenta o Método 4x4 de Estudos, um sistema prático e poderoso que combina Foco, Revisão, Constância e Resultado — os quatro pilares que formam os estudantes de alta performance. Baseado em princípios de neurociência, psicologia cognitiva e técnicas modernas de aprendizagem, este método foi criado para otimizar o tempo, melhorar a retenção e acelerar o aprendizado, mesmo que você não tenha muito tempo para estudar.',
        rating: 5,
        reviews: 0,
        badge: 'Novo',
        highlights: [
            'Como aplicar o Método 4x4 no seu dia a dia',
            'Técnicas de foco e concentração mental',
            'Como fazer revisões inteligentes que fixam o conteúdo',
            'Estratégias de constância e produtividade nos estudos',
            'Como medir e avaliar seus resultados semanais',
            'Cronograma prático para estudar com eficiência',
            'Estudar não é sobre tempo, é sobre método'
        ]
    },
    'A Mente Inabalável: Como Ter Controle Emocional em Qualquer Situação': {
        cover: 'covers/mente-inabalavel.jpg',
        description: 'Vivemos em um mundo cada vez mais acelerado, barulhento e cheio de estímulos. Notícias, redes sociais, cobranças, comparações — tudo parece empurrar nossa mente para o limite. Por isso, o verdadeiro poder hoje não é falar mais alto — é permanecer calmo enquanto o mundo grita. Este eBook foi criado para te ensinar, de forma simples e prática, como dominar suas emoções, lidar com a ansiedade e manter o equilíbrio, mesmo quando tudo parece desmoronar. Aqui, você vai descobrir estratégias reais, usadas por psicólogos, monges e atletas de alta performance, para fortalecer sua mente e agir com inteligência emocional em qualquer situação.',
        rating: 5,
        reviews: 0,
        badge: 'Novo',
        highlights: [
            'Entender de onde vêm suas emoções e como controlá-las',
            'Técnicas de respiração e foco para reduzir ansiedade e impulsividade',
            'Estratégias para manter calma sob pressão',
            'Como lidar com críticas, frustrações e raiva',
            'Hábitos diários para manter a mente equilibrada e resiliente',
            'Exercícios práticos para aplicar no dia a dia',
            'Você não controla o vento, mas pode ajustar as velas'
        ]
    },
    'Mentalidade Antifrágil: Como Usar as Dificuldades a Seu Favor': {
        cover: 'covers/MENTALIDADE_ANTIFRAGIL.jpg',
        description: 'A maioria das pessoas teme o caos e as dificuldades da vida. Mas há um grupo de pessoas que, em vez de quebrar diante das adversidades, crescem por causa delas. Essas pessoas têm algo em comum: a mentalidade antifrágil. Inspirado nos conceitos do pensador Nassim Nicholas Taleb, este eBook foi criado para te ensinar a lidar com a incerteza, superar obstáculos e transformar cada problema em uma oportunidade de crescimento.',
        rating: 5,
        reviews: 0,
        badge: 'Novo',
        highlights: [
            'O que é a mentalidade antifrágil e como desenvolvê-la',
            'Como transformar fracassos em combustível para o sucesso',
            'Estratégias práticas para crescer diante de crises e desafios',
            'Como fortalecer a mente, a disciplina e as emoções',
            'Hábitos diários para se tornar emocionalmente inabalável',
            'Como usar o caos e a dor como instrumentos de evolução',
            'O fraco quebra diante da pressão. O resiliente resiste. O antifrágil melhora'
        ]
    },
    'Receitas Fit e Saborosas: Comer Bem Nunca Foi Tão Fácil': {
        cover: 'covers/receitas-fit-saborosas.jpg',
        description: 'Comer saudável não precisa ser caro, difícil ou sem graça. Na verdade, quando você entende os princípios da alimentação equilibrada e aprende receitas práticas, comer bem se torna um prazer diário — e não um sacrifício. Este eBook foi criado para ajudar você a adotar uma rotina alimentar saudável sem abrir mão do sabor. Aqui, você vai encontrar receitas fit reais, de fácil preparo, com ingredientes acessíveis e explicações simples. Além disso, vai aprender como montar seus próprios pratos equilibrados, entender a importância dos macronutrientes e descobrir como a comida pode transformar sua energia, disposição e corpo.',
        rating: 5,
        reviews: 0,
        badge: 'Novo',
        highlights: [
            'Como montar refeições equilibradas com sabor',
            'Receitas fit para café da manhã, almoço, jantar e sobremesas',
            'Como economizar e planejar suas refeições da semana',
            'Substituições inteligentes para versões mais saudáveis',
            'Dicas de preparo, armazenamento e variação de sabores',
            'Estratégias para manter a alimentação saudável sem enjoar',
            'Saúde não é sobre comer menos, é sobre comer melhor'
        ]
    },
    'Sem Dívidas: Como Sair do Vermelho e Reconstruir Sua Vida Financeira': {
        cover: 'covers/SEM_DIVIDAS.png',
        description: 'Viver endividado é viver com um peso invisível nos ombros. A cada boleto, a cada ligação do banco, surge o mesmo sentimento: culpa, medo e impotência. Mas existe saída — e este eBook foi feito pra provar isso. "Sem Dívidas" é um guia prático que ensina como organizar suas finanças, negociar dívidas e reconstruir sua vida financeira, passo a passo. Nada de promessas milagrosas: aqui você vai aprender estratégias reais, sustentáveis e comprovadas para sair do vermelho e começar a investir no seu futuro.',
        rating: 5,
        reviews: 0,
        badge: 'Novo',
        highlights: [
            'Como entender e diagnosticar sua situação financeira real',
            'Estratégias eficazes para eliminar dívidas e lidar com juros',
            'Como negociar com bancos e credores',
            'Técnicas para organizar seu orçamento mensal',
            'Como reconstruir o crédito e criar uma nova relação com o dinheiro',
            'Hábitos financeiros que garantem estabilidade a longo prazo',
            'Sair das dívidas não é sorte — é decisão, estratégia e constância'
        ]
    },
    'Liberdade Financeira Passo a Passo: Como Construir Riqueza Mesmo Ganhando Pouco': {
        cover: 'covers/LIBERDADE_FINANCEIRA_PASSO_A_PASSO.jpg',
        description: 'A liberdade financeira não é um privilégio — é uma construção. Não importa quanto você ganha hoje, e sim como você lida com o que tem. Este eBook foi criado para te mostrar o caminho passo a passo para alcançar estabilidade, segurança e crescimento financeiro, mesmo começando do zero. Com hábitos simples, mentalidade correta e constância, você vai entender como eliminar dívidas, economizar de forma inteligente e começar a investir.',
        rating: 5,
        reviews: 0,
        badge: 'Novo',
        highlights: [
            'Como criar uma mentalidade de prosperidade',
            'O passo a passo da organização financeira',
            'Estratégias reais para economizar e investir, mesmo ganhando pouco',
            'Como eliminar dívidas e criar uma reserva de emergência',
            'Os princípios do enriquecimento gradual e sustentável',
            'Hábitos financeiros das pessoas que conquistaram a liberdade',
            'A liberdade financeira começa na mente — e se concretiza nas atitudes diárias'
        ]
    },
    '7 Pilares da Saúde: O Método Para Viver com Mais Energia e Vitalidade': {
        cover: 'covers/7_PILARES_DA_SAUDE.png',
        description: 'Cuidar da saúde vai muito além de "comer bem e fazer exercícios". A verdadeira saúde é construída sobre pilares que se complementam — corpo, mente e espírito em harmonia. Este eBook apresenta os 7 pilares fundamentais da saúde, baseados em estudos científicos e práticas simples do dia a dia, que você pode aplicar imediatamente para aumentar sua energia, disposição e qualidade de vida. Aqui você vai entender como pequenas mudanças geram grandes resultados — e como cuidar de si mesmo de forma integral e equilibrada.',
        rating: 5,
        reviews: 0,
        badge: 'Novo',
        highlights: [
            'Os 7 pilares essenciais para o equilíbrio físico e mental',
            'Como melhorar sono, alimentação e energia naturalmente',
            'Estratégias simples para reduzir estresse e ansiedade',
            'A importância da hidratação e do movimento diário',
            'Hábitos de mentalidade e propósito para uma vida mais plena',
            'Rotina prática para aplicar os pilares no dia a dia',
            'Saúde não é o que você faz de vez em quando. É o que você faz todos os dias'
        ]
    },
    'Energia Total: Como Acabar com o Cansaço e Ter Disposição Todos os Dias': {
        cover: 'covers/ENERGIA_TOTAL.jpg',
        description: 'Você acorda cansado, sem vontade de começar o dia? Sente que falta energia mesmo dormindo bem? A boa notícia é que você pode mudar isso. Este eBook foi criado para te mostrar como recuperar sua vitalidade, entender o que está drenando sua disposição e aprender hábitos naturais que aumentam energia física e mental. Com passos simples e eficazes, você vai aprender a eliminar o cansaço crônico, regular seu sono, alimentar-se melhor e usar seu corpo e mente a seu favor.',
        rating: 5,
        reviews: 0,
        badge: 'Novo',
        highlights: [
            'As causas reais do cansaço físico e mental',
            'Como a alimentação influencia sua energia',
            'Estratégias práticas para ter mais disposição todos os dias',
            'Hábitos matinais e noturnos para manter a vitalidade',
            'Como o sono, a mente e o movimento se conectam',
            'Dicas de suplementação natural e autocuidado energético',
            'Energia é a base da produtividade, da saúde e da felicidade'
        ]
    },
    'O Poder da Autoridade Digital: Como Ser Reconhecido e Vender Mais': {
        cover: 'covers/O_PODER_DA_AUTORIDADE_DIGITAL.jpeg',
        description: 'Em um mundo onde todos estão online, quem não tem autoridade digital, não é lembrado. As pessoas não compram produtos — compram quem representa confiança, conhecimento e autenticidade. Este eBook foi criado para te mostrar como construir uma marca pessoal forte, gerar reconhecimento e transformar sua presença online em resultados reais. Você vai entender o que é autoridade digital, como criar posicionamento, construir identidade e usar o Instagram como uma vitrine estratégica de valor.',
        rating: 5,
        reviews: 0,
        badge: 'Novo',
        highlights: [
            'O que é autoridade digital e por que ela gera vendas',
            'Como criar um posicionamento autêntico e memorável',
            'Como desenvolver sua marca pessoal e se diferenciar da concorrência',
            'Estratégias práticas para crescer no Instagram e criar conteúdo de valor',
            'Como transformar seguidores em clientes fiéis',
            'Mentalidade e hábitos de pessoas com alta autoridade online',
            'A autoridade digital é o novo cartão de visita'
        ]
    },
    'Sabores do Mundo: Receitas Fáceis Inspiradas em Diversos Países': {
        cover: 'covers/SABORES_DO_MUNDO.jpg',
        description: 'Você já imaginou saborear uma massa italiana autêntica, um curry indiano aromático ou um brownie americano incrível — sem precisar sair do Brasil? Este eBook foi criado para te levar a uma viagem gastronômica pelo mundo, apresentando receitas tradicionais de diversos países, adaptadas com ingredientes acessíveis e práticas para o dia a dia. Prepare-se para descobrir sabores, histórias e técnicas que vão transformar suas refeições em experiências internacionais!',
        rating: 5,
        reviews: 0,
        badge: 'Novo',
        highlights: [
            'Receitas típicas de diversos países — com versões simples e acessíveis',
            'Histórias e curiosidades sobre cada prato',
            'Dicas de substituições e adaptações brasileiras',
            'Sugestões de acompanhamentos e harmonizações',
            'Técnicas culinárias internacionais adaptadas ao seu dia a dia',
            'Viajar pelo paladar é a forma mais deliciosa de conhecer o mundo'
        ]
    },
    'Concurso Polícia Federal - Guia Definitivo': {
        description: 'Material completo e atualizado para preparação do concurso da Polícia Federal. Inclui todas as matérias do edital, questões das últimas provas comentadas, dicas de estudo e preparação física.',
        rating: 4.5,
        reviews: 89,
        badge: null,
        highlights: [
            'Todo conteúdo do edital organizado',
            '1000+ questões anteriores comentadas',
            'Legislação atualizada',
            'Dicas de preparação física',
            'Estratégias de resolução de provas'
        ]
    },
    '150 Receitas de Bolos Irresistíveis': {
        description: 'Do básico ao profissional: uma coleção completa de receitas de bolos para todas as ocasiões. Com fotos passo a passo, dicas de confeitaria e técnicas para decoração profissional.',
        rating: 5,
        reviews: 342,
        badge: 'Best Seller',
        highlights: [
            '150 receitas testadas e aprovadas',
            'Fotos passo a passo de cada receita',
            'Técnicas de confeitaria profissional',
            'Dicas para vender bolos',
            'Receitas para diabéticos e veganos'
        ]
    },
    'Cozinha Brasileira Completa': {
        description: 'Explore os sabores autênticos do Brasil! Pratos típicos de todas as regiões com ingredientes acessíveis, história das receitas e técnicas culinárias tradicionais.',
        rating: 4.5,
        reviews: 198,
        badge: null,
        highlights: [
            'Pratos de todas as regiões do Brasil',
            'Receitas com ingredientes acessíveis',
            'História e origem de cada prato',
            'Técnicas culinárias tradicionais',
            'Adaptações contemporâneas'
        ]
    },
    'Instagram para Negócios - Guia Completo': {
        description: 'Aprenda a transformar seu Instagram em uma máquina de vendas! Estratégias de conteúdo, crescimento orgânico, engajamento, Stories que vendem e muito mais.',
        rating: 5,
        reviews: 276,
        badge: 'Popular',
        highlights: [
            'Estratégias de conteúdo que convertem',
            'Como criar Stories que vendem',
            'Técnicas de crescimento orgânico',
            'Análise de métricas e KPIs',
            'Templates prontos para usar'
        ]
    },
    'Instagram Ads - Do Zero ao Avançado': {
        description: 'Domine os anúncios do Instagram e multiplique suas vendas com tráfego pago. Desde a criação da primeira campanha até estratégias avançadas de otimização e escala.',
        rating: 4.5,
        reviews: 154,
        badge: null,
        highlights: [
            'Como criar campanhas que convertem',
            'Otimização de anúncios para vendas',
            'Estratégias de retargeting',
            'Análise e interpretação de dados',
            'Escala de campanhas lucrativas'
        ]
    },
    'Produtividade Máxima': {
        description: 'Transforme sua rotina com técnicas comprovadas de produtividade. Aprenda a gerenciar seu tempo, eliminar distrações, criar hábitos poderosos e alcançar suas metas mais rapidamente.',
        rating: 5,
        reviews: 219,
        badge: null,
        highlights: [
            'Técnicas de gestão de tempo',
            'Métodos de foco e concentração',
            'Como criar hábitos duradouros',
            'Ferramentas de produtividade',
            'Sistema de metas e objetivos'
        ]
    },
    'Guia da Alimentação Saudável': {
        description: 'Aprenda a montar um cardápio equilibrado, nutritivo e saboroso para toda a família. Inclui planos alimentares, receitas saudáveis, dicas de substituições e educação nutricional.',
        rating: 4.5,
        reviews: 167,
        badge: null,
        highlights: [
            'Planos alimentares completos',
            'Receitas saudáveis e práticas',
            'Guia de substituições inteligentes',
            'Educação nutricional básica',
            'Cardápios para a semana toda'
        ]
    },
    'Investimentos para Iniciantes': {
        description: 'Comece a investir do zero com segurança e inteligência financeira. Aprenda sobre ações, fundos imobiliários, renda fixa, diversificação e como montar sua carteira de investimentos.',
        rating: 5,
        reviews: 203,
        badge: 'Novo',
        highlights: [
            'Como começar a investir do zero',
            'Entenda ações, FIIs e renda fixa',
            'Estratégias de diversificação',
            'Como montar sua carteira',
            'Análise de riscos e retornos'
        ]
    }
};

// Add click event to product cards to open details
function addProductCardClickEvents() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't open details if clicking on the add to cart button
            if (e.target.closest('.btn-add-cart')) {
                return;
            }
            
            const title = card.querySelector('h3').textContent;
            const priceText = card.querySelector('.price').textContent;
            const price = parseFloat(priceText.replace('R$', '').replace(',', '.').trim());
            const category = card.getAttribute('data-category');
            
            const details = ebookDetails[title];
            if (details) {
                openEbookDetails(
                    title,
                    price,
                    category,
                    details.description,
                    details.rating,
                    details.reviews,
                    details.badge,
                    details.highlights
                );
            }
        });
    });
}

// Payment Verification Polling
let verificationInterval = null;

function startPaymentVerification(preferenceId, externalReference, userId, items, showInitialMessage = true) {
    console.log('🔄 Iniciando verificação automática de pagamento...');
    
    let attempts = 0;
    
    verificationInterval = setInterval(async () => {
        attempts++;
        
        // Log de progresso menos frequente (a cada 12 verificações = 1 minuto)
        if (attempts % 12 === 0 || attempts <= 5) {
            console.log(`⏱️ Verificação ${attempts} (${Math.floor(attempts * 5 / 60)} minutos)...`);
        }
        
        try {
            const response = await fetch(`${API_URL}/api/check-payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ preferenceId, externalReference, userId, items })
            });
            
            const result = await response.json();
            
            if (result.approved) {
                console.log('✅ Pagamento aprovado!');
                clearInterval(verificationInterval);
                localStorage.removeItem('ebookhub_payment_data');
                
                // Reload ebooks
                await loadMyEbooks();
                showNotification('🎉 Pagamento confirmado! Seus ebooks foram liberados.', 'success');
                
                // Scroll to My Ebooks section
                setTimeout(() => {
                    const myEbooksSection = document.getElementById('my-ebooks-section');
                    if (myEbooksSection) {
                        myEbooksSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 1000);
            } else if (result.status === 'pending') {
                // Show status only on first check
                if (attempts === 1 && showInitialMessage) {
                    showNotification('⏳ Aguardando confirmação do pagamento PIX... O sistema verificará automaticamente.', 'info');
                }
                
                // Lembrete a cada 3 minutos
                if (attempts % 36 === 0) {
                    console.log('ℹ️ PIX ainda pendente. Continuando verificação automática...');
                }
            } else if (result.status === 'rejected' || result.status === 'cancelled') {
                console.log('❌ Pagamento rejeitado ou cancelado');
                clearInterval(verificationInterval);
                localStorage.removeItem('ebookhub_payment_data');
                showNotification('❌ Pagamento não foi aprovado.', 'error');
            }
        } catch (error) {
            console.error('Erro na verificação:', error);
        }
    }, 5000); // Check every 5 seconds
}

function checkPendingPayment() {
    const paymentData = localStorage.getItem('ebookhub_payment_data');
    if (paymentData) {
        const data = JSON.parse(paymentData);
        const timeElapsed = Date.now() - data.timestamp;
        
        // Only check if payment was initiated in the last 30 minutes (not 24h)
        // After 30 min, assume customer gave up
        if (timeElapsed < 30 * 60 * 1000) {
            console.log('🔍 Detectado pagamento pendente. Retomando verificação...');
            const minutesElapsed = Math.floor(timeElapsed / 60000);
            
            // Only show notification if less than 10 minutes (silent after that)
            if (timeElapsed < 10 * 60 * 1000) {
                showNotification(`🔄 Verificando seu pagamento...`, 'info');
            }
            
            startPaymentVerification(data.preferenceId, data.externalReference, data.userId, data.items, false);
        } else {
            // Clean up old payment data (older than 30min - customer gave up)
            console.log('🗑️ Removendo dados de pagamento antigo (cliente desistiu)');
            localStorage.removeItem('ebookhub_payment_data');
        }
    }
}

// ===== Initialize on Page Load =====
document.addEventListener('DOMContentLoaded', () => {
    loadUser();
    addProductCardClickEvents();
    checkPaymentReturn(); // Clean URL after payment
    checkPendingPayment(); // Check for pending payments
    
    // Add fade-in animation to product cards
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    productCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        observer.observe(card);
    });
});

// ===== Handle Page Visibility =====
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        loadUser();
    }
});

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', (e) => {
    // ESC to close modals
    if (e.key === 'Escape') {
        if (authModal.classList.contains('active')) {
            closeAuthModal();
        }
        if (cartModal.classList.contains('active')) {
        closeCartModal();
        }
        if (myEbooksModal.classList.contains('active')) {
            closeMyEbooksModal();
        }
        if (ebookDetailsModal.classList.contains('active')) {
            closeEbookDetailsModal();
        }
        if (changePasswordModal.classList.contains('active')) {
            changePasswordModal.classList.remove('active');
            changePasswordForm.reset();
        }
        if (forgotPasswordModal.classList.contains('active')) {
            forgotPasswordModal.classList.remove('active');
            verifyAccountForm.reset();
            resetPasswordForm.reset();
            verifyAccountForm.style.display = 'flex';
            resetPasswordForm.style.display = 'none';
            verifiedEmail = null;
        }
    }
    
    // CTRL/CMD + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
});

// ===== Performance: Debounce Search =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to search
searchInput.removeEventListener('input', searchInput.oninput);
searchInput.addEventListener('input', debounce((e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    productCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const category = card.querySelector('.product-category').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm) || category.includes(searchTerm)) {
            card.classList.remove('hidden');
            card.style.animation = 'fadeIn 0.5s ease-out';
        } else {
            card.classList.add('hidden');
        }
    });
    
    if (searchTerm === '') {
        const activeFilter = document.querySelector('.filter-btn.active');
        if (activeFilter) {
            activeFilter.click();
        }
    }
}, 300));

// ===== Payment Return Detection =====
// Clean URL parameters after return from payment
function checkPaymentReturn() {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    
    if (status) {
        console.log('🔄 Usuário retornou do gateway de pagamento');
        
        // Clean URL without showing notifications
        // The automatic verification system will handle the payment
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// NOTE: Removed checkStoredPaymentStatus to prevent fraud!
// Only approved payments are processed now.

console.log('🎉 EbookHub carregado com sucesso!');
console.log('✨ Funcionalidades: Login/Cadastro, Meus Ebooks, Carrinho');
console.log('🔐 Sistema de autenticação ativo!');
console.log('💳 Sistema de pagamento integrado!');
console.log('🚀 Deploy automático funcionando!');
