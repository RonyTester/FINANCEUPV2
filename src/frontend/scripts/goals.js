// Funções utilitárias para loader
function showLoader() {
    // Verifica se o loader já existe
    let loader = document.getElementById('global-loader');
    if (!loader) {
        // Cria o elemento loader
        loader = document.createElement('div');
        loader.id = 'global-loader';
        loader.className = 'global-loader';
        loader.innerHTML = `
            <div class="loader-spinner">
                <div class="spinner-border" role="status">
                    <span class="sr-only">Carregando...</span>
                </div>
            </div>
        `;
        document.body.appendChild(loader);
        
        // Adiciona o estilo caso não exista
        if (!document.getElementById('loader-style')) {
            const style = document.createElement('style');
            style.id = 'loader-style';
            style.textContent = `
                .global-loader {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                }
                .loader-spinner {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background-color: white;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                }
                .spinner-border {
                    width: 30px;
                    height: 30px;
                    border: 3px solid transparent;
                    border-top-color: var(--primary-color, #4A90E2);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .sr-only {
                    position: absolute;
                    width: 1px;
                    height: 1px;
                    padding: 0;
                    margin: -1px;
                    overflow: hidden;
                    clip: rect(0, 0, 0, 0);
                    white-space: nowrap;
                    border: 0;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Mostra o loader
    loader.style.display = 'flex';
}

function hideLoader() {
    const loader = document.getElementById('global-loader');
    if (loader) {
        loader.style.display = 'none';
    }
}

// Função para mostrar toast de notificação
function showToast(message, type = 'info', title = null) {
    // Verifica se o container de notificações existe
    let notificationsContainer = document.getElementById('notifications-container');
    if (!notificationsContainer) {
        // Cria o container
        notificationsContainer = document.createElement('div');
        notificationsContainer.id = 'notifications-container';
        notificationsContainer.className = 'notifications-container';
        document.body.appendChild(notificationsContainer);
    }
    
    // Define um título padrão se não for fornecido
    if (!title) {
        if (type === 'success') title = 'Sucesso';
        else if (type === 'error') title = 'Erro';
        else if (type === 'warning') title = 'Atenção';
        else title = 'Informação';
    }
    
    // Define o ícone com base no tipo
    let icon = '';
    switch(type) {
        case 'success':
            icon = 'check-circle';
            break;
        case 'error':
            icon = 'times-circle';
            break;
        case 'warning':
            icon = 'exclamation-circle';
            break;
        default:
            icon = 'info-circle';
    }
    
    // Cria a notificação
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Adiciona o conteúdo HTML estruturado
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
        <div class="notification-close">
            <i class="fas fa-times"></i>
        </div>
    `;
    
    // Adiciona ao container
    notificationsContainer.appendChild(notification);
    
    // Adiciona evento de clique para fechar
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            if (notification.parentElement) {
                notificationsContainer.removeChild(notification);
            }
        }, 300);
    });
    
    // Remove automaticamente após 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                if (notification.parentElement) {
                    notificationsContainer.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// Função para configurar as abas do modal de metas
function setupGoalModalTabs() {
    const tabBtns = document.querySelectorAll('#goalModal .tab-btn');
    const tabPanes = document.querySelectorAll('#goalModal .tab-pane');

    console.log('Configurando abas do modal de metas...'); // Debug
    console.log('Botões encontrados:', tabBtns.length); // Debug
    console.log('Painéis encontrados:', tabPanes.length); // Debug

    // Remover listeners antigos para evitar duplicação
    tabBtns.forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
    });

    // Adicionar novos listeners
    document.querySelectorAll('#goalModal .tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            console.log('Tab clicked:', btn.dataset.target); // Debug
            
            // Remove active class from all buttons and panes
            document.querySelectorAll('#goalModal .tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('#goalModal .tab-pane').forEach(p => p.classList.remove('active'));

            // Add active class to clicked button and corresponding pane
            btn.classList.add('active');
            const targetPane = document.querySelector(btn.dataset.target);
            if (targetPane) {
                targetPane.classList.add('active');
                console.log('Activated pane:', btn.dataset.target); // Debug
            } else {
                console.log('Target pane not found:', btn.dataset.target); // Debug
            }
        });
    });

    // Activate first tab by default if none is active
    if (!document.querySelector('#goalModal .tab-btn.active') && tabBtns.length > 0) {
        console.log('Activating first tab by default'); // Debug
        tabBtns[0].click();
    }
}

// Adicionar listener para o tipo de notificação
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, setting up listeners'); // Debug
    
    // Configurar event listeners para o modal de metas
    setupGoalEventListeners();
    
    const notificationTypeSelect = document.getElementById('notificationType');
    const postponeDaysGroup = document.getElementById('postponeDaysGroup');

    if (notificationTypeSelect && postponeDaysGroup) {
        notificationTypeSelect.addEventListener('change', (e) => {
            console.log('Notification type changed:', e.target.value); // Debug
            postponeDaysGroup.style.display = 
                e.target.value === 'postpone' ? 'block' : 'none';
        });
    }

    // Adicionar lógica para enviar notificações inteligentes
    if (notificationTypeSelect) {
        notificationTypeSelect.addEventListener('change', (e) => {
            const notificationType = e.target.value;
            if (notificationType === 'notify') {
                showNotification('info', 'Notificação', 'Você será notificado antes do prazo.');
            } else if (notificationType === 'postpone') {
                showNotification('warning', 'Adiar', 'A meta será adiada automaticamente se não for atingida.');
            } else if (notificationType === 'auto_adjust') {
                showNotification('success', 'Ajuste Automático', 'A meta será ajustada automaticamente para se adequar ao seu progresso.');
            }
        });
    }

    // Configurar as abas assim que o DOM carregar
    setupGoalModalTabs();
});

function toggleGoalModal(show = null) {
    const modal = document.getElementById('goalModal');
    if (!modal) return;

    if (show === null) {
        show = !modal.classList.contains('active');
    }

    if (show) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        setupGoalModalTabs(); // Chamar novamente ao abrir o modal

        // Configurar estado inicial dos campos de notificação
        const notificationType = document.getElementById('notificationType');
        const postponeDaysGroup = document.getElementById('postponeDaysGroup');
        if (notificationType && postponeDaysGroup) {
            postponeDaysGroup.style.display = 
                notificationType.value === 'postpone' ? 'block' : 'none';
        }
        
        // Adicionar listeners aos botões de fechar e cancelar
        const closeButton = modal.querySelector('.close-modal');
        const cancelButton = modal.querySelector('.cancel-modal');
        
        if (closeButton) {
            closeButton.addEventListener('click', () => toggleGoalModal(false));
        }
        
        if (cancelButton) {
            cancelButton.addEventListener('click', () => toggleGoalModal(false));
        }
    } else {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        // Limpa os campos do formulário
        const goalNameInput = document.getElementById('goalName');
        if (goalNameInput) {
            goalNameInput.value = '';
        }
        const targetAmountInput = document.getElementById('targetAmount');
        if (targetAmountInput) {
            targetAmountInput.value = '';
        }
        const deadlineInput = document.getElementById('deadline');
        if (deadlineInput) {
            deadlineInput.value = '';
        }
        const notificationDaysInput = document.getElementById('notificationDays');
        if (notificationDaysInput) {
            notificationDaysInput.value = '7';
        }
        const notificationTypeInput = document.getElementById('notificationType');
        if (notificationTypeInput) {
            notificationTypeInput.value = 'notify';
        }
        const postponeDaysInput = document.getElementById('postponeDays');
        if (postponeDaysInput) {
            postponeDaysInput.value = '30';
        }
    }
}

// Função para verificar metas e enviar notificações
function checkGoalsForNotifications() {
    const now = new Date();
    const THREE_HOURS = 3 * 60 * 60 * 1000; // 3 horas em milissegundos
    
    goals.forEach((goal, index) => {
        const deadline = new Date(goal.deadline);
        const daysUntilDeadline = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
        const lastNotificationKey = `lastNotification_${goal.id}`;
        const lastNotification = localStorage.getItem(lastNotificationKey);

        // Notificações que precisam aparecer imediatamente
        if (goal.notification_type === 'auto_adjust' && daysUntilDeadline <= 0) {
            setTimeout(() => {
                showConfirmation(
                    'Reajustar Meta',
                    `A meta "${goal.name}" venceu. Deseja reajustar automaticamente por mais ${goal.postpone_days} dias?`
                ).then(confirmed => {
                    if (confirmed) {
                        const newDeadline = new Date(deadline);
                        newDeadline.setDate(newDeadline.getDate() + goal.postpone_days);
                        updateGoalDeadline(goal.id, newDeadline.toISOString().split('T')[0]);
                    }
                });
            }, index * 500); // Delay de 0.5 segundos entre cada notificação
            return;
        }

        // Verificar cooldown apenas para notificações não críticas
        if (!lastNotification || (now - new Date(lastNotification)) > THREE_HOURS) {
            if (daysUntilDeadline <= 7 && daysUntilDeadline > 0) {
                setTimeout(() => {
                    showNotification(
                        'warning',
                        'Lembrete de Meta',
                        `A meta "${goal.name}" vence em ${daysUntilDeadline} dias! Meta: ${formatCurrency(goal.target_amount)}`,
                        4000
                    );
                    localStorage.setItem(lastNotificationKey, now.toISOString());
                }, index * 500); // Delay de 0.5 segundos entre cada notificação
            }
        }
    });
}

// Função para atualizar a data limite da meta
async function updateGoalDeadline(goalId, newDeadline) {
    try {
        const { error } = await supabase
            .from('financial_goals')
            .update({ deadline: newDeadline })
            .eq('id', goalId);

        if (error) throw error;

        // Recarregar as metas após a atualização
        await loadGoals();
        
        showNotification('success', 'Meta Atualizada', 'A data limite da meta foi atualizada com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar meta:', error);
        showNotification('error', 'Erro', 'Não foi possível atualizar a meta.');
    }
}

// Alterar o intervalo para verificar a cada hora em vez de diariamente
setInterval(checkGoalsForNotifications, 60 * 60 * 1000); // Verificar uma vez por hora

