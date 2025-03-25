// Rotas de transações
const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Não vamos usar o middleware de autenticação por enquanto
// const authMiddleware = require('../middlewares/auth');
// router.use(authMiddleware);

// Obter todas as transações
router.get('/', async (req, res) => {
    try {
        // Para teste, usamos um ID fixo
        const userId = '123';
        const transactions = await db.getTransactions(userId);
        res.json(transactions);
    } catch (error) {
        console.error('Erro ao buscar transações:', error);
        res.status(500).json({ error: 'Erro ao carregar transações' });
    }
});

// Criar uma nova transação
router.post('/', async (req, res) => {
    try {
        const { description, amount, type, category, date } = req.body;
        const userId = '123'; // Para teste
        
        // Validações
        if (!description || !amount || !type || !category || !date) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }
        
        const transaction = await db.addTransaction({
            description,
            amount: type === 'expense' ? -Math.abs(Number(amount)) : Math.abs(Number(amount)),
            type,
            category,
            date
        }, userId);
        
        res.status(201).json(transaction);
    } catch (error) {
        console.error('Erro ao criar transação:', error);
        res.status(500).json({ error: 'Erro ao salvar transação' });
    }
});

// Atualizar uma transação
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { description, amount, type, category, date } = req.body;
        const userId = '123'; // Para teste
        
        // Validações
        if (!description || !amount || !type || !category || !date) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }
        
        const transaction = await db.updateTransaction(id, {
            description,
            amount: type === 'expense' ? -Math.abs(Number(amount)) : Math.abs(Number(amount)),
            type,
            category,
            date
        }, userId);
        
        if (!transaction) {
            return res.status(404).json({ error: 'Transação não encontrada' });
        }
        
        res.json(transaction);
    } catch (error) {
        console.error('Erro ao atualizar transação:', error);
        res.status(500).json({ error: 'Erro ao atualizar transação' });
    }
});

// Excluir uma transação
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = '123'; // Para teste
        await db.deleteTransaction(id, userId);
        res.json({ message: 'Transação excluída com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir transação:', error);
        res.status(500).json({ error: 'Erro ao excluir transação' });
    }
});

module.exports = router; 