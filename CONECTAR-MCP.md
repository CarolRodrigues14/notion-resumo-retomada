# Conectando o servidor MCP ao Claude Desktop

## 1. Instale o Claude Desktop (se ainda não tiver)
https://claude.ai/download

## 2. Abra o arquivo de configuração
No Claude Desktop: **Settings → Developer → Edit Config**

## 3. Adicione a configuração do servidor

```json
{
  "mcpServers": {
    "sistema-operacional-pessoal": {
      "command": "node",
      "args": ["C:\\Users\\Fernanda\\Desktop\\notion-resumo-retomada\\mcp-server.js"],
      "env": {
        "NOTION_TOKEN": "seu_token_aqui",
        "MATRIZ_DATA_SOURCE_ID": "7c7bfe4a-a155-404a-b194-75d70bb582b0",
        "DIARIO_DATA_SOURCE_ID": "554b2fe3-8c1d-4d5e-b351-cdc4437fcbb0",
        "TAREFAS_DATA_SOURCE_ID": "5ea53857-90da-4ba1-9726-e5ac02217e51"
      }
    }
  }
}
```

Se o arquivo já tiver outras configurações, mantenha-as e apenas adicione
a chave `mcpServers` ao lado delas.

## 4. Reinicie o Claude Desktop completamente

## 5. Teste
Numa conversa nova, pergunte:
- "Quais são minhas prioridades agora?"
- "Como foi minha semana de produtividade?"
- "Qual o próximo horário livre pra estudar Dev Web?"