async function handleGoalSubmit(e) {
    e.preventDefault();
    
    try {
        const formData = {
            name: document.getElementById('goalName').value,
            target_amount: parseFloat(document.getElementById('targetAmount').value),
            deadline: document.getElementById('deadline').value,
            user_id: currentUser.id,
            // Adicionar campos de notificação
            notification_type: document.getElementById('notificationType').value,
            notification_days: parseInt(document.getElementById('notificationDays').value),
            postpone_days: parseInt(document.getElementById('postponeDays')?.value || '30')
        };

        // Validações
        if (!formData.name || !formData.target_amount || !formData.deadline) {
            throw new Error('Por favor, preencha todos os campos obrigatórios.');
        }

        if (formData.target_amount <= 0) {
            throw new Error('O valor alvo deve ser maior que zero.');
        }

        const { data, error } = await supabase
            .from('financial_goals')
            .insert([formData])
            .select()
            .single();

        if (error) throw error;

        showNotification('success', 'Meta Criada', 'Meta criada com sucesso!');
        toggleGoalModal(false);
        await loadGoals();
    } catch (error) {
        console.error('Erro ao criar meta:', error);
        showNotification('error', 'Erro ao Criar Meta', error.message || 'Não foi possível criar a meta. Por favor, tente novamente.');
    }
}

function renderGoals() {
    const goalsContainer = document.querySelector('.goals-container');
    if (!goalsContainer) return;

    if (!goals || goals.length === 0) {
        goalsContainer.innerHTML = `
            <div class="empty-goals">
                <div class="empty-state">
                    <i class="fas fa-bullseye"></i>
                    <h3>Comece a Planejar Seus Objetivos</h3>
                    <p>Crie metas financeiras para realizar seus sonhos.<br>Acompanhe seu progresso e mantenha-se motivado!</p>
                    <div class="empty-state-suggestions">
                        <div class="suggestion-item" onclick="toggleGoalModal(true)">
                            <i class="fas fa-home"></i>
                            <span>Casa Própria</span>
                        </div>
                        <div class="suggestion-item" onclick="toggleGoalModal(true)">
                            <i class="fas fa-car"></i>
                            <span>Carro Novo</span>
                        </div>
                        <div class="suggestion-item" onclick="toggleGoalModal(true)">
                            <i class="fas fa-plane"></i>
                            <span>Viagem</span>
                        </div>
                        <div class="suggestion-item" onclick="toggleGoalModal(true)">
                            <i class="fas fa-graduation-cap"></i>
                            <span>Educação</span>
                        </div>
                    </div>
                    <button class="btn btn-primary create-goal-btn" onclick="toggleGoalModal(true)">
                        <i class="fas fa-plus"></i>
                        Criar Primeira Meta
                    </button>
                </div>
            </div>
        `;
        return;
    }

    // Só mostrar o menu de estatísticas quando houver metas
    goalsContainer.innerHTML = `
        <div class="goals-stats-header">
            <div class="stat-card">
                <i class="fas fa-bullseye"></i>
                <div class="stat-info">
                    <span>Total de Metas</span>
                    <strong>${goals.length}</strong>
                </div>
            </div>
            <div class="stat-card">
                <i class="fas fa-check-circle"></i>
                <div class="stat-info">
                    <span>Metas Concluídas</span>
                    <strong>${getCompletedGoalsCount()}</strong>
                </div>
            </div>
            <div class="stat-card">
                <i class="fas fa-chart-line"></i>
                <div class="stat-info">
                    <span>Progresso Geral</span>
                    <strong>${calculateTotalProgress().toFixed(1)}%</strong>
                </div>
            </div>
            <div class="stat-card">
                <i class="fas fa-piggy-bank"></i>
                <div class="stat-info">
                    <span>Total Acumulado</span>
                    <strong>${formatCurrency(calculateTotalAccumulated())}</strong>
                </div>
            </div>
        </div>
        <div class="goals-list" id="goalsList">
            ${renderGoalsList()}
        </div>
    `;
}

// Funções auxiliares para cálculos
function getCompletedGoalsCount() {
    if (!goals) return 0;
    return goals.filter(goal => {
        const contributions = goal.contributions || [];
        const totalContributed = contributions.reduce((sum, contrib) => sum + contrib.amount, 0);
        return totalContributed >= goal.target_amount;
    }).length;
}

function calculateTotalProgress() {
    if (!goals || goals.length === 0) return 0;
    return goals.reduce((sum, goal) => {
        const contributions = goal.contributions || [];
        const totalContributed = contributions.reduce((sum, contrib) => sum + contrib.amount, 0);
        return sum + (totalContributed / goal.target_amount) * 100;
    }, 0) / goals.length;
}

function calculateTotalAccumulated() {
    if (!goals) return 0;
    return goals.reduce((sum, goal) => {
        const contributions = goal.contributions || [];
        return sum + contributions.reduce((sum, contrib) => sum + contrib.amount, 0);
    }, 0);
}

