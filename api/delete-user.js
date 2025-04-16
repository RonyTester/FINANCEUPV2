// Função serverless para deletar usuário do Supabase com segurança
// Coloque sua SUPABASE_SERVICE_ROLE_KEY nas variáveis de ambiente da Vercel/NODE

const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // Service Role Key (NUNCA exponha no frontend)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { userId, access_token } = req.body;

  // Verifica se o access_token realmente pertence ao userId
  const { data: user, error: userError } = await supabase.auth.getUser(access_token);
  if (userError || !user || user.user.id !== userId) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  // Deleta o usuário
  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true });
};
