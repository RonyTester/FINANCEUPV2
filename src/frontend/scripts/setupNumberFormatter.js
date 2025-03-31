/**
 * setupNumberFormatter.js
 * 
 * Script para formatar campos de números com separadores de milhar (.) e decimal (,)
 * no padrão brasileiro.
 */

// Função para formatar número com separador de milhar (.) e decimal (,)
function formatNumberToBrazilian(value) {
    // Remover pontos e substituir vírgula por ponto para converter para número
    const cleanValue = value.toString().replace(/\./g, '').replace(',', '.');
    
    // Converter para número e aplicar formatação
    const number = parseFloat(cleanValue);
    
    // Se for NaN, retornar valor original
    if (isNaN(number)) return value;
    
    // Formatar com separadores brasileiros
    return number.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Função para converter número formatado em valor numérico
function parseFormattedNumber(formattedValue) {
    if (!formattedValue) return 0;
    
    // Verificar se é uma string ou número
    const valueStr = formattedValue.toString().trim();
    
    // Registrar todas as entradas para debug
    console.log(`[Debug] Processando valor: "${valueStr}"`);
    
    // Tratar casos especiais: se contém apenas pontos como separador de milhar (sem vírgula)
    // Por exemplo: 141.597 deve ser interpretado como 141597 (cento e quarenta e um mil, quinhentos e noventa e sete)
    if (valueStr.includes('.') && !valueStr.includes(',')) {
        // Remover todos os pontos e converter para número
        const cleanValue = valueStr.replace(/\./g, '');
        const parsedValue = parseFloat(cleanValue);
        console.log(`Convertendo valor com separador de milhar: "${formattedValue}" => limpo: "${cleanValue}" => número: ${parsedValue}`);
        return parsedValue;
    }
    
    // Caso normal: valor com vírgula como separador decimal 
    // Por exemplo: 141.597,50 ou 1.597,50 ou 597,50
    // Primeiro remover pontos e depois substituir vírgula por ponto para converter para número
    const cleanValue = valueStr.replace(/\./g, '').replace(',', '.');
    
    // Garantir que o valor seja um número válido
    if (cleanValue === '.' || cleanValue === '') {
        console.log(`Valor inválido detectado: "${formattedValue}" => retornando 0`);
        return 0;
    }
    
    const parsedValue = parseFloat(cleanValue);
    
    // Verificar se o valor é NaN
    if (isNaN(parsedValue)) {
        console.error(`Erro ao converter valor: "${formattedValue}" => "${cleanValue}" => NaN`);
        return 0;
    }
    
    // Log para debug
    console.log(`Convertendo valor formatado: "${formattedValue}" => limpo: "${cleanValue}" => número: ${parsedValue}`);
    
    return parsedValue;
}

// Função para aplicar máscara de formatação em tempo real
function applyNumberMask(input) {
    input.addEventListener('input', function(e) {
        // Armazenar posição do cursor
        const start = this.selectionStart;
        const end = this.selectionEnd;
        const oldLength = this.value.length;
        
        // Verificar o valor atual para debug
        console.log(`Aplicando máscara ao valor: "${this.value}"`);
        
        // Remover tudo que não for número ou vírgula (deixar apenas dígitos e vírgula)
        let cleanValue = this.value.replace(/[^\d,]/g, '');
        
        // Garantir apenas uma vírgula
        const parts = cleanValue.split(',');
        if (parts.length > 2) {
            cleanValue = parts[0] + ',' + parts.slice(1).join('');
        }
        
        // Tratar a parte decimal (limitar a 2 casas)
        if (cleanValue.includes(',')) {
            const [intPart, decPart] = cleanValue.split(',');
            
            // Garantir que a parte decimal tenha exatamente 2 dígitos
            let formattedDecPart = decPart;
            if (decPart.length > 2) {
                formattedDecPart = decPart.substring(0, 2);
            } else if (decPart.length === 1) {
                // Se houver apenas um dígito após a vírgula, manter assim em tempo real
                formattedDecPart = decPart;
            }
            
            cleanValue = intPart + ',' + formattedDecPart;
        }
        
        // Adicionar pontos como separadores de milhar na parte inteira
        let formattedValue = '';
        if (cleanValue.includes(',')) {
            const [intPart, decPart] = cleanValue.split(',');
            // Formatar parte inteira com pontos a cada 3 dígitos da direita para a esquerda
            const formattedIntPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            formattedValue = formattedIntPart + ',' + decPart;
        } else {
            // Se não tem vírgula, é um número inteiro - formatar com pontos
            formattedValue = cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }
        
        // Atualizar o valor e ajustar posição do cursor
        this.value = formattedValue;
        
        // Log de debug final
        console.log(`Valor formatado: "${formattedValue}"`);
        
        // Calcular a nova posição do cursor considerando pontos adicionados
        const newLength = this.value.length;
        const cursorAdjustment = newLength - oldLength;
        const newPosition = start + cursorAdjustment;
        
        // Restaurar a posição do cursor após a formatação
        this.setSelectionRange(newPosition, newPosition);
    });
    
    // Adicionar evento de focus para formatar o valor ao entrar no campo
    input.addEventListener('focus', function() {
        // Se o valor estiver vazio, não fazer nada
        if (!this.value) return;
        
        // Verificar se o valor já está formatado corretamente
        if (!this.value.includes(',')) {
            // Adicionar vírgula e zeros para valores inteiros
            if (!isNaN(parseFloat(this.value.replace(/\./g, '')))) {
                const numericValue = parseFloat(this.value.replace(/\./g, ''));
                this.value = formatNumberToBrazilian(numericValue);
                console.log(`Formatando valor ao focar: "${numericValue}" => "${this.value}"`);
            }
        }
    });
    
    // Adicionar evento de blur para garantir formatação correta
    input.addEventListener('blur', function() {
        // Se o valor estiver vazio, não fazer nada
        if (!this.value) return;
        
        // Verificar se já tem vírgula
        if (!this.value.includes(',')) {
            // Se não tem vírgula, adicionar ,00 ao final
            const cleanValue = this.value.replace(/\./g, '');
            if (!isNaN(cleanValue) && cleanValue !== '') {
                const numericValue = parseFloat(cleanValue);
                this.value = formatNumberToBrazilian(numericValue);
                console.log(`Formatando valor ao sair: "${cleanValue}" => "${this.value}"`);
            }
        } else {
            // Se tem vírgula mas não tem 2 casas decimais, adicionar zeros
            const parts = this.value.split(',');
            if (parts.length === 2 && parts[1].length < 2) {
                this.value = parts[0] + ',' + parts[1].padEnd(2, '0');
                console.log(`Completando casas decimais: "${parts[0]},${parts[1]}" => "${this.value}"`);
            }
        }
    });
}

// Função para formatar automaticamente valores grandes no campo
function autoFormatNumberInput(input) {
    // Verificar se o valor do input parece ser um número sem formatação adequada
    const value = input.value;
    
    // Se o valor já tem o formato adequado (com vírgula) ou está vazio, não fazer nada
    if (!value || value.includes(',')) return;
    
    // Se for um número grande (mais de 3 dígitos) sem formatação
    if (/^\d{4,}$/.test(value.replace(/\./g, ''))) {
        // Converter para número e depois formatar
        const numericValue = parseFloat(value.replace(/\./g, ''));
        
        // Formatar com o padrão brasileiro
        input.value = formatNumberToBrazilian(numericValue);
        console.log(`Auto formatando valor grande: ${value} => ${input.value}`);
    }
}

// Função para inicializar a formatação nos inputs monetários
function setupNumberFormatters() {
    // Aplicar formatador a todos os inputs de valor monetário
    const monetaryInputs = document.querySelectorAll('input[type="number"][data-type="money"], input[data-format="currency"]');
    
    monetaryInputs.forEach(input => {
        // Trocar tipo para texto para permitir formatação
        input.type = 'text';
        
        // Adicionar evento de formatação
        applyNumberMask(input);
        
        // Formatar valor inicial se existir
        if (input.value) {
            input.value = formatNumberToBrazilian(input.value);
        }
        
        // Adicionar evento de blur para formatar automaticamente valores grandes
        input.addEventListener('blur', function() {
            autoFormatNumberInput(this);
        });
    });
    
    // Adicionar evento para quando novos formulários são adicionados dinamicamente
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const node = mutation.addedNodes[i];
                    if (node.nodeType === 1) { // ELEMENT_NODE
                        const newInputs = node.querySelectorAll('input[type="number"][data-type="money"], input[data-format="currency"]');
                        if (newInputs.length) {
                            newInputs.forEach(input => {
                                input.type = 'text';
                                applyNumberMask(input);
                                
                                // Adicionar evento de blur para formatar valores grandes
                                input.addEventListener('blur', function() {
                                    autoFormatNumberInput(this);
                                });
                            });
                        }
                    }
                }
            }
        });
    });
    
    // Configurar observador para monitorar mudanças no DOM
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('Formatadores de números configurados com sucesso!');
}