function renderGoalsList() {
    if (!goals || goals.length === 0) {
        return `
            <div class="empty-state">
                <i class="fas fa-bullseye"></i>
                <h3>Comece a Planejar Seus Objetivos</h3>
                <p>Crie metas financeiras para realizar seus sonhos.<br>Acompanhe seu progresso e mantenha-se motivado!</p>
                <div class="empty-state-suggestions">
                    <div class="suggestion-item" onclick="toggleGoalModal(true)">
                        <i class="fas fa-home"></i>
                        <span>Casa Prória</span>
                    </div>
                    <div class="suggestion-item" onclick="toggleGoalModal(true)">
                        <i class="fas fa-car"></i>
                        <span>Carro Novo</span>
                    </div>
                    <div class="suggestion-item" onclick="toggleGoalModal(true)">
                        <i class="fas fa-plane"></i>
                        <span>Viagem</span>
                    </div>
                    <div class="suggestion-item" onclick="toggleGoalModal(true)">
                        <i class="fas fa-graduation-cap"></i>
                        <span>Educação</span>
                    </div>
                </div>
                <button class="btn btn-primary create-goal-btn" onclick="toggleGoalModal(true)">
                    <i class="fas fa-plus"></i>
                    Criar Primeira Meta
                </button>
            </div>
        `;
    }

    return goals.map(goal => {
        const contributions = goal.contributions || [];
        const totalContributed = contributions.reduce((sum, contrib) => sum + contrib.amount, 0);
        const progress = (totalContributed / goal.target_amount) * 100;
        const deadline = new Date(goal.deadline);
        const today = new Date();
        const daysUntilDeadline = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
        const isOverdue = daysUntilDeadline < 0;
        const isCompleted = progress >= 100;

        return `
            <div class="goal-card ${isOverdue ? 'overdue' : ''} ${isCompleted ? 'completed' : ''}">
                <div class="goal-header">
                    <div class="goal-title-wrapper">
                        <h3>${goal.name}</h3>
                    </div>
                    <div class="goal-actions">
                        <button onclick="showContributionModal(${goal.id})" 
                                class="btn btn-primary btn-sm" 
                                title="Contribuir"
                                ${isCompleted ? 'disabled' : ''}>
                            <i class="fas fa-circle-plus"></i>
                        </button>
                        <button onclick="showGoalDetails(${goal.id})" class="btn btn-secondary btn-sm" title="Histórico">
                            <i class="fas fa-clock-rotate-left"></i>
                        </button>
                        <button onclick="handleDeleteGoal(${goal.id})" class="btn btn-danger btn-sm" title="Excluir">
                            <i class="fas fa-circle-xmark"></i>
                        </button>
                    </div>
                </div>
                <div class="goal-info">
                    <div class="goal-amount">
                        <span>Meta: ${formatCurrency(goal.target_amount)}</span>
                        <span>Acumulado: ${formatCurrency(totalContributed)}</span>
                    </div>
                    <div class="goal-deadline ${isOverdue ? 'overdue' : ''}">
                        <i class="fas fa-clock"></i>
                        <span>${isOverdue ? 'Vencida há' : 'Vence em'} ${Math.abs(daysUntilDeadline)} dias</span>
                    </div>
                    <div class="goal-progress-container">
                        <div class="goal-progress" style="width: ${progress}%"></div>
                        <span class="progress-text">${progress.toFixed(1)}%</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Adicionar após a função loadGoals()
function updateOverallProgress() {
    const totalGoals = goals.length;
    if (totalGoals === 0) return;

    const completedGoals = goals.filter(goal => {
        const totalContributed = (goal.contributions || []).reduce((sum, contrib) => sum + contrib.amount, 0);
        return (totalContributed / goal.target_amount) * 100 >= 100;
    }).length;

    const progressPercentage = (completedGoals / totalGoals) * 100;

    // Atualizar a barra de progresso geral
    const progressHtml = `
        <div class="overall-progress">
            <div class="progress-info">
                <span>Progresso Geral das Metas</span>
                <span class="progress-percentage">${progressPercentage.toFixed(1)}%</span>
            </div>
            <div class="progress-bar-container">
                <div class="progress-bar" style="width: ${progressPercentage}%"></div>
            </div>
            <div class="progress-stats">
                <span>${completedGoals} de ${totalGoals} metas concluídas</span>
            </div>
        </div>
    `;

    // Inserir antes da lista de metas
    const container = document.querySelector('.goals-container');
    const existingProgress = container.querySelector('.overall-progress');
    const goalsList = container.querySelector('.goals-list');
    
    if (existingProgress) {
        existingProgress.outerHTML = progressHtml;
    } else if (goalsList) {
        goalsList.insertAdjacentHTML('beforebegin', progressHtml);
    }
}

// Modificar a função loadGoals para chamar updateOverallProgress
async function loadGoals() {
    try {
        // Primeiro, carregar as metas
        const { data: goalsData, error: goalsError } = await supabase
            .from('financial_goals')
            .select('*')
            .eq('user_id', currentUser.id);

        if (goalsError) throw goalsError;

        // Depois, carregar as contribuições para cada meta
        const { data: contributionsData, error: contributionsError } = await supabase
            .from('goal_contributions')
            .select('*')
            .in('goal_id', goalsData.map(goal => goal.id));

        if (contributionsError) throw contributionsError;

        // Combinar os dados
        goals = goalsData.map(goal => ({
            ...goal,
            contributions: contributionsData.filter(contrib => contrib.goal_id === goal.id)
        }));
        
        renderGoals();
        checkGoalsForNotifications();
        updateOverallProgress();
    } catch (error) {
        console.error('Erro ao carregar metas:', error);
        showNotification('error', 'Erro', 'Não foi possível carregar as metas.');
    }
}

// Adicionar ao início do arquivo, após as definições de funções
document.addEventListener('DOMContentLoaded', () => {
    if (currentUser) {
        loadGoals();
    }
});

function showGoalDetails(goalId) {
    // Fechar qualquer painel existente antes de abrir um novo
    const existingPanel = document.querySelector('.goal-details-panel.active');
    if (existingPanel) {
        existingPanel.classList.remove('active');
        setTimeout(() => existingPanel.remove(), 300);
    }

    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const contributions = goal.contributions || [];
    const totalContributed = contributions.reduce((sum, contrib) => sum + contrib.amount, 0);
    const progress = (totalContributed / goal.target_amount) * 100;
    const isCompleted = progress >= 100;

    const panel = document.createElement('div');
    panel.id = 'goalDetailsPanel';
    panel.className = 'goal-details-panel';
    panel.innerHTML = `
        <div class="goal-details-header">
            <i class="fas fa-bullseye"></i>
            <h3>${goal.name}</h3>
            <button onclick="closeGoalDetails()" class="close-details">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="goal-details-content">
            <div class="goal-details-info">
                <div class="info-item">
                    <span>Meta</span>
                    <strong>${formatCurrency(goal.target_amount)}</strong>
                </div>
                <div class="info-item">
                    <span>Acumulado</span>
                    <strong>${formatCurrency(totalContributed)}</strong>
                </div>
                <div class="goal-details-progress ${isCompleted ? 'completed' : ''}">
                    <div class="goal-details-progress-info">
                        <span>Progresso</span>
                    </div>
                    <div class="goal-details-progress-bar-container">
                        <div class="goal-details-progress-bar" style="width: ${progress}%"></div>
                    </div>
                    <div class="goal-details-progress-percentage">
                        ${progress.toFixed(1)}%
                    </div>
                </div>
            </div>
            <div class="contributions-section">
                <h5>
                    <i class="fas fa-history"></i>
                    Histórico de Contribuições
                </h5>
                <div class="contributions-timeline">
                    ${contributions.length > 0 ? contributions.map(contrib => `
                        <div class="timeline-item">
                            <div class="timeline-date">
                                <i class="fas fa-circle"></i>
                                ${new Date(contrib.date).toLocaleDateString()}
                            </div>
                            <div class="timeline-content">
                                <div class="timeline-header">
                                    <span class="amount">+ ${formatCurrency(contrib.amount)}</span>
                                    <div class="timeline-actions">
                                        <button onclick="editContribution(${contrib.id})" class="btn btn-sm btn-secondary" title="Editar">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button onclick="deleteContribution(${contrib.id}, ${goalId})" class="btn btn-sm btn-danger" title="Excluir">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                                ${contrib.notes ? `<p class="notes">${contrib.notes}</p>` : ''}
                            </div>
                        </div>
                    `).join('') : '<p class="no-contributions">Nenhuma contribuição realizada ainda.</p>'}
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(panel);
    setTimeout(() => panel.classList.add('active'), 10);
}

function closeGoalDetails() {
    const panel = document.getElementById('goalDetailsPanel');
    if (panel) {
        panel.classList.remove('active');
        setTimeout(() => panel.remove(), 300);
    }
}

// Modificar a função updateContributionHistory para preservar os botões
async function updateContributionHistory(goalId) {
    try {
        // Busca as contribuições atualizadas
        const { data: contributionsData, error: contributionsError } = await supabase
            .from('goal_contributions')
            .select('*')
            .eq('goal_id', goalId)
            .order('date', { ascending: false });

        if (contributionsError) throw contributionsError;

        // Atualiza o histórico na timeline
        const timelineContainer = document.querySelector('.contributions-timeline');
        if (timelineContainer) {
            timelineContainer.innerHTML = contributionsData.length > 0 ? 
                contributionsData.map(contrib => `
                    <div class="timeline-item">
                        <div class="timeline-date">
                            <i class="fas fa-circle"></i>
                            ${new Date(contrib.date).toLocaleDateString()}
                        </div>
                        <div class="timeline-content">
                            <div class="timeline-header">
                                <span class="amount">+ ${formatCurrency(contrib.amount)}</span>
                                <div class="timeline-actions">
                                    <button onclick="editContribution(${contrib.id})" class="btn btn-sm btn-secondary" title="Editar">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button onclick="deleteContribution(${contrib.id}, ${goalId})" class="btn btn-sm btn-danger" title="Excluir">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                            ${contrib.notes ? `<p class="notes">${contrib.notes}</p>` : ''}
                        </div>
                    </div>
                `).join('') : 
                '<p class="no-contributions">Nenhuma contribuição realizada ainda.</p>';
        }

        // Atualiza o progresso da meta
        await updateGoalProgress(goalId);
    } catch (error) {
        console.error('Erro ao atualizar histórico:', error);
        showNotification('error', 'Erro', 'Não foi possível atualizar o histórico de contribuições.');
    }
}

// Modificar a função handleContributionSubmit
async function handleContributionSubmit(e) {
    e.preventDefault();

    try {
        const amountInput = document.querySelector('#contributionModal #amount');
        const dateInput = document.querySelector('#contributionModal #date');
        const notesInput = document.querySelector('#contributionModal #notes');
        const goalId = parseInt(document.querySelector('#contributionModal #goalId').value);

        const formData = {
            goal_id: goalId,
            amount: Number(amountInput.value.trim().replace(',', '.')),
            date: dateInput.value,
            notes: notesInput.value,
            user_id: currentUser.id
        };

        const { data, error } = await supabase
            .from('goal_contributions')
            .insert(formData)
            .select()
            .single();

        if (error) throw error;

        // Fecha o modal e limpa o formulário primeiro
        document.getElementById('contributionModal').classList.remove('active');
        document.getElementById('contributionForm').reset();

        // Depois atualiza os dados
        await updateContributionHistory(goalId);
        await loadGoals(); // Atualiza a lista geral de metas uma única vez
        
        showNotification('success', 'Sucesso', 'Contribuição adicionada com sucesso!');
    } catch (error) {
        console.error('Erro ao adicionar contribuição:', error);
        showNotification('error', 'Erro', error.message || 'Erro ao adicionar contribuição. Por favor, tente novamente.');
    }
}

// Função para atualizar o progresso da meta
async function updateGoalProgress(goalId) {
    try {
        const goal = goals.find(g => g.id === goalId);
        if (!goal) return;

        const { data: contributions, error } = await supabase
            .from('goal_contributions')
            .select('amount')
            .eq('goal_id', goalId);

        if (error) throw error;

        const totalContributed = contributions.reduce((sum, contrib) => sum + contrib.amount, 0);
        const progress = (totalContributed / goal.target_amount) * 100;

        // Atualiza a barra de progresso no painel de detalhes
        const progressBar = document.querySelector('.goal-details-progress-bar');
        const progressPercentage = document.querySelector('.goal-details-progress-percentage');
        
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        if (progressPercentage) {
            progressPercentage.textContent = `${progress.toFixed(1)}%`;
        }

        // Atualiza o valor acumulado
        const accumulatedElement = document.querySelector('.goal-details-info .info-item:nth-child(2) strong');
        if (accumulatedElement) {
            accumulatedElement.textContent = formatCurrency(totalContributed);
        }
    } catch (error) {
        console.error('Erro ao atualizar progresso:', error);
    }
} 

// Função para excluir contribuição
async function deleteContribution(contributionId, goalId) {
    try {
        // Usar sistema de confirmação personalizado em vez do confirm nativo
        const confirmed = await showConfirmation(
            'Excluir Contribuição',
            'Deseja excluir esta contribuição?'
        );

        if (!confirmed) return;

        const { error } = await supabase
            .from('goal_contributions')
            .delete()
            .eq('id', contributionId);

        if (error) throw error;

        // Atualizar o histórico e o progresso
        await updateContributionHistory(goalId);
        await loadGoals();
        
        showNotification('success', 'Sucesso', 'Contribuição excluída com sucesso!');
    } catch (error) {
        console.error('Erro ao excluir contribuição:', error);
        showNotification('error', 'Erro', 'Não foi possível excluir a contribuição.');
    }
}

// Função para abrir o modal de edição
async function editContribution(contributionId) {
    try {
        // Buscar os dados da contribuição
        const { data: contribution, error } = await supabase
            .from('goal_contributions')
            .select('*')
            .eq('id', contributionId)
            .single();

        if (error) throw error;

        // Preencher o modal de edição
        document.getElementById('editContributionId').value = contribution.id;
        document.getElementById('editContributionAmount').value = contribution.amount;
        document.getElementById('editContributionDate').value = contribution.date.split('T')[0];
        document.getElementById('editContributionNotes').value = contribution.notes || '';
        document.getElementById('editContributionGoalId').value = contribution.goal_id;

        // Armazenar o ID da meta para reabrir o painel depois
        sessionStorage.setItem('lastOpenGoalId', contribution.goal_id);

        // Fechar o painel de detalhes no mobile antes de abrir o modal
        if (window.innerWidth <= 768) {
            const panel = document.getElementById('goalDetailsPanel');
            if (panel) {
                panel.classList.remove('active');
                setTimeout(() => panel.remove(), 300);
            }
        }

        // Mostrar o modal
        toggleEditContributionModal(true);
    } catch (error) {
        console.error('Erro ao carregar contribuição:', error);
        showNotification('error', 'Erro', 'Não foi possível carregar os dados da contribuição.');
    }
}

// Função para salvar a edição
async function handleEditContributionSubmit(e) {
    e.preventDefault();

    try {
        const contributionId = document.getElementById('editContributionId').value;
        const goalId = document.getElementById('editContributionGoalId').value;
        
        const formData = {
            amount: Number(document.getElementById('editContributionAmount').value),
            date: document.getElementById('editContributionDate').value,
            notes: document.getElementById('editContributionNotes').value
        };

        const { error } = await supabase
            .from('goal_contributions')
            .update(formData)
            .eq('id', contributionId);

        if (error) throw error;

        // Fechar o modal
        toggleEditContributionModal(false);

        // Atualizar a interface
        await updateContributionHistory(goalId);
        await loadGoals();

        // Reabrir o painel de detalhes no mobile
        if (window.innerWidth <= 768) {
            const lastGoalId = sessionStorage.getItem('lastOpenGoalId');
            if (lastGoalId) {
                setTimeout(() => {
                    showGoalDetails(lastGoalId);
                    sessionStorage.removeItem('lastOpenGoalId');
                }, 300);
            }
        }

        showNotification('success', 'Sucesso', 'Contribuição atualizada com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar contribuição:', error);
        showNotification('error', 'Erro', 'Não foi possível atualizar a contribuição.');
    }
}

// Função para controlar a visibilidade do modal de edição
function toggleEditContributionModal(show) {
    const modal = document.getElementById('editContributionModal');
    if (!modal) return;

    if (show) {
        modal.classList.add('active');
    } else {
        modal.classList.remove('active');
        document.getElementById('editContributionForm').reset();
    }
}

// ================ METAS COMPARTILHADAS ================

// Variáveis globais para metas compartilhadas
let sharedGoals = [];
let sharedGoalParticipants = {};
let sharedGoalContributions = {};
let currentSharedGoalId = null;

// Inicialização das abas
function initGoalTabs() {
    const tabButtons = document.querySelectorAll('.goals-tabs .tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            // Remover classe active de todas as abas e botões
            document.querySelectorAll('.goals-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.goals-tabs .tab-pane').forEach(pane => pane.classList.remove('active'));
            
            // Adicionar classe active ao botão e painel clicado
            button.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
            
            // Alternar visibilidade dos botões de nova meta
            toggleGoalButtonsVisibility(tabName);
            
            // Atualizar o atributo data-active-tab no body
            document.body.setAttribute('data-active-tab', tabName);
            
            // Carregar dados específicos da aba
            if (tabName === 'shared' && sharedGoals.length === 0) {
                loadSharedGoals();
            }
        });
    });
    
    // Inicializar o atributo data-active-tab no body como "individual"
    document.body.setAttribute('data-active-tab', 'individual');
}

