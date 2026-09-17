# Agente de Retomada — Sistema Operacional Pessoal

Agente de IA que lê o Diário de Retomada no Notion e, para cada entrada nova:
1. gera um resumo de retomada (via Groq),
2. classifica a tarefa na Matriz de Eisenhower,
3. sugere um bloco de horário livre.

## Como rodar

1. Extraia este zip numa pasta
2. Abra o terminal nessa pasta e rode:
   ```
   npm install
   ```
3. Copie `.env.example` para um novo arquivo chamado `.env` e cole suas chaves reais
4. Rode:
   ```
   node index.js
   ```

## Arquivos

- `notionClient.js` / `groqClient.js` — configuram as conexões
- `buscarPendentes.js` — busca entradas sem resumo
- `gerarResumo.js` — passo 1 (resumo com IA)
- `atualizarResumo.js` — escreve o resumo de volta no Notion
- `classificarTarefa.js` — passo 2 (classificação urgente/importante)
- `matrizNotion.js` — cria/atualiza na Matriz de Eisenhower
- `disponibilidade.js` — grade de horários fixos
- `encontrarHorario.js` / `tarefasNotion.js` — passo 3 (sugestão de bloco)
- `index.js` — roda os 3 passos em sequência
- `mcp-server.js` — servidor MCP (ver CONECTAR-MCP.md)
- `.github/workflows/agente-diario.yml` — automação diária (ver GITHUB-ACTIONS.md)
