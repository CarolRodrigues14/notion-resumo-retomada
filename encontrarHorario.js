const { PERIODOS, disponibilidade } = require("./disponibilidade");

const DIAS_SEMANA = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

function formatarData(date) {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
}

/**
 * Recebe a trilha e um Set de chaves "YYYY-MM-DD|periodo" já ocupadas,
 * e retorna o próximo slot livre dentro das próximas 4 semanas.
 */
function encontrarProximoHorario(trilha, blocosOcupados) {
  const janelas = disponibilidade[trilha] || [];
  if (janelas.length === 0) return null;

  const hoje = new Date();

  for (let offset = 0; offset < 28; offset++) {
    const data = new Date(hoje);
    data.setDate(hoje.getDate() + offset);
    const nomeDia = DIAS_SEMANA[data.getDay()];
    const dataStr = formatarData(data);

    const janelasDoDia = janelas.filter((j) => j.dia === nomeDia);

    for (const janela of janelasDoDia) {
      const chave = `${dataStr}|${janela.periodo}`;
      if (!blocosOcupados.has(chave)) {
        return {
          data: dataStr,
          periodo: janela.periodo,
          horario: PERIODOS[janela.periodo].inicio,
        };
      }
    }
  }

  return null;
}

module.exports = { encontrarProximoHorario, DIAS_SEMANA };