// Função para alternar a visibilidade dos botões de nova meta
function toggleGoalButtonsVisibility(tabName) {
    const individualBtn = document.getElementById('newGoalBtn');
    const sharedBtn = document.getElementById('newSharedGoalBtn');
    
    if (tabName === 'shared') {
        individualBtn.style.display = 'none';
        sharedBtn.style.display = 'flex';
    } else {
        individualBtn.style.display = 'flex';
        sharedBtn.style.display = 'none';
    }
}

// Inicialização das abas dentro do modal de detalhes
function initSharedGoalDetailsTabs() {
    const tabButtons = document.querySelectorAll('#sharedGoalDetailsModal .tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            // Remover classe active de todas as abas e botões
            document.querySelectorAll('#sharedGoalDetailsModal .tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('#sharedGoalDetailsModal .tab-pane').forEach(pane => pane.classList.remove('active'));
            
            // Adicionar classe active ao botão e painel clicado
            button.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });
}

// Event listeners para metas compartilhadas
function setupSharedGoalsEventListeners() {
    console.log("Configurando event listeners para metas compartilhadas");
    
    // Modal de nova meta compartilhada
    const newSharedGoalBtn = document.getElementById('newSharedGoalBtn');
    if (newSharedGoalBtn) {
        console.log("Botão de nova meta compartilhada encontrado");
        newSharedGoalBtn.addEventListener('click', () => {
            console.log("Botão de nova meta compartilhada clicado");
            toggleSharedGoalModal(true);
        });
    } else {
        console.error("Botão de nova meta compartilhada não encontrado!");
    }
    
    const sharedGoalForm = document.getElementById('sharedGoalForm');
    if (sharedGoalForm) {
        sharedGoalForm.addEventListener('submit', handleSharedGoalSubmit);
    }
    
    // Gerenciar o modal de Nova Meta compartilhada
    const closeButtons = document.querySelectorAll('#sharedGoalModal .close-modal, #sharedGoalModal .cancel-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => toggleSharedGoalModal(false));
    });
    
    // Modal de detalhes
    const detailsCloseButtons = document.querySelectorAll('#sharedGoalDetailsModal .close-modal');
    detailsCloseButtons.forEach(element => {
        if (element) {
            element.addEventListener('click', () => toggleSharedGoalDetailsModal(false));
        }
    });
    
    // Formulário de contribuição
    const contributionForm = document.getElementById('sharedGoalContributionForm');
    if (contributionForm) {
        contributionForm.addEventListener('submit', handleSharedGoalContribution);
    }
    
    // Formulário de convite
    const inviteForm = document.getElementById('inviteForm');
    if (inviteForm) {
        inviteForm.addEventListener('submit', handleParticipantInvite);
    }
    
    // Inicializar abas
    initGoalTabs();
    initSharedGoalDetailsTabs();
    
    console.log("Event listeners configurados");
}

// Carregar metas compartilhadas do Supabase
async function loadSharedGoals() {
    try {
        showLoader();
        
        // Buscar metas onde o usuário é criador ou participante
        const { data: sharedGoalsData, error: sharedGoalsError } = await supabase
            .from('shared_goals')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (sharedGoalsError) throw sharedGoalsError;

        console.log("Metas compartilhadas carregadas:", sharedGoalsData);
        
        // Para cada meta, buscar participantes e contribuições
        const goalsWithData = await Promise.all(sharedGoalsData.map(async (goal) => {
            // Buscar participantes - removendo a junção direta com user
            const { data: participants, error: participantsError } = await supabase
                .from('shared_goal_participants')
                .select('*')
                .eq('shared_goal_id', goal.id);
            
            if (participantsError) throw participantsError;
            
            console.log(`Participantes da meta ${goal.id}:`, participants);
            
            // Adicionar dados de usuário usando a função RPC melhorada
            if (participants && participants.length > 0) {
                for (let participant of participants) {
                    try {
                        const { data: userData, error: userDataError } = await supabase
                            .rpc('get_user_data_with_display_name', { user_id: participant.user_id });
                        
                        console.log(`Dados do usuário ${participant.user_id}:`, userData);
                        
                        if (!userDataError && userData) {
                            participant.user = userData;
                        } else {
                            console.warn(`Erro ao buscar dados do usuário ${participant.user_id}:`, userDataError);
                        }
                    } catch (userError) {
                        console.warn('Erro ao buscar dados do usuário:', userError);
                        // Continuar mesmo com erro, para não bloquear a carga das metas
                    }
                }
            }
            
            // Buscar contribuições - removendo a junção direta com user
            const { data: contributions, error: contributionsError } = await supabase
                .from('shared_goal_contributions')
                .select('*')
                .eq('shared_goal_id', goal.id)
                .order('date', { ascending: false });
            
            if (contributionsError) throw contributionsError;
            
            console.log(`Contribuições da meta ${goal.id}:`, contributions);
            
            // Adicionar dados de usuário para cada contribuição usando a função RPC melhorada
            if (contributions && contributions.length > 0) {
                for (let contribution of contributions) {
                    try {
                        const { data: userData, error: userDataError } = await supabase
                            .rpc('get_user_data_with_display_name', { user_id: contribution.user_id });
                        
                        console.log(`Dados do usuário da contribuição ${contribution.id}:`, userData);
                        
                        if (!userDataError && userData) {
                            contribution.user = userData;
                        } else {
                            console.warn(`Erro ao buscar dados do usuário da contribuição ${contribution.id}:`, userDataError);
                        }
                    } catch (userError) {
                        console.warn('Erro ao buscar dados do usuário para contribuição:', userError);
                        // Continuar mesmo com erro
                    }
                }
            }
            
            // Calcular valor total contribuído
            const totalContributed = contributions.reduce((sum, c) => sum + Number(c.amount), 0);
            const remaining = Math.max(0, goal.target_amount - totalContributed);
            const progress = (totalContributed / goal.target_amount) * 100;
            
            // Armazenar os dados em cache
            sharedGoalParticipants[goal.id] = participants;
            sharedGoalContributions[goal.id] = contributions;
            
            // Retornar meta com dados calculados
            return {
                ...goal,
                participants: participants,
                contributions: contributions,
                total_contributed: totalContributed,
                remaining: remaining,
                progress: progress
            };
        }));
        
        sharedGoals = goalsWithData;
        console.log("Metas processadas com dados completos:", sharedGoals);
        renderSharedGoals();
        
    } catch (error) {
        console.error('Erro ao carregar metas compartilhadas:', error);
        showToast('Não foi possível carregar as metas compartilhadas', 'error', 'Erro');
    } finally {
        hideLoader();
    }
}

