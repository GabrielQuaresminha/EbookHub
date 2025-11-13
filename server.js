const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');

const app = express();

// Admin Configuration - APENAS ESTE EMAIL TEM ACESSO AO PAINEL ADMIN
const ADMIN_EMAIL = 'gabrielquaresma96@hotmail.com';

// Middleware FIRST
app.use(cors());
app.use(express.json());

// MongoDB Connection
// Try Railway MongoDB first, then fallback to Atlas
const MONGODB_URI = process.env.MONGO_URL || process.env.MONGODB_URI || 'mongodb+srv://gabrielquaresma96_db_user:obEawi5Y0ehgj1CK@cluster0.dzzgcla.mongodb.net/ebookhub?retryWrites=true&w=majority';

// Wait for MongoDB to be ready before handling requests
let mongoReady = false;

mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    retryWrites: true
})
    .then(() => {
        console.log('✅ MongoDB conectado com sucesso!');
        mongoReady = true;
    })
    .catch(err => {
        console.error('❌ Erro ao conectar MongoDB:', err.message);
        console.error('Connection string:', MONGODB_URI);
        mongoReady = false;
    });

// Serve static files AFTER routes
app.use(express.static(__dirname));

// Schemas
const UserSchema = new mongoose.Schema({
    name: String,
    nickname: String,
    email: { type: String, unique: true, lowercase: true },
    password: String,
    createdAt: { type: Date, default: Date.now }
});

const CartSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    items: Array,
    updatedAt: { type: Date, default: Date.now }
});

const PurchaseSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    items: Array,
    paymentId: String,
    status: String,
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Cart = mongoose.model('Cart', CartSchema);
const Purchase = mongoose.model('Purchase', PurchaseSchema);

// ===== AUTHENTICATION ROUTES =====

// Register
app.post('/api/register', async (req, res) => {
    if (!mongoReady) {
        return res.status(503).json({ error: 'MongoDB não está conectado. Tente novamente em alguns segundos.' });
    }
    
    try {
        console.log('Register request received:', req.body);
        const { name, nickname, email, password } = req.body;

        if (!name || !nickname || !email || !password) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists:', email);
            return res.status(400).json({ error: 'Este e-mail já está cadastrado!' });
        }

        // Hash password
        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10).catch(err => {
            console.error('Bcrypt error:', err);
            throw new Error('Erro ao criptografar senha');
        });

        // Create user
        console.log('Creating user...');
        const user = new User({
            name,
            nickname,
            email,
            password: hashedPassword
        });

        await user.save();
        console.log('User created successfully:', user._id);

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                nickname: user.nickname,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Erro ao criar conta', details: error.message });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    if (!mongoReady) {
        return res.status(503).json({ error: 'MongoDB não está conectado. Tente novamente em alguns segundos.' });
    }
    
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ error: 'E-mail ou senha incorretos!' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'E-mail ou senha incorretos!' });
        }

        // Verificar se é admin
        const isAdmin = user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                nickname: user.nickname,
                email: user.email,
                isAdmin: isAdmin
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
});

// Change Password
app.post('/api/change-password', async (req, res) => {
    try {
        const { email, currentPassword, newPassword } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const validPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Senha atual incorreta!' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ success: true, message: 'Senha alterada com sucesso!' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Erro ao alterar senha' });
    }
});

// Forgot Password - Verify Account
app.post('/api/verify-account', async (req, res) => {
    try {
        const { email, name } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ error: 'Conta não encontrada com este e-mail' });
        }

        if (user.name.toLowerCase() !== name.toLowerCase()) {
            return res.status(401).json({ error: 'Nome completo não confere' });
        }

        res.json({ success: true, message: 'Conta verificada com sucesso!' });
    } catch (error) {
        console.error('Verify account error:', error);
        res.status(500).json({ error: 'Erro ao verificar conta' });
    }
});

// Forgot Password - Reset
app.post('/api/reset-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ success: true, message: 'Senha alterada com sucesso!' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Erro ao resetar senha' });
    }
});

// ===== CART ROUTES =====

// Get Cart
app.get('/api/cart/:userId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        res.json({ items: cart ? cart.items : [] });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ error: 'Erro ao carregar carrinho' });
    }
});

// Save Cart
app.post('/api/cart/:userId', async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.params.userId });
        
        if (!cart) {
            cart = new Cart({ userId: req.params.userId, items: req.body.items });
        } else {
            cart.items = req.body.items;
            cart.updatedAt = new Date();
        }
        
        await cart.save();
        res.json({ success: true });
    } catch (error) {
        console.error('Save cart error:', error);
        res.status(500).json({ error: 'Erro ao salvar carrinho' });
    }
});

// ===== PURCHASES ROUTES =====

// Mercado Pago Webhook - Receive payment notifications
app.post('/api/mercadopago/webhook', async (req, res) => {
    try {
        console.log('🔔 Webhook recebido do Mercado Pago:', req.body);
        
        const { type, data } = req.body;
        
        // Only process payment notifications
        if (type === 'payment') {
            const paymentId = data.id;
            
            // Fetch payment details from Mercado Pago
            const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || 'APP_USR-92158868421375-101718-37ad7e8f5bef84a15fd3995af1d2ea25-1964064467';
            
            const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
                headers: {
                    'Authorization': `Bearer ${MP_ACCESS_TOKEN}`
                }
            });
            
            const payment = await paymentResponse.json();
            console.log('💰 Detalhes do pagamento:', payment.status, payment.payer.email);
            
            // Only process approved payments
            if (payment.status === 'approved') {
                const buyerEmail = payment.payer.email;
                
                // Find user by email
                const user = await User.findOne({ email: buyerEmail.toLowerCase() });
                
                if (user) {
                    // Check if purchase already exists
                    const existingPurchase = await Purchase.findOne({ paymentId: payment.id.toString() });
                    
                    if (!existingPurchase) {
                        // Extract items from payment metadata or external_reference
                        const items = payment.additional_info?.items || [];
                        
                        const purchase = new Purchase({
                            userId: user._id,
                            items: items.map(item => ({
                                name: item.title,
                                price: item.unit_price,
                                category: item.category_id || 'geral',
                                purchaseDate: new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
                                transactionId: payment.id
                            })),
                            paymentId: payment.id.toString(),
                            status: 'approved'
                        });
                        
                        await purchase.save();
                        console.log('✅ Compra processada automaticamente via webhook!', buyerEmail);
                    } else {
                        console.log('ℹ️ Compra já processada anteriormente');
                    }
                } else {
                    console.log('⚠️ Usuário não encontrado:', buyerEmail);
                }
            }
        }
        
        // Always return 200 to Mercado Pago
        res.status(200).send('OK');
    } catch (error) {
        console.error('❌ Webhook error:', error);
        res.status(200).send('OK'); // Still return 200 to avoid retries
    }
});

