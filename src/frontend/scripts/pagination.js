// Classe para gerenciar a paginação de transações
class TransactionPagination {
    constructor(itemsPerPage = 10) {
        this.currentPage = 1;
        this.itemsPerPage = itemsPerPage;
        this.totalTransactions = [];
        this.filteredTransactions = [];
        this.paginationElement = null;
        this.transactionContainer = null;
        
        this.init();
    }
    
    init() {
        // Criar elemento de paginação se não existir
        if (!document.getElementById('transaction-pagination')) {
            const paginationContainer = document.createElement('div');
            paginationContainer.className = 'pagination-container';
            paginationContainer.innerHTML = `
                <ul id="transaction-pagination" class="pagination"></ul>
                <div class="pagination-info">
                    <select id="items-per-page" class="items-per-page">
                        <option value="10">10 por página</option>
                        <option value="15">15 por página</option>
                        <option value="20">20 por página</option>
                        <option value="30">30 por página</option>
                    </select>
                </div>
            `;
            
            // Encontrar a lista de transações e inserir a paginação após ela
            const transactionsList = document.getElementById('transactionsList');
            if (transactionsList) {
                transactionsList.parentNode.appendChild(paginationContainer);
            }
        }
        
        this.paginationElement = document.getElementById('transaction-pagination');
        this.transactionContainer = document.getElementById('transactionsList');
        
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
        
        // Listener para alterar itens por página
        const itemsPerPageSelect = document.getElementById('items-per-page');
        if (itemsPerPageSelect) {
            itemsPerPageSelect.addEventListener('change', () => {
                this.itemsPerPage = parseInt(itemsPerPageSelect.value);
                this.renderPage(1);
            });
        }
    }
    
    setTransactions(transactions) {
        this.totalTransactions = transactions;
        this.filteredTransactions = [...transactions];
        this.renderPage(1);
    }
    
    applyFilter(filterFn) {
        if (typeof filterFn === 'function') {
            this.filteredTransactions = this.totalTransactions.filter(filterFn);
        } else {
            this.filteredTransactions = [...this.totalTransactions];
        }
        this.renderPage(1);
    }
    
    goToPage(page) {
        const totalPages = this.getTotalPages();
        
        if (page < 1) page = 1;
        if (page > totalPages) page = totalPages;
        
        this.currentPage = page;
        this.renderPage(page);
        
        // Rolar para o topo da lista de transações
        if (this.transactionContainer) {
            this.transactionContainer.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    getTotalPages() {
        return Math.max(1, Math.ceil(this.filteredTransactions.length / this.itemsPerPage));
    }
    
    getPageItems() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        
        return this.filteredTransactions.slice(startIndex, endIndex);
    }
    
    renderPage() {
        const pageItems = this.getPageItems();
        // Renderizar apenas os itens da página atual
        this.renderTransactions(pageItems);
        this.renderPaginationControls();
    }
    
    renderTransactions(transactions) {
        // Usamos a função existente do sistema, apenas passando as transações filtradas por página
        updateTransactionsList(transactions);
    }
    
    renderPaginationControls() {
        if (!this.paginationElement) return;
        
        const totalPages = this.getTotalPages();
        let html = '';
        
        if (totalPages <= 1) {
            this.paginationElement.innerHTML = '';
            this.paginationElement.classList.add('hidden');
            return;
        }
        
        this.paginationElement.classList.remove('hidden');
        
        // Botão anterior
        html += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a href="#" class="page-link" data-page="prev">
                    <i class="fas fa-chevron-left"></i>
                </a>
            </li>
        `;
        
        // Determinar quais páginas mostrar
        let startPage = Math.max(1, this.currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }
        
        // Sempre mostrar a primeira página
        if (startPage > 1) {
            html += `
                <li class="page-item">
                    <a href="#" class="page-link" data-page="1">1</a>
                </li>
            `;
            
            if (startPage > 2) {
                html += `
                    <li class="page-item disabled">
                        <span class="page-ellipsis">...</span>
                    </li>
                `;
            }
        }
        
        // Páginas numeradas
        for (let i = startPage; i <= endPage; i++) {
            html += `
                <li class="page-item ${this.currentPage === i ? 'active' : ''}">
                    <a href="#" class="page-link" data-page="${i}">${i}</a>
                </li>
            `;
        }
        
        // Sempre mostrar a última página
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                html += `
                    <li class="page-item disabled">
                        <span class="page-ellipsis">...</span>
                    </li>
                `;
            }
            
            html += `
                <li class="page-item">
                    <a href="#" class="page-link" data-page="${totalPages}">${totalPages}</a>
                </li>
            `;
        }
        
        // Botão próximo
        html += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a href="#" class="page-link" data-page="next">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        `;
        
        this.paginationElement.innerHTML = html;
    }
}

// Exportar a classe para uso global
window.TransactionPagination = TransactionPagination; 