// Renderizar metas compartilhadas na interface
function renderSharedGoals() {
    const container = document.getElementById('sharedGoalsList');
    if (!container) return;
    
    if (!sharedGoals.length) {
        container.innerHTML = `
            <div class="no-shared-goals">
                <div class="empty-icon-container">
                    <i class="fas fa-users-slash"></i>
                </div>
                <h3>Nenhuma meta compartilhada encontrada</h3>
                <p>Crie uma meta compartilhada para trabalhar em equipe com amigos ou familiares em direção a um objetivo comum. Compartilhe despesas, acompanhe o progresso e alcance objetivos juntos!</p>
                <button class="btn btn-primary" onclick="toggleSharedGoalModal(true)">
                    <i class="fas fa-plus-circle"></i>
                    Criar Meta Compartilhada
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = sharedGoals.map(goal => {
        const deadline = new Date(goal.deadline);
        const today = new Date();
        const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
        
        // Determinar classe de progresso
        const progressClass = goal.progress >= 100 ? 'success' :
                              goal.progress >= 75 ? 'warning' : '';
        
        // Preparar preview de participantes
        const participantsPreview = renderParticipantsPreview(goal.participants, 5);
        
        return `
            <div class="shared-goal-card ${goal.progress >= 100 ? 'completed' : ''}">
                <div class="shared-goal-header">
                    <h3 class="shared-goal-title">${goal.name}</h3>
                    <div class="shared-goal-actions">
                        <button class="btn btn-sm btn-info" onclick="showSharedGoalDetails(${goal.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${goal.creator_id === getCurrentUserIdSync() ? `
                            <button class="btn btn-sm btn-danger" onclick="deleteSharedGoal(${goal.id})">
                                <i class="fas fa-times-circle"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
                
                ${goal.description ? `
                    <div class="shared-goal-description">${goal.description}</div>
                ` : ''}
                
                <div class="shared-goal-info">
                    <div class="shared-goal-amounts">
                        <div>Meta: ${formatCurrency(goal.target_amount)}</div>
                        <div>Acumulado: ${formatCurrency(goal.total_contributed)}</div>
                    </div>
                    
                    <div class="shared-goal-progress-container">
                        <div class="shared-goal-progress ${progressClass}" style="width: ${Math.min(100, goal.progress)}%"></div>
                    </div>
                    
                    <div class="shared-goal-status">
                        <div class="status-item">
                            ${daysLeft > 0 
                                ? `<span class="${daysLeft < 30 ? 'urgent' : ''}"><i class="far fa-clock"></i> ${daysLeft} dias restantes</span>` 
                                : `<span class="expired"><i class="fas fa-exclamation-circle"></i> Prazo expirado</span>`
                            }
                        </div>
                        <div class="status-item">
                            <span><i class="fas fa-trophy"></i> ${goal.progress.toFixed(1)}% concluído</span>
                        </div>
                    </div>
                </div>
                
                <div class="participants-preview">
                    ${participantsPreview}
                </div>
                
                <div class="shared-goal-actions-footer">
                    <button class="btn btn-primary contribute-btn" onclick="openContributionModal(${goal.id})" ${goal.progress >= 100 ? 'disabled' : ''}>
                        <i class="fas fa-plus-circle"></i>
                        ${goal.progress >= 100 ? 'Meta Concluída!' : 'Contribuir'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Renderizar preview de participantes
function renderParticipantsPreview(participants, maxDisplay) {
    if (!participants || participants.length === 0) {
        return `<div class="participant-avatar"><i class="fas fa-user"></i></div>`;
    }
    
    const displayCount = Math.min(participants.length, maxDisplay - 1);
    const hasMore = participants.length > maxDisplay - 1;
    
    let html = '';
    
    // Renderizar avatares visíveis
    for (let i = 0; i < displayCount; i++) {
        const participant = participants[i];
        const userName = participant.user?.display_name || participant.user?.email || 'Usuário';
        const initials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        
        html += `
            <div class="participant-avatar" title="${userName}">
                ${initials}
            </div>
        `;
    }
    
    // Adicionar avatar "mais" se necessário
    if (hasMore) {
        const moreCount = participants.length - displayCount;
        html += `
            <div class="participant-avatar more-participants" title="+ ${moreCount} participantes">
                +${moreCount}
            </div>
        `;
    }
    
    return html;
}

// Abrir/fechar modal de nova meta compartilhada
function toggleSharedGoalModal(show) {
    const modal = document.getElementById('sharedGoalModal');
    if (!modal) {
        console.error("Modal de meta compartilhada não encontrado!");
        return;
    }
    
    if (show) {
        // Preparar formulário
        const form = document.getElementById('sharedGoalForm');
        if (form) {
            form.reset();
            const deadlineInput = document.getElementById('sharedGoalDeadline');
            if (deadlineInput) {
                deadlineInput.min = new Date().toISOString().split('T')[0];
            }
        }
        
        // Mostrar modal
        modal.classList.add('show');
        console.log("Modal aberto:", modal);
    } else {
        modal.classList.remove('show');
        console.log("Modal fechado");
    }
}

// Tornar a função acessível globalmente
window.toggleSharedGoalModal = toggleSharedGoalModal;

// Abrir/fechar modal de detalhes da meta compartilhada
function toggleSharedGoalDetailsModal(show, goalId = null, activeTab = null) {
    const modal = document.getElementById('sharedGoalDetailsModal');
    if (!modal) return;
    
    if (show && goalId) {
        currentSharedGoalId = goalId;
        const goal = sharedGoals.find(g => g.id === goalId);
        if (!goal) return;
        
        // Preencher dados da meta
        document.getElementById('sharedGoalDetailTitle').textContent = goal.name;
        document.getElementById('sharedGoalTargetAmount').textContent = formatCurrency(goal.target_amount);
        document.getElementById('sharedGoalTotalContributed').textContent = formatCurrency(goal.total_contributed);
        document.getElementById('sharedGoalRemainingAmount').textContent = formatCurrency(goal.remaining);
        
        // Configurar barra de progresso
        const progressBar = document.getElementById('sharedGoalProgressBar');
        progressBar.style.width = `${Math.min(100, goal.progress)}%`;
        progressBar.className = `goal-progress ${goal.progress >= 100 ? 'success' : goal.progress >= 75 ? 'warning' : ''}`;
        
        // Carregar ranking
        renderRanking(goal);
        
        // Carregar contribuições
        renderContributions(goal);
        
        // Carregar participantes
        renderParticipants(goal);
        
        // Configurar botões de ação com base em permissões
        setupSharedGoalActionButtons(goal);
        
        // Ativar aba específica se solicitado, ou usar 'ranking' como padrão
        if (activeTab) {
            activateSharedGoalTab(activeTab);
        } else {
            activateSharedGoalTab('ranking');
        }
        
        // Mostrar modal
        modal.classList.add('show');
    } else {
        modal.classList.remove('show');
        currentSharedGoalId = null;
    }
}

// Função para exibir os detalhes de uma meta compartilhada
async function showSharedGoalDetails(goalId, activeTab = 'ranking') {
    if (!goalId) return;
    
    currentSharedGoalId = goalId;
    
    try {
        // Buscar meta pelo ID
        const goal = sharedGoals.find(g => g.id === goalId);
        if (!goal) {
            showToast('Meta não encontrada', 'error', 'Erro');
            return;
        }
        
        // Verificar se o usuário atual é o criador da meta
        const userId = await getCurrentUserId();
        const isCreator = userId && goal.creator_id === userId;
        
        // Verificar se o usuário atual é participante da meta
        const isParticipant = userId && goal.participants.some(p => p.user_id === userId);
        
        // Configurar botões de ação
        const deleteButton = document.getElementById('deleteSharedGoalBtn');
        const leaveButton = document.getElementById('leaveSharedGoalBtn');
        
        if (deleteButton) {
            deleteButton.style.display = isCreator ? 'inline-block' : 'none';
        }
        
        if (leaveButton) {
            leaveButton.style.display = (!isCreator && isParticipant) ? 'inline-block' : 'none';
            if (!isCreator && isParticipant) {
                leaveButton.setAttribute('data-goal-id', goalId);
            }
        }
        
        // Renderizar as abas
        renderParticipants(goal);
        renderContributions(goal);
        renderRanking(goal);
        
        // Ativar aba solicitada
        activateSharedGoalTab(activeTab);
        
        // Exibir modal
        toggleSharedGoalDetailsModal(true, goalId, activeTab);
    } catch (error) {
        console.error('Erro ao exibir detalhes da meta:', error);
        showToast('Erro ao exibir detalhes da meta', 'error', 'Erro');
    }
}

// Função para sair de uma meta compartilhada
async function leaveSharedGoal(goalId) {
    try {
        // Usar sistema de confirmação personalizado em vez do confirm nativo
        const confirmed = await showConfirmation(
            'Sair da Meta Compartilhada',
            'Deseja sair desta meta?'
        );
        
        if (!confirmed) return;
        
        showLoader();
        
        // Obter ID do usuário atual
        const userId = await getCurrentUserId();
        if (!userId) {
            showToast('Erro: usuário não autenticado', 'error');
            hideLoader();
            return;
        }
        
        // Buscar o registro do participante para o usuário atual
        const { data: participant, error: findError } = await supabase
            .from('shared_goal_participants')
            .select('id')
            .eq('shared_goal_id', goalId)
            .eq('user_id', userId)
            .single();
        
        if (findError) {
            console.error('Erro ao buscar participante:', findError);
            showToast('Erro ao buscar sua participação na meta', 'error', 'Erro');
            hideLoader();
            return;
        }
        
        if (!participant) {
            showToast('Você não é participante desta meta', 'error', 'Acesso Negado');
            hideLoader();
            return;
        }
        
        // Remover o participante
        const { error: deleteError } = await supabase
            .from('shared_goal_participants')
            .delete()
            .eq('id', participant.id);
        
        if (deleteError) {
            console.error('Erro ao sair da meta:', deleteError);
            showToast('Não foi possível sair da meta compartilhada', 'error', 'Erro');
            hideLoader();
            return;
        }
        
        // Fechar o modal de detalhes
        toggleSharedGoalDetailsModal(false);
        
        // Recarregar as metas
        await loadSharedGoals();
        
        showToast('Você saiu da meta compartilhada com sucesso', 'success', 'Meta Atualizada');
        
    } catch (error) {
        console.error('Erro ao sair da meta compartilhada:', error);
        showToast('Erro ao sair da meta compartilhada', 'error', 'Erro');
    } finally {
        hideLoader();
    }
}

// Variáveis para controle de paginação
let currentContributionsPage = 1;
const contributionsPerPage = 3; // Reduzindo para 3 itens por página

// Função para renderizar contribuições com paginação
function renderContributions(goal) {
    const contributionsContainer = document.getElementById('sharedGoalContributions');
    if (!contributionsContainer) return;
    
    // Ordenar contribuições por data (mais recentes primeiro)
    const contributions = [...goal.contributions].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        dateA.setMinutes(dateA.getMinutes() + dateA.getTimezoneOffset());
        dateB.setMinutes(dateB.getMinutes() + dateB.getTimezoneOffset());
        return dateB - dateA;
    });
    
    if (contributions.length === 0) {
        contributionsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-piggy-bank"></i>
                <p>Ainda não há contribuições para esta meta.</p>
            </div>
        `;
        return;
    }
    
    // Calcular paginação
    const totalPages = Math.ceil(contributions.length / contributionsPerPage);
    const startIndex = (currentContributionsPage - 1) * contributionsPerPage;
    const endIndex = startIndex + contributionsPerPage;
    const currentContributions = contributions.slice(startIndex, endIndex);
    
    let html = '<div class="contributions-list">';
    
    for (const contribution of currentContributions) {
        // Encontrar o participante correspondente
        const participant = goal.participants.find(p => p.user_id === contribution.user_id);
        
        // Usar o display_name do participante, ou o email como fallback
        const userName = participant?.user?.display_name || participant?.user?.email || 'Usuário';
        const isCreator = contribution.user_id === goal.creator_id;
        
        // Ajustar a data para o fuso horário local
        const date = new Date(contribution.date);
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        const dateFormatted = date.toLocaleDateString('pt-BR');
        
        const amount = parseFloat(contribution.amount).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        
        html += `
            <div class="contribution-item">
                <div class="contribution-avatar">
                    ${userName.charAt(0).toUpperCase()}
                </div>
                <div class="contribution-info">
                    <div class="contribution-header">
                        <div class="contribution-user">
                            ${userName}
                            ${isCreator ? '<span class="contribution-user-badge">Criador</span>' : ''}
                        </div>
                        <div class="contribution-date"><i class="far fa-calendar"></i> ${dateFormatted}</div>
                    </div>
                    <div class="contribution-amount">${amount}</div>
                    ${contribution.notes ? `<div class="contribution-notes">${contribution.notes}</div>` : ''}
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    
    // Adicionar informação de paginação
    html += `<div class="pagination-info">Mostrando ${startIndex + 1}-${Math.min(endIndex, contributions.length)} de ${contributions.length} contribuições</div>`;
    
    // Adicionar paginação se houver mais de uma página
    if (totalPages > 1) {
        html += '<div class="pagination-container">';
        
        // Botão anterior
        if (currentContributionsPage > 1) {
            html += `
                <button class="pagination-button" onclick="changePage(${currentContributionsPage - 1})">
                    <i class="fas fa-chevron-left"></i>
                </button>
            `;
        } else {
            html += `
                <button class="pagination-button" disabled>
                    <i class="fas fa-chevron-left"></i>
                </button>
            `;
        }
        
        // Números das páginas
        const maxPagesToShow = 5;
        const startPage = Math.max(1, currentContributionsPage - Math.floor(maxPagesToShow / 2));
        const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
        
        if (startPage > 1) {
            html += `
                <button class="pagination-button" onclick="changePage(1)">1</button>
                ${startPage > 2 ? '<span class="pagination-ellipsis">...</span>' : ''}
            `;
        }
        
        for (let i = startPage; i <= endPage; i++) {
            html += `
                <button class="pagination-button ${i === currentContributionsPage ? 'active' : ''}" 
                    onclick="changePage(${i})">
                    ${i}
                </button>
            `;
        }
        
        if (endPage < totalPages) {
            html += `
                ${endPage < totalPages - 1 ? '<span class="pagination-ellipsis">...</span>' : ''}
                <button class="pagination-button" onclick="changePage(${totalPages})">${totalPages}</button>
            `;
        }
        
        // Botão próximo
        if (currentContributionsPage < totalPages) {
            html += `
                <button class="pagination-button" onclick="changePage(${currentContributionsPage + 1})">
                    <i class="fas fa-chevron-right"></i>
                </button>
            `;
        } else {
            html += `
                <button class="pagination-button" disabled>
                    <i class="fas fa-chevron-right"></i>
                </button>
            `;
        }
        
        html += '</div>';
    }
    
    contributionsContainer.innerHTML = html;
}

// Função para mudar de página
function changePage(page) {
    currentContributionsPage = page;
    const goal = sharedGoals.find(g => g.id === currentSharedGoalId);
    if (goal) {
        renderContributions(goal);
    }
}

// Expor a função changePage globalmente
window.changePage = changePage;

// Renderizar participantes
function renderParticipants(goal) {
    const participantsContainer = document.getElementById('sharedGoalParticipants');
    if (!participantsContainer) return;
    
    const participants = goal.participants || [];
    
    console.log("Renderizando participantes:", participants);
    
    if (participants.length === 0) {
        participantsContainer.innerHTML = `
            <div class="no-data">
                <p>Nenhum participante encontrado</p>
            </div>
        `;
        return;
    }
    
    participantsContainer.innerHTML = participants.map(participant => {
        // Debug para verificar os dados do usuário
        console.log("Dados completos do participante:", participant);
        
        // Priorizar o display_name configurado pelo usuário
        const userName = participant.user?.display_name || participant.user?.email || 'Usuário';
        const userEmail = participant.user?.email || '';
        console.log(`Nome exibido para participante: ${userName}, email: ${userEmail}`);
        
        const initials = userName.split(' ').map(n => n?.[0] || '').join('').substring(0, 2).toUpperCase() || 'U';
        const formattedDate = new Date(participant.joined_at).toLocaleDateString('pt-BR');
        
        // Definir classe de status
        let statusClass = '';
        let statusText = '';
        
        switch (participant.status) {
            case 'active':
                statusClass = 'status-active';
                statusText = 'Ativo';
                break;
            case 'pending':
                statusClass = 'status-pending';
                statusText = 'Pendente';
                break;
            case 'inactive':
                statusClass = 'status-inactive';
                statusText = 'Inativo';
                break;
            default:
                statusClass = 'status-active';
                statusText = 'Ativo';
        }
        
        return `
            <div class="participant-item">
                <div class="participant-avatar">${initials}</div>
                <div class="participant-info">
                    <div class="participant-name">${userName}</div>
                    <div class="participant-email">${userEmail}</div>
                    <div class="participant-since">Desde ${formattedDate}</div>
                </div>
                <div class="participant-status ${statusClass}">${statusText}</div>
            </div>
        `;
    }).join('');
}

// Renderizar ranking de participantes
function renderRanking(goal) {
    const rankingContainer = document.getElementById('sharedGoalRanking');
    if (!rankingContainer) return;
    
    // Obter participantes e suas contribuições
    const participants = goal.participants || [];
    
    console.log("Renderizando ranking com participantes:", participants);
    console.log("Contribuições disponíveis:", goal.contributions);
    
    if (participants.length === 0) {
        rankingContainer.innerHTML = `
            <div class="no-data">
                <p>Nenhum participante encontrado</p>
            </div>
        `;
        return;
    }
    
    // Ordenar participantes por pontos
    const sortedParticipants = [...participants].sort((a, b) => b.points - a.points);
    
    console.log("Participantes ordenados por pontos:", sortedParticipants);
    
    rankingContainer.innerHTML = sortedParticipants.map((participant, index) => {
        // Debug para verificar dados do participante
        console.log(`Renderizando participante ${index + 1} no ranking:`, participant);
        
        // Priorizar o display_name configurado pelo usuário
        const userName = participant.user?.display_name || participant.user?.email || 'Usuário';
        console.log(`Nome exibido para participante no ranking: ${userName}`);
        
        const initials = userName.split(' ').map(n => n?.[0] || '').join('').substring(0, 2).toUpperCase() || 'U';
        
        // Definir classe de posição para os 3 primeiros
        let positionClass = '';
        if (index === 0) positionClass = 'gold';
        else if (index === 1) positionClass = 'silver';
        else if (index === 2) positionClass = 'bronze';
        
        // Buscar contribuições do participante
        const userContributions = goal.contributions.filter(c => c.user_id === participant.user_id);
        console.log(`Contribuições do usuário ${participant.user_id}:`, userContributions);
        
        const totalAmount = userContributions.reduce((sum, c) => sum + Number(c.amount), 0);
        const contributionCount = userContributions.length;
        
        console.log(`Total contribuído: ${totalAmount}, Número de contribuições: ${contributionCount}`);
        
        // Verificar badges
        const badges = [];
        // Badge para primeiro contribuinte
        if (goal.contributions.length > 0 && goal.contributions[goal.contributions.length - 1].user_id === participant.user_id) {
            badges.push(`<div class="badge badge-first" title="Primeiro Contribuinte"><i class="fas fa-star"></i></div>`);
        }
        // Badge para maior contribuição
        if (goal.contributions.length > 0) {
            const maxContribution = Math.max(...goal.contributions.map(c => Number(c.amount) || 0));
            if (userContributions.some(c => Number(c.amount) === maxContribution)) {
                badges.push(`<div class="badge badge-highest" title="Maior Contribuição"><i class="fas fa-arrow-up"></i></div>`);
            }
        }
        // Badge para contribuidor frequente (3+ contribuições)
        if (contributionCount >= 3) {
            badges.push(`<div class="badge badge-frequent" title="Contribuidor Frequente"><i class="fas fa-bolt"></i></div>`);
        }
        
        return `
            <div class="ranking-item">
                <div class="ranking-position ${positionClass}">${index + 1}</div>
                <div class="ranking-avatar">${initials}</div>
                <div class="ranking-info">
                    <div class="ranking-name">${userName}</div>
                    <div class="ranking-stats">
                        <span>${contributionCount} contribuição(ões)</span>
                        <span>${formatCurrency(totalAmount)}</span>
                    </div>
                </div>
                ${badges.length > 0 ? `<div class="badge-container">${badges.join('')}</div>` : ''}
                <div class="ranking-points">${participant.points || 0} pts</div>
            </div>
        `;
    }).join('');
}

// Criar nova meta compartilhada
async function handleSharedGoalSubmit(e) {
    e.preventDefault();
    
    try {
        showLoader();
        
        const form = e.target;
        const formData = new FormData(form);
        
        // Obter ID do usuário atual
        const userId = await getCurrentUserId();
        if (!userId) {
            showToast('Erro: usuário não autenticado', 'error');
            hideLoader();
            return;
        }
        
        const newGoal = {
            name: formData.get('name'),
            description: formData.get('description') || null,
            target_amount: parseFloat(formData.get('amount')),
            deadline: formData.get('deadline'),
            creator_id: userId
        };
        
        // Validar dados
        if (!newGoal.name || !newGoal.target_amount || !newGoal.deadline) {
            showToast('Preencha todos os campos obrigatórios', 'error');
            hideLoader();
            return;
        }
        
        // Inserir meta no banco
        const { data: goalData, error: goalError } = await supabase
            .from('shared_goals')
            .insert([newGoal])
            .select()
            .single();
        
        if (goalError) throw goalError;
        
        // Adicionar criador como participante
        const { data: participantData, error: participantError } = await supabase
            .from('shared_goal_participants')
            .insert([{
                shared_goal_id: goalData.id,
                user_id: userId,
                status: 'active'
            }]);
        
        if (participantError) throw participantError;
        
        // Recarregar metas
        await loadSharedGoals();
        
        // Fechar modal
        toggleSharedGoalModal(false);
        
        showToast('Meta compartilhada criada com sucesso!', 'success', 'Nova Meta');
        
    } catch (error) {
        console.error('Erro ao criar meta compartilhada:', error);
        showToast('Não foi possível criar a meta', 'error', 'Erro');
    } finally {
        hideLoader();
    }
}

// Adicionar contribuição a uma meta compartilhada
async function handleSharedGoalContribution(e) {
    e.preventDefault();
    
    try {
        showLoader();
        
        // Obter os valores do formulário
        const amount = parseFloat(document.getElementById('contributionAmount').value);
        const dateInput = document.getElementById('contributionDate').value;
        // Ajustar a data para o fuso horário local
        const date = new Date(dateInput);
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        const formattedDate = date.toISOString().split('T')[0];
        const notes = document.getElementById('contributionNotes').value;
        const goalId = document.getElementById('sharedGoalId').value;
        
        // Validar se temos o ID da meta
        if (!goalId) {
            showToast('ID da meta não encontrado', 'error', 'Erro');
            hideLoader();
            return;
        }
        
        // Obter o ID do usuário atual
        const userId = await getCurrentUserId();
        if (!userId) {
            showToast('Usuário não autenticado', 'error', 'Erro');
            hideLoader();
            return;
        }
        
        // Criar a contribuição
        const { data: contribution, error } = await supabase
            .from('shared_goal_contributions')
            .insert([{
                shared_goal_id: goalId,
                user_id: userId,
                amount: amount,
                date: formattedDate,
                notes: notes
            }])
            .select('*')
            .single();
        
        if (error) {
            console.error('Erro ao adicionar contribuição:', error);
            showToast('Erro ao adicionar contribuição', 'error', 'Erro');
            hideLoader();
            return;
        }
        
        // Atualizar a interface
        showToast('Contribuição adicionada com sucesso!', 'success', 'Sucesso');
        
        // Fechar o modal de contribuição
        toggleContributionModal(false);
        
        // Atualizar a exibição da meta
        if (currentSharedGoalId) {
            const goal = sharedGoals.find(g => g.id === currentSharedGoalId);
            if (goal) {
                renderContributions(goal);
                renderRanking(goal);
            }
        }
        
        // Recarregar as metas para atualizar os valores
        await loadSharedGoals();
        
    } catch (error) {
        console.error('Erro ao adicionar contribuição:', error);
        showToast('Erro ao adicionar contribuição', 'error', 'Erro');
    } finally {
        hideLoader();
    }
}

// Convidar participante para meta compartilhada
async function handleParticipantInvite(e) {
    e.preventDefault();
    
    if (!currentSharedGoalId) return;
    
    try {
        showLoader();
        
        const email = document.getElementById('inviteEmail').value;
        
        if (!email) {
            showToast('Informe um e-mail válido', 'error');
            hideLoader();
            return;
        }
        
        // Obter ID do usuário atual
        const currentUserId = await getCurrentUserId();
        if (!currentUserId) {
            showToast('Erro: usuário não autenticado', 'error');
            hideLoader();
            return;
        }
        
        // Buscar usuário com o email diretamente na tabela auth.users através da função RPC melhorada
        const { data: userData, error: userDataError } = await supabase
            .rpc('find_user_by_email_with_display_name', { email_to_find: email });
        
        if (userDataError || !userData || !userData.id) {
            showToast('Usuário não encontrado', 'error');
            hideLoader();
            return;
        }
        
        // Verificar se o usuário já é participante
        const { data: existingParticipant, error: checkError } = await supabase
            .from('shared_goal_participants')
            .select('id')
            .eq('shared_goal_id', currentSharedGoalId)
            .eq('user_id', userData.id)
            .single();
        
        if (existingParticipant) {
            showToast('Usuário já é participante desta meta', 'info', 'Informação');
            hideLoader();
            return;
        }
        
        // Adicionar como participante pendente
        const { data, error } = await supabase
            .from('shared_goal_participants')
            .insert([{
                shared_goal_id: currentSharedGoalId,
                user_id: userData.id,
                status: 'active'
            }]);
        
        if (error) throw error;
        
        // Recarregar metas
        await loadSharedGoals();
        
        // Recarregar detalhes se o modal estiver aberto
        if (currentSharedGoalId) {
            showSharedGoalDetails(currentSharedGoalId, 'participants');
        }
        
        // Limpar campo
        document.getElementById('inviteEmail').value = '';
        
        showToast('Participante adicionado com sucesso!', 'success', 'Nova Participação');
        
    } catch (error) {
        console.error('Erro ao convidar participante:', error);
        showToast('Não foi possível adicionar o participante', 'error', 'Erro');
    } finally {
        hideLoader();
    }
}

// Excluir meta compartilhada
async function deleteSharedGoal(goalId) {
    try {
        // Usar sistema de confirmação personalizado em vez do confirm nativo
        const confirmed = await showConfirmation(
            'Excluir Meta',
            'Deseja excluir esta meta?'
        );
        
        if (!confirmed) return;
        
        showLoader();
        
        // Excluir meta
        const { error } = await supabase
            .from('shared_goals')
            .delete()
            .eq('id', goalId);
        
        if (error) throw error;
        
        // Fechar o modal de detalhes se estiver aberto
        toggleSharedGoalDetailsModal(false);
        
        // Recarregar metas
        await loadSharedGoals();
        
        showToast('Meta excluída com sucesso!', 'success', 'Meta Removida');
        
    } catch (error) {
        console.error('Erro ao excluir meta compartilhada:', error);
        showToast('Não foi possível excluir a meta', 'error', 'Erro');
    } finally {
        hideLoader();
    }
}

// Função para obter o ID do usuário atual usando Supabase v2
async function getCurrentUserId() {
    try {
        // Para Supabase v2, a forma de obter o usuário mudou
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session && session.user) {
            // Salvar na variável global para acesso síncrono
            window.currentUser = { id: session.user.id };
            console.log("Usuário inicializado:", window.currentUser.id);
            return session.user.id;
        }
        
        return null;
    } catch (error) {
        console.error("Erro ao obter usuário atual:", error);
        return null;
    }
}

// Função para obter o ID do usuário atual de forma síncrona
function getCurrentUserIdSync() {
    // Verificar se temos o ID do usuário em variável global
    if (window.currentUser && window.currentUser.id) {
        return window.currentUser.id;
    }
    
    // Fallback: tentar obter direto de supabase.auth
    try {
        const user = supabase.auth.user?.() || null;
        if (user) return user.id;
        
        // Nova API do Supabase v2
        const session = supabase.auth.session?.() || null;
        if (session && session.user) return session.user.id;
    } catch (error) {
        console.warn("Erro ao obter usuário sincronamente:", error);
    }
    
    console.warn("Usuário não disponível sincronamente");
    return null;
}

// Inicializar módulo
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('DOM carregado, inicializando módulo de metas...');
        
        // Verificar autenticação e inicializar usuário
        await checkAuth();
        await initCurrentUser();
        
        // Inicializar o tema atual
        if (typeof initTheme === 'function') initTheme();
        
        // Inicializar as abas
        initGoalTabs();
        
        // Inicializar a visibilidade dos botões com base na aba ativa inicialmente
        const activeTab = document.querySelector('.goals-tabs .tab-btn.active');
        if (activeTab) {
            toggleGoalButtonsVisibility(activeTab.getAttribute('data-tab'));
        }
        
        // Inicializar funcionalidades de metas
        setupGoalModalTabs();
        setupSharedGoalsEventListeners();
        initSharedGoalDetails();
        initSharedGoalDetailsTabs();
        initContributionModal();
        
        // Carregar dados iniciais
        loadGoals();
        
        // Expor funções para o escopo global
        exposeGlobalFunctions();
        
        console.log('Módulo de metas inicializado com sucesso!');
    } catch (error) {
        console.error('Erro ao inicializar módulo de metas:', error);
    }
});

