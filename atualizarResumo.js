const notion = require("./notionClient");

/**
 * Escreve o texto do resumo no campo "Resumo IA" da página informada.
 */
async function atualizarResumo(pageId, textoResumo) {
  await notion.pages.update({
    page_id: pageId,
    properties: {
      "Resumo IA": {
        rich_text: [{ text: { content: textoResumo } }],
      },
    },
  });
}

module.exports = atualizarResumo;
