-- SQL para criar um sistema completo de cartões de crédito
-- Inclui gerenciamento de despesas e parcelas

-- Remover tabelas existentes (se necessário)
DROP TABLE IF EXISTS credit_card_installments;
DROP TABLE IF EXISTS credit_card_expenses;
DROP TABLE IF EXISTS credit_cards;

-- Tabela de cartões de crédito
CREATE TABLE credit_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    bank TEXT NOT NULL,
    brand TEXT NOT NULL,
    "limit" NUMERIC(12,2) NOT NULL,
    due_day INTEGER NOT NULL CHECK (due_day >= 1 AND due_day <= 31),
    color TEXT,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de despesas/transações vinculadas ao cartão
CREATE TABLE credit_card_expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    card_id UUID NOT NULL REFERENCES credit_cards(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    transaction_date DATE NOT NULL,
    installment_total INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Nova tabela para gerenciar parcelas individuais
CREATE TABLE credit_card_installments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expense_id UUID NOT NULL REFERENCES credit_card_expenses(id) ON DELETE CASCADE,
    installment_number INTEGER NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    due_date DATE NOT NULL,
    is_paid BOOLEAN DEFAULT FALSE,
    paid_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(expense_id, installment_number)
);

-- Índices para performance
CREATE INDEX idx_credit_cards_user ON credit_cards(user_id);
CREATE INDEX idx_expenses_card ON credit_card_expenses(card_id);
CREATE INDEX idx_installment_expense ON credit_card_installments(expense_id);
CREATE INDEX idx_installment_paid ON credit_card_installments(is_paid);

-- Habilitar RLS
ALTER TABLE credit_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_card_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_card_installments ENABLE ROW LEVEL SECURITY;

-- Políticas para credit_cards
CREATE POLICY "select_own_credit_cards"
ON credit_cards FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "insert_own_credit_cards"
ON credit_cards FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "update_own_credit_cards"
ON credit_cards FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "delete_own_credit_cards"
ON credit_cards FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Políticas para credit_card_expenses
CREATE POLICY "select_own_card_expenses"
ON credit_card_expenses FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "insert_own_card_expenses"
ON credit_card_expenses FOR INSERT
TO authenticated
WITH CHECK (
    user_id = auth.uid()
    AND card_id IN (SELECT id FROM credit_cards WHERE user_id = auth.uid())
);

CREATE POLICY "update_own_card_expenses"
ON credit_card_expenses FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "delete_own_card_expenses"
ON credit_card_expenses FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Políticas para credit_card_installments
CREATE POLICY "select_own_card_installments"
ON credit_card_installments FOR SELECT
TO authenticated
USING (expense_id IN (
    SELECT id FROM credit_card_expenses WHERE user_id = auth.uid()
));

CREATE POLICY "insert_own_card_installments"
ON credit_card_installments FOR INSERT
TO authenticated
WITH CHECK (expense_id IN (
    SELECT id FROM credit_card_expenses WHERE user_id = auth.uid()
));

CREATE POLICY "update_own_card_installments"
ON credit_card_installments FOR UPDATE
TO authenticated
USING (expense_id IN (
    SELECT id FROM credit_card_expenses WHERE user_id = auth.uid()
));

CREATE POLICY "delete_own_card_installments"
ON credit_card_installments FOR DELETE
TO authenticated
USING (expense_id IN (
    SELECT id FROM credit_card_expenses WHERE user_id = auth.uid()
));

-- View para histórico completo de despesas e parcelas
CREATE OR REPLACE VIEW credit_card_expense_view AS
SELECT
    c.id AS card_id,
    c.name AS card_name,
    c.bank,
    c.brand,
    c.limit,
    c.due_day,
    e.id AS expense_id,
    e.description,
    e.amount AS total_amount,
    e.transaction_date,
    e.installment_total,
    i.id AS installment_id,
    i.installment_number,
    i.amount AS installment_amount,
    i.due_date,
    i.is_paid,
    i.paid_date
FROM credit_cards c
JOIN credit_card_expenses e ON c.id = e.card_id
JOIN credit_card_installments i ON e.id = i.expense_id
WHERE c.user_id = auth.uid();

-- Função para calcular o saldo usado de um cartão
CREATE OR REPLACE FUNCTION get_card_used_amount(card_uuid UUID) 
RETURNS NUMERIC AS $$
DECLARE
    total_used NUMERIC(12,2);
BEGIN
    SELECT COALESCE(SUM(i.amount), 0) INTO total_used
    FROM credit_card_installments i
    JOIN credit_card_expenses e ON i.expense_id = e.id
    WHERE e.card_id = card_uuid AND i.is_paid = FALSE;
    
    RETURN total_used;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar automaticamente parcelas quando uma despesa é inserida
CREATE OR REPLACE FUNCTION create_installments_trigger()
RETURNS TRIGGER AS $$
DECLARE
    i INTEGER;
    installment_amt NUMERIC(12,2);
    due_date DATE;
    card_due_day INTEGER;
BEGIN
    -- Obter o dia de vencimento do cartão
    SELECT due_day INTO card_due_day
    FROM credit_cards
    WHERE id = NEW.card_id;

    -- Calcular o valor de cada parcela
    installment_amt := NEW.amount / NEW.installment_total;
    
    -- Para cada parcela, criar um registro na tabela de parcelas
    FOR i IN 1..NEW.installment_total LOOP
        -- Calcular a data de vencimento (mesma data do mês seguinte)
        due_date := NEW.transaction_date + ((i - 1) || ' months')::INTERVAL;
        
        -- Ajustar para o dia de vencimento do cartão
        due_date := date_trunc('month', due_date) + ((card_due_day - 1) || ' days')::INTERVAL;
        
        -- Inserir a parcela
        INSERT INTO credit_card_installments (
            expense_id, 
            installment_number, 
            amount, 
            due_date, 
            is_paid
        ) VALUES (
            NEW.id,
            i,
            installment_amt,
            due_date,
            FALSE
        );
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_installments_after_expense
AFTER INSERT ON credit_card_expenses
FOR EACH ROW
EXECUTE FUNCTION create_installments_trigger();

-- Função auxiliar para atualizar o timestamp 'updated_at'
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar o timestamp
CREATE TRIGGER update_credit_cards_timestamp
BEFORE UPDATE ON credit_cards
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_credit_card_expenses_timestamp
BEFORE UPDATE ON credit_card_expenses
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_credit_card_installments_timestamp
BEFORE UPDATE ON credit_card_installments
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
