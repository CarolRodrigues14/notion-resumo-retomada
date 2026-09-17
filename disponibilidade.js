// Grade de disponibilidade fixa da Carol.
// Períodos: manhã (08:00-12:00), tarde (13:00-18:00), noite (19:00-22:00)

const PERIODOS = {
  manhã: { inicio: "08:00", fim: "12:00" },
  tarde: { inicio: "13:00", fim: "18:00" },
  noite: { inicio: "19:00", fim: "22:00" },
};

// Janelas em que cada trilha PODE ser sugerida
const disponibilidade = {
  "Dev Web": [
    { dia: "segunda", periodo: "noite" },
    { dia: "terça", periodo: "noite" },
    { dia: "quinta", periodo: "noite" },
    { dia: "sábado", periodo: "tarde" },
    { dia: "sábado", periodo: "noite" },
    { dia: "domingo", periodo: "tarde" },
    { dia: "domingo", periodo: "noite" },
  ],
  "Graduação": [
    { dia: "segunda", periodo: "manhã" },
    { dia: "sábado", periodo: "tarde" },
    { dia: "sábado", periodo: "noite" },
    { dia: "domingo", periodo: "tarde" },
    { dia: "domingo", periodo: "noite" },
  ],
};

// Períodos sempre bloqueados (freelance / compras coletivas / descanso)
const bloqueados = [
  { dia: "quarta", periodo: "tarde" },
  { dia: "quarta", periodo: "noite" },
  { dia: "quinta", periodo: "tarde" },
  { dia: "sábado", periodo: "manhã" },
  { dia: "domingo", periodo: "manhã" },
];

module.exports = { PERIODOS, disponibilidade, bloqueados };
