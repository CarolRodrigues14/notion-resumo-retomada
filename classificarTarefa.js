const groq = require("./groqClient");

/**
 * Classifica a tarefa do próximo passo na Matriz de Eisenhower e sugere um
 * título mensurável (reformulado a partir do texto vago do diário).
 * Retorna: { tarefa, urgente, importante, quadrante }
 */
async function classificarTarefa({ trilha, ondeParei, proximoPasso }) {
  const prompt = `Você organiza tarefas numa Matriz de Eisenhower (urgente x importante).

Trilha: ${trilha}
Onde parei: ${ondeParei}
Próximo passo: ${proximoPasso}

Responda APENAS com um JSON no formato exato abaixo, sem texto antes ou depois:
{
  "tarefa": "versão curta e mensurável do próximo passo, começando com um verbo (ex: 'Fazer 1 exercício de useEffect')",
  "urgente": true ou false,
  "importante": true ou false
}

Considere: tarefas de trilhas com prazo formal (ex: Graduação) tendem a ser mais urgentes.
Tarefas que constroem uma habilidade de longo prazo (ex: Dev Web) tendem a ser importantes mas nem sempre urgentes.`;

  const resposta = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    max_completion_tokens: 500,
    reasoning_effort: "low",
    response_format: { type: "json_object" },
  });

  const resultado = JSON.parse(resposta.choices[0].message.content);

  const quadrante =
    resultado.urgente && resultado.importante
      ? "1. Fazer agora"
      : !resultado.urgente && resultado.importante
      ? "2. Planejar"
      : resultado.urgente && !resultado.importante
      ? "3. Delegar"
      : "4. Eliminar";

  return { ...resultado, quadrante };
}

module.exports = classificarTarefa;
