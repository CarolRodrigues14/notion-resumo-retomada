const buscarEntradasPendentes = require("./buscarPendentes");
const gerarResumo = require("./gerarResumo");
const atualizarResumo = require("./atualizarResumo");
const classificarTarefa = require("./classificarTarefa");
const { criarOuAtualizarNaMatriz } = require("./matrizNotion");
const { buscarBlocosOcupados, criarBlocoSugerido } = require("./tarefasNotion");
const { encontrarProximoHorario } = require("./encontrarHorario");

async function main() {
  const pendentes = await buscarEntradasPendentes();
  console.log(`Encontradas ${pendentes.length} entrada(s) sem resumo.`);

  // Busca os blocos ocupados uma vez só, no início
  const blocosOcupados = await buscarBlocosOcupados();

  for (const entrada of pendentes) {
    console.log(`\n[${entrada.trilha}] Processando...`);

    // Passo 1: gerar resumo de retomada
    const resumo = await gerarResumo(entrada);
    await atualizarResumo(entrada.pageId, resumo);
    console.log("✔ Resumo salvo:", resumo);

    // Passo 2: classificar na Matriz de Eisenhower
    const classificacao = await classificarTarefa(entrada);
    const acao = await criarOuAtualizarNaMatriz(classificacao, entrada.trilha);
    console.log(`✔ Tarefa ${acao} na Matriz:`, classificacao);

    // Passo 3: sugerir bloco de horário livre
    const horario = encontrarProximoHorario(entrada.trilha, blocosOcupados);
    if (horario) {
      await criarBlocoSugerido({
        tarefa: classificacao.tarefa,
        trilha: entrada.trilha,
        data: horario.data,
        horario: horario.horario,
      });
      blocosOcupados.add(`${horario.data}|${horario.periodo}`);
      console.log(`✔ Bloco sugerido: ${horario.data} (${horario.periodo}, ${horario.horario})`);
    } else {
      console.log("⚠ Nenhum horário livre encontrado nas próximas 4 semanas.");
    }
  }

  console.log("\nConcluído!");
}

main().catch((erro) => {
  console.error("Erro ao rodar o script:", erro.message);
});