// Inicializar o usuário atual no carregamento
async function initCurrentUser() {
    try {
        // Para Supabase v2
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session && session.user) {
            window.currentUser = { id: session.user.id };
            console.log("Usuário inicializado:", window.currentUser.id);
            return session.user.id;
        } else {
            console.warn("Nenhuma sessão de usuário encontrada");
            return null;
        }
    } catch (error) {
        console.error("Erro ao inicializar usuário:", error);
        return null;
    }
}

// Renderizar informações básicas da meta
function renderSharedGoalInfo(goal) {
    if (!goal) return;
    
    // Preencher as informações básicas
    document.getElementById('sharedGoalName').textContent = goal.name;
    document.getElementById('sharedGoalDescription').textContent = goal.description || 'Sem descrição';
    
    // Formatar e preencher datas
    const deadlineDate = new Date(goal.deadline);
    const formattedDeadline = deadlineDate.toLocaleDateString('pt-BR');
    document.getElementById('sharedGoalDeadline').textContent = formattedDeadline;
    
    const createdDate = new Date(goal.created_at);
    const formattedCreatedAt = createdDate.toLocaleDateString('pt-BR');
    document.getElementById('sharedGoalCreatedAt').textContent = formattedCreatedAt;
    
    // Preencher informações de progresso
    document.getElementById('sharedGoalTargetAmount').textContent = formatCurrency(goal.target_amount);
    document.getElementById('sharedGoalTotalContributed').textContent = formatCurrency(goal.total_contributed);
    document.getElementById('sharedGoalRemainingAmount').textContent = formatCurrency(goal.remaining);
    
    // Atualizar barra de progresso
    const progressBar = document.getElementById('sharedGoalProgressBar');
    progressBar.style.width = `${Math.min(100, goal.progress)}%`;
    
    // Adicionar classe baseada no progresso
    progressBar.className = 'goal-progress';
    if (goal.progress >= 100) {
        progressBar.classList.add('complete');
    } else if (goal.progress >= 75) {
        progressBar.classList.add('almost');
    } else if (goal.progress >= 50) {
        progressBar.classList.add('half');
    } else if (goal.progress >= 25) {
        progressBar.classList.add('started');
    } else {
        progressBar.classList.add('beginning');
    }
    
    // Preparar o formulário de contribuição
    document.getElementById('sharedGoalId').value = goal.id;
    document.getElementById('contributionDate').value = new Date().toISOString().split('T')[0];
}

