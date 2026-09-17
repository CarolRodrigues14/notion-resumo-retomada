const groq = require("./groqClient");

/**
 * Gera um resumo curto e motivador de onde a pessoa parou e o próximo passo,
 * a partir de uma entrada do Diário de Retomada.
 */
async function gerarResumo({ trilha, ondeParei, proximoPasso }) {
  const prompt = `Você está ajudando alguém a retomar um estudo após uma pausa.
Trilha: ${trilha}
Onde parei: ${ondeParei}
Próximo passo: ${proximoPasso}

Escreva um resumo de retomada em no máximo 2 frases, em português, tom direto e motivador,
que ajude a pessoa a voltar sem precisar reler tudo. Não use markdown, apenas texto corrido.`;

  const resposta = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
    max_completion_tokens: 500,
    reasoning_effort: "low",
  });

  return resposta.choices[0].message.content.trim();
}

module.exports = gerarResumo;
