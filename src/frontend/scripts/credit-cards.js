// credit-cards.js
// SPA Cartões de Crédito - v2
// Comentado para fácil manutenção

// Inicializar lista de cartões vazia
let creditCards = [];

// Constantes de bancos e bandeiras
const BANKS = {
    'nubank':   { color: '#8A05BE', icon: 'nubank.svg', label: 'Nubank' },
    'itau':     { color: '#EC7000', icon: 'itau.svg', label: 'Itaú' },
    'santander':{ color: '#CC0000', icon: 'santander.svg', label: 'Santander' },
    'bradesco': { color: '#CC092F', icon: 'bradesco.svg', label: 'Bradesco' },
    'caixa':    { color: '#1A5BAD', icon: 'caixa.svg', label: 'Caixa' },
    'bb':       { color: '#FFEF38', icon: 'bb.svg', label: 'Banco do Brasil' },
    'inter':    { color: '#FF7A00', icon: 'inter.svg', label: 'Inter' },
    'original': { color: '#43b02a', icon: 'original.svg', label: 'Original' },
    'c6':       { color: '#222222', icon: 'c6.svg', label: 'C6 Bank' },
    'next':     { color: '#00ff5f', icon: 'next.svg', label: 'Next' },
    'pagbank':  { color: '#00C244', icon: 'pagbank.svg', label: 'PagBank' },
    'picpay':   { color: '#21C25E', icon: 'picpay.svg', label: 'PicPay' },
    'outro':    { color: '#4F8CFF', icon: 'credit-card.svg', label: 'Outro' }
};

// Função para renderizar a lista de cartões
function renderCardsList() {
    const container = document.getElementById('cardsListContainer');
    if (!container) return;
    
    // Se não houver cartões, mostra tela de boas-vindas
    if (!creditCards.length) {
        renderEmptyState();
        document.querySelector('.cards-actions-header')?.classList.add('hidden');
        return;
    }
    
    // Se houver cartões, mostra o botão de adicionar
    document.querySelector('.cards-actions-header')?.classList.remove('hidden');

    // GRID para desktop, carrossel para mobile
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        container.style.display = 'none';
        let carousel = document.getElementById('cardsCarousel');
        if (!carousel) {
            carousel = document.createElement('div');
            carousel.id = 'cardsCarousel';
            carousel.className = 'cards-carousel';
            container.parentNode.insertBefore(carousel, container);
        }
        
        // Inicializar ou atualizar a paginação de cartões
        if (!window.cardPagination) {
            window.cardPagination = new CreditCardPagination(4);
        } else {
            window.cardPagination.update(creditCards);
        }
        
        carousel.style.display = 'flex';
    } else {
        // Comportamento original do desktop
        container.style.display = '';
        let carousel = document.getElementById('cardsCarousel');
        if (carousel) carousel.style.display = 'none';
        
        // Esconder paginação no desktop
        const paginationContainer = document.getElementById('card-pagination-container');
        if (paginationContainer) {
            paginationContainer.style.display = 'none';
        }
        
        // Paginação: 4 cartões por página (original)
        const cardsPerPage = 4;
        let page = window.__cardsPage || 0;
        const totalPages = Math.ceil(creditCards.length / cardsPerPage);
        if (page >= totalPages) page = 0;
        window.__cardsPage = page;
        const paginated = creditCards.slice(page * cardsPerPage, (page + 1) * cardsPerPage);
        container.innerHTML = paginated.map((card, idx) => renderCardVisual(card, idx + page * cardsPerPage)).join('');
        
        // Paginação original do desktop
        let pagination = document.getElementById('cardsPagination');
        if (!pagination) {
            pagination = document.createElement('div');
            pagination.id = 'cardsPagination';
            pagination.className = 'cards-pagination';
            container.parentNode.insertBefore(pagination, container.nextSibling);
        }
        pagination.innerHTML = '';
        for (let i = 0; i < totalPages; i++) {
            pagination.innerHTML += `<button class="${i === page ? 'active' : ''}" onclick="setCardsPage(${i})"></button>`;
        }
        pagination.style.display = totalPages > 1 ? 'flex' : 'none';
    }
}

