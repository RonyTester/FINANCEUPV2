# FinanceUP - Controle Financeiro Pessoal

AplicaÃ§Ã£o web moderna para controle de finanÃ§as pessoais, construÃ­da com JavaScript e Supabase.

## Nova Estrutura de DiretÃ³rios

O projeto foi reorganizado seguindo boas prÃ¡ticas de separaÃ§Ã£o entre frontend e backend:

### Frontend
- `src/frontend/pages` - PÃ¡ginas HTML
- `src/frontend/styles` - Arquivos CSS
- `src/frontend/scripts` - Scripts JavaScript
- `src/frontend/components` - Componentes reutilizÃ¡veis
- `src/frontend/assets` - Imagens e outros recursos

### Backend
- `src/backend/controllers` - Controladores da API
- `src/backend/routes` - Rotas da API
- `src/backend/models` - Modelos de dados
- `src/backend/config` - ConfiguraÃ§Ãµes
- `src/backend/middlewares` - Middlewares
- `src/backend/services` - ServiÃ§os

## ðŸš€ Funcionalidades

- âœ¨ Interface moderna e responsiva
- ðŸ” AutenticaÃ§Ã£o segura de usuÃ¡rios
- ðŸ'° Gerenciamento de receitas e despesas
- ðŸ"Š GrÃ¡ficos e anÃ¡lises financeiras
- ðŸ" Tema claro/escuro
- ðŸ'± Suporte a mÃºltiplas moedas
- ðŸ" Sistema de paginaÃ§Ã£o para transaÃ§Ãµes

## ðŸ› ï¸ Tecnologias

- HTML5, CSS3 e JavaScript
- [Supabase](https://supabase.com/) - Backend e AutenticaÃ§Ã£o
- [Chart.js](https://www.chartjs.org/) - GrÃ¡ficos
- [Font Awesome](https://fontawesome.com/) - Ã­cones
- [Express](https://expressjs.com/) - Servidor Node.js

## âš™ï¸ InstalaÃ§Ã£o

1. Clone o repositÃ³rio
2. Instale as dependÃªncias:
```bash
npm install
```

3. Configure as variÃ¡veis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto
   - Adicione suas credenciais do Supabase:
```env
SUPABASE_URL=sua_url_do_supabase
SUPABASE_KEY=sua_chave_do_supabase
DATABASE_URL=sua_url_do_banco
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Executando em produÃ§Ã£o

```bash
npm start
```

## ðŸ" ConfiguraÃ§Ã£o do Banco de Dados

Execute os seguintes scripts SQL no seu projeto Supabase:

1. Tabela de TransaÃ§Ãµes:
```sql
create table transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users,
  description text not null,
  amount decimal not null,
  type text not null,
  category text not null,
  date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  
  constraint positive_amount check (amount != 0),
  constraint valid_type check (type in ('income', 'expense'))
);

-- Habilitar RLS
alter table transactions enable row level security;

-- Criar polÃ­tica de acesso
create policy "UsuÃ¡rios podem gerenciar apenas suas prÃ³prias transaÃ§Ãµes"
on transactions for all
using (auth.uid() = user_id);
```

2. Tabela de ConfiguraÃ§Ãµes do UsuÃ¡rio:
```sql
create table user_settings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users unique,
  currency text default 'BRL',
  theme text default 'light',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  
  constraint valid_currency check (currency in ('BRL', 'USD', 'EUR')),
  constraint valid_theme check (theme in ('light', 'dark'))
);

-- Habilitar RLS
alter table user_settings enable row level security;

-- Criar polÃ­tica de acesso
create policy "UsuÃ¡rios podem gerenciar apenas suas prÃ³prias configuraÃ§Ãµes"
on user_settings for all
using (auth.uid() = user_id);
```

## ðŸ" Screenshots

[Adicione screenshots do seu aplicativo aqui]

## ðŸ¤ Contribuindo

ContribuiÃ§Ãµes sÃ£o sempre bem-vindas! Por favor, leia o [guia de contribuiÃ§Ã£o](CONTRIBUTING.md) primeiro.

1. FaÃ§a um fork do projeto
2. Crie sua branch de feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanÃ§as (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## ðŸ" LicenÃ§a

Este projeto estÃ¡ sob a licenÃ§a MIT - veja o arquivo [LICENSE.md](LICENSE.md) para detalhes.

## ðŸ' Agradecimentos

- [Supabase](https://supabase.com/) - Por fornecer uma excelente plataforma de backend
- [Chart.js](https://www.chartjs.org/) - Pela biblioteca de grÃ¡ficos
- [Font Awesome](https://fontawesome.com/) - Pelos Ã­cones incrÃ­veis

## ðŸ" Contato

Seu Nome - [@seu_twitter](https://twitter.com/seu_twitter) - seu_email@email.com

Link do Projeto: [https://github.com/seu-usuario/finance](https://github.com/seu-usuario/finance)


depois
Quando terminar todas as alteraÃ§Ãµes e quiser mesclar com a branch principal:
1. VÃ¡ para o GitHub no navegador
Crie um "Pull Request"
Revise as mudanÃ§as
FaÃ§a o merge
Quer comeÃ§ar a fazer alguma alteraÃ§Ã£o especÃ­fica na branch? Posso te ajudar com isso!