// Modificar os formulários para processar corretamente os valores formatados
function setupFormSubmitInterceptors() {
    document.addEventListener('submit', function(e) {
        const form = e.target;
        const formId = form.id;
        
        console.log(`Formulário submetido: ${formId}`);
        
        // Buscar todos os inputs com formatação de moeda
        const formattedInputs = form.querySelectorAll('input[data-format="currency"]');
        
        console.log(`Encontrados ${formattedInputs.length} campos formatados no formulário ${formId}`);
        
        // Converter valores formatados para números antes do envio
        formattedInputs.forEach(input => {
            const originalValue = input.value;
            const numericValue = parseFormattedNumber(originalValue);
            
            // Armazenar o valor formatado como atributo data
            input.setAttribute('data-formatted-value', originalValue);
            
            // Substituir pelo valor numérico para envio
            input.value = numericValue;
            
            console.log(`Campo ${input.id} (${formId}): Valor formatado "${originalValue}" convertido para ${numericValue}`);
        });
    });
}

// Aplicar formatação ao modal de contribuição quando for aberto
function setupContributionModalFormatting() {
    // Configurar formatação no modal de contribuição de metas individuais
    const contributionModal = document.getElementById('contributionModal');
    if (contributionModal) {
        // Monitorar quando o modal é aberto
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && 
                    mutation.attributeName === 'class' && 
                    contributionModal.classList.contains('active')) {
                    
                    // Modal aberto - formatar o input de valor
                    const amountInput = contributionModal.querySelector('#contributionAmount');
                    if (amountInput && amountInput.getAttribute('type') !== 'text') {
                        amountInput.type = 'text';
                        applyNumberMask(amountInput);
                    }
                }
            });
        });
        
        observer.observe(contributionModal, { attributes: true });
    }
    
    // Configurar formatação no modal de contribuição de metas compartilhadas
    const sharedContributionModal = document.getElementById('sharedContributionModal');
    if (sharedContributionModal) {
        // Monitorar quando o modal é aberto
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && 
                    mutation.attributeName === 'class' && 
                    sharedContributionModal.classList.contains('show')) {
                    
                    // Modal aberto - formatar o input de valor
                    const amountInput = sharedContributionModal.querySelector('#contributionAmount');
                    if (amountInput && amountInput.getAttribute('type') !== 'text') {
                        amountInput.type = 'text';
                        applyNumberMask(amountInput);
                    }
                }
            });
        });
        
        observer.observe(sharedContributionModal, { attributes: true });
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    setupNumberFormatters();
    setupFormSubmitInterceptors();
    setupContributionModalFormatting();
    
    // Expor funções globalmente para uso em outros scripts
    window.formatNumberToBrazilian = formatNumberToBrazilian;
    window.parseFormattedNumber = parseFormattedNumber;
    window.applyNumberMask = applyNumberMask;
    window.autoFormatNumberInput = autoFormatNumberInput;
    
    console.log('Sistema de formatação de números inicializado com sucesso!');
}); 