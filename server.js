const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');

const app = express();

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

// Manual Purchase Addition (for customer support)
app.post('/api/manual-purchase', async (req, res) => {
    try {
        const { email, ebookName } = req.body;
        
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
                purchaseDate: new Date().toLocaleString('pt-BR'),
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