// Check payment status and process if approved
app.post('/api/check-payment', async (req, res) => {
    try {
        const { preferenceId, externalReference, userId, items } = req.body;
        console.log('🔍 === INICIANDO VERIFICAÇÃO ===');
        console.log('PreferenceId:', preferenceId);
        console.log('ExternalReference:', externalReference);
        console.log('UserId:', userId);
        console.log('Items:', JSON.stringify(items));
        
        const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || 'APP_USR-92158868421375-101718-37ad7e8f5bef84a15fd3995af1d2ea25-1964064467';
        
        // Get user to search by email (fallback for old payments)
        const user = await User.findById(userId);
        if (!user) {
            console.log('❌ Usuário não encontrado');
            return res.json({ success: false, error: 'Usuário não encontrado' });
        }
        
        let searchData = null;
        
        // Try 1: Search by external_reference (for new payments)
        if (externalReference) {
            console.log('🔍 Tentativa 1: Buscando por external_reference:', externalReference);
            const searchUrl = `https://api.mercadopago.com/v1/payments/search?external_reference=${externalReference}&sort=date_created&criteria=desc`;
            const searchResponse = await fetch(searchUrl, {
                headers: { 'Authorization': `Bearer ${MP_ACCESS_TOKEN}` }
            });
            searchData = await searchResponse.json();
            console.log('📋 Resultado external_reference:', searchData.results?.length || 0, 'pagamentos');
        }
        
        // Try 2: Search by payer email (fallback for old payments without external_reference)
        if (!searchData?.results?.length) {
            console.log('🔍 Tentativa 2: Buscando por email do pagador:', user.email);
            const searchUrl = `https://api.mercadopago.com/v1/payments/search?payer.email=${user.email}&sort=date_created&criteria=desc&range=date_created&begin_date=NOW-7DAYS&end_date=NOW`;
            const searchResponse = await fetch(searchUrl, {
                headers: { 'Authorization': `Bearer ${MP_ACCESS_TOKEN}` }
            });
            searchData = await searchResponse.json();
            console.log('📋 Resultado email:', searchData.results?.length || 0, 'pagamentos');
        }
        
        console.log('📋 Resposta da API Mercado Pago:', JSON.stringify(searchData, null, 2));
        
        if (searchData.results && searchData.results.length > 0) {
            // Get the most recent payment
            const payment = searchData.results[0];
            console.log('💳 Pagamento encontrado:');
            console.log('   - Status:', payment.status);
            console.log('   - ID:', payment.id);
            console.log('   - Payer email:', payment.payer?.email);
            console.log('   - Amount:', payment.transaction_amount);
            
            if (payment.status === 'approved') {
                console.log('✅ Pagamento APROVADO! Processando compra...');
                
                // Check if purchase already exists
                const existingPurchase = await Purchase.findOne({ paymentId: payment.id.toString() });
                console.log('🔍 Verificando duplicidade:', existingPurchase ? 'JÁ EXISTE' : 'NOVA COMPRA');
                
                if (!existingPurchase) {
                    const purchase = new Purchase({
                        userId: userId,
                        items: items.map(item => ({
                            name: item.name,
                            price: item.price,
                            category: item.category,
                            purchaseDate: new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
                            transactionId: payment.id
                        })),
                        paymentId: payment.id.toString(),
                        status: 'approved'
                    });
                    
                    await purchase.save();
                    console.log('💾 Compra salva no banco de dados!');
                    console.log('✅ === COMPRA PROCESSADA COM SUCESSO ===');
                    
                    return res.json({ 
                        success: true, 
                        approved: true,
                        message: 'Pagamento aprovado! Ebooks liberados.' 
                    });
                } else {
                    console.log('ℹ️ Compra já foi processada anteriormente');
                    return res.json({ 
                        success: true, 
                        approved: true,
                        message: 'Compra já foi processada anteriormente.' 
                    });
                }
            } else if (payment.status === 'pending') {
                console.log('⏳ Pagamento ainda PENDENTE');
                return res.json({ 
                    success: true, 
                    approved: false,
                    status: 'pending',
                    message: 'Pagamento pendente' 
                });
            } else {
                console.log('❌ Pagamento com status:', payment.status);
                return res.json({ 
                    success: true, 
                    approved: false,
                    status: payment.status,
                    message: 'Pagamento não aprovado' 
                });
            }
        } else {
            console.log('⚠️ Nenhum pagamento encontrado para este external_reference');
        }
        
        res.json({ 
            success: true, 
            approved: false,
            message: 'Nenhum pagamento encontrado ainda' 
        });
    } catch (error) {
        console.error('❌ ERRO AO VERIFICAR PAGAMENTO:', error);
        console.error('Stack:', error.stack);
        res.status(500).json({ error: 'Erro ao verificar pagamento', details: error.message });
    }
});

// Manual Purchase Addition (for customer support)
app.post('/api/manual-purchase', async (req, res) => {
    try {
        const { email, ebookName, price, category } = req.body;
        
        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Create purchase with manual payment
        const purchase = new Purchase({
            userId: user._id,
            items: [{
                name: ebookName,
                price: price || 14.90,
                category: category || 'geral',
                purchaseDate: new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
                transactionId: 'MANUAL-' + Date.now()
            }],
            paymentId: 'MANUAL-' + Date.now(),
            status: 'approved'
        });

        await purchase.save();
        console.log('Manual purchase created for:', email, ebookName);
        
        res.json({ success: true, message: 'Ebook adicionado com sucesso!' });
    } catch (error) {
        console.error('Manual purchase error:', error);
        res.status(500).json({ error: 'Erro ao adicionar ebook', details: error.message });
    }
});

