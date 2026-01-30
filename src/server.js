import app from './app.js';
import { validateSupabaseConnection } from './config/supabase.js';

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Configuração de shutdown gracioso
const shutdown = async (server, options = { coredump: false, timeout: 500 }) => {
  // Função de saída com falha
  const exit = (code) => {
    options.coredump ? process.abort() : process.exit(code);
  };

  // Encerra as conexões do banco de dados
  const closeDatabase = async () => {
    try {
      console.log('✅ Conexão com o Supabase encerrada');
    } catch (error) {
      console.error('❌ Erro ao encerrar conexão com o Supabase:', error);
    }
  };

  // Encerra o servidor HTTP
  const closeHttpServer = () => {
    if (!server) return Promise.resolve();
    
    return new Promise((resolve) => {
      console.log('🛑 Encerrando servidor HTTP...');
      server.close(() => {
        console.log('✅ Servidor HTTP encerrado');
        resolve();
      });

      // Força o encerramento após o tempo limite
      setTimeout(() => {
        console.warn('⚠️ Forçando encerramento do servidor HTTP...');
        resolve();
      }, options.timeout).unref();
    });
  };

  try {
    console.log('\n🚦 Iniciando desligamento gracioso...');
    
    // Fecha o servidor HTTP e o banco de dados em paralelo
    await Promise.all([
      closeHttpServer(),
      closeDatabase()
    ]);
    
    console.log('👋 Tchau!');
    exit(0);
  } catch (error) {
    console.error('❌ Erro durante o desligamento gracioso:', error);
    exit(1);
  }
};

// Inicialização do servidor
const startServer = async () => {
  try {
    // Validar conexão com Supabase antes de iniciar
    await validateSupabaseConnection();
    
    // Iniciar o servidor
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
      console.log(`📚 Documentação da API: http://localhost:${PORT}/api-docs`);
      console.log(`🌍 Ambiente: ${NODE_ENV}`);
      console.log('🛑 Use Ctrl+C para encerrar o servidor\n');
    });

    // Configurar manipuladores de eventos para encerramento gracioso
    const exitHandler = async (signal) => {
      console.log(`\n⚠️ Recebido sinal ${signal}. Encerrando graciosamente...`);
      await shutdown(server, { timeout: 10000 });
    };

    // Captura os eventos de encerramento
    process.on('SIGINT', () => exitHandler('SIGINT'));
    process.on('SIGTERM', () => exitHandler('SIGTERM'));
    
    // Captura exceções e rejeições não tratadas
    process.on('uncaughtException', async (error) => {
      console.error('\n❌ Exceção não tratada:', error);
      await shutdown(server, { timeout: 10000 });
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('\n❌ Rejeição não tratada em:', promise, '\nRazão:', reason);
    });

    // Captura avisos de rejeição não tratada
    process.on('warning', (warning) => {
      console.warn('\n⚠️ Aviso do Node.js:', warning.name);
      console.warn(warning.message);
      console.warn('Stack:', warning.stack);
    });

    return server;
  } catch (error) {
    console.error('❌ Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
};

// Iniciar a aplicação
startServer();
