# Colocando o agente pra rodar sozinho (GitHub Actions)

## 1. Criar o repositório no GitHub
1. Acesse github.com/CarolRodrigues14 → **New repository**
2. Nome sugerido: `notion-resumo-retomada`
3. Não marque "Add README" (já temos um)

## 2. Subir o código
No terminal, dentro da pasta do projeto:
```bash
git init
git add .
git commit -m "Agente de automação do Sistema Operacional Pessoal"
git branch -M main
git remote add origin https://github.com/CarolRodrigues14/notion-resumo-retomada.git
git push -u origin main
```

O `.env` **não vai subir** (protegido pelo `.gitignore`) — confirme olhando
a lista de arquivos no GitHub: deve aparecer só o `.env.example`.

## 3. Cadastrar as chaves como Secrets
No repositório: **Settings → Secrets and variables → Actions** →
**New repository secret**, criando um por um:
- `NOTION_TOKEN`
- `GROQ_API_KEY`
- `DIARIO_DATA_SOURCE_ID`
- `MATRIZ_DATA_SOURCE_ID`
- `TAREFAS_DATA_SOURCE_ID`

(os valores são os mesmos do seu `.env` local)

## 4. Testar
1. Aba **Actions** do repositório
2. "Agente Diário - Sistema Operacional Pessoal"
3. **Run workflow** (botão manual)
4. Se der certo, aparece um ✔ verde

## 5. Pronto
Agora o agente roda sozinho todo dia às 06:00 (horário de Brasília).
Você só registra a retomada no Diário e o resto acontece automaticamente.