// Fix purchase dates (correct timezone issues)
app.post('/api/fix-dates', async (req, res) => {
    try {
        const { email, correctDate } = req.body;
        
        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Update all purchases for this user
        const purchases = await Purchase.find({ userId: user._id });
        
        let updated = 0;
        for (const purchase of purchases) {
            purchase.items = purchase.items.map(item => ({
                ...item,
                purchaseDate: correctDate
            }));
            await purchase.save();
            updated++;
        }

        console.log(`Datas corrigidas para ${updated} compras do usuário:`, email);
        
        res.json({ success: true, message: `${updated} compras atualizadas!` });
    } catch (error) {
        console.error('Fix dates error:', error);
        res.status(500).json({ error: 'Erro ao corrigir datas', details: error.message });
    }
});

// Fix/Update purchase data (for fixing manual purchases)
app.post('/api/fix-purchase', async (req, res) => {
    try {
        const { email, ebookName, price, category } = req.body;
        
        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Find and update the purchase
        const purchase = await Purchase.findOne({ 
            userId: user._id,
            'items.name': ebookName
        });
        
        if (!purchase) {
            return res.status(404).json({ error: 'Compra não encontrada' });
        }

        // Update the item with missing data
        purchase.items = purchase.items.map(item => {
            if (item.name === ebookName) {
                return {
                    ...item,
                    price: price || item.price || 14.90,
                    category: category || item.category || 'geral'
                };
            }
            return item;
        });

        await purchase.save();
        console.log('Purchase fixed for:', email, ebookName);
        
        res.json({ success: true, message: 'Compra corrigida com sucesso!' });
    } catch (error) {
        console.error('Fix purchase error:', error);
        res.status(500).json({ error: 'Erro ao corrigir compra', details: error.message });
    }
});

// Get My Ebooks
app.get('/api/my-ebooks/:userId', async (req, res) => {
    try {
        const purchases = await Purchase.find({ 
            userId: req.params.userId,
            status: 'approved'
        });
        
        const ebooks = purchases.flatMap(p => p.items);
        res.json({ ebooks });
    } catch (error) {
        console.error('Get my ebooks error:', error);
        res.status(500).json({ error: 'Erro ao carregar meus ebooks' });
    }
});

// Save Purchase
app.post('/api/purchase', async (req, res) => {
    try {
        const { userId, items, paymentId, status } = req.body;

        const purchase = new Purchase({
            userId,
            items,
            paymentId,
            status
        });

        await purchase.save();
        res.json({ success: true });
    } catch (error) {
        console.error('Save purchase error:', error);
        res.status(500).json({ error: 'Erro ao salvar compra' });
    }
});

// ===== ADMIN MIDDLEWARE =====
// Middleware para verificar se o usuário é admin
function verificarAdmin(req, res, next) {
    const userEmail = req.headers['x-user-email']; // Email vem do frontend
    
    if (!userEmail || userEmail.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
    }
    
    next();
}

// ===== ADMIN ROUTES =====

// Verificar se usuário é admin
app.get('/api/admin/check', async (req, res) => {
    try {
        const userEmail = req.headers['x-user-email'];
        const isAdmin = userEmail && userEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase();
        res.json({ isAdmin });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao verificar admin' });
    }
});

