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

// Rota padrão para o frontend (Single Page Application)
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../frontend/pages/index.html'));
});

// Iniciar o servidor
app.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT}`);
});