// Ativar aba específica
function activateSharedGoalTab(tabName) {
    if (!tabName) return;
    
    // Remover classe ativa de todas as abas e conteúdos
    document.querySelectorAll('#sharedGoalDetailsModal .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelectorAll('#sharedGoalDetailsModal .tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    
    // Ativar aba e conteúdo correspondente
    const tabBtn = document.querySelector(`#sharedGoalDetailsModal .tab-btn[data-tab="${tabName}"]`);
    const tabPane = document.getElementById(`${tabName}-tab`);
    
    if (tabBtn) tabBtn.classList.add('active');
    if (tabPane) tabPane.classList.add('active');
}

// Inicializar os ouvintes de eventos para detalhes de metas compartilhadas
function initSharedGoalDetails() {
    // Inicializar abas
    document.querySelectorAll('#sharedGoalDetailsModal .tab-btn').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.addEventListener('click', () => {
            const tabName = newBtn.getAttribute('data-tab');
            activateSharedGoalTab(tabName);
        });
    });
    
    // Ouvintes para fechar modal
    document.querySelectorAll('#sharedGoalDetailsModal .close-modal').forEach(element => {
        const newElement = element.cloneNode(true);
        element.parentNode.replaceChild(newElement, element);
        newElement.addEventListener('click', () => toggleSharedGoalDetailsModal(false));
    });
    
    // Inicializar formulário de convite
    const inviteForm = document.getElementById('inviteForm');
    if (inviteForm) {
        const newForm = inviteForm.cloneNode(true);
        inviteForm.parentNode.replaceChild(newForm, inviteForm);
        newForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleParticipantInvite(e);
        });
    }
}

