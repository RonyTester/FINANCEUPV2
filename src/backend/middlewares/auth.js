// Middleware de autenticação
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware para verificar autenticação
const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Token de autenticação não fornecido' });
    }
    
    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error || !user) {
            return res.status(401).json({ error: 'Token inválido ou expirado' });
        }
        
        // Adiciona o usuário ao objeto de requisição
        req.user = user;
        next();
    } catch (error) {
        console.error('Erro de autenticação:', error);
        return res.status(500).json({ error: 'Erro no servidor' });
    }
};

module.exports = authMiddleware; 