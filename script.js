// ===== Mercado Pago Configuration =====
// IMPORTANTE: Substitua com suas credenciais reais
const MP_PUBLIC_KEY = 'SUA_PUBLIC_KEY_AQUI';
const MP_ACCESS_TOKEN = 'SEU_ACCESS_TOKEN_AQUI';

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

// Load cart from localStorage
function loadCart() {
    if (!currentUser) {
        cart = [];
        updateCartCount();
        return;
    }
    const savedCart = localStorage.getItem(`ebookhub_cart_${currentUser.email}`);
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Load my ebooks from localStorage
function loadMyEbooks() {
    if (!currentUser) {
        myEbooks = [];
        updateMyEbooksCount();
        return;
    }
    const savedEbooks = localStorage.getItem(`ebookhub_myebooks_${currentUser.email}`);
    if (savedEbooks) {
        myEbooks = JSON.parse(savedEbooks);
        updateMyEbooksCount();
    }
}

// Save my ebooks to localStorage
function saveMyEbooks() {
    if (!currentUser) return;
    localStorage.setItem(`ebookhub_myebooks_${currentUser.email}`, JSON.stringify(myEbooks));
    updateMyEbooksCount();
}

// Save cart to localStorage
function saveCart() {
    if (!currentUser) return;
    localStorage.setItem(`ebookhub_cart_${currentUser.email}`, JSON.stringify(cart));
    updateCartCount();
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
    
    const item = {
        id: Date.now(),
        name: name,
        price: price,
        category: category
    };
    
    cart.push(item);
    saveCart();
    updateCartDisplay();
    showNotification('Ebook adicionado ao carrinho!', 'success');
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
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
                    <span>${item.category}</span>
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
                name: 'EbookHub',
                email: currentUser.email
            },
            payment_methods: {
                excluded_payment_methods: [],
                excluded_payment_types: [],
                installments: 12
            },
            back_urls: {
                success: window.location.href,
                failure: window.location.href,
                pending: window.location.href
            },
            auto_return: 'approved',
            notification_url: window.location.href + '?notification=payment'
        };

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
function handleSuccessfulPayment(result) {
    // Move items from cart to myEbooks
    const purchaseDate = new Date().toLocaleString('pt-BR');
    cart.forEach(item => {
        const ebook = {
            ...item,
            purchaseDate: purchaseDate,
            downloadUrl: `downloads/${item.id}.pdf`, // Placeholder for actual download URL
            transactionId: result.payment_id || 'MP-' + Date.now()
        };
        myEbooks.push(ebook);
    });
    
    // Clear cart
    cart = [];
    saveCart();
    saveMyEbooks();
    updateCartCount();
    updateMyEbooksCount();
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
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('ebookhub_users') || '{}');
    
    if (users[email] && users[email].password === password) {
        // Login successful
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
    } else {
        showNotification('E-mail ou senha incorretos!', 'error');
    }
});

// Handle Register
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const nickname = document.getElementById('registerNickname').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
    
    // Validate passwords match
    if (password !== passwordConfirm) {
        showNotification('As senhas não coincidem!', 'error');
        return;
    }
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('ebookhub_users') || '{}');
    
    // Check if user already exists
    if (users[email]) {
        showNotification('Este e-mail já está cadastrado!', 'warning');
        return;
    }
    
    // Register new user
    users[email] = {
        name: name,
        nickname: nickname,
        password: password,
        createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('ebookhub_users', JSON.stringify(users));
    
    // Auto login after register
    currentUser = {
        name: name,
        nickname: nickname,
        email: email
    };
    localStorage.setItem('ebookhub_current_user', JSON.stringify(currentUser));
    updateUIForLoggedInUser();
    closeAuthModal();
    showNotification(`Conta criada com sucesso! Bem-vindo(a), ${nickname}!`, 'success');
});

// Handle Logout
logoutBtn.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('ebookhub_current_user');
        currentUser = null;
        updateUIForLoggedOutUser();
        showNotification('Você saiu da sua conta', 'info');
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
    
    const ebookDetailsBody = document.getElementById('ebookDetailsBody');
    ebookDetailsBody.innerHTML = `
        <div class="ebook-details-container">
            <div class="ebook-details-image">
                ${badgeHtml}
                <i class="fas fa-book"></i>
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
        html += `
            <div class="my-ebook-item">
                <div class="my-ebook-info">
                    <h4>${ebook.name}</h4>
                    <span class="ebook-category">${categoryName}</span>
                    <div class="purchase-date">
                        <i class="fas fa-calendar"></i> Comprado em: ${ebook.purchaseDate}
                    </div>
                </div>
                <div class="my-ebook-actions">
                    <button class="btn-download" onclick="downloadEbook('${ebook.name}', '${ebook.downloadUrl}')">
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
function downloadEbook(name, url) {
    if (url === '#') {
        showNotification('O download estará disponível em breve! Aguardando upload dos arquivos.', 'info');
        return;
    }
    
    // In a real implementation, this would download the actual file
    showNotification(`Iniciando download de "${name}"...`, 'success');
    
    // Create temporary link to download
    const link = document.createElement('a');
    link.href = url;
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
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
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
    'Como Tirar Nota 1000 no ENEM': {
        description: 'Guia completo e atualizado com todas as estratégias comprovadas para alcançar a nota máxima no ENEM. Inclui cronograma de estudos personalizado, técnicas de redação nota 1000, questões comentadas das últimas provas e dicas exclusivas de aprovados.',
        rating: 5,
        reviews: 127,
        badge: 'Novo',
        highlights: [
            'Cronograma de estudos completo de 12 meses',
            'Técnicas de redação com correções exemplificadas',
            '500+ questões comentadas',
            'Métodos de memorização eficazes',
            'Simulados completos com gabarito'
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

// ===== Initialize on Page Load =====
document.addEventListener('DOMContentLoaded', () => {
    loadUser();
    addProductCardClickEvents();
    
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

console.log('🎉 EbookHub carregado com sucesso!');
console.log('✨ Funcionalidades: Login/Cadastro, Meus Ebooks, Carrinho');
console.log('🔐 Sistema de autenticação ativo!');