// Expor funções necessárias ao escopo global
function exposeGlobalFunctions() {
    window.toggleGoalModal = toggleGoalModal;
    window.toggleGoalContributionModal = toggleGoalContributionModal;
    window.handleGoalSubmit = handleGoalSubmit;
    window.handleGoalContributionSubmit = handleGoalContributionSubmit;
    window.deleteGoal = deleteGoal;
    window.navigateToPage = navigateToPage;
    window.handleCategoryFilter = handleCategoryFilter;
    window.toggleFilterMenu = toggleFilterMenu;
    window.handleDatesFilter = handleDatesFilter;
    window.resetFilters = resetFilters;
    window.handleFilterForm = handleFilterForm;
    window.toggleSharedGoalModal = toggleSharedGoalModal;
    window.handleSharedGoalSubmit = handleSharedGoalSubmit;
    
    // Funções para metas compartilhadas
    window.showSharedGoalDetails = showSharedGoalDetails;
    window.deleteSharedGoal = deleteSharedGoal;
    window.leaveSharedGoal = leaveSharedGoal;
    window.openContributionModal = openContributionModal;
    window.toggleContributionModal = toggleContributionModal;
}

// Variáveis para controle do modal de contribuição
let contributionModalActive = false;

// Função para abrir o modal de contribuição
function openContributionModal(goalId) {
    if (!goalId) {
        showToast('ID da meta não encontrado', 'error', 'Erro');
        return;
    }
    
    // Armazenar o ID da meta atual
    currentSharedGoalId = goalId;
    
    // Configurar o ID da meta para o formulário
    const sharedGoalIdInput = document.getElementById('sharedGoalId');
    if (!sharedGoalIdInput) {
        console.error('Campo sharedGoalId não encontrado');
        showToast('Erro ao abrir modal de contribuição', 'error', 'Erro');
        return;
    }
    sharedGoalIdInput.value = goalId;
    
    // Configurar a data para hoje por padrão
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('contributionDate');
    if (dateInput) {
        dateInput.value = today;
        dateInput.max = today;
    }
    
    // Limpar os campos do formulário
    const amountInput = document.getElementById('contributionAmount');
    const notesInput = document.getElementById('contributionNotes');
    
    if (amountInput) amountInput.value = '';
    if (notesInput) notesInput.value = '';
    
    // Mostrar o modal
    toggleContributionModal(true);
    
    console.log('Modal de contribuição aberto para meta compartilhada:', goalId); // Debug
}

// Função para abrir/fechar o modal de contribuição
function toggleContributionModal(show) {
    // Verifica se estamos lidando com o modal de metas compartilhadas
    const sharedModal = document.getElementById('sharedContributionModal');
    if (sharedModal) {
        console.log('toggleContributionModal (shared) chamada:', show);
        
        if (show) {
            sharedModal.classList.add('show');
            contributionModalActive = true;
        } else {
            sharedModal.classList.remove('show');
            contributionModalActive = false;
            
            // Limpar campos
            const amountInput = document.getElementById('contributionAmount');
            const notesInput = document.getElementById('contributionNotes');
            if (amountInput) amountInput.value = '';
            if (notesInput) notesInput.value = '';
        }
    }
    
    // Verifica se estamos lidando com o modal de contribuição individual
    const individualModal = document.getElementById('contributionModal');
    if (individualModal) {
        console.log('toggleContributionModal (individual) chamada:', show);
        
        if (show) {
            individualModal.classList.add('active');
            
            // Resetar o formulário quando abrir o modal
            document.getElementById('contributionForm')?.reset();
            // Definir a data atual como padrão
            const dateInput = document.querySelector('#contributionModal #date');
            if (dateInput) {
                dateInput.valueAsDate = new Date();
            }
        } else {
            individualModal.classList.remove('active');
            
            // Limpar o formulário ao fechar
            document.getElementById('contributionForm')?.reset();
        }
    }
}

// Função para inicializar os ouvintes de eventos para o modal de contribuição
function initContributionModal() {
    // Inicializar formulário de contribuição
    const contributionForm = document.getElementById('sharedGoalContributionForm');
    if (contributionForm) {
        // Remover event listeners antigos
        const newForm = contributionForm.cloneNode(true);
        contributionForm.parentNode.replaceChild(newForm, contributionForm);
        
        // Adicionar novo event listener
        newForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                showLoader();
                
                // Obter os valores do formulário
                const amount = parseFloat(document.getElementById('contributionAmount').value);
                const date = document.getElementById('contributionDate').value;
                const notes = document.getElementById('contributionNotes').value;
                const goalId = document.getElementById('sharedGoalId').value;
                
                // Validar se temos o ID da meta
                if (!goalId) {
                    showToast('ID da meta não encontrado', 'error', 'Erro');
                    return;
                }
                
                // Obter o ID do usuário atual
                const userId = await getCurrentUserId();
                if (!userId) {
                    showToast('Usuário não autenticado', 'error', 'Erro');
                    return;
                }
                
                console.log('Enviando contribuição para meta compartilhada:', { goalId, userId, amount, date, notes }); // Debug
                
                // Criar a contribuição na tabela shared_goal_contributions
                const { data: contribution, error } = await supabase
                    .from('shared_goal_contributions')
                    .insert([{
                        shared_goal_id: goalId,
                        user_id: userId,
                        amount: amount,
                        date: date,
                        notes: notes
                    }])
                    .select('*')
                    .single();
                
                if (error) {
                    console.error('Erro ao adicionar contribuição:', error);
                    showToast('Erro ao adicionar contribuição', 'error', 'Erro');
                    return;
                }
                
                // Atualizar a interface
                showToast('Contribuição adicionada com sucesso!', 'success', 'Sucesso');
                
                // Fechar o modal de contribuição
                toggleContributionModal(false);
                
                // Atualizar a exibição da meta
                if (currentSharedGoalId) {
                    const goal = sharedGoals.find(g => g.id === currentSharedGoalId);
                    if (goal) {
                        renderContributions(goal);
                        renderRanking(goal);
                    }
                }
                
                // Recarregar as metas para atualizar os valores
                await loadSharedGoals();
                
            } catch (error) {
                console.error('Erro ao adicionar contribuição:', error);
                showToast('Erro ao adicionar contribuição', 'error', 'Erro');
            } finally {
                hideLoader();
            }
        });
    }
    
    // Adicionar listeners para os botões de fechar
    const closeButtons = document.querySelectorAll('#sharedContributionModal .close-modal, #sharedContributionModal .cancel-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            toggleContributionModal(false);
        });
    });
}

// Configurar botões de ação com base em permissões
async function setupSharedGoalActionButtons(goal) {
    // Verificar se o usuário está logado
    const userId = await getCurrentUserId();
    if (!userId) return;
    
    // Configurar botão de excluir meta (apenas para o criador)
    const deleteBtn = document.getElementById('deleteSharedGoalBtn');
    if (deleteBtn) {
        if (goal.creator_id === userId) {
            deleteBtn.style.display = 'inline-block';
        } else {
            deleteBtn.style.display = 'none';
        }
    }
    
    // Configurar botão de sair da meta (não mostrar para o criador)
    const leaveBtn = document.getElementById('leaveSharedGoalBtn');
    if (leaveBtn) {
        if (goal.creator_id !== userId) {
            leaveBtn.style.display = 'inline-block';
            leaveBtn.setAttribute('data-goal-id', goal.id);
        } else {
            leaveBtn.style.display = 'none';
        }
    }
}

function setupGoalEventListeners() {
    // Event listeners para o modal de Meta individual
    const saveGoalButton = document.querySelector('#goalModal .save-goal');
    if (saveGoalButton) {
        saveGoalButton.addEventListener('click', (event) => {
            handleGoalSubmit(event);
        });
    }
    
    // ... existing code ...
}