// Exibe tela de boas-vindas quando não há cartões
function renderEmptyState() {
    const container = document.getElementById('cardsListContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="empty-credit-cards">
            <div class="empty-icon">
                <i class="fas fa-credit-card"></i>
            </div>
            <h3>Comece a Gerenciar Seus Cartões</h3>
            <p>Cadastre seus cartões de crédito para acompanhar faturas, gastos e receber alertas de vencimento.</p>
            <div class="suggestion-items">
                <div class="suggestion-item" onclick="toggleCreditCardModal(true)">
                    <i class="fas fa-university"></i>
                    <span>Cartão do Banco</span>
                </div>
                <div class="suggestion-item" onclick="toggleCreditCardModal(true)">
                    <i class="fas fa-shopping-cart"></i>
                    <span>Cartão de Loja</span>
                </div>
                <div class="suggestion-item" onclick="toggleCreditCardModal(true)">
                    <i class="fas fa-globe"></i>
                    <span>Cartão Internacional</span>
                </div>
                <div class="suggestion-item" onclick="toggleCreditCardModal(true)">
                    <i class="fas fa-piggy-bank"></i>
                    <span>Cartão Benefício</span>
                </div>
            </div>
            <button class="btn btn-primary create-first-card" onclick="toggleCreditCardModal(true)">
                <i class="fas fa-plus"></i> Criar Primeiro Cartão
            </button>
        </div>
    `;
}

// Renderiza o cartão em formato realista, cor padrão, ícone do banco
function renderCardVisual(card, idx) {
    const percent = Math.min(100, (card.used || 0) / card.limit * 100);
    return `
        <div class="credit-card-visual realistic-card">
            <img class="card-bank-icon" src="/assets/banks/${card.icon}" alt="${card.bank}" title="${card.bank}" />
            <div class="card-name">${card.name}</div>
            <div class="card-limit">Limite: R$ ${Number(card.limit).toLocaleString('pt-BR', {minimumFractionDigits:2})}</div>
            <div class="card-due">Vencimento: dia ${card.due_day}</div>
            <div class="progress-bar"><div class="progress" style="width:${percent}%;background:#4f8cff;"></div></div>
            <div class="used-info">Usado: <b>R$ ${Number(card.used||0).toLocaleString('pt-BR', {minimumFractionDigits:2})}</b> (${percent.toFixed(0)}%)</div>
            <div class="credit-card-actions">
                <button title="Ver Gastos" onclick="showCardExpenses('${card.id}')"><i class="fas fa-receipt"></i></button>
                <button title="Editar" onclick="editCard('${card.id}')"><i class="fas fa-edit"></i></button>
                <button title="Excluir" onclick="deleteCard('${card.id}')"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `;
}

window.setCardsPage = function(page) {
    window.__cardsPage = page;
    renderCardsList();
};

// Classe para gerenciar a paginação de cartões de crédito no mobile
class CreditCardPagination {
    constructor(itemsPerPage = 4) {
        this.currentPage = 1;
        this.itemsPerPage = itemsPerPage;
        this.allCards = [...creditCards]; // cópia dos cartões
        this.paginationElement = null;
        this.cardsContainer = null;
        
        this.init();
    }
    
    init() {
        // Verifica se estamos no mobile
        if (window.innerWidth > 768) return;
        
        // Criar elemento de paginação se não existir
        const cardsCarousel = document.getElementById('cardsCarousel');
        if (!cardsCarousel) return;
        
        // Verificar se o container de paginação já existe
        let paginationContainer = document.getElementById('card-pagination-container');
        if (!paginationContainer) {
            paginationContainer = document.createElement('div');
            paginationContainer.id = 'card-pagination-container';
            paginationContainer.className = 'pagination-container fixed-pagination';
            paginationContainer.innerHTML = `
                <ul id="card-pagination" class="pagination"></ul>
            `;
            
            // Inserir após o carrossel de cartões
            cardsCarousel.parentNode.insertBefore(paginationContainer, cardsCarousel.nextSibling);
        }
        
        this.paginationElement = document.getElementById('card-pagination');
        this.cardsContainer = cardsCarousel;
        
        // Adicionar listener para mudança de página
        if (this.paginationElement) {
            this.paginationElement.addEventListener('click', (e) => {
                if (e.target.closest('.page-link')) {
                    e.preventDefault();
                    const pageAction = e.target.closest('.page-link').dataset.page;
                    
                    if (pageAction === 'prev') {
                        this.goToPage(this.currentPage - 1);
                    } else if (pageAction === 'next') {
                        this.goToPage(this.currentPage + 1);
                    } else {
                        this.goToPage(parseInt(pageAction));
                    }
                }
            });
        }
        
        // Renderizar a primeira página
        this.renderPage();
    }
    
    renderPage() {
        // Somente para mobile
        if (window.innerWidth > 768 || !this.cardsContainer) return;
        
        // Verificar se há cartões para mostrar
        if (this.allCards.length === 0) {
            renderEmptyState();
            if (this.paginationElement) {
                this.paginationElement.parentElement.style.display = 'none';
            }
            return;
        }
        
        // Calcular início e fim da página atual
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = Math.min(startIndex + this.itemsPerPage, this.allCards.length);
        
        // Obter cartões da página atual
        const cardsToShow = this.allCards.slice(startIndex, endIndex);
        
        // Renderizar cartões no container
        this.cardsContainer.innerHTML = cardsToShow.map((card, idx) => 
            renderCardVisual(card, idx + startIndex)
        ).join('');
        
        // Renderizar controles de paginação
        this.renderPaginationControls();
        
        // Mostrar a paginação
        if (this.paginationElement) {
            this.paginationElement.parentElement.style.display = 'flex';
        }
    }
    
    renderPaginationControls() {
        if (!this.paginationElement) return;
        
        const totalPages = Math.ceil(this.allCards.length / this.itemsPerPage);
        
        // Não mostrar paginação se tiver apenas uma página
        if (totalPages <= 1) {
            this.paginationElement.parentElement.style.display = 'none';
            return;
        }
        
        // Definir máximo de 5 botões de página para mostrar
        const maxPageButtons = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxPageButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
        
        // Ajustar startPage se endPage chegou ao máximo
        if (endPage === totalPages) {
            startPage = Math.max(1, endPage - maxPageButtons + 1);
        }
        
        let html = '';
        
        // Adicionar botão "Anterior" 
        html += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a href="#" class="page-link" data-page="prev">
                    <i class="fas fa-chevron-left"></i>
                </a>
            </li>
        `;
        
        // Adicionar elipse se necessário (início)
        if (startPage > 1) {
            html += `
                <li class="page-item">
                    <a href="#" class="page-link" data-page="1">1</a>
                </li>
                ${startPage > 2 ? '<li class="page-ellipsis">...</li>' : ''}
            `;
        }
        
        // Adicionar botões de página
        for (let i = startPage; i <= endPage; i++) {
            html += `
                <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                    <a href="#" class="page-link" data-page="${i}">${i}</a>
                </li>
            `;
        }
        
        // Adicionar elipse se necessário (fim)
        if (endPage < totalPages) {
            html += `
                ${endPage < totalPages - 1 ? '<li class="page-ellipsis">...</li>' : ''}
                <li class="page-item">
                    <a href="#" class="page-link" data-page="${totalPages}">${totalPages}</a>
                </li>
            `;
        }
        
        // Adicionar botão "Próximo"
        html += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a href="#" class="page-link" data-page="next">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        `;
        
        this.paginationElement.innerHTML = html;
    }
    
    goToPage(page) {
        const totalPages = Math.ceil(this.allCards.length / this.itemsPerPage);
        if (page < 1) page = 1;
        if (page > totalPages) page = totalPages;
        
        this.currentPage = page;
        this.renderPage();
    }
    
    update(cards) {
        this.allCards = [...cards];
        this.currentPage = 1;
        this.renderPage();
    }
}

// Tabela de bancos: cor e ícone
// const BANKS = {
//     nubank:   { color: '#8A05BE', icon: 'nubank.svg', label: 'Nubank' },
//     itau:     { color: '#FF7300', icon: 'itau.svg', label: 'Itaú' },
//     inter:    { color: '#FF6600', icon: 'inter.svg', label: 'Banco Inter' },
//     santander:{ color: '#EC0000', icon: 'santander.svg', label: 'Santander' },
//     caixa:    { color: '#005CA9', icon: 'caixa.svg', label: 'Caixa' },
//     bb:       { color: '#FFCC29', icon: 'bb.svg', label: 'Banco do Brasil' },
//     bradesco: { color: '#A51C48', icon: 'bradesco.svg', label: 'Bradesco' },
//     pagbank:  { color: '#00C244', icon: 'pagbank.svg', label: 'PagBank' },
//     picpay:   { color: '#21C25E', icon: 'picpay.svg', label: 'PicPay' },
//     outro:    { color: '#4f8cff', icon: 'credit-card.svg', label: 'Outro' }
// };

// Função para carregar cartões do Supabase
async function loadCreditCards() {
    try {
        // Ativar loader
        document.getElementById('cards-loader')?.classList.remove('hidden');
        
        // Carregar cartões
        const { data: cardsData, error: cardsError } = await supabase
            .from('credit_cards')
            .select('*')
            .eq('user_id', currentUser.id);
        
        if (cardsError) throw cardsError;
        
        creditCards = await Promise.all(cardsData.map(async (card) => {
            try {
                // Buscar despesas do cartão
                const { data: expensesData, error: expensesError } = await supabase
                    .from('credit_card_expenses')
                    .select('*')
                    .eq('card_id', card.id)
                    .eq('user_id', currentUser.id);
                
                if (expensesError) throw expensesError;
                
                let all_card_installments_from_db = [];
                const processedExpenses = await Promise.all(expensesData.map(async (expense) => {
                    // Buscar parcelas REAIS para cada despesa
                    const { data: fetched_installments, error: instError } = await supabase
                        .from('credit_card_installments')
                        .select('*')
                        .eq('expense_id', expense.id)
                        .eq('user_id', currentUser.id) // Adicionado para segurança e filtro
                        .order('installment_number', { ascending: true });

                    if (instError) {
                        console.error(`Erro ao buscar parcelas para despesa ${expense.id}:`, instError);
                        return { ...expense, installments_from_db: [] }; // Retorna despesa com parcelas vazias em caso de erro
                    }
                    
                    // Adiciona informações da despesa original a cada parcela para facilitar a renderização
                    const installments_with_expense_info = fetched_installments.map(inst => ({
                        ...inst,
                        // Campos da parcela já existentes: id (UUID real), expense_id, installment_number, amount, due_date, is_paid, paid_date
                        description: expense.description, // Descrição da despesa original
                        total_installments_for_expense: expense.installment_total, // Total de parcelas da despesa original
                        original_expense_amount: expense.amount, // Valor total da despesa original
                        card_id: card.id // Adiciona card_id para referência, se necessário
                    }));

                    all_card_installments_from_db.push(...installments_with_expense_info);
                    return { ...expense, installments_from_db: installments_with_expense_info };
                }));

                const card_used_amount = all_card_installments_from_db
                    .filter(inst => !inst.is_paid)
                    .reduce((sum, inst) => sum + parseFloat(inst.amount), 0);

                const classifiedInstallments = classifyInstallments(all_card_installments_from_db, card.due_day);
                
                return {
                    ...card,
                    expenses: processedExpenses, // Despesas com suas parcelas reais aninhadas
                    installments: all_card_installments_from_db, // Array plano de todas as parcelas reais do cartão
                    used: card_used_amount,
                    availableLimit: parseFloat(card.limit) - card_used_amount,
                    current: classifiedInstallments.current,
                    previous: classifiedInstallments.previous,
                    future: classifiedInstallments.future,
                    currentTotal: classifiedInstallments.current.reduce((sum, item) => sum + parseFloat(item.amount), 0),
                    previousTotal: classifiedInstallments.previous.reduce((sum, item) => sum + parseFloat(item.amount), 0),
                    futureTotal: classifiedInstallments.future.reduce((sum, item) => sum + parseFloat(item.amount), 0),
                };
            } catch (error) {
                console.error(`Erro ao carregar despesas e parcelas do cartão ${card.name}:`, error);
                return { // Retorno em caso de erro para este cartão específico
                    ...card,
                    expenses: [],
                    installments: [],
                    used: 0,
                    availableLimit: parseFloat(card.limit),
                    current: [], previous: [], future: [],
                    currentTotal: 0, previousTotal: 0, futureTotal: 0
                };
            }
        }));
        
        // Ocultar loader e renderizar cartões
        document.getElementById('cards-loader')?.classList.add('hidden');
        renderCardsList();
    } catch (error) {
        console.error('Erro geral ao carregar cartões:', error);
        document.getElementById('cards-loader')?.classList.add('hidden');
        // Poderia renderizar um estado de erro geral aqui
    }
}

// Função para gerar parcelas a partir de uma despesa - AGORA OBSOLETA PARA DADOS PRIMÁRIOS
// Manter apenas se for usada para UI temporária ou alguma outra lógica específica não coberta pelo banco.
// Para os dados principais, as parcelas vêm do banco.
// ... existing code ...
// Classificar parcelas por aba e agrupar por ID da despesa
// A função classifyInstallments agora recebe card_due_day como segundo argumento
function classifyInstallments(installments, card_due_day) {
    // Determinar começo do mês atual e do próximo mês
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    
    // Agrupar todas as parcelas por ID da despesa
    const expenseGroups = {};

    installments.forEach(inst => {
        if (!expenseGroups[inst.expense_id]) {
            expenseGroups[inst.expense_id] = [];
        }
        expenseGroups[inst.expense_id].push(inst);
    });

    // Inicializar arrays de resultado
    const currentInstallmentArray = [];
    const previousInstallmentArray = [];
    const futureInstallmentArray = [];

    // Para cada grupo de despesa, distribuir suas parcelas individualmente
    for (const expenseId in expenseGroups) {
        const expenseInstallments = expenseGroups[expenseId];
        // Ordenar parcelas por número
        expenseInstallments.sort((a, b) => a.installment_number - b.installment_number);
        
        // Processar cada parcela individualmente
        expenseInstallments.forEach(inst => {
            const dueDate = new Date(inst.due_date);
            
            // Parcelas pagas vão para 'previous'
            if (inst.is_paid) {
                previousInstallmentArray.push(inst);
            } 
            // Parcelas não pagas são classificadas pela data
            else {
                if (dueDate >= currentMonthStart && dueDate < nextMonthStart) {
                    // Parcela atual
                    currentInstallmentArray.push(inst);
                } else if (dueDate >= nextMonthStart) {
                    // Parcela futura
                    futureInstallmentArray.push(inst);
                } else {
                    // Parcelas vencidas (antes do mês atual) também vão para 'current'
                    currentInstallmentArray.push(inst);
                }
            }
        });
    }

    // Ordenar as listas
    currentInstallmentArray.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
    previousInstallmentArray.sort((a, b) => new Date(b.paid_date || b.due_date) - new Date(a.paid_date || a.due_date)); // Mais recente primeiro
    futureInstallmentArray.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

    return {
        current: currentInstallmentArray,
        previous: previousInstallmentArray,
        future: futureInstallmentArray
    };
}

// Marcar parcela como paga
async function toggleInstallmentPaid(installmentId, isPaid, expenseId) {
    try {
        if (isPaid) {
            // Perguntar se o usuário quer pagar apenas esta parcela ou todas as parcelas futuras
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.id = 'paymentOptionsModal';
            
            modal.innerHTML = `
                <div class="modal-content payment-options-modal">
                    <div class="modal-header">
                        <h3>Opções de Pagamento</h3>
                        <button class="close-modal" onclick="document.getElementById('paymentOptionsModal').remove(); document.body.style.overflow = '';">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p>Como deseja efetuar o pagamento?</p>
                        <div class="payment-options">
                            <button class="btn btn-outline payment-option" onclick="processPayment('${installmentId}', 'single')">
                                <i class="fas fa-file-invoice-dollar"></i>
                                <span>Pagar apenas esta parcela</span>
                            </button>
                            <button class="btn btn-outline payment-option" onclick="processPayment('${installmentId}', 'all', '${expenseId}')">
                                <i class="fas fa-money-check-alt"></i>
                                <span>Pagar todas as parcelas pendentes</span>
                            </button>
                            <button class="btn btn-outline payment-option" onclick="showAdvancedPayment('${expenseId}')">
                                <i class="fas fa-tasks"></i>
                                <span>Seleção personalizada</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            // Para marcar como não pago, apenas uma parcela por vez
            await updateInstallmentStatus(installmentId, false);
        }
    } catch (error) {
        console.error('Erro ao processar pagamento:', error);
        showNotification('error', 'Erro', 'Não foi possível processar o pagamento');
    }
}

