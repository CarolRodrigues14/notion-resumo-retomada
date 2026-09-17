const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { z } = require("zod");
const notion = require("./notionClient");
const { encontrarProximoHorario } = require("./encontrarHorario");
const { buscarBlocosOcupados } = require("./tarefasNotion");

const server = new McpServer({
  name: "sistema-operacional-pessoal",
  version: "1.0.0",
});

// Ferramenta 1: listar prioridades (quadrante "Fazer agora")
server.tool(
  "listar_prioridades",
  "Lista as tarefas mais urgentes e importantes do Sistema Operacional Pessoal (quadrante 'Fazer agora' da Matriz de Eisenhower).",
  {},
  async () => {
    const resposta = await notion.dataSources.query({
      data_source_id: process.env.MATRIZ_DATA_SOURCE_ID,
      filter: {
        and: [
          { property: "Quadrante", select: { equals: "1. Fazer agora" } },
          { property: "Status", status: { does_not_equal: "Done" } },
        ],
      },
    });

    if (resposta.results.length === 0) {
      return { content: [{ type: "text", text: "Nenhuma tarefa no quadrante 'Fazer agora' no momento." }] };
    }

    const lista = resposta.results
      .map((p) => {
        const tarefa = p.properties["Tarefa"]?.title?.[0]?.plain_text ?? "(sem título)";
        const trilha = p.properties["Trilha"]?.select?.name ?? "?";
        return `- [${trilha}] ${tarefa}`;
      })
      .join("\n");

    return { content: [{ type: "text", text: `Prioridades atuais:\n${lista}` }] };
  }
);

// Ferramenta 2: resumo da semana
server.tool(
  "resumo_da_semana",
  "Retorna um resumo da semana: quantas tarefas foram concluídas e quantas retomadas foram registradas no Diário.",
  {},
  async () => {
    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
    const dataLimite = seteDiasAtras.toISOString().split("T")[0];

    const concluidas = await notion.dataSources.query({
      data_source_id: process.env.MATRIZ_DATA_SOURCE_ID,
      filter: { property: "Status", status: { equals: "Done" } },
    });

    const retomadas = await notion.dataSources.query({
      data_source_id: process.env.DIARIO_DATA_SOURCE_ID,
      filter: { property: "Data", date: { on_or_after: dataLimite } },
    });

    const texto = `Nos últimos 7 dias:\n- ${concluidas.results.length} tarefa(s) concluída(s) no total (Matriz de Eisenhower)\n- ${retomadas.results.length} retomada(s) registrada(s) no Diário de Retomada`;

    return { content: [{ type: "text", text: texto }] };
  }
);

// Ferramenta 3: próximo bloco de horário livre por trilha
server.tool(
  "proximo_bloco_livre",
  "Sugere o próximo horário livre disponível para uma trilha específica, considerando a disponibilidade fixa e os blocos já ocupados.",
  { trilha: z.enum(["Graduação", "Dev Web", "Freelance", "Compras Coletivas"]) },
  async ({ trilha }) => {
    const blocosOcupados = await buscarBlocosOcupados();
    const horario = encontrarProximoHorario(trilha, blocosOcupados);

    if (!horario) {
      return { content: [{ type: "text", text: `Nenhum horário livre encontrado para ${trilha} nas próximas 4 semanas.` }] };
    }

    return {
      content: [
        { type: "text", text: `Próximo horário livre para ${trilha}: ${horario.data} (${horario.periodo}, às ${horario.horario}).` },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((erro) => {
  console.error("Erro ao iniciar o servidor MCP:", erro);
  process.exit(1);
});
