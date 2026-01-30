import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://sua-url.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sua-chave-anon';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

// Função para validar conexão ao iniciar
export const validateSupabaseConnection = async () => {
  try {
    console.log('🔄 Validando conexão com Supabase...');
    
    // Verificar se as credenciais foram configuradas
    if (!supabaseUrl || supabaseUrl === 'https://sua-url.supabase.co') {
      throw new Error('SUPABASE_URL não configurada. Verifique o arquivo .env');
    }
    
    if (!supabaseKey || supabaseKey === 'sua-chave-anon') {
      throw new Error('SUPABASE_ANON_KEY não configurada. Verifique o arquivo .env');
    }
    
    // Testar conexão básica
    const { error } = await supabase.from('tarefas').select('id').limit(1);
    
    if (error && error.code === 'PGRST116') {
      console.warn('⚠️ Tabela "tarefas" não encontrada. Execute o SQL schema no Supabase.');
      console.log('🔗 SQL Editor: https://nexmkcseutopfnbazstb.supabase.co/project/sql');
      return { valid: true, tableExists: false };
    }
    
    if (error) {
      throw new Error(`Erro de conexão: ${error.message}`);
    }
    
    console.log('✅ Conexão com Supabase validada com sucesso!');
    return { valid: true, tableExists: true };
    
  } catch (error) {
    console.error('❌ Erro na validação do Supabase:', error.message);
    console.log('\n💡 Soluções:');
    console.log('1. Verifique se as credenciais no .env estão corretas');
    console.log('2. Confirme se o projeto Supabase existe');
    console.log('3. Execute o schema SQL para criar a tabela');
    throw error;
  }
};

export default supabase;
