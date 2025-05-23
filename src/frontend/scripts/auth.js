// Verificar autenticação ao carregar a página foi movido para o script embutido na página

// Configurar event listeners
function setupEventListeners() {
    // Alternar entre formulários
    document.querySelectorAll('[data-form]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showForm(e.target.dataset.form);
        });
    });

    // Formulários
    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
    document.getElementById('registerForm')?.addEventListener('submit', handleRegister);

    // Adicionar login social com Google via Supabase
    const googleBtn = document.getElementById('google-login-btn');
    if (googleBtn) {
        googleBtn.addEventListener('click', async () => {
            try {
                // Verificar se o cliente Supabase já foi inicializado
                if (!supabase) {
                    throw new Error('Cliente Supabase não inicializado');
                }
                
                const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: window.location.origin
                    }
                });
                if (error) throw error;
                // O redirecionamento será feito automaticamente pelo Supabase
            } catch (err) {
                alert('Erro ao fazer login com Google: ' + err.message);
            }
        });
    }
}

// Mostrar formulário específico
function showForm(formId) {
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById(formId).classList.add('active');
}

// Manipular login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorElement = document.getElementById('loginError');
    
    try {
        // Verificar se o cliente Supabase já foi inicializado
        if (!supabase) {
            throw new Error('Cliente Supabase não inicializado');
        }
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        // Redirecionar para a página principal
        window.location.href = '/';
    } catch (error) {
        errorElement.textContent = 'Erro ao fazer login: ' + error.message;
        errorElement.style.display = 'block';
    }
}

// Manipular registro
async function handleRegister(e) {
    e.preventDefault();
    
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorElement = document.getElementById('registerError');
    
    // Validar senha
    if (password !== confirmPassword) {
        errorElement.textContent = 'As senhas não coincidem';
        errorElement.style.display = 'block';
        return;
    }

    if (password.length < 6) {
        errorElement.textContent = 'A senha deve ter pelo menos 6 caracteres';
        errorElement.style.display = 'block';
        return;
    }
    
    try {
        // Verificar se o cliente Supabase já foi inicializado
        if (!supabase) {
            throw new Error('Cliente Supabase não inicializado');
        }
        
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    created_at: new Date().toISOString()
                }
            }
        });

        if (error) throw error;

        // Mostrar mensagem de sucesso
        alert('Registro realizado com sucesso! Por favor, verifique seu email para confirmar a conta.');
        showForm('loginForm');
    } catch (error) {
        errorElement.textContent = 'Erro ao registrar: ' + error.message;
        errorElement.style.display = 'block';
    }
}

// Limpar mensagens de erro ao digitar
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
        const form = input.closest('form');
        const errorElement = form.querySelector('.error-message');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    });
}); 