// Middleware para tratamento de erros
const errorHandler = (err, req, res, next) => {
    console.error(`Erro: ${err.message}`);
    console.error(err.stack);
    
    // Define o código de status (500 como padrão)
    const statusCode = err.statusCode || 500;
    
    // Resposta de erro
    res.status(statusCode).json({
        error: true,
        message: process.env.NODE_ENV === 'production' 
            ? 'Erro ao processar a requisição' 
            : err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = errorHandler; 