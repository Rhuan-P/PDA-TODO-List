# 🤖 Setup Automatizado Supabase

## Método 1: Script Automatizado (Recomendado)

### Passo 1 - Criar Projeto Manual (2 min)
1. Acesse: **https://supabase.com**
2. Login → **New Project** → `pda-todo-list`
3. Aguarde criação (2-3 minutos)

### Passo 2 - Obter Credenciais (30 seg)
1. **Project Settings** → **API**
2. Copie **Project URL** e **anon public key**

### Passo 3 - Executar Script (1 min)
```bash
node create_supabase_project.js
```

O script irá:
- ✅ Testar conexão com Supabase
- ✅ Criar tabela `tarefas` automaticamente
- ✅ Inserir dados de exemplo
- ✅ Atualizar arquivo `.env`
- ✅ Testar funcionamento

### Passo 4 - Testar Local (30 seg)
```bash
npm run dev
```

### Passo 5 - Deploy Vercel (1 min)
1. Dashboard Vercel → **Environment Variables**
2. Adicione `SUPABASE_URL` e `SUPABASE_ANON_KEY`
3. Deploy automático!

---

## Método 2: Manual Tradicional

Se preferir o método manual, siga `setup_supabase.md`

---

## 🎯 Vantagens do Script

- ⚡ **Mais rápido** - Automatiza tudo
- 🛡️ **Mais seguro** - Valida credenciais
- 🧪 **Testa tudo** - Verifica funcionamento
- 📝 **Gera logs** - Mostra cada passo

## 🔧 Se o Script Falhar

1. Verifique se as credenciais estão corretas
2. Confirme se o projeto Supabase existe
3. Use o método manual como fallback

## 📊 Tempo Total

- **Script:** ~5 minutos
- **Manual:** ~8 minutos

**Execute o script agora:** `node create_supabase_project.js` 🚀