// Processa o pagamento conforme a opção selecionada
async function processPayment(installmentId, mode, expenseId = null) {
    try {
        if (mode === 'single') {
            // Pagamento de uma única parcela
            await updateInstallmentStatus(installmentId, true); // installmentId aqui deve ser o UUID real
        } else if (mode === 'all' && expenseId) {
            // Pagamento de todas as parcelas da despesa
            const allInstallments = getAllInstallments();
            const relatedInstallments = allInstallments.filter(inst => 
                inst.expense_id === expenseId && !inst.is_paid
            );
            
            for (const inst of relatedInstallments) {
                await updateInstallmentStatus(inst.id, true);
            }
        }
        
        // Fechar modal de opções
        const modal = document.getElementById('paymentOptionsModal');
        if (modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
        
        // Atualizar a UI sem recarregar a página
        await updateUIWithoutReload();
        
    } catch (error) {
        console.error('Erro ao processar pagamento:', error);
        showNotification('error', 'Erro', 'Não foi possível processar o pagamento');
    }
}

// Mostrar opções avançadas para pagamento personalizado
function showAdvancedPayment(expenseId) {
    // Fechar o modal de opções
    const optionsModal = document.getElementById('paymentOptionsModal');
    if (optionsModal) {
        optionsModal.remove();
    }
    
    // Obter todas as parcelas dessa despesa
    const allInstallments = getAllInstallments();
    const relatedInstallments = allInstallments.filter(inst => 
        inst.expense_id === expenseId && !inst.is_paid
    );
    
    // Se não houver parcelas, retornar
    if (!relatedInstallments.length) {
        showNotification('info', 'Info', 'Não há parcelas pendentes para esta despesa');
        document.body.style.overflow = '';
        return;
    }
    
    // Criar modal para seleção personalizada
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'advancedPaymentModal';
    
    // Obter informações da despesa para o título
    const expense = relatedInstallments[0];
    
    modal.innerHTML = `
        <div class="modal-content payment-options-modal">
            <div class="modal-header">
                <h3>Pagamento Personalizado</h3>
                <button class="close-modal" onclick="document.getElementById('advancedPaymentModal').remove(); document.body.style.overflow = '';">&times;</button>
            </div>
            <div class="modal-body">
                <div class="expense-payment-header">
                    <strong>${expense.description}</strong>
                    <span>Selecione as parcelas que deseja pagar:</span>
                </div>
                <div class="installment-selection">
                    ${relatedInstallments.map(inst => `
                        <div class="installment-option">
                            <label class="checkbox-container">
                                <input type="checkbox" class="payment-checkbox" data-id="${inst.id}">
                                <span class="checkmark"></span>
                                <div class="installment-info">
                                    <div class="installment-details">
                                        <span class="installment-number">Parcela ${inst.installment_number}/${inst.total_installments}</span>
                                        <span class="installment-amount">R$ ${Number(inst.amount).toLocaleString('pt-BR', {minimumFractionDigits:2})}</span>
                                    </div>
                                    <div class="installment-date">
                                        <i class="fas fa-calendar-alt"></i> Vencimento: ${new Date(inst.due_date).toLocaleDateString('pt-BR')}
                                    </div>
                                </div>
                            </label>
                        </div>
                    `).join('')}
                </div>
                <div class="payment-actions">
                    <button class="btn btn-secondary" onclick="document.getElementById('advancedPaymentModal').remove(); document.body.style.overflow = '';">Cancelar</button>
                    <button class="btn btn-primary" onclick="processSelectedPayments()">Confirmar Pagamento</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Processa o pagamento das parcelas selecionadas
async function processSelectedPayments() {
    const checkboxes = document.querySelectorAll('.payment-checkbox:checked');
    if (!checkboxes.length) {
        showNotification('warning', 'Atenção', 'Selecione pelo menos uma parcela para pagar');
        return;
    }
    
    const installmentIdsToPay = Array.from(checkboxes).map(cb => cb.dataset.id); // Estes IDs devem ser os UUIDs reais
    
    try {
        // Marcar cada parcela selecionada como paga
        for (const installmentId of installmentIdsToPay) { // Iterar sobre os IDs corretos
            await updateInstallmentStatus(installmentId, true);
        }
        
        // Fechar modal
        const modal = document.getElementById('advancedPaymentModal');
        if (modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
        
        // Atualizar a UI sem recarregar a página
        await updateUIWithoutReload();
        
        showNotification('success', 'Sucesso', `${checkboxes.length} parcela(s) marcada(s) como paga(s)!`);
    } catch (error) {
        console.error('Erro ao processar pagamentos selecionados:', error);
        showNotification('error', 'Erro', 'Não foi possível processar os pagamentos selecionados');
    }
}

// Atualiza o status de uma parcela individual
async function updateInstallmentStatus(installmentId, isPaid) {
    const updates = {
        is_paid: isPaid,
        paid_date: isPaid ? new Date().toISOString().split('T')[0] : null
    };
    
    const { data, error } = await supabase
        .from('credit_card_installments')
        .update(updates)
        .eq('id', installmentId)
        .select();
        
    if (error) throw error;
    
    // Atualizar UI sem recarregar
    await updateUIWithoutReload(); 
    
    return data;
}

// Atualiza os cartões e a UI sem recarregar a página
async function refreshCardsAndUI() {
    await updateUIWithoutReload();
}

// Modal explicativo
function toggleCreditCardIntroModal(show) {
    const modal = document.getElementById('creditCardIntroModal');
    if (!modal) return;
    if (show === false) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    } else {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Modal de cadastro/edição
function toggleCreditCardModal(show, idx = null) {
    const modal = document.getElementById('creditCardModal');
    const form = document.getElementById('creditCardForm');
    if (!modal || !form) return;
    if (show) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Se for edição, preenche os campos
        // idx aqui deve ser o ID do cartão, não o índice do array
        const cardToEdit = idx !== null ? creditCards.find(c => c.id === idx) : null;
        if (cardToEdit) {
            form.cardName.value = cardToEdit.name;
            form.cardBrand.value = cardToEdit.brand;
            form.cardLimit.value = cardToEdit.limit;
            form.cardDueDay.value = cardToEdit.due_day;
            form.cardBank.value = cardToEdit.bank;
            form.dataset.editIdx = idx; // Armazena o ID do cartão para edição
            document.getElementById('creditCardModalTitle').textContent = 'Editar Cartão';
        } else {
            form.reset();
            delete form.dataset.editIdx;
            document.getElementById('creditCardModalTitle').textContent = 'Novo Cartão';
        }
    } else {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        form.reset();
        delete form.dataset.editIdx;
    }
}

// Função para lidar com o envio do formulário do cartão
async function handleCardFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const cardId = form.dataset.editIdx; // ID para edição ou undefined para novo

    const cardData = {
        user_id: currentUser.id,
        name: form.cardName.value,
        bank: form.cardBank.value,
        brand: form.cardBrand.value,
        limit: parseFloat(form.cardLimit.value),
        due_day: parseInt(form.cardDueDay.value),
        color: BANKS[form.cardBank.value]?.color || '#4F8CFF',
        icon: BANKS[form.cardBank.value]?.icon || 'credit-card.svg'
    };

    try {
        let response;
        if (cardId) {
            // Atualizar cartão existente
            const { data, error } = await supabase
                .from('credit_cards')
                .update(cardData)
                .eq('id', cardId)
                .eq('user_id', currentUser.id)
                .select()
                .single();
            if (error) throw error;
            response = data;
            showNotification('success', 'Sucesso', 'Cartão atualizado com sucesso!');
        } else {
            // Criar novo cartão
            const { data, error } = await supabase
                .from('credit_cards')
                .insert([cardData])
                .select()
                .single();
            if (error) throw error;
            response = data;
            showNotification('success', 'Sucesso', 'Cartão criado com sucesso!');
        }
        await updateUIWithoutReload(); // Nova função para atualizar sem recarregar
        toggleCreditCardModal(false);
    } catch (error) {
        console.error('Erro ao salvar cartão:', error);
        showNotification('error', 'Erro', error.message || 'Não foi possível salvar o cartão.');
    }
}

// Função para preencher o formulário de edição do cartão
function editCard(cardId) {
    toggleCreditCardModal(true, cardId);
}

// Função para deletar um cartão
async function deleteCard(cardId) {
    const cardToDelete = creditCards.find(c => c.id === cardId);
    if (!cardToDelete) {
        showNotification('error', 'Erro', 'Cartão não encontrado!');
        return;
    }

    // Usar o showConfirmation em vez do confirm nativo
    const confirmationResult = await showConfirmation(
        'Excluir Cartão', 
        `Tem certeza que deseja excluir o cartão "${cardToDelete.name}" e todas as suas despesas associadas? Esta ação não pode ser desfeita.`
    );
    
    if (!confirmationResult) {
        return; // Usuário cancelou a operação
    }

    try {
        // O Supabase deve lidar com a exclusão em cascata das despesas e parcelas se configurado corretamente
        const { error } = await supabase
            .from('credit_cards')
            .delete()
            .eq('id', cardId)
            .eq('user_id', currentUser.id);

        if (error) throw error;

        showNotification('success', 'Sucesso', `Cartão "${cardToDelete.name}" excluído com sucesso.`);
        await updateUIWithoutReload(); // Nova função para atualizar sem recarregar
    } catch (error) {
        console.error('Erro ao excluir cartão:', error);
        showNotification('error', 'Erro', error.message || 'Não foi possível excluir o cartão.');
    }
}

// Abrir/fechar o modal de despesas do cartão
function toggleCardExpensesModal(show, cardId = null) {
    const modal = document.getElementById('cardExpensesModal');
    
    if (show && cardId) {
        // Armazenar o ID do cartão atual no dataset do modal
        modal.dataset.currentCardId = cardId;
        
        // Encontrar o cartão
        const card = creditCards.find(c => c.id === cardId);
        if (!card) {
            showNotification('error', 'Erro', 'Cartão não encontrado!');
            return;
        }
        
        // Atualizar título do modal
        document.getElementById('expensesModalTitle').textContent = `Despesas de ${card.name}`;
        
        // Atualizar totais das faturas
        document.getElementById('currentInvoiceTotal').textContent = 
            `R$ ${card.currentTotal ? card.currentTotal.toLocaleString('pt-BR', {minimumFractionDigits:2}) : '0,00'}`;
        document.getElementById('nextBillTotal').textContent = 
            `R$ ${card.futureTotal ? card.futureTotal.toLocaleString('pt-BR', {minimumFractionDigits:2}) : '0,00'}`;
        
        // Configurar botão de adicionar despesa
        document.getElementById('openAddExpenseModalBtn').onclick = () => toggleAddExpenseModal(true, cardId);
        
        // Renderizar as abas de despesas
        renderCardExpenseTabs(card);
        
        // Exibir o modal
        modal.classList.add('active');
        document.body.classList.add('modal-open');
    } else {
        // Fechar o modal
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }
}

// Renderização das tabs de despesas do cartão
function renderCardExpenseTabs(card) {
    if (!card) {
        console.error('Cartão não fornecido para renderização de abas de despesa');
        return;
    }
    
    // Obter as despesas processadas
    let processedExpenses;
    
    try {
        // Tentativa de obter despesas já processadas
        processedExpenses = {
            current: card.current || [],
            future: card.future || [],
            previous: card.previous || []
        };
    } catch (error) {
        console.error('Erro ao obter despesas processadas:', error);
        processedExpenses = { current: [], future: [], previous: [] };
    }
    
    // Containers para cada tipo de despesa
    const currentContainer = document.getElementById('current-expenses-content');
    if (currentContainer) {
        const currentList = currentContainer.querySelector('.expenses-list') || currentContainer;
        renderCurrentExpenses(card, currentList);
    }
    
    const futureContainer = document.getElementById('future-expenses-content');
    if (futureContainer) {
        const futureList = futureContainer.querySelector('.expenses-list') || futureContainer;
        renderFutureExpenses(card, futureList);
    }
    
    const paidContainer = document.getElementById('paid-expenses-content');
    if (paidContainer) {
        const paidList = paidContainer.querySelector('.expenses-list') || paidContainer;
        renderPaidExpenses(card, paidList);
    }
    
    // Configurar as abas
    setupExpenseTabs();
}

// Modal de adicionar despesa
function toggleAddExpenseModal(show, cardId = null) {
    const modal = document.getElementById('addExpenseModal');
    const form = document.getElementById('addExpenseForm');
    if (!modal || !form) {
        console.error('Modal ou formulário de adicionar despesa não encontrado.');
        return;
    }

    if (show && cardId) {
        const card = creditCards.find(c => c.id === cardId);
        if (!card) {
            showNotification('error', 'Erro', 'Cartão não encontrado para adicionar despesa.');
            return;
        }
        form.expenseCardId.value = cardId; // Define o ID do cartão no formulário
        document.getElementById('addExpenseModalTitle').textContent = `Nova Despesa para ${card.name}`;
        
        // Definir data padrão como hoje
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('expenseDate').value = today;
        
        // Limpar campos do formulário
        document.getElementById('expenseDescription').value = '';
        document.getElementById('expenseAmount').value = '';
        document.getElementById('expenseInstallments').value = '1';

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        form.reset(); // Limpa o formulário ao fechar
    }
}

// Função para mostrar as despesas do cartão (chamada pelo botão "Ver Gastos")
function showCardExpenses(cardId) {
    // Encontrar o cartão pelo ID
    const card = creditCards.find(c => c.id === cardId);
    if (!card) {
        showNotification('error', 'Erro', 'Cartão não encontrado!');
        return;
    }
    
    // Abrir o modal de despesas
    toggleCardExpensesModal(true, cardId);
    
    // Garantir que a primeira aba (Fatura Atual) esteja ativa
    const firstTab = document.querySelector('.expenses-tabs .cc-tab-btn');
    if (firstTab) {
        // Simular um clique para ativar a primeira aba
        firstTab.click();
    }
}

// Placeholder para funções que podem estar faltando e são referenciadas
function deleteExpense(expenseId) {
    console.warn(`deleteExpense(${expenseId}) não implementada`);
    // Implementar lógica de exclusão de despesa e suas parcelas
    // Ex: confirmar, chamar Supabase, refreshCardsAndUI()
}

function moveToCurrentBill(installmentId) {
    console.log(`Adiantando parcela ${installmentId} para a fatura atual...`);
    
    // Encontrar a parcela correspondente
    const allInstallments = getAllInstallments();
    const installment = allInstallments.find(inst => inst.id === installmentId);
    
    if (!installment) {
        showNotification('error', 'Erro', 'Parcela não encontrada');
        return;
    }
    
    // Definir a nova data para o mês atual (fatura atual)
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Criar data para o vencimento no mês atual
    // Usamos o dia de vencimento do cartão ou dia 15 como fallback
    const card = creditCards.find(c => c.id === installment.card_id);
    const dueDay = card ? card.due_day : 15;
    
    // Garantir que o dia seja válido (para meses com menos de 31 dias)
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const validDueDay = Math.min(dueDay, lastDayOfMonth);
    
    // Criar a nova data
    const newDueDate = new Date(currentYear, currentMonth, validDueDay);
    
    // Formatar para YYYY-MM-DD como esperado pelo banco de dados
    const formattedNewDate = newDueDate.toISOString().split('T')[0];
    
    // Mostrar uma notificação de carregamento
    showNotification('info', 'Processando', 'Adiantando parcela, aguarde...');
    
    // Atualizar a data de vencimento da parcela no banco de dados
    supabase
        .from('credit_card_installments')
        .update({ due_date: formattedNewDate })
        .eq('id', installmentId)
        .then(async ({ data, error }) => {
            if (error) {
                console.error('Erro ao adiantar parcela:', error);
                showNotification('error', 'Erro', 'Não foi possível adiantar a parcela');
                return;
            }
            
            // Atualizar dados locais para refletir a mudança
            const cardIndex = creditCards.findIndex(c => c.id === card.id);
            if (cardIndex >= 0) {
                // Recarregar dados do cartão específico
                await updateUIWithoutReload();
                
                // Atualizar o modal se estiver aberto
                if (card.id === document.getElementById('cardExpensesModal')?.dataset?.currentCardId) {
                    renderCardExpenseTabs(creditCards[cardIndex]);
                }
                
                showNotification('success', 'Sucesso', 'Parcela adiantada para a fatura atual');
            }
        });
}

// Função auxiliar para pegar todas as parcelas (se não existir ainda)
function getAllInstallments() {
    return creditCards.reduce((acc, card) => {
        if (card.installments && Array.isArray(card.installments)) {
            acc.push(...card.installments);
        }
        return acc;
    }, []);
}

// Configurar botão de novo cartão e inicializar módulo
function setupNewCardButton() {
    const newCardBtn = document.getElementById('newCreditCardBtn');
    if (newCardBtn) {
        newCardBtn.addEventListener('click', function() {
            toggleCreditCardModal(true);
        });
    }
    
    // Verificar se as funções necessárias estão disponíveis
    if (typeof showConfirmation !== 'function') {
        console.error('A função showConfirmation não está disponível. Isso pode causar problemas ao excluir cartões.');
    }
}

// SPA: Detecta quando a página de cartões é exibida
function observePageChange() {
    let lastActive = false;
    const observer = new MutationObserver(() => {
        const section = document.getElementById('credit-cards-page');
        const isActive = section && section.classList.contains('active');
        if (isActive && !lastActive) {
            // carregar cartões ao ativar página após autenticação
            loadCreditCards();
            setupNewCardButton();
            toggleCreditCardModal(false);
            if (!window.__creditCardIntroShown) {
                toggleCreditCardIntroModal(true);
                window.__creditCardIntroShown = true;
            }
        }
        lastActive = isActive;
    });
    observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class'] });
}
// Inicialização ao carregar DOM
document.addEventListener('DOMContentLoaded', () => {
    observePageChange();
    
    const cardForm = document.getElementById('creditCardForm');
    if (cardForm) {
        cardForm.onsubmit = handleCardFormSubmit;
    }

    const addExpenseForm = document.getElementById('addExpenseForm');
    if (addExpenseForm) {
        addExpenseForm.onsubmit = handleAddExpense;
    }
    
    // Expor funções globais para botões inline
    window.toggleCreditCardIntroModal = toggleCreditCardIntroModal;
    window.toggleCreditCardModal = toggleCreditCardModal;
    window.editCard = editCard;
    window.deleteCard = deleteCard;
    window.showCardExpenses = showCardExpenses; 
    window.toggleCardExpensesModal = toggleCardExpensesModal;
    window.toggleAddExpenseModal = toggleAddExpenseModal;
    window.deleteExpense = deleteExpense;
    window.moveToCurrentBill = moveToCurrentBill;
    window.processPayment = processPayment;
    window.showAdvancedPayment = showAdvancedPayment;
    window.processSelectedPayments = processSelectedPayments;
    window.toggleInstallmentPaid = toggleInstallmentPaid;
    window.showPaymentOptions = (cardId, installmentId, isInstallment, expenseId) => {
        toggleInstallmentPaid(installmentId, true, expenseId);
    };
    
    // Adicionar listener para redimensionamento da janela
    window.addEventListener('resize', function() {
        renderCardsList();
    });

    // Setup para abas no modal de despesas
    setupExpenseTabs();
});

// Configurar abas de despesas no modal
function setupExpenseTabs() {
    // Verificar se as abas já foram configuradas
    const expensesTabs = document.querySelector('.expenses-tabs');
    if (!expensesTabs) return;

    // Remover eventos existentes para evitar duplicações
    const existingTabButtons = expensesTabs.querySelectorAll('.cc-tab-btn');
    existingTabButtons.forEach(tab => {
        const newTab = tab.cloneNode(true);
        tab.parentNode.replaceChild(newTab, tab);
    });

    // Adicionar novos event listeners
    const tabButtons = expensesTabs.querySelectorAll('.cc-tab-btn');
    tabButtons.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remover classe ativa de todas as abas
            tabButtons.forEach(t => t.classList.remove('active'));
            
            // Adicionar classe ativa a esta aba
            this.classList.add('active');
            
            // Obter id do conteúdo a ser mostrado
            const targetId = this.getAttribute('data-target');
            
            // Remover classe ativa de todos os conteúdos
            const tabContents = document.querySelectorAll('.cc-tab-content');
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Adicionar classe ativa ao conteúdo alvo
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
    
    // Garantir que haja uma aba ativa
    const activeTab = expensesTabs.querySelector('.cc-tab-btn.active') || 
                      expensesTabs.querySelector('.cc-tab-btn');
    
    if (activeTab && !activeTab.classList.contains('active')) {
        activeTab.click();
    }
}

// Função para adicionar despesa ao cartão
async function handleAddExpense(e) {
    e.preventDefault();
    
    const form = e.target;
    const cardId = form.expenseCardId.value;
    const description = form.expenseDescription.value;
    
    // Verificar se o ID do cartão foi fornecido
    if (!cardId) {
        showNotification('error', 'Erro', 'Cartão não encontrado!');
        return;
    }
    
    // Encontrar o cartão correspondente
    const card = creditCards.find(c => c.id === cardId);
    if (!card) {
        showNotification('error', 'Erro', 'Cartão não encontrado!');
        return;
    }
    
    // Obter e formatar os valores
    const amount = parseFloat(form.expenseAmount.value);
    if (isNaN(amount) || amount <= 0) {
        showNotification('error', 'Erro', 'Por favor, informe um valor válido maior que zero.');
        return;
    }
    
    // Validar se a despesa não ultrapassa o limite do cartão
    if (!validateCardLimit(card, amount)) {
        showNotification('error', 'Limite Excedido', `Esta despesa de R$${amount.toLocaleString('pt-BR', {minimumFractionDigits:2})} ultrapassa o limite disponível do cartão.`);
        return;
    }
    
    const transactionDate = form.expenseDate.value;
    if (!transactionDate) {
        showNotification('error', 'Erro', 'Por favor, informe a data da compra.');
        return;
    }
    
    const installmentTotal = parseInt(form.expenseInstallments.value, 10);
    
    // Verificar se já existe uma despesa idêntica para evitar duplicidade
    const existingExpense = await checkDuplicateExpense(cardId, description, amount, transactionDate, installmentTotal);
    if (existingExpense) {
        const confirmResult = await showConfirmation(
            'Despesa Duplicada', 
            'Uma despesa idêntica já existe. Deseja adicionar mesmo assim?'
        );
        
        if (!confirmResult) {
            return;
        }
    }
    
    const expenseData = {
        user_id: currentUser.id,
        card_id: card.id,
        description: description,
        amount: amount,
        transaction_date: transactionDate,
        installment_total: installmentTotal,
    };
    
    console.log('Submitting expenseData:', expenseData);
    try {
        // Iniciar loader ou indicador de progresso
        const saveButton = document.querySelector('#addExpenseForm + .modal-footer .btn-primary');
        if (saveButton) {
            saveButton.disabled = true;
            saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';
        }
        
        // Inserir a despesa principal
        const { data: newExpense, error } = await supabase
            .from('credit_card_expenses')
            .insert([expenseData])
            .select()
            .single();
            
        console.log('Insert expense response:', newExpense, error);
        if (error) throw error;
        
        // O trigger do banco criará as parcelas automaticamente
        await updateUIWithoutReload();
        
        // Resetar formulário
        form.reset();
        
        // Definir data hoje como padrão para a próxima despesa
        form.expenseDate.value = new Date().toISOString().split('T')[0];
        
        // Fechar modal
        toggleAddExpenseModal(false);
        
        // Mostrar notificação de sucesso
        showNotification('success', 'Sucesso', 'Despesa adicionada com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar despesa:', error);
        showNotification('error', 'Erro', error.message || 'Não foi possível salvar a despesa');
    } finally {
        // Restaurar botão de salvar
        const saveButton = document.querySelector('#addExpenseForm + .modal-footer .btn-primary');
        if (saveButton) {
            saveButton.disabled = false;
            saveButton.innerHTML = 'Salvar';
        }
    }
}

// Verificar se já existe uma despesa duplicada
async function checkDuplicateExpense(cardId, description, amount, transactionDate, installmentTotal) {
    // Buscar despesas similares com os mesmos atributos
    const { data, error } = await supabase
        .from('credit_card_expenses')
        .select()
        .eq('card_id', cardId)
        .eq('description', description)
        .eq('amount', amount)
        .eq('transaction_date', transactionDate)
        .eq('installment_total', installmentTotal);
        
    if (error) {
        console.error('Erro ao verificar duplicidade:', error);
        return false;
    }
    
    return data && data.length > 0;
}

// Renderização específica de despesas atuais
function renderCurrentExpenses(card, container) {
    if (!container) {
        console.error("Container para despesas atuais não fornecido.");
        return;
    }
    
    // Agrupar parcelas pelo ID da despesa
    const groupedByExpense = {};
    card.current.forEach(inst => {
        const expenseId = inst.expense_id;
        if (!groupedByExpense[expenseId]) {
            groupedByExpense[expenseId] = [];
        }
        groupedByExpense[expenseId].push(inst);
    });
    
    // Ordenar grupos por data de vencimento da primeira parcela
    const orderedGroups = Object.entries(groupedByExpense)
        .sort(([_, installmentsA], [__, installmentsB]) => {
            const dateA = new Date(installmentsA[0].due_date);
            const dateB = new Date(installmentsB[0].due_date);
            return dateA - dateB;
        });
    
    if (orderedGroups.length === 0) {
        container.innerHTML = `
            <div class="empty-expenses">
                <i class="fas fa-receipt"></i>
                <p>Nenhuma despesa para este mês</p>
            </div>
        `;
        return;
    }
    
    // Construir HTML para cada grupo de parcelas
    let html = '';
    
    for (const [expenseId, installments] of orderedGroups) {
        const firstItem = installments[0];
        // Formatar data de vencimento
        const dueDate = new Date(firstItem.due_date);
        const formattedDueDate = dueDate.toLocaleDateString('pt-BR');
        
        // Parcela única ou múltiplas?
        const isInstallment = firstItem.total_installments_for_expense > 1;
        const installmentLabel = isInstallment 
            ? `${firstItem.installment_number}/${firstItem.total_installments_for_expense}` 
            : '';
        
        // Status (atrasado?)
        const isOverdue = dueDate < new Date() && !firstItem.is_paid;
        const statusClass = isOverdue ? 'overdue' : '';
        
        // Soma das parcelas no grupo (normalmente será só uma para "current")
        const totalAmount = installments.reduce((sum, inst) => sum + parseFloat(inst.amount), 0);
        
        html += `
            <div class="expense-item beautiful-expense ${statusClass}" data-expense-id="${expenseId}">
                <div class="expense-content">
                    <div class="expense-info">
                        <div class="expense-date">${formattedDueDate}</div>
                        <div class="expense-description">
                            ${firstItem.description}
                            ${isInstallment ? `<span class="installment-badge">${installmentLabel}</span>` : ''}
                        </div>
                    </div>
                    <div class="expense-amount">
                        R$ ${totalAmount.toLocaleString('pt-BR', {minimumFractionDigits:2})}
                    </div>
                </div>
                <div class="expense-actions">
                    <button class="btn-pay" onclick="showPaymentOptions('${card.id}', '${firstItem.id}', ${isInstallment}, '${expenseId}')">
                        <i class="fas fa-money-bill-wave"></i> Pagar
                    </button>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

// Renderização específica de despesas futuras
function renderFutureExpenses(card, container) {
    if (!container) {
        console.error("Container para despesas futuras não fornecido.");
        return;
    }
    
    // Verificar se tem parcelas futuras
    if (!card.future || card.future.length === 0) {
        container.innerHTML = `
            <div class="empty-expenses">
                <i class="fas fa-calendar-alt"></i>
                <p>Nenhuma despesa futura</p>
            </div>
        `;
        return;
    }
    
    // Agrupar parcelas por ID da despesa
    const groupedByExpense = {};
    card.future.forEach(inst => {
        const expenseId = inst.expense_id;
        if (!groupedByExpense[expenseId]) {
            groupedByExpense[expenseId] = [];
        }
        groupedByExpense[expenseId].push(inst);
    });
    
    // Ordenar grupos por data de vencimento da primeira parcela
    const orderedGroups = Object.entries(groupedByExpense)
        .sort(([_, installmentsA], [__, installmentsB]) => {
            const dateA = new Date(installmentsA[0].due_date);
            const dateB = new Date(installmentsB[0].due_date);
            return dateA - dateB;
        });
    
    // Construir HTML para cada grupo de parcelas
    let html = '';
    
    for (const [expenseId, installments] of orderedGroups) {
        // Ordenar parcelas por número
        installments.sort((a, b) => a.installment_number - b.installment_number);
        
        // Obter informações completas da despesa
        const firstItem = installments[0];
        const totalOriginalExpenseAmount = firstItem.original_expense_amount;
        // Obter o total real de parcelas da base de dados
        const totalInstallmentsForExpense = firstItem.total_installments_for_expense;

        // Criar cabeçalho do grupo com informações completas
        html += `
            <div class="expense-group" data-expense-id="${expenseId}">
                <div class="expense-group-header">
                    <div class="expense-description">${firstItem.description}</div>
                    <div class="expense-total">
                        Total: R$ ${Number(totalOriginalExpenseAmount).toLocaleString('pt-BR', {minimumFractionDigits:2})} 
                        ${totalInstallmentsForExpense > 1 ? `(${totalInstallmentsForExpense}x)` : ''}
                    </div>
                </div>
                <div class="expense-group-items">
        `;
        
        // Adicionar cada parcela individual
        for (const inst of installments) {
            const dueDate = new Date(inst.due_date);
            const month = dueDate.toLocaleString('pt-BR', { month: 'long' });
            const formattedDueDate = `${month.charAt(0).toUpperCase() + month.slice(1)}/${dueDate.getFullYear()}`;
            
            html += `
                <div class="expense-item future-item beautiful-expense" data-installment-id="${inst.id}">
                    <div class="expense-content">
                        <div class="expense-info">
                            <div class="expense-date">${formattedDueDate}</div>
                            <div class="expense-installment">
                                Parcela ${inst.installment_number}/${inst.total_installments_for_expense}
                            </div>
                        </div>
                        <div class="expense-amount">
                            R$ ${Number(inst.amount).toLocaleString('pt-BR', {minimumFractionDigits:2})}
                        </div>
                    </div>
                    <div class="expense-actions">
                        <button class="btn-advance" onclick="moveToCurrentBill('${inst.id}')">
                            <i class="fas fa-forward"></i> Adiantar
                        </button>
                    </div>
                </div>
            `;
        }
        
        html += `
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

// Validar se o valor está dentro do limite do cartão
function validateCardLimit(card, amount) {
    if (!card) return false;
    return (card.availableLimit >= amount);
}

// Nova função para renderizar despesas pagas
function renderPaidExpenses(card, container) {
    if (!container) {
        console.error("Container para despesas pagas não fornecido.");
        return;
    }

    if (!card.previous || !Array.isArray(card.previous) || card.previous.length === 0) {
        container.innerHTML = `
            <div class="empty-expenses">
                <i class="fas fa-check-circle"></i>
                <p>Nenhuma despesa paga encontrada</p>
            </div>
        `;
        return;
    }

    const groupedByExpense = {};
    card.previous.forEach(inst => { // previous são as parcelas pagas
        const expenseId = inst.expense_id;
        if (!groupedByExpense[expenseId]) {
            groupedByExpense[expenseId] = [];
        }
        groupedByExpense[expenseId].push(inst);
    });

    const orderedGroups = Object.entries(groupedByExpense)
        .sort(([_, installmentsA], [__, installmentsB]) => {
            // Ordenar pela data de pagamento da primeira parcela (mais recente primeiro)
            const dateA = installmentsA[0].paid_date ? new Date(installmentsA[0].paid_date) : new Date(0);
            const dateB = installmentsB[0].paid_date ? new Date(installmentsB[0].paid_date) : new Date(0);
            return dateB - dateA; 
        });

    if (orderedGroups.length === 0) {
        container.innerHTML = `
            <div class="empty-expenses">
                <i class="fas fa-check-circle"></i>
                <p>Nenhuma despesa paga encontrada</p>
            </div>
        `;
        return;
    }

    let html = '';
    for (const [expenseId, installments] of orderedGroups) {
        installments.sort((a, b) => a.installment_number - b.installment_number);
        const firstItem = installments[0];
        const totalOriginalExpenseAmount = firstItem.original_expense_amount;
        const totalInstallmentsForExpense = firstItem.total_installments_for_expense;

        html += `
            <div class="expense-group paid-group" data-expense-id="${expenseId}">
                <div class="expense-group-header">
                    <div class="expense-description">${firstItem.description}</div>
                    <div class="expense-total">
                        Total: R$ ${Number(totalOriginalExpenseAmount).toLocaleString('pt-BR', {minimumFractionDigits:2})} 
                        ${totalInstallmentsForExpense > 1 ? `(${totalInstallmentsForExpense}x)` : ''}
                    </div>
                </div>
                <div class="expense-group-items">
        `;

        for (const inst of installments) {
            const paidDate = inst.paid_date ? new Date(inst.paid_date).toLocaleDateString('pt-BR') : 'N/A';
            html += `
                <div class="expense-item paid-item beautiful-expense">
                    <div class="expense-content">
                        <div class="expense-info">
                            <div class="expense-paid-date">Pago em: ${paidDate}</div>
                            <div class="expense-installment">
                                Parcela ${inst.installment_number}/${inst.total_installments_for_expense}
                            </div>
                        </div>
                        <div class="expense-amount">
                            R$ ${Number(inst.amount).toLocaleString('pt-BR', {minimumFractionDigits:2})}
                        </div>
                    </div>
                    <div class="expense-actions">
                        <span class="payment-status"><i class="fas fa-check-circle"></i> Pago</span>
                    </div>
                </div>
            `;
        }
        html += `
                </div>
            </div>
        `;
    }
    container.innerHTML = html;
}

// Nova função para atualizar a interface sem recarregar a página
async function updateUIWithoutReload() {
    try {
        // Salvar o estado de scroll atual
        const scrollPos = window.scrollY;
        
        // Salvar o ID do cartão atual se o modal de despesas estiver aberto
        const expensesModal = document.getElementById('cardExpensesModal');
        const currentCardId = expensesModal?.dataset?.currentCardId;
        
        // Recarregar dados do servidor
        await loadCreditCards();
        
        // Renderizar cartões novamente
        renderCardsList();
        
        // Se um modal de despesas estiver aberto, atualize-o
        if (expensesModal && expensesModal.classList.contains('active') && currentCardId) {
            const card = creditCards.find(c => c.id === currentCardId);
            if (card) {
                // Resetar todas as abas para garantir que sejam atualizadas corretamente
                const currentContainer = document.getElementById('current-expenses-content');
                const futureContainer = document.getElementById('future-expenses-content');
                const paidContainer = document.getElementById('paid-expenses-content');
                
                // Limpar containers antes de renderizar novamente
                if (currentContainer) {
                    const currentList = currentContainer.querySelector('.expenses-list');
                    if (currentList) currentList.innerHTML = '<div class="loading-expenses"><i class="fas fa-spinner fa-spin"></i></div>';
                }
                
                if (futureContainer) {
                    const futureList = futureContainer.querySelector('.expenses-list');
                    if (futureList) futureList.innerHTML = '<div class="loading-expenses"><i class="fas fa-spinner fa-spin"></i></div>';
                }
                
                if (paidContainer) {
                    const paidList = paidContainer.querySelector('.expenses-list');
                    if (paidList) paidList.innerHTML = '<div class="loading-expenses"><i class="fas fa-spinner fa-spin"></i></div>';
                }
                
                // Agora renderizar com os dados atualizados
                renderCardExpenseTabs(card);
                
                // Atualizar totais de fatura
                const currentTotal = card.currentTotal || 0;
                const nextTotal = card.futureTotal || 0;
                
                document.getElementById('currentInvoiceTotal').textContent = 
                    `R$ ${currentTotal.toLocaleString('pt-BR', {minimumFractionDigits:2})}`;
                document.getElementById('nextBillTotal').textContent = 
                    `R$ ${nextTotal.toLocaleString('pt-BR', {minimumFractionDigits:2})}`;
                
                // Manter a aba ativa atual
                const activeTab = document.querySelector('.expenses-tabs .cc-tab-btn.active');
                if (activeTab) {
                    const targetId = activeTab.getAttribute('data-target');
                    const tabContent = document.getElementById(targetId);
                    if (tabContent) {
                        document.querySelectorAll('.cc-tab-content').forEach(content => 
                            content.classList.remove('active')
                        );
                        tabContent.classList.add('active');
                    }
                }
            }
        }
        
        // Restaurar a posição de scroll
        window.scrollTo(0, scrollPos);
        
        console.log('Interface atualizada sem recarregar página');
    } catch (error) {
        console.error('Erro ao atualizar interface:', error);
        showNotification('error', 'Erro', 'Falha ao atualizar dados');
    }
}