// Estatísticas Gerais (Dashboard)
app.get('/api/admin/stats', verificarAdmin, async (req, res) => {
    try {
        const period = req.query.period; // 'all', '7', '30', '90', '180', '365'
        
        // Criar filtro de data
        const query = { status: 'approved' };
        if (period && period !== 'all') {
            const days = parseInt(period);
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);
            query.createdAt = { $gte: startDate };
        }
        
        // Total de vendas aprovadas
        const totalSales = await Purchase.countDocuments(query);
        
        // Receita total
        const purchases = await Purchase.find(query);
        const totalRevenue = purchases.reduce((sum, purchase) => {
            const purchaseTotal = purchase.items.reduce((itemSum, item) => itemSum + (item.price || 14.90), 0);
            return sum + purchaseTotal;
        }, 0);
        
        // Total de clientes únicos
        const uniqueCustomers = await Purchase.distinct('userId', query);
        const totalCustomers = uniqueCustomers.length;
        
        // Total de ebooks vendidos
        const totalEbooksSold = purchases.reduce((sum, purchase) => sum + purchase.items.length, 0);
        
        // Vendas por categoria
        const salesByCategory = {};
        purchases.forEach(purchase => {
            purchase.items.forEach(item => {
                const category = item.category || 'geral';
                salesByCategory[category] = (salesByCategory[category] || 0) + 1;
            });
        });
        
        res.json({
            totalSales,
            totalRevenue: totalRevenue.toFixed(2),
            totalCustomers,
            totalEbooksSold,
            salesByCategory
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
});

// Lista de todas as vendas
app.get('/api/admin/sales', verificarAdmin, async (req, res) => {
    try {
        const purchases = await Purchase.find({ status: 'approved' })
            .populate('userId', 'name email nickname')
            .sort({ createdAt: -1 })
            .limit(100); // Últimas 100 vendas
        
        const salesData = purchases.map(purchase => {
            return purchase.items.map(item => ({
                purchaseId: purchase._id,
                customerName: purchase.userId?.name || 'N/A',
                customerEmail: purchase.userId?.email || 'N/A',
                customerNickname: purchase.userId?.nickname || 'N/A',
                ebookName: item.name,
                price: item.price || 14.90,
                category: item.category || 'geral',
                purchaseDate: item.purchaseDate || purchase.createdAt.toLocaleDateString('pt-BR'),
                createdAt: purchase.createdAt
            }));
        }).flat();
        
        res.json({ sales: salesData });
    } catch (error) {
        console.error('Admin sales error:', error);
        res.status(500).json({ error: 'Erro ao buscar vendas' });
    }
});

// Top Ebooks Mais Vendidos
app.get('/api/admin/top-ebooks', verificarAdmin, async (req, res) => {
    try {
        const period = req.query.period;
        
        const query = { status: 'approved' };
        if (period && period !== 'all') {
            const days = parseInt(period);
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);
            query.createdAt = { $gte: startDate };
        }
        
        const purchases = await Purchase.find(query);
        
        const ebookStats = {};
        purchases.forEach(purchase => {
            purchase.items.forEach(item => {
                const ebookName = item.name;
                if (!ebookStats[ebookName]) {
                    ebookStats[ebookName] = {
                        name: ebookName,
                        sales: 0,
                        revenue: 0,
                        category: item.category || 'geral'
                    };
                }
                ebookStats[ebookName].sales += 1;
                ebookStats[ebookName].revenue += item.price || 14.90;
            });
        });
        
        // Converter para array e ordenar por vendas
        const topEbooks = Object.values(ebookStats)
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 10); // Top 10
        
        res.json({ topEbooks });
    } catch (error) {
        console.error('Admin top ebooks error:', error);
        res.status(500).json({ error: 'Erro ao buscar top ebooks' });
    }
});

// Clientes e seus históricos
app.get('/api/admin/customers', verificarAdmin, async (req, res) => {
    try {
        const purchases = await Purchase.find({ status: 'approved' })
            .populate('userId', 'name email nickname createdAt');
        
        const customerMap = {};
        
        purchases.forEach(purchase => {
            const userId = purchase.userId?._id?.toString();
            if (!userId) return;
            
            if (!customerMap[userId]) {
                customerMap[userId] = {
                    name: purchase.userId?.name || 'Cliente',
                    email: purchase.userId?.email || 'email@desconhecido.com',
                    nickname: purchase.userId?.nickname || 'Usuário',
                    registeredAt: purchase.userId?.createdAt || purchase.createdAt,
                    totalPurchases: 0,
                    totalSpent: 0,
                    ebooks: []
                };
            }
            
            purchase.items.forEach(item => {
                customerMap[userId].totalPurchases += 1;
                customerMap[userId].totalSpent += item.price || 14.90;
                customerMap[userId].ebooks.push({
                    name: item.name,
                    price: item.price || 14.90,
                    purchaseDate: item.purchaseDate
                });
            });
        });
        
        const customers = Object.values(customerMap)
            .sort((a, b) => b.totalSpent - a.totalSpent);
        
        res.json({ customers });
    } catch (error) {
        console.error('Admin customers error:', error);
        res.status(500).json({ error: 'Erro ao buscar clientes' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📡 MongoDB URI: ${MONGODB_URI ? 'Configurado' : 'Não configurado'}`);
});

