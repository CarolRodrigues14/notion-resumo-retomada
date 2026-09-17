const notion = require("./notionClient");

/**
 * Busca todas as páginas do Diário de Retomada onde "Resumo IA" está vazio.
 * Retorna um array simplificado, já extraindo só o que a gente precisa.
 */
async function buscarEntradasPendentes() {
  const dataSourceId = process.env.DIARIO_DATA_SOURCE_ID;

  const resposta = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: {
      property: "Resumo IA",
      rich_text: { is_empty: true },
    },
  });

  return resposta.results.map((pagina) => {
    const props = pagina.properties;
    return {
      pageId: pagina.id,
      trilha: props["Trilha"]?.select?.name ?? null,
      ondeParei: props["Onde parei"]?.rich_text?.[0]?.plain_text ?? "",
      proximoPasso: props["Próximo passo"]?.rich_text?.[0]?.plain_text ?? "",
    };
  });
}

module.exports = buscarEntradasPendentes;
