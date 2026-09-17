const notion = require("./notionClient");

/**
 * Busca uma tarefa ABERTA (Status ≠ Done) da mesma trilha E mesmo texto
 * de tarefa na Matriz (evita duplicar a mesma tarefa reaparecendo, mas deixa
 * tarefas diferentes da mesma trilha coexistirem).
 * Retorna o ID da página se encontrar, ou null.
 */
async function buscarTarefaAberta(trilha, tarefa) {
  const resposta = await notion.dataSources.query({
    data_source_id: process.env.MATRIZ_DATA_SOURCE_ID,
    filter: {
      and: [
        { property: "Trilha", select: { equals: trilha } },
        { property: "Tarefa", title: { equals: tarefa } },
        { property: "Status", status: { does_not_equal: "Done" } },
      ],
    },
  });

  return resposta.results.length > 0 ? resposta.results[0].id : null;
}

/**
 * Cria uma nova linha na Matriz de Eisenhower.
 */
async function criarTarefaMatriz({ tarefa, trilha, urgente, importante, quadrante }) {
  await notion.pages.create({
    parent: { data_source_id: process.env.MATRIZ_DATA_SOURCE_ID },
    properties: {
      "Tarefa": { title: [{ text: { content: tarefa } }] },
      "Trilha": { select: { name: trilha } },
      "Urgente": { checkbox: urgente },
      "Importante": { checkbox: importante },
      "Quadrante": { select: { name: quadrante } },
      "Status": { status: { name: "Not started" } },
    },
  });
}

/**
 * Atualiza uma linha existente na Matriz de Eisenhower.
 */
async function atualizarTarefaMatriz(pageId, { tarefa, urgente, importante, quadrante }) {
  await notion.pages.update({
    page_id: pageId,
    properties: {
      "Tarefa": { title: [{ text: { content: tarefa } }] },
      "Urgente": { checkbox: urgente },
      "Importante": { checkbox: importante },
      "Quadrante": { select: { name: quadrante } },
    },
  });
}

/**
 * Cria ou atualiza, dependendo se já existe uma tarefa aberta igual.
 */
async function criarOuAtualizarNaMatriz(classificacao, trilha) {
  const idExistente = await buscarTarefaAberta(trilha, classificacao.tarefa);

  if (idExistente) {
    await atualizarTarefaMatriz(idExistente, classificacao);
    return "atualizada";
  } else {
    await criarTarefaMatriz({ ...classificacao, trilha });
    return "criada";
  }
}

module.exports = { criarOuAtualizarNaMatriz };
