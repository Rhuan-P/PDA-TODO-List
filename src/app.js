import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import tarefasRoutes from './routes/tarefas.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuração do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API To-Do List',
      version: '1.0.0',
      description: 'API para gerenciamento de tarefas com CRUD completo',
      contact: {
        name: 'Suporte',
        email: 'suporte@exemplo.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Token de acesso inválido ou expirado',
        },
        BadRequest: {
          description: 'Dados inválidos fornecidos',
        },
        NotFound: {
          description: 'Recurso não encontrado',
        },
        ServerError: {
          description: 'Erro interno do servidor',
        }
      }
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware para log de requisições
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Rotas da API
app.use('/api/tarefas', tarefasRoutes);

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Rota de boas-vindas
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bem-vindo à API To-Do List',
    docs: '/api-docs',
    endpoints: {
      tarefas: '/api/tarefas',
      docs: '/api-docs'
    }
  });
});

// Middleware para rotas não encontradas
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    message: `A rota ${req.originalUrl} não existe`,
  });
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Erro:`, err.stack);
  
  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.status(statusCode).json({
    error: err.name || 'Erro interno do servidor',
    message: isProduction && statusCode === 500 ? 'Ocorreu um erro inesperado' : err.message,
    ...(!isProduction && { stack: err.stack }),
  });
});

export default app;
