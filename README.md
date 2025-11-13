# 📋 TaskFlow API

API RESTful para gerenciamento de tarefas, desenvolvida com Node.js, Express e SQLite. 

Oferece endpoints completos para operações CRUD, validação de dados e documentação interativa via Swagger.

## 🛠️ Funcionalidades

- **CRUD de Tarefas** - Create, Read, Update, Delete com validação
- **Filtros** - Busca por status, prioridade e data
- **Swagger UI** - Teste os endpoints em `/api-docs`
- **Multi-ambiente** - Configs para dev e prod
- **Tratamento de erros** - Padrão REST
- **SQLite** - Banco de dados simples e rápido
- **Variáveis de ambiente** - Fácil configuração

### 📋 Requisitos
- Node.js 14+ (com npm incluso)
- SQLite3 (já incluso nas dependências)

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 14+
- npm ou yarn
- SQLite3 (incluído nas dependências)

### Instalação

1. **Clonar o repositório**
   ```bash
   git clone https://github.com/Rhuan-P/PDA-TODO-List.git
   cd PDA-TODO-List
   ```

2. **Instalar dependências**
   ```bash
   npm install
   # ou
   yarn
   ```

3. **Configuração do Ambiente**
   
   O arquivo `.env` é opcional, mas recomendado para personalizações. O sistema usa valores padrão se o arquivo não existir.
   
   ```bash
   # Copie o arquivo de exemplo
   cp .env.example .env
   ```
   
   ⚙️ **Variáveis disponíveis** (todas opcionais):
   - `PORT`: Porta do servidor (padrão: 3000)
   - `NODE_ENV`: Ambiente de execução (development/production)
   - `DB_STORAGE`: Caminho do arquivo do SQLite (padrão: `./database.sqlite`)
   - `API_BASE_URL`: URL base da API (usada no Swagger)
   
   > 💡 Dica: Para desenvolvimento local, você pode usar o `.env.example` como está.

4. **Iniciar o servidor**
   - Modo desenvolvimento (com hot-reload):
     ```bash
     npm run dev
     ```
   - Modo produção:
     ```bash
     npm start
     ```

5. **Acessar documentação**
   - API Docs: `http://localhost:3000/api-docs`
   - Endpoint base: `http://localhost:3000/api`

## 🚦 Executando o Projeto

### 1. Inicialize o banco de dados
O banco de dados será criado automaticamente na primeira execução do servidor.

### 2. Inicie o servidor

#### Modo Desenvolvimento
```bash
npm run dev
```

#### Modo Produção
```bash
npm start
```

A API estará disponível em `http://localhost:3000`

## 📚 Documentação da API

Acesse a documentação interativa em:
- Swagger UI: `http://localhost:3000/api-docs`

## 🎯 Endpoints

### Tarefas
- `GET /api/tarefas` - Lista todas as tarefas (com filtros opcionais)
  - Filtros: `?status=pendente&prioridade=alta`
- `POST /api/tarefas` - Cria uma nova tarefa
  - Exemplo de corpo:
    ```json
    {
      "titulo": "Minha Tarefa",
      "descricao": "Descrição detalhada",
      "status": "pendente",
      "data_limite": "2025-12-31T23:59:59.000Z",
      "prioridade": "media",
      "categoria": "Trabalho"
    }
    ```
- `GET /api/tarefas/:id` - Busca uma tarefa por ID
- `PUT /api/tarefas/:id` - Atualiza uma tarefa existente
- `DELETE /api/tarefas/:id` - Remove uma tarefa

### Health Check
- `GET /api/health` - Verifica o status da API

## 📅 Formatos de Data

Todas as datas devem seguir o padrão ISO 8601:
- Formato: `YYYY-MM-DDTHH:MM:SS.sssZ`
- Exemplo: `2025-12-31T23:59:59.000Z`

## 🧪 Dados Iniciais

O banco de dados é inicializado com 4 tarefas de exemplo:
1. Configurar ambiente de desenvolvimento (Alta prioridade)
2. Criar documentação da API (Média prioridade)
3. Implementar testes automatizados (Alta prioridade)
4. Revisar código (Baixa prioridade)

## 🔧 Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `PORT` | Porta do servidor | `3000` |
| `NODE_ENV` | Ambiente de execução | `development` |
| `DB_STORAGE` | Caminho do arquivo do SQLite | `./database.sqlite` |
| `API_BASE_URL` | URL base da API | `http://localhost:3000` |
| `CORS_ORIGIN` | Origens permitidas pelo CORS | `*` |
| `CORS_METHODS` | Métodos HTTP permitidos | `GET,POST,PUT,DELETE,OPTIONS` |

## 🤝 Como Contribuir

Contribuições são bem-vindas! Siga estes passos para contribuir com o projeto:

1. **Faça um Fork** do repositório
2. **Crie uma branch** para sua feature:
   ```bash
   git checkout -b feature/nova-funcionalidade
   ```
3. **Faça commit** das suas alterações:
   ```bash
   git commit -m 'feat: adiciona nova funcionalidade'
   ```
4. **Envie as alterações** para o repositório remoto:
   ```bash
   git push origin feature/nova-funcionalidade
   ```
5. **Abra um Pull Request** descrevendo suas alterações

### Padrões de Commit
- `feat:` para novas funcionalidades
- `fix:` para correções de bugs
- `docs:` para atualizações na documentação
- `style:` para formatação de código
- `refactor:` para mudanças que não corrigem bugs nem adicionam funcionalidades
- `test:` para adicionar ou corrigir testes

## 📄 Licença

Distribuído sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para obter mais informações.

---

<div align="center">
  <p>Desenvolvido por <strong>Rhuan Pablo</strong></p>
  <p>
    <a href="https://github.com/Rhuan-P" target="_blank">GitHub</a> • 
    <a href="https://www.linkedin.com/in/Rhuan-P/" target="_blank">LinkedIn</a>
  </p>
</div>
