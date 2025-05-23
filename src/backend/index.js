// Servidor principal
const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

// Importar rotas
const transactionRoutes = require('./routes/transactionRoutes');

// Configuração do Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos do frontend
// Primeiro servimos os arquivos da pasta pages como raiz
app.use(express.static(path.join(__dirname, '../frontend/pages')));

// Depois servimos os outros diretórios com seus próprios caminhos
app.use('/styles', express.static(path.join(__dirname, '../frontend/styles')));
app.use('/scripts', express.static(path.join(__dirname, '../frontend/scripts')));
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));

// Rota simples para teste
app.get('/api/status', (req, res) => {
	res.json({ status: 'online', message: 'API funcionando corretamente' });
});

// Rotas da API
app.use('/api/transactions', transactionRoutes);

// --- ROTA DE EXCLUSÃO DE USUÁRIO ---
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.post('/api/delete-user', async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'User ID required' });

  try {
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota para fornecer as credenciais do Supabase ao frontend
app.get('/api/supabase-config', (req, res) => {
  // Apenas fornecendo a chave anônima pública, nunca a chave de serviço
  res.json({
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY
  });
});

// Rota padrão para o frontend (Single Page Application)
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../frontend/pages/index.html'));
});

// Iniciar o servidor
app.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT}`);
});
