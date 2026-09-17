const notion = require("./notionClient");
const { PERIODOS } = require("./disponibilidade");

/**
 * Descobre em qual período (manhã/tarde/noite) uma hora "HH:MM" cai.
 */
function horaParaPeriodo(horaStr) {
  for (const [nome, faixa] of Object.entries(PERIODOS)) {
    if (horaStr >= faixa.inicio && horaStr < faixa.fim) return nome;
  }
  return null;
}

/**
 * Busca todos os blocos já planejados e retorna um Set de chaves "YYYY-MM-DD|periodo".
 */
async function buscarBlocosOcupados() {
  const resposta = await notion.dataSources.query({
    data_source_id: process.env.TAREFAS_DATA_SOURCE_ID,
    filter: {
      property: "Bloco planejado",
      date: { is_not_empty: true },
    },
  });

  const ocupados = new Set();

  resposta.results.forEach((pagina) => {
    const dataProp = pagina.properties["Bloco planejado"]?.date;
    if (!dataProp?.start) return;

    const [dataStr, horaCompleta] = dataProp.start.split("T");
    const hora = horaCompleta ? horaCompleta.slice(0, 5) : PERIODOS.manhã.inicio;
    const periodo = horaParaPeriodo(hora);

    if (periodo) ocupados.add(`${dataStr}|${periodo}`);
  });

  return ocupados;
}

/**
 * Cria uma nova linha em Tarefas Reformuladas com o bloco sugerido.
 */
async function criarBlocoSugerido({ tarefa, trilha, data, horario }) {
  await notion.pages.create({
    parent: { data_source_id: process.env.TAREFAS_DATA_SOURCE_ID },
    properties: {
      "Tarefa mensurável": { title: [{ text: { content: tarefa } }] },
      "Trilha": { select: { name: trilha } },
      "Tempo estimado (min)": { number: 60 },
      "Bloco planejado": { date: { start: `${data}T${horario}:00` } },
      "Concluída": { checkbox: false },
    },
  });
}

module.exports = { buscarBlocosOcupados, criarBlocoSugerido };
