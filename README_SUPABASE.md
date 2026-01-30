# Migração para Supabase - Guia Rápido

## 🚀 Passos para Configurar

### 1. Criar Projeto Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Faça login com sua conta
3. Clique em "New Project"
4. Escolha uma organização
5. Dê um nome ao projeto (ex: `pda-todo-list`)
6. Defina uma senha forte
7. Selecione a região mais próxima
8. Aguarde o projeto ser criado (2-3 minutos)

### 2. Configurar Tabela no Supabase
1. No dashboard do seu projeto, vá para "SQL Editor"
2. Clique em "New query"
3. Copie e cole o conteúdo do arquivo `sql/supabase_schema.sql`
4. Clique em "Run" para executar

### 3. Obter Credenciais
1. No dashboard, vá para "Project Settings" (ícone de engrenagem)
2. Vá para "API"
3. Copie:
   - **Project URL**: `https://seu-projeto-id.supabase.co`
   - **anon public key**: Chave longa que começa com `eyJ...`

### 4. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:

```bash
# Copie do .env.example
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
# Configurações do Supabase
SUPABASE_URL=https://seu-projeto-id.supabase.co
SUPABASE_ANON_KEY=eyJ...sua_chave_aqui
```

### 5. Testar Localmente
```bash
# Instalar dependências
npm install

# Iniciar servidor
npm run dev
```

### 6. Deploy no Vercel
1. Configure as variáveis de ambiente no Vercel Dashboard
2. Faça push das mudanças
3. Deploy automático será acionado

## 📋 Estrutura da Tabela

```sql
tarefas (
    id BIGINT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    status VARCHAR(20) DEFAULT 'pendente',
    criado_em TIMESTAMP DEFAULT NOW(),
    atualizado_em TIMESTAMP DEFAULT NOW()
)
```

## 🔧 Benefícios da Migração

✅ **Deploy funcional no Vercel**  
✅ **Banco de dados PostgreSQL robusto**  
✅ **API REST automática do Supabase**  
✅ **Real-time subscriptions**  
✅ **Backup automático**  
✅ **Escalabilidade infinita**  
✅ **Segurança com Row Level Security**

## 🚨 Importante

- Mantenha suas chaves do Supabase em segredo
- Configure RLS policies para produção
- Use variáveis de ambiente, nunca hardcode chaves
- Teste bem antes de fazer deploy

## 🆘 Suporte

Se tiver problemas:
1. Verifique as credenciais no `.env`
2. Confirme se a tabela foi criada no Supabase
3. Verifique os logs do servidor
4. Consulte a [documentação do Supabase](https://supabase.com/docs)
