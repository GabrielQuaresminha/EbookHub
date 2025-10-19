// ===== Configuração do Mercado Pago =====
// 
// INSTRUÇÕES:
// 1. Renomeie este arquivo para 'config.js'
// 2. Substitua os valores abaixo com suas credenciais reais do Mercado Pago
// 3. NUNCA faça commit do arquivo 'config.js' no GitHub
//
// Para obter suas credenciais:
// 1. Acesse https://www.mercadopago.com.br
// 2. Vá em "Seu negócio" → "Configurações" → "Integrações" → "Credenciais"
// 3. Copie suas chaves de teste ou produção

// Credenciais de TESTE (para desenvolvimento)
const MP_PUBLIC_KEY_TEST = 'TEST-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX';
const MP_ACCESS_TOKEN_TEST = 'TEST-XXXXXXXXXXXX-XXXXXX-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-XXXXXXXXXX';

// Credenciais de PRODUÇÃO (para vender de verdade)
const MP_PUBLIC_KEY_PROD = 'APP_USR-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX';
const MP_ACCESS_TOKEN_PROD = 'APP_USR-XXXXXXXXXXXX-XXXXXX-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-XXXXXXXXXX';

// Exportar credenciais
// Use TEST para desenvolvimento, PROD para produção
export const MP_PUBLIC_KEY = MP_PUBLIC_KEY_TEST;
export const MP_ACCESS_TOKEN = MP_ACCESS_TOKEN_TEST;

