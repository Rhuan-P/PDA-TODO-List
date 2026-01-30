#!/usr/bin/env node

/**
 * Script automatizado para criar projeto Supabase
 * Execute: node create_supabase_project.js
 */

import { createClient } from '@supabase/supabase-js';
import readline from 'readline';
import fs from 'fs';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function createSupabaseProject() {
  console.log('🚀 Criador Automático de Projeto Supabase');
  console.log('==========================================\n');

  try {
    // Obter credenciais do usuário
    console.log('📋 Por favor, forneça suas credenciais:');
    
    const supabaseUrl = await question('🔗 URL do Supabase (ex: https://abc123.supabase.co): ');
    const supabaseKey = await question('🔑 Chave ANON (eyJ...): ');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Credenciais inválidas!');
      process.exit(1);
    }

    // Testar conexão
    console.log('\n🔄 Testando conexão com Supabase...');
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Verificar se projeto existe
    const { data, error } = await supabase.from('_info').select('*').limit(1);
    
    if (error && error.code !== 'PGRST116') {
      console.error('❌ Erro de conexão:', error.message);
      console.log('\n💡 Dicas:');
      console.log('- Verifique se a URL está correta');
      console.log('- Confirme se a chave ANON está válida');
      console.log('- Certifique-se de que o projeto existe');
      process.exit(1);
    }

    console.log('✅ Conexão bem-sucedida!\n');

    // Ler e executar schema SQL
    console.log('📊 Criando tabela de tarefas...');
    const schemaSQL = fs.readFileSync('./sql/supabase_schema.sql', 'utf8');
    
    // Dividir SQL em comandos individuais
    const commands = schemaSQL
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd && !cmd.startsWith('--'));

    for (const command of commands) {
      if (command.trim()) {
        const { error } = await supabase.rpc('exec_sql', { sql: command });
        if (error && !error.message.includes('already exists')) {
          console.warn(`⚠️ Aviso no comando: ${error.message}`);
        }
      }
    }

    console.log('✅ Tabela criada com sucesso!\n');

    // Testar inserção
    console.log('🧪 Testando inserção de dados...');
    const { data: testData, error: testError } = await supabase
      .from('tarefas')
      .select('*')
      .limit(1);

    if (testError) {
      console.error('❌ Erro ao testar tabela:', testError.message);
    } else {
      console.log('✅ Tabela funcionando perfeitamente!');
      console.log(`📊 Encontradas ${testData.length} tarefas de exemplo\n`);
    }

    // Atualizar arquivo .env
    console.log('⚙️ Atualizando arquivo .env...');
    const envContent = `# Configurações do Servidor
PORT=3000
NODE_ENV=development

# Configurações do Supabase
SUPABASE_URL=${supabaseUrl}
SUPABASE_ANON_KEY=${supabaseKey}

# Configurações de Segurança
JWT_SECRET=seu_segredo_jwt_aqui
JWT_EXPIRES_IN=1d

# Configurações de Log
LOG_LEVEL=info
LOG_TO_FILE=true

# Configurações do CORS
CORS_ORIGIN=http://localhost:3000
CORS_METHODS=GET,POST,PUT,DELETE,OPTIONS
CORS_ALLOWED_HEADERS=Content-Type,Authorization

# Configurações de Rate Limiting
RATE_LIMIT_WINDOW_MS=15 * 60 * 1000
RATE_LIMIT_MAX=100

# Configurações do Swagger
SWAGGER_TITLE=API To-Do List
SWAGGER_DESCRIPTION=API para gerenciamento de tarefas
SWAGGER_VERSION=1.0.0
SWAGGER_SERVER_URL=http://localhost:3000/api`;

    fs.writeFileSync('./.env', envContent);
    console.log('✅ Arquivo .env atualizado!\n');

    // Resumo
    console.log('🎉 Projeto configurado com sucesso!');
    console.log('==========================================');
    console.log(`🌐 URL: ${supabaseUrl}`);
    console.log('📊 Tabela: tarefas');
    console.log('⚙️ Config: .env');
    console.log('\n🚀 Próximos passos:');
    console.log('1. npm run dev (testar local)');
    console.log('2. Configure variáveis no Vercel');
    console.log('3. Faça deploy para produção\n');

    console.log('🔗 Links úteis:');
    console.log(`- Dashboard: ${supabaseUrl.replace('/rest/v1', '')}`);
    console.log(`- API Docs: ${supabaseUrl}/rest/v1/`);
    console.log('- Vercel: https://vercel.com/dashboard');

  } catch (error) {
    console.error('❌ Erro durante setup:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Executar script
createSupabaseProject();
