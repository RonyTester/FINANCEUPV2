// Script para configurar autenticação Google no Supabase
// Este script deve ser executado no dashboard do Supabase

console.log('Configurações necessárias no Supabase Dashboard:');
console.log('');
console.log('1. Acesse: https://supabase.com/dashboard/project/jzamtjaxrxtbhzvdzqfq/auth/url-configuration');
console.log('');
console.log('2. Configure as seguintes URLs:');
console.log('   Site URL: https://finance-up.vercel.app');
console.log('');
console.log('3. Adicione as seguintes URLs adicionais de redirecionamento:');
console.log('   - https://finance-up.vercel.app/**');
console.log('   - https://*-ronytesters-projects.vercel.app/**');
console.log('   - http://localhost:3000/**');
console.log('');
console.log('4. Acesse: https://supabase.com/dashboard/project/jzamtjaxrxtbhzvdzqfq/auth/providers');
console.log('');
console.log('5. Configure o Google OAuth:');
console.log('   - Habilite o Google Provider');
console.log('   - Adicione o Client ID do Google');
console.log('   - Adicione o Client Secret do Google');
console.log('   - Configure as URLs de redirecionamento no Google Console:');
console.log('     * https://jzamtjaxrxtbhzvdzqfq.supabase.co/auth/v1/callback');
console.log('');
console.log('6. No Google Cloud Console (https://console.cloud.google.com/apis/credentials):');
console.log('   - Configure as URLs autorizadas:');
console.log('     * https://finance-up.vercel.app');
console.log('     * https://jzamtjaxrxtbhzvdzqfq.supabase.co');
console.log('   - Configure as URLs de redirecionamento:');
console.log('     * https://jzamtjaxrxtbhzvdzqfq.supabase.co/auth/v1/callback');
