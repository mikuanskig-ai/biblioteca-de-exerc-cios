/**
 * Seed script to generate 180+ exercises with high-quality content.
 */
const fs = require('fs');
const path = require('path');

const EXERCISES_FILE_PATH = path.join(__dirname, '..', 'data', 'exercises.json');

// List of all exercises with metadata
const exercisesList = [
  // === MUSCULAÇÃO: PEITO ===
  { nome: "Supino Reto com Barra", categoria: "Musculação", grupoMuscular: "Peito", subGrupo: "Peitoral Maior", nivel: "Intermediário", equipamentos: ["Barra", "Banco Reto", "Anilhas"], musculosPrimarios: ["Peitoral Maior"], musculosSecundarios: ["Deltoide Anterior", "Tríceps Braquial"] },
  { nome: "Supino Reto com Halteres", categoria: "Musculação", grupoMuscular: "Peito", subGrupo: "Peitoral Maior", nivel: "Iniciante", equipamentos: ["Halteres", "Banco Reto"], musculosPrimarios: ["Peitoral Maior"], musculosSecundarios: ["Deltoide Anterior", "Tríceps Braquial"] },
  { nome: "Supino Inclinado com Barra", categoria: "Musculação", grupoMuscular: "Peito", subGrupo: "Peitoral Clavicular", nivel: "Intermediário", equipamentos: ["Barra", "Banco Inclinado", "Anilhas"], musculosPrimarios: ["Peitoral Maior (Porção Clavicular)"], musculosSecundarios: ["Deltoide Anterior", "Tríceps Braquial"] },
  { nome: "Supino Inclinado com Halteres", categoria: "Musculação", grupoMuscular: "Peito", subGrupo: "Peitoral Clavicular", nivel: "Iniciante", equipamentos: ["Halteres", "Banco Inclinado"], musculosPrimarios: ["Peitoral Maior (Porção Clavicular)"], musculosSecundarios: ["Deltoide Anterior", "Tríceps Braquial"] },
  { nome: "Supino Declinado", categoria: "Musculação", grupoMuscular: "Peito", subGrupo: "Peitoral Inferior", nivel: "Intermediário", equipamentos: ["Barra", "Banco Declinado", "Anilhas"], musculosPrimarios: ["Peitoral Maior (Porção Esternocostal)"], musculosSecundarios: ["Tríceps Braquial", "Deltoide Anterior"] },
  { nome: "Crucifixo Reto", categoria: "Musculação", grupoMuscular: "Peito", subGrupo: "Peitoral Maior", nivel: "Iniciante", equipamentos: ["Halteres", "Banco Reto"], musculosPrimarios: ["Peitoral Maior"], musculosSecundarios: ["Deltoide Anterior", "Coracobraquial"] },
  { nome: "Crucifixo Inclinado", categoria: "Musculação", grupoMuscular: "Peito", subGrupo: "Peitoral Clavicular", nivel: "Iniciante", equipamentos: ["Halteres", "Banco Inclinado"], musculosPrimarios: ["Peitoral Maior (Porção Clavicular)"], musculosSecundarios: ["Deltoide Anterior", "Serrátil Anterior"] },
  { nome: "Crucifixo Declinado", categoria: "Musculação", grupoMuscular: "Peito", subGrupo: "Peitoral Inferior", nivel: "Intermediário", equipamentos: ["Halteres", "Banco Declinado"], musculosPrimarios: ["Peitoral Maior (Porção Esternocostal)"], musculosSecundarios: ["Deltoide Anterior", "Tríceps Braquial"] },
  { nome: "Peck Deck", categoria: "Musculação", grupoMuscular: "Peito", subGrupo: "Peitoral Esternocostal", nivel: "Iniciante", equipamentos: ["Máquina Peck Deck"], musculosPrimarios: ["Peitoral Maior"], musculosSecundarios: ["Deltoide Anterior", "Coracobraquial"] },
  { nome: "Cross Over Alto", categoria: "Musculação", grupoMuscular: "Peito", subGrupo: "Peitoral Inferior", nivel: "Intermediário", equipamentos: ["Polia Alta"], musculosPrimarios: ["Peitoral Maior (Porção Inferior)"], musculosSecundarios: ["Deltoide Anterior", "Tríceps Braquial"] },
  { nome: "Cross Over Médio", categoria: "Musculação", grupoMuscular: "Peito", subGrupo: "Peitoral Esternocostal", nivel: "Intermediário", equipamentos: ["Polia Média"], musculosPrimarios: ["Peitoral Maior (Porção Média)"], musculosSecundarios: ["Deltoide Anterior", "Bíceps (Cabeça Curta)"] },
  { nome: "Cross Over Baixo", categoria: "Musculação", grupoMuscular: "Peito", subGrupo: "Peitoral Clavicular", nivel: "Intermediário", equipamentos: ["Polia Baixa"], musculosPrimarios: ["Peitoral Maior (Porção Clavicular)"], musculosSecundarios: ["Deltoide Anterior", "Bíceps Braquial"] },
  { nome: "Flexão Tradicional", categoria: "Musculação", grupoMuscular: "Peito", subGrupo: "Peitoral Geral", nivel: "Iniciante", equipamentos: ["Peso Corporal"], musculosPrimarios: ["Peitoral Maior"], musculosSecundarios: ["Tríceps Braquial", "Deltoide Anterior", "Core"] },
  { nome: "Flexão Inclinada", categoria: "Musculação", grupoMuscular: "Peito", subGrupo: "Peitoral Inferior", nivel: "Iniciante", equipamentos: ["Banco ou Apoio Alto"], musculosPrimarios: ["Peitoral Maior (Porção Inferior)"], musculosSecundarios: ["Tríceps Braquial", "Deltoide Anterior"] },
  { nome: "Flexão Declinada", categoria: "Musculação", grupoMuscular: "Peito", subGrupo: "Peitoral Clavicular", nivel: "Avançado", equipamentos: ["Banco ou Apoio para os Pés"], musculosPrimarios: ["Peitoral Maior (Porção Superior)"], musculosSecundarios: ["Tríceps Braquial", "Deltoide Anterior"] },
  { nome: "Pullover", categoria: "Musculação", grupoMuscular: "Peito", subGrupo: "Peitoral e Costas", nivel: "Intermediário", equipamentos: ["Halter", "Banco Reto"], musculosPrimarios: ["Peitoral Maior", "Latíssimo do Dorso"], musculosSecundarios: ["Tríceps Braquial (Cabeça Longa)", "Serrátil Anterior"] },
  { nome: "Chest Press", categoria: "Musculação", grupoMuscular: "Peito", subGrupo: "Peitoral Geral", nivel: "Iniciante", equipamentos: ["Máquina de Chest Press"], musculosPrimarios: ["Peitoral Maior"], musculosSecundarios: ["Deltoide Anterior", "Tríceps Braquial"] },

  // === MUSCULAÇÃO: COSTAS ===
  { nome: "Puxada Frontal", categoria: "Musculação", grupoMuscular: "Costas", subGrupo: "Latíssimo do Dorso", nivel: "Iniciante", equipamentos: ["Polia Alta", "Barra de Puxada"], musculosPrimarios: ["Latíssimo do Dorso"], musculosSecundarios: ["Bíceps Braquial", "Braquiorradial", "Trapézio Inferior", "Redondo Maior"] },
  { nome: "Puxada Fechada", categoria: "Musculação", grupoMuscular: "Costas", subGrupo: "Latíssimo Central", nivel: "Iniciante", equipamentos: ["Polia Alta", "Puxador Triângulo"], musculosPrimarios: ["Latíssimo do Dorso", "Redondo Maior"], musculosSecundarios: ["Bíceps Braquial", "Braquial", "Trapézio Médio"] },
  { nome: "Puxada Supinada", categoria: "Musculação", grupoMuscular: "Costas", subGrupo: "Latíssimo Inferior", nivel: "Iniciante", equipamentos: ["Polia Alta"], musculosPrimarios: ["Latíssimo do Dorso"], musculosSecundarios: ["Bíceps Braquial", "Braquiorradial", "Trapézio Inferior"] },
  { nome: "Pulldown", categoria: "Musculação", grupoMuscular: "Costas", subGrupo: "Latíssimo Externo", nivel: "Intermediário", equipamentos: ["Polia Alta", "Corda ou Barra"], musculosPrimarios: ["Latíssimo do Dorso"], musculosSecundarios: ["Tríceps Braquial (Cabeça Longa)", "Redondo Maior", "Abdominais"] },
  { nome: "Barra Fixa", categoria: "Musculação", grupoMuscular: "Costas", subGrupo: "Latíssimo Geral", nivel: "Avançado", equipamentos: ["Barra Fixa"], musculosPrimarios: ["Latíssimo do Dorso"], musculosSecundarios: ["Bíceps Braquial", "Trapezius", "Romboide", "Core"] },
  { nome: "Barra Fixa Assistida", categoria: "Musculação", grupoMuscular: "Costas", subGrupo: "Latíssimo Geral", nivel: "Iniciante", equipamentos: ["Graviton / Máquina Assistida"], musculosPrimarios: ["Latíssimo do Dorso"], musculosSecundarios: ["Bíceps Braquial", "Redondo Maior", "Braquial"] },
  { nome: "Remada Curvada", categoria: "Musculação", grupoMuscular: "Costas", subGrupo: "Dorso Central", nivel: "Intermediário", equipamentos: ["Barra", "Anilhas"], musculosPrimarios: ["Latíssimo do Dorso", "Trapézio Médio/Inferior"], musculosSecundarios: ["Romboide", "Deltoide Posterior", "Bíceps Braquial", "Eretores da Espinha"] },
  { nome: "Remada Cavalinho", categoria: "Musculação", grupoMuscular: "Costas", subGrupo: "Dorso Central", nivel: "Intermediário", equipamentos: ["Barra T / Plataforma Cavalinho", "Anilhas"], musculosPrimarios: ["Latíssimo do Dorso", "Trapézio Médio"], musculosSecundarios: ["Romboide", "Bíceps Braquial", "Braquial"] },
  { nome: "Remada Baixa", categoria: "Musculação", grupoMuscular: "Costas", subGrupo: "Dorso Central", nivel: "Iniciante", equipamentos: ["Polia Baixa", "Puxador Triângulo"], musculosPrimarios: ["Latíssimo do Dorso", "Romboide"], musculosSecundarios: ["Bíceps Braquial", "Trapézio Médio", "Eretores da Espinha"] },
  { nome: "Remada Unilateral", categoria: "Musculação", grupoMuscular: "Costas", subGrupo: "Dorso Lateral", nivel: "Iniciante", equipamentos: ["Halter", "Banco Reto"], musculosPrimarios: ["Latíssimo do Dorso"], musculosSecundarios: ["Bíceps Braquial", "Deltoide Posterior", "Romboide"] },
  { nome: "Remada Máquina", categoria: "Musculação", grupoMuscular: "Costas", subGrupo: "Dorso Geral", nivel: "Iniciante", equipamentos: ["Máquina de Remada"], musculosPrimarios: ["Latíssimo do Dorso", "Trapézio Médio"], musculosSecundarios: ["Romboide", "Bíceps Braquial"] },
  { nome: "Remada T-Bar", categoria: "Musculação", grupoMuscular: "Costas", subGrupo: "Dorso Central", nivel: "Intermediário", equipamentos: ["Máquina de Remada T-Bar"], musculosPrimarios: ["Latíssimo do Dorso", "Trapézio Médio/Inferior"], musculosSecundarios: ["Romboide", "Deltoide Posterior", "Bíceps Braquial"] },
  { nome: "Pull Over", categoria: "Musculação", grupoMuscular: "Costas", subGrupo: "Latíssimo e Serrátil", nivel: "Intermediário", equipamentos: ["Halter", "Banco Reto"], musculosPrimarios: ["Latíssimo do Dorso"], musculosSecundarios: ["Peitoral Maior", "Tríceps (Cabeça Longa)", "Serrátil"] },
  { nome: "Remada Alta", categoria: "Musculação", grupoMuscular: "Costas", subGrupo: "Trapézio e Ombros", nivel: "Intermediário", equipamentos: ["Barra", "Anilhas ou Polia"], musculosPrimarios: ["Trapézio Superior", "Deltoide Lateral"], musculosSecundarios: ["Bíceps Braquial", "Braquiorradial"] },

  // === MUSCULAÇÃO: OMBROS ===
  { nome: "Desenvolvimento com Barra", categoria: "Musculação", grupoMuscular: "Ombros", subGrupo: "Deltoide Anterior", nivel: "Intermediário", equipamentos: ["Barra", "Banco com encosto", "Anilhas"], musculosPrimarios: ["Deltoide Anterior"], musculosSecundarios: ["Deltoide Lateral", "Tríceps Braquial", "Trapézio Superior"] },
  { nome: "Desenvolvimento com Halteres", categoria: "Musculação", grupoMuscular: "Ombros", subGrupo: "Deltoide Anterior", nivel: "Iniciante", equipamentos: ["Halteres", "Banco com encosto"], musculosPrimarios: ["Deltoide Anterior"], musculosSecundarios: ["Deltoide Lateral", "Tríceps Braquial", "Trapézio Superior"] },
  { nome: "Desenvolvimento Máquina", categoria: "Musculação", grupoMuscular: "Ombros", subGrupo: "Deltoide Anterior", nivel: "Iniciante", equipamentos: ["Máquina de Desenvolvimento"], musculosPrimarios: ["Deltoide Anterior"], musculosSecundarios: ["Tríceps Braquial", "Deltoide Lateral"] },
  { nome: "Arnold Press", categoria: "Musculação", grupoMuscular: "Ombros", subGrupo: "Deltoide Anterior e Lateral", nivel: "Intermediário", equipamentos: ["Halteres", "Banco com encosto"], musculosPrimarios: ["Deltoide Anterior"], musculosSecundarios: ["Deltoide Lateral", "Tríceps Braquial", "Trapézio"] },
  { nome: "Elevação Lateral", categoria: "Musculação", grupoMuscular: "Ombros", subGrupo: "Deltoide Lateral", nivel: "Iniciante", equipamentos: ["Halteres"], musculosPrimarios: ["Deltoide Lateral"], musculosSecundarios: ["Deltoide Anterior", "Trapézio Superior", "Supraespinhal"] },
  { nome: "Elevação Frontal", categoria: "Musculação", grupoMuscular: "Ombros", subGrupo: "Deltoide Anterior", nivel: "Iniciante", equipamentos: ["Halteres ou Barra"], musculosPrimarios: ["Deltoide Anterior"], musculosSecundarios: ["Deltoide Lateral", "Peitoral Maior (Porção Clavicular)"] },
  { nome: "Crucifixo Invertido", categoria: "Musculação", grupoMuscular: "Ombros", subGrupo: "Deltoide Posterior", nivel: "Iniciante", equipamentos: ["Halteres ou Máquina"], musculosPrimarios: ["Deltoide Posterior"], musculosSecundarios: ["Trapézio Médio/Inferior", "Romboide", "Infraespinhal"] },
  { nome: "Face Pull", categoria: "Musculação", grupoMuscular: "Ombros", subGrupo: "Manguito e Posterior", nivel: "Iniciante", equipamentos: ["Polia Alta", "Corda"], musculosPrimarios: ["Deltoide Posterior", "Trapézio Médio/Inferior"], musculosSecundarios: ["Romboide", "Infraespinhal", "Redondo Menor"] },
  { nome: "Desenvolvimento Smith", categoria: "Musculação", grupoMuscular: "Ombros", subGrupo: "Deltoide Anterior", nivel: "Intermediário", equipamentos: ["Máquina Smith", "Banco com encosto"], musculosPrimarios: ["Deltoide Anterior"], musculosSecundarios: ["Tríceps Braquial", "Deltoide Lateral"] },
  { nome: "Elevação Lateral Cabo", categoria: "Musculação", grupoMuscular: "Ombros", subGrupo: "Deltoide Lateral", nivel: "Intermediário", equipamentos: ["Polia Baixa", "Puxador Estribo"], musculosPrimarios: ["Deltoide Lateral"], musculosSecundarios: ["Deltoide Anterior", "Trapézio Superior"] },
  { nome: "Elevação Frontal Cabo", categoria: "Musculação", grupoMuscular: "Ombros", subGrupo: "Deltoide Anterior", nivel: "Intermediário", equipamentos: ["Polia Baixa"], musculosPrimarios: ["Deltoide Anterior"], musculosSecundarios: ["Deltoide Lateral", "Trapézio Superior"] },

  // === MUSCULAÇÃO: TRAPÉZIO ===
  { nome: "Encolhimento Barra", categoria: "Musculação", grupoMuscular: "Trapézio", subGrupo: "Trapézio Superior", nivel: "Iniciante", equipamentos: ["Barra", "Anilhas"], musculosPrimarios: ["Trapézio Superior"], musculosSecundarios: ["Levantador da Escápula", "Antebraços"] },
  { nome: "Encolhimento Halteres", categoria: "Musculação", grupoMuscular: "Trapézio", subGrupo: "Trapézio Superior", nivel: "Iniciante", equipamentos: ["Halteres"], musculosPrimarios: ["Trapézio Superior"], musculosSecundarios: ["Levantador da Escápula", "Antebraços"] },
  { nome: "Encolhimento Smith", categoria: "Musculação", grupoMuscular: "Trapézio", subGrupo: "Trapézio Superior", nivel: "Intermediário", equipamentos: ["Máquina Smith", "Anilhas"], musculosPrimarios: ["Trapézio Superior"], musculosSecundarios: ["Levantador da Escápula", "Antebraços"] },
  { nome: "Encolhimento Máquina", categoria: "Musculação", grupoMuscular: "Trapézio", subGrupo: "Trapézio Superior", nivel: "Iniciante", equipamentos: ["Máquina de Encolhimento"], musculosPrimarios: ["Trapézio Superior"], musculosSecundarios: ["Levantador da Escápula", "Antebraços"] },

  // === MUSCULAÇÃO: BÍCEPS ===
  { nome: "Rosca Direta", categoria: "Musculação", grupoMuscular: "Bíceps", subGrupo: "Bíceps Geral", nivel: "Iniciante", equipamentos: ["Barra W ou Reta", "Anilhas"], musculosPrimarios: ["Bíceps Braquial"], musculosSecundarios: ["Braquial", "Braquiorradial", "Flexores do Punho"] },
  { nome: "Rosca Alternada", categoria: "Musculação", grupoMuscular: "Bíceps", subGrupo: "Bíceps Geral", nivel: "Iniciante", equipamentos: ["Halteres"], musculosPrimarios: ["Bíceps Braquial"], musculosSecundarios: ["Braquial", "Braquiorradial", "Flexores do Punho"] },
  { nome: "Rosca Martelo", categoria: "Musculação", grupoMuscular: "Bíceps", subGrupo: "Braquiorradial", nivel: "Iniciante", equipamentos: ["Halteres"], musculosPrimarios: ["Braquiorradial", "Braquial"], musculosSecundarios: ["Bíceps Braquial", "Flexores do Punho"] },
  { nome: "Rosca Scott", categoria: "Musculação", grupoMuscular: "Bíceps", subGrupo: "Bíceps Isolado", nivel: "Intermediário", equipamentos: ["Banco Scott", "Barra W", "Anilhas"], musculosPrimarios: ["Bíceps Braquial (Cabeça Curta)"], musculosSecundarios: ["Braquial", "Pronador Redondo"] },
  { nome: "Rosca Concentrada", categoria: "Musculação", grupoMuscular: "Bíceps", subGrupo: "Bíceps Pico", nivel: "Iniciante", equipamentos: ["Halter", "Banco Reto"], musculosPrimarios: ["Bíceps Braquial (Cabeça Longa)"], musculosSecundarios: ["Braquial", "Braquiorradial"] },
  { nome: "Rosca 21", categoria: "Musculação", grupoMuscular: "Bíceps", subGrupo: "Bíceps Resistência", nivel: "Intermediário", equipamentos: ["Barra W", "Anilhas"], musculosPrimarios: ["Bíceps Braquial"], musculosSecundarios: ["Braquial", "Braquiorradial"] },
  { nome: "Rosca Inversa", categoria: "Musculação", grupoMuscular: "Bíceps", subGrupo: "Extensores de Punho", nivel: "Iniciante", equipamentos: ["Barra", "Anilhas"], musculosPrimarios: ["Braquiorradial", "Extensores do Punho"], musculosSecundarios: ["Bíceps Braquial", "Braquial"] },
  { nome: "Rosca Cabo", categoria: "Musculação", grupoMuscular: "Bíceps", subGrupo: "Bíceps Isolado", nivel: "Iniciante", equipamentos: ["Polia Baixa", "Barra ou Corda"], musculosPrimarios: ["Bíceps Braquial"], musculosSecundarios: ["Braquial", "Braquiorradial"] },
  { nome: "Rosca Spider", categoria: "Musculação", grupoMuscular: "Bíceps", subGrupo: "Bíceps Curto", nivel: "Intermediário", equipamentos: ["Banco Inclinado", "Barra W", "Anilhas"], musculosPrimarios: ["Bíceps Braquial (Cabeça Curta)"], musculosSecundarios: ["Braquial", "Extensores do Punho"] },
  { nome: "Rosca Banco Inclinado", categoria: "Musculação", grupoMuscular: "Bíceps", subGrupo: "Bíceps Longo", nivel: "Intermediário", equipamentos: ["Halteres", "Banco Inclinado"], musculosPrimarios: ["Bíceps Braquial (Cabeça Longa)"], musculosSecundarios: ["Braquial", "Braquiorradial"] },

  // === MUSCULAÇÃO: TRÍCEPS ===
  { nome: "Tríceps Pulley", categoria: "Musculação", grupoMuscular: "Tríceps", subGrupo: "Tríceps Geral", nivel: "Iniciante", equipamentos: ["Polia Alta", "Barra Reta ou V"], musculosPrimarios: ["Tríceps Braquial"], musculosSecundarios: ["Ancôneo", "Extensores do Punho"] },
  { nome: "Tríceps Corda", categoria: "Musculação", grupoMuscular: "Tríceps", subGrupo: "Tríceps Lateral", nivel: "Iniciante", equipamentos: ["Polia Alta", "Corda"], musculosPrimarios: ["Tríceps Braquial (Cabeça Lateral)"], musculosSecundarios: ["Tríceps Braquial (Cabeça Medial)", "Ancôneo"] },
  { nome: "Tríceps Francês", categoria: "Musculação", grupoMuscular: "Tríceps", subGrupo: "Tríceps Longo", nivel: "Intermediário", equipamentos: ["Halter", "Banco com encosto"], musculosPrimarios: ["Tríceps Braquial (Cabeça Longa)"], musculosSecundarios: ["Tríceps (Cabeça Lateral/Medial)", "Core"] },
  { nome: "Tríceps Testa", categoria: "Musculação", grupoMuscular: "Tríceps", subGrupo: "Tríceps Medial e Lateral", nivel: "Intermediário", equipamentos: ["Banco Reto", "Barra W", "Anilhas"], musculosPrimarios: ["Tríceps Braquial (Cabeça Longa e Lateral)"], musculosSecundarios: ["Ancôneo", "Extensores do Punho"] },
  { nome: "Tríceps Banco", categoria: "Musculação", grupoMuscular: "Tríceps", subGrupo: "Tríceps Geral", nivel: "Iniciante", equipamentos: ["Banco Reto ou Apoio"], musculosPrimarios: ["Tríceps Braquial"], musculosSecundarios: ["Deltoide Anterior", "Peitoral Maior", "Core"] },
  { nome: "Tríceps Coice", categoria: "Musculação", grupoMuscular: "Tríceps", subGrupo: "Tríceps Isolado", nivel: "Iniciante", equipamentos: ["Halteres ou Polia"], musculosPrimarios: ["Tríceps Braquial (Cabeça Lateral)"], musculosSecundarios: ["Deltoide Posterior", "Ancôneo"] },
  { nome: "Tríceps Unilateral", categoria: "Musculação", grupoMuscular: "Tríceps", subGrupo: "Tríceps Isolado", nivel: "Intermediário", equipamentos: ["Polia Alta", "Puxador Estribo"], musculosPrimarios: ["Tríceps Braquial"], musculosSecundarios: ["Ancôneo"] },
  { nome: "Paralelas", categoria: "Musculação", grupoMuscular: "Tríceps", subGrupo: "Tríceps Composto", nivel: "Avançado", equipamentos: ["Barras Paralelas / Estação de Mergulho"], musculosPrimarios: ["Tríceps Braquial", "Peitoral Maior (Porção Inferior)"], musculosSecundarios: ["Deltoide Anterior", "Serrátil Anterior"] },
  { nome: "Tríceps Barra W", categoria: "Musculação", grupoMuscular: "Tríceps", subGrupo: "Tríceps Geral", nivel: "Intermediário", equipamentos: ["Barra W", "Banco Reto", "Anilhas"], musculosPrimarios: ["Tríceps Braquial"], musculosSecundarios: ["Ancôneo", "Flexores de Punho"] },

  // === MUSCULAÇÃO: ANTEBRAÇO ===
  { nome: "Rosca Punho", categoria: "Musculação", grupoMuscular: "Antebraço", subGrupo: "Flexores do Punho", nivel: "Iniciante", equipamentos: ["Barra ou Halteres", "Banco Reto"], musculosPrimarios: ["Flexor Radial do Carpo", "Flexor Ulnar do Carpo"], musculosSecundarios: ["Flexor Superficial dos Dedos"] },
  { nome: "Rosca Punho Inversa", categoria: "Musculação", grupoMuscular: "Antebraço", subGrupo: "Extensores do Punho", nivel: "Iniciante", equipamentos: ["Barra ou Halteres", "Banco Reto"], musculosPrimarios: ["Extensor Radial do Carpo", "Extensor Ulnar do Carpo"], musculosSecundarios: ["Extensor dos Dedos"] },
  { nome: "Farmer Walk", categoria: "Musculação", grupoMuscular: "Antebraço", subGrupo: "Pegada e Core", nivel: "Intermediário", equipamentos: ["Halteres Pesados ou Kettlebells"], musculosPrimarios: ["Músculos da Pegada (Flexores dos Dedos)", "Trapézio"], musculosSecundarios: ["Deltoides", "Core", "Membros Inferiores"] },
  { nome: "Wrist Roller", categoria: "Musculação", grupoMuscular: "Antebraço", subGrupo: "Pegada e Resistência", nivel: "Intermediário", equipamentos: ["Aparelho Wrist Roller com Peso"], musculosPrimarios: ["Extensores do Punho", "Flexores do Punho"], musculosSecundarios: ["Deltoide Anterior (estabilização)"] },

  // === MUSCULAÇÃO: ABDÔMEN ===
  { nome: "Abdominal Tradicional", categoria: "Musculação", grupoMuscular: "Abdômen", subGrupo: "Reto Abdominal", nivel: "Iniciante", equipamentos: ["Colchonete"], musculosPrimarios: ["Reto Abdominal"], musculosSecundarios: ["Oblíquo Externo", "Oblíquo Interno"] },
  { nome: "Abdominal Infra", categoria: "Musculação", grupoMuscular: "Abdômen", subGrupo: "Abdominal Inferior", nivel: "Iniciante", equipamentos: ["Colchonete"], musculosPrimarios: ["Reto Abdominal (Porção Inferior)"], musculosSecundarios: ["Iliopsoas (Flexores do Quadril)", "Pectíneo"] },
  { nome: "Abdominal Canivete", categoria: "Musculação", grupoMuscular: "Abdômen", subGrupo: "Abdominal Completo", nivel: "Avançado", equipamentos: ["Colchonete"], musculosPrimarios: ["Reto Abdominal", "Oblíquo Interno/Externo"], musculosSecundarios: ["Flexores do Quadril", "Quadríceps"] },
  { nome: "Abdominal Oblíquo", categoria: "Musculação", grupoMuscular: "Abdômen", subGrupo: "Oblíquos", nivel: "Iniciante", equipamentos: ["Colchonete"], musculosPrimarios: ["Oblíquo Externo", "Oblíquo Interno"], musculosSecundarios: ["Reto Abdominal"] },
  { nome: "Prancha", categoria: "Musculação", grupoMuscular: "Abdômen", subGrupo: "Estabilização Core", nivel: "Iniciante", equipamentos: ["Colchonete"], musculosPrimarios: ["Transverso do Abdômen", "Reto Abdominal"], musculosSecundarios: ["Eretores da Espinha", "Glúteos", "Deltoides"] },
  { nome: "Prancha Lateral", categoria: "Musculação", grupoMuscular: "Abdômen", subGrupo: "Estabilização Lateral", nivel: "Iniciante", equipamentos: ["Colchonete"], musculosPrimarios: ["Transverso do Abdômen", "Oblíquo Externo/Interno"], musculosSecundarios: ["Glúteo Médio", "Deltoide Lateral"] },
  { nome: "Elevação de Pernas", categoria: "Musculação", grupoMuscular: "Abdômen", subGrupo: "Abdominal Inferior", nivel: "Intermediário", equipamentos: ["Barra Fixa ou Paralela", "Colchonete"], musculosPrimarios: ["Reto Abdominal (Porção Inferior)", "Transverso do Abdômen"], musculosSecundarios: ["Flexores do Quadril", "Quadríceps"] },
  { nome: "Abdominal Polia", categoria: "Musculação", grupoMuscular: "Abdômen", subGrupo: "Reto Abdominal com Carga", nivel: "Intermediário", equipamentos: ["Polia Alta", "Corda"], musculosPrimarios: ["Reto Abdominal"], musculosSecundarios: ["Oblíquo Externo/Interno", "Serrátil Anterior"] },
  { nome: "Abdominal Máquina", categoria: "Musculação", grupoMuscular: "Abdômen", subGrupo: "Reto Abdominal com Carga", nivel: "Iniciante", equipamentos: ["Máquina de Abdominal"], musculosPrimarios: ["Reto Abdominal"], musculosSecundarios: ["Oblíquo Externo", "Transverso do Abdômen"] },
  { nome: "Hollow Hold", categoria: "Musculação", grupoMuscular: "Abdômen", subGrupo: "Estabilização Isométrica", nivel: "Avançado", equipamentos: ["Colchonete"], musculosPrimarios: ["Reto Abdominal", "Transverso do Abdômen"], musculosSecundarios: ["Flexores do Quadril", "Quadríceps", "Serrátil"] },
  { nome: "Dead Bug", categoria: "Musculação", grupoMuscular: "Abdômen", subGrupo: "Coordenação e Estabilidade", nivel: "Iniciante", equipamentos: ["Colchonete"], musculosPrimarios: ["Transverso do Abdômen", "Reto Abdominal"], musculosSecundarios: ["Flexores do Quadril", "Multífidos"] },
  { nome: "Mountain Climbers", categoria: "Musculação", grupoMuscular: "Abdômen", subGrupo: "Abdominal Dinâmico", nivel: "Iniciante", equipamentos: ["Colchonete"], musculosPrimarios: ["Reto Abdominal", "Transverso do Abdômen"], musculosSecundarios: ["Flexores do Quadril", "Deltoides", "Cardiorrespiratório"] },

  // === MUSCULAÇÃO: LOMBAR ===
  { nome: "Extensão Lombar", categoria: "Musculação", grupoMuscular: "Lombar", subGrupo: "Eretores da Espinha", nivel: "Iniciante", equipamentos: ["Colchonete ou Banco de Extensão"], musculosPrimarios: ["Eretores da Espinha (Iliocostal, Longuíssimo, Espinhal)"], musculosSecundarios: ["Glúteo Máximo", "Isquiotibiais"] },
  { nome: "Superman", categoria: "Musculação", grupoMuscular: "Lombar", subGrupo: "Cadeia Posterior Isométrica", nivel: "Iniciante", equipamentos: ["Colchonete"], musculosPrimarios: ["Eretores da Espinha", "Glúteo Máximo"], musculosSecundarios: ["Isquiotibiais", "Deltoide Posterior", "Trapézio"] },
  { nome: "Good Morning", categoria: "Musculação", grupoMuscular: "Lombar", subGrupo: "Cadeia Posterior", nivel: "Intermediário", equipamentos: ["Barra", "Anilhas"], musculosPrimarios: ["Eretores da Espinha", "Isquiotibiais"], musculosSecundarios: ["Glúteo Máximo", "Core"] },
  { nome: "Banco Romano", categoria: "Musculação", grupoMuscular: "Lombar", subGrupo: "Eretores da Espinha", nivel: "Iniciante", equipamentos: ["Banco Romano / Extensão Lombar 45°"], musculosPrimarios: ["Eretores da Espinha"], musculosSecundarios: ["Glúteo Máximo", "Isquiotibiais"] },
  { nome: "Bird Dog", categoria: "Musculação", grupoMuscular: "Lombar", subGrupo: "Estabilidade do Core", nivel: "Iniciante", equipamentos: ["Colchonete"], musculosPrimarios: ["Eretores da Espinha", "Multífidos", "Transverso do Abdômen"], musculosSecundarios: ["Glúteo Máximo", "Deltoide Anterior"] },

  // === MUSCULAÇÃO: QUADRÍCEPS ===
  { nome: "Agachamento Livre", categoria: "Musculação", grupoMuscular: "Quadríceps", subGrupo: "Coxas e Glúteos", nivel: "Intermediário", equipamentos: ["Barra", "Anilhas", "Suporte de Agachamento"], musculosPrimarios: ["Quadríceps Femoral", "Glúteo Máximo"], musculosSecundarios: ["Isquiotibiais", "Eretores da Espinha", "Sólio", "Core"] },
  { nome: "Agachamento Frontal", categoria: "Musculação", grupoMuscular: "Quadríceps", subGrupo: "Quadríceps Ênfase", nivel: "Avançado", equipamentos: ["Barra", "Anilhas"], musculosPrimarios: ["Quadríceps Femoral (Vasto Lateral, Medial, Intermédio e Reto)"], musculosSecundarios: ["Glúteo Máximo", "Core", "Eretores da Espinha"] },
  { nome: "Agachamento Smith", categoria: "Musculação", grupoMuscular: "Quadríceps", subGrupo: "Coxas e Glúteos", nivel: "Iniciante", equipamentos: ["Máquina Smith", "Anilhas"], musculosPrimarios: ["Quadríceps Femoral", "Glúteo Máximo"], musculosSecundarios: ["Isquiotibiais", "Core"] },
  { nome: "Hack Squat", categoria: "Musculação", grupoMuscular: "Quadríceps", subGrupo: "Coxas Ênfase", nivel: "Intermediário", equipamentos: ["Máquina de Hack Squat", "Anilhas"], musculosPrimarios: ["Quadríceps Femoral"], musculosSecundarios: ["Glúteo Máximo", "Isquiotibiais", "Panturrilhas"] },
  { nome: "Leg Press 45°", categoria: "Musculação", grupoMuscular: "Quadríceps", subGrupo: "Membros Inferiores Geral", nivel: "Iniciante", equipamentos: ["Máquina de Leg Press 45°", "Anilhas"], musculosPrimarios: ["Quadríceps Femoral", "Glúteo Máximo"], musculosSecundarios: ["Isquiotibiais", "Adutor Maior"] },
  { nome: "Leg Press Horizontal", categoria: "Musculação", grupoMuscular: "Quadríceps", subGrupo: "Membros Inferiores Geral", nivel: "Iniciante", equipamentos: ["Máquina de Leg Press Horizontal"], musculosPrimarios: ["Quadríceps Femoral"], musculosSecundarios: ["Glúteo Máximo", "Isquiotibiais", "Panturrilhas"] },
  { nome: "Cadeira Extensora", categoria: "Musculação", grupoMuscular: "Quadríceps", subGrupo: "Quadríceps Isolado", nivel: "Iniciante", equipamentos: ["Máquina Cadeira Extensora"], musculosPrimarios: ["Quadríceps (Vasto Lateral, Vasto Medial, Vasto Intermédio, Reto Femoral)"], musculosSecundarios: ["Nenhum (Isolamento)"] },
  { nome: "Afundo", categoria: "Musculação", grupoMuscular: "Quadríceps", subGrupo: "Membros Inferiores Unilateral", nivel: "Iniciante", equipamentos: ["Halteres ou Barra"], musculosPrimarios: ["Quadríceps Femoral", "Glúteo Máximo"], musculosSecundarios: ["Isquiotibiais", "Adutor Maior", "Core"] },
  { nome: "Passada", categoria: "Musculação", grupoMuscular: "Quadríceps", subGrupo: "Membros Inferiores Dinâmico", nivel: "Iniciante", equipamentos: ["Halteres ou Barra"], musculosPrimarios: ["Quadríceps Femoral", "Glúteo Máximo"], musculosSecundarios: ["Isquiotibiais", "Adutor Maior", "Core"] },
  { nome: "Bulgarian Split Squat", categoria: "Musculação", grupoMuscular: "Quadríceps", subGrupo: "Unilateral Ênfase Glúteo/Quad", nivel: "Intermediário", equipamentos: ["Halteres", "Banco Reto"], musculosPrimarios: ["Quadríceps Femoral", "Glúteo Máximo"], musculosSecundarios: ["Glúteo Médio", "Adutor Maior", "Core"] },
  { nome: "Sissy Squat", categoria: "Musculação", grupoMuscular: "Quadríceps", subGrupo: "Quadríceps Isolado", nivel: "Avançado", equipamentos: ["Banco Sissy Squat ou Apoio"], musculosPrimarios: ["Quadríceps Femoral (Reto Femoral Ênfase)"], musculosSecundarios: ["Reto Abdominal (estabilização)", "Gastrocnêmio"] },
  { nome: "Step Up", categoria: "Musculação", grupoMuscular: "Quadríceps", subGrupo: "Membros Inferiores Unilateral", nivel: "Iniciante", equipamentos: ["Banco Alto ou Caixa de Salto", "Halteres"], musculosPrimarios: ["Quadríceps Femoral", "Glúteo Máximo"], musculosSecundarios: ["Isquiotibiais", "Gastrocnêmio", "Core"] },

  // === MUSCULAÇÃO: POSTERIOR ===
  { nome: "Mesa Flexora", categoria: "Musculação", grupoMuscular: "Posterior", subGrupo: "Posterior de Coxa Isolado", nivel: "Iniciante", equipamentos: ["Máquina Mesa Flexora"], musculosPrimarios: ["Bíceps Femoral (Cabeça Longa/Curta)", "Semitendíneo", "Semimembranáceo"], musculosSecundarios: ["Gastrocnêmio", "Sartório"] },
  { nome: "Cadeira Flexora", categoria: "Musculação", grupoMuscular: "Posterior", subGrupo: "Posterior de Coxa Isolado", nivel: "Iniciante", equipamentos: ["Máquina Cadeira Flexora"], musculosPrimarios: ["Isquiotibiais (Bíceps Femoral, Semitendíneo, Semimembranáceo)"], musculosSecundarios: ["Gastrocnêmio"] },
  { nome: "Stiff", categoria: "Musculação", grupoMuscular: "Posterior", subGrupo: "Cadeia Posterior Força", nivel: "Intermediário", equipamentos: ["Barra ou Halteres", "Anilhas"], musculosPrimarios: ["Isquiotibiais", "Glúteo Máximo"], musculosSecundarios: ["Eretores da Espinha", "Core", "Adutor Maior"] },
  { nome: "Terra Romeno", categoria: "Musculação", grupoMuscular: "Posterior", subGrupo: "Cadeia Posterior Força", nivel: "Intermediário", equipamentos: ["Barra ou Halteres", "Anilhas"], musculosPrimarios: ["Isquiotibiais", "Glúteo Máximo"], musculosSecundarios: ["Eretores da Espinha", "Trapézio", "Core"] },
  { nome: "Glute Ham Raise", categoria: "Musculação", grupoMuscular: "Posterior", subGrupo: "Cadeia Posterior Peso Corporal", nivel: "Avançado", equipamentos: ["Máquina de Glute Ham Raise ou Apoio de Joelhos"], musculosPrimarios: ["Isquiotibiais", "Glúteo Máximo"], musculosSecundarios: ["Gastrocnêmio", "Eretores da Espinha"] },
  { nome: "Nordic Curl", categoria: "Musculação", grupoMuscular: "Posterior", subGrupo: "Posterior de Coxa Excêntrico", nivel: "Avançado", equipamentos: ["Apoio para Tornozelos / Colchonete"], musculosPrimarios: ["Isquiotibiais (Bíceps Femoral)"], musculosSecundarios: ["Gastrocnêmio", "Glúteo Máximo", "Core"] },

  // === MUSCULAÇÃO: GLÚTEOS ===
  { nome: "Hip Thrust", categoria: "Musculação", grupoMuscular: "Glúteos", subGrupo: "Glúteos com Barra", nivel: "Intermediário", equipamentos: ["Barra", "Banco Reto", "Estofado / Protetor", "Anilhas"], musculosPrimarios: ["Glúteo Máximo"], musculosSecundarios: ["Isquiotibiais", "Quadríceps", "Core", "Adutor Maior"] },
  { nome: "Elevação Pélvica", categoria: "Musculação", grupoMuscular: "Glúteos", subGrupo: "Glúteos Geral", nivel: "Iniciante", equipamentos: ["Colchonete", "Anilha ou Halter"], musculosPrimarios: ["Glúteo Máximo"], musculosSecundarios: ["Isquiotibiais", "Eretores da Espinha", "Transverso Abdominal"] },
  { nome: "Glúteo Máquina", categoria: "Musculação", grupoMuscular: "Glúteos", subGrupo: "Glúteos Isolado", nivel: "Iniciante", equipamentos: ["Máquina de Extensão de Quadril"], musculosPrimarios: ["Glúteo Máximo"], musculosSecundarios: ["Isquiotibiais"] },
  { nome: "Coice Polia", categoria: "Musculação", grupoMuscular: "Glúteos", subGrupo: "Glúteos Isolado", nivel: "Iniciante", equipamentos: ["Polia Baixa", "Tornozeleira de Cabo"], musculosPrimarios: ["Glúteo Máximo"], musculosSecundarios: ["Isquiotibiais", "Adutor Maior"] },
  { nome: "Coice Máquina", categoria: "Musculação", grupoMuscular: "Glúteos", subGrupo: "Glúteos Isolado", nivel: "Iniciante", equipamentos: ["Máquina de Coice / Kickback"], musculosPrimarios: ["Glúteo Máximo"], musculosSecundarios: ["Isquiotibiais"] },
  { nome: "Abdução Máquina", categoria: "Musculação", grupoMuscular: "Glúteos", subGrupo: "Glúteo Médio e Mínimo", nivel: "Iniciante", equipamentos: ["Cadeira Abdutora"], musculosPrimarios: ["Glúteo Médio", "Glúteo Mínimo", "Tensor da Fáscia Lata"], musculosSecundarios: ["Piriforme", "Sartório"] },
  { nome: "Agachamento Sumô", categoria: "Musculação", grupoMuscular: "Glúteos", subGrupo: "Cadeia Posterior e Adutores", nivel: "Iniciante", equipamentos: ["Halter ou Kettlebell", "Plataformas (opcional)"], musculosPrimarios: ["Glúteo Máximo", "Adutor Maior"], musculosSecundarios: ["Quadríceps Femoral", "Isquiotibiais", "Core"] },
  { nome: "Ponte de Glúteo", categoria: "Musculação", grupoMuscular: "Glúteos", subGrupo: "Glúteos Geral", nivel: "Iniciante", equipamentos: ["Colchonete"], musculosPrimarios: ["Glúteo Máximo"], musculosSecundarios: ["Isquiotibiais", "Eretores da Espinha"] },
  { nome: "Donkey Kick", categoria: "Musculação", grupoMuscular: "Glúteos", subGrupo: "Glúteos Peso Corporal", nivel: "Iniciante", equipamentos: ["Colchonete"], musculosPrimarios: ["Glúteo Máximo"], musculosSecundarios: ["Isquiotibiais", "Transverso do Abdômen"] },

  // === MUSCULAÇÃO: ADUTORES ===
  { nome: "Cadeira Adutora", categoria: "Musculação", grupoMuscular: "Adutores", subGrupo: "Interno de Coxa", nivel: "Iniciante", equipamentos: ["Cadeira Adutora"], musculosPrimarios: ["Adutor Longo", "Adutor Breve", "Adutor Maior", "Grácil"], musculosSecundarios: ["Pectíneo"] },
  { nome: "Afundo Lateral", categoria: "Musculação", grupoMuscular: "Adutores", subGrupo: "Unilateral e Adutores", nivel: "Intermediário", equipamentos: ["Halteres"], musculosPrimarios: ["Adutor Maior", "Quadríceps", "Glúteo Máximo"], musculosSecundarios: ["Isquiotibiais", "Glúteo Médio"] },
  { nome: "Copenhagen Plank", categoria: "Musculação", grupoMuscular: "Adutores", subGrupo: "Estabilização e Adutores", nivel: "Avançado", equipamentos: ["Banco Reto", "Colchonete"], musculosPrimarios: ["Adutor Maior", "Adutor Longo", "Transverso do Abdômen"], musculosSecundarios: ["Oblíquos", "Glúteo Médio"] },

  // === MUSCULAÇÃO: ABDUTORES ===
  { nome: "Cadeira Abdutora", categoria: "Musculação", grupoMuscular: "Abdutores", subGrupo: "Lateral de Quadril", nivel: "Iniciante", equipamentos: ["Cadeira Abdutora"], musculosPrimarios: ["Glúteo Médio", "Glúteo Mínimo", "Tensor da Fáscia Lata"], musculosSecundarios: ["Piriforme"] },
  { nome: "Caminhada Lateral Mini Band", categoria: "Musculação", grupoMuscular: "Abdutores", subGrupo: "Ativação de Glúteo Médio", nivel: "Iniciante", equipamentos: ["Mini Band (Elástico circular)"], musculosPrimarios: ["Glúteo Médio", "Tensor da Fáscia Lata"], musculosSecundarios: ["Glúteo Máximo (porção superior)"] },
  { nome: "Elevação Lateral de Perna", categoria: "Musculação", grupoMuscular: "Abdutores", subGrupo: "Abdutores Isolado", nivel: "Iniciante", equipamentos: ["Colchonete", "Tornozeleira (opcional)"], musculosPrimarios: ["Glúteo Médio", "Glúteo Mínimo"], musculosSecundarios: ["Tensor da Fáscia Lata"] },
  { nome: "Monster Walk", categoria: "Musculação", grupoMuscular: "Abdutores", subGrupo: "Ativação de Quadril", nivel: "Iniciante", equipamentos: ["Mini Band"], musculosPrimarios: ["Glúteo Médio", "Glúteo Máximo"], musculosSecundarios: ["Quadríceps Femoral"] },

  // === MUSCULAÇÃO: PANTURRILHAS ===
  { nome: "Panturrilha em Pé", categoria: "Musculação", grupoMuscular: "Panturrilhas", subGrupo: "Panturrilhas Geral", nivel: "Iniciante", equipamentos: ["Máquina de Panturrilha em pé ou Degrau"], musculosPrimarios: ["Gastrocnêmio Lateral/Medial", "Sóleo"], musculosSecundarios: ["Tibial Posterior"] },
  { nome: "Panturrilha Sentado", categoria: "Musculação", grupoMuscular: "Panturrilhas", subGrupo: "Panturrilha Sóleo", nivel: "Iniciante", equipamentos: ["Máquina de Panturrilha Sentado / Solear"], musculosPrimarios: ["Sóleo"], musculosSecundarios: ["Gastrocnêmio"] },
  { nome: "Panturrilha Leg Press", categoria: "Musculação", grupoMuscular: "Panturrilhas", subGrupo: "Panturrilhas Geral", nivel: "Iniciante", equipamentos: ["Máquina de Leg Press", "Anilhas"], musculosPrimarios: ["Gastrocnêmio", "Sóleo"], musculosSecundarios: ["Tibial Posterior", "Flexor Longo dos Dedos"] },
  { nome: "Panturrilha Smith", categoria: "Musculação", grupoMuscular: "Panturrilhas", subGrupo: "Panturrilhas Geral", nivel: "Intermediário", equipamentos: ["Máquina Smith", "Degrau ou Bloco", "Anilhas"], musculosPrimarios: ["Gastrocnêmio", "Sóleo"], musculosSecundarios: ["Tibial Posterior"] },
  { nome: "Panturrilha Unilateral", categoria: "Musculação", grupoMuscular: "Panturrilhas", subGrupo: "Panturrilha Isolado", nivel: "Iniciante", equipamentos: ["Halter (opcional)", "Degrau"], musculosPrimarios: ["Gastrocnêmio", "Sóleo"], musculosSecundarios: ["Tibial Posterior"] },

  // === CARDIO ===
  { nome: "Caminhada (Esteira)", categoria: "Cardio", grupoMuscular: "Quadríceps", subGrupo: "Condicionamento Cardiorrespiratório", nivel: "Iniciante", equipamentos: ["Esteira"], musculosPrimarios: ["Gastrocnêmio", "Sóleo", "Quadríceps"], musculosSecundarios: ["Glúteos", "Isquiotibiais", "Coração"] },
  { nome: "Caminhada Inclinada", categoria: "Cardio", grupoMuscular: "Quadríceps", subGrupo: "Resistência e Queima Calórica", nivel: "Iniciante", equipamentos: ["Esteira com Inclinação"], musculosPrimarios: ["Gastrocnêmio", "Sóleo", "Glúteo Máximo"], musculosSecundarios: ["Isquiotibiais", "Quadríceps", "Coração"] },
  { nome: "Corrida Leve (Esteira)", categoria: "Cardio", grupoMuscular: "Quadríceps", subGrupo: "Resistência Aeróbica", nivel: "Iniciante", equipamentos: ["Esteira"], musculosPrimarios: ["Quadríceps Femoral", "Gastrocnêmio", "Sóleo"], musculosSecundarios: ["Glúteo Máximo", "Isquiotibiais", "Core", "Coração"] },
  { nome: "Corrida Moderada (Esteira)", categoria: "Cardio", grupoMuscular: "Quadríceps", subGrupo: "Capacidade Cardiorrespiratória", nivel: "Intermediário", equipamentos: ["Esteira"], musculosPrimarios: ["Quadríceps Femoral", "Isquiotibiais", "Gastrocnêmio"], musculosSecundarios: ["Glúteos", "Core", "Músculos Respiratórios", "Coração"] },
  { nome: "Sprint (Esteira)", categoria: "Cardio", grupoMuscular: "Quadríceps", subGrupo: "Potência e HIIT", nivel: "Avançado", equipamentos: ["Esteira"], musculosPrimarios: ["Quadríceps Femoral", "Glúteo Máximo", "Isquiotibiais", "Gastrocnêmio"], musculosSecundarios: ["Core", "Deltoides (oscilação)", "Coração"] },
  { nome: "Bike Horizontal", categoria: "Cardio", grupoMuscular: "Quadríceps", subGrupo: "Cardio Baixo Impacto", nivel: "Iniciante", equipamentos: ["Bicicleta Ergométrica Horizontal"], musculosPrimarios: ["Quadríceps Femoral", "Glúteo Máximo"], musculosSecundarios: ["Isquiotibiais", "Gastrocnêmio", "Coração"] },
  { nome: "Bike Vertical", categoria: "Cardio", grupoMuscular: "Quadríceps", subGrupo: "Cardio Geral", nivel: "Iniciante", equipamentos: ["Bicicleta Ergométrica Vertical"], musculosPrimarios: ["Quadríceps Femoral", "Glúteo Máximo", "Gastrocnêmio"], musculosSecundarios: ["Isquiotibiais", "Core", "Coração"] },
  { nome: "Bike HIIT", categoria: "Cardio", grupoMuscular: "Quadríceps", subGrupo: "Treinamento Intervalado", nivel: "Intermediário", equipamentos: ["Bicicleta Ergométrica / Air Bike"], musculosPrimarios: ["Quadríceps Femoral", "Glúteo Máximo", "Gastrocnêmio"], musculosSecundarios: ["Isquiotibiais", "Core", "Músculos Superiores (se Air Bike)", "Coração"] },
  { nome: "Elíptico Tradicional", categoria: "Cardio", grupoMuscular: "Quadríceps", subGrupo: "Cardio Sem Impacto", nivel: "Iniciante", equipamentos: ["Aparelho Elíptico"], musculosPrimarios: ["Quadríceps Femoral", "Glúteo Máximo", "Gastrocnêmio"], musculosSecundarios: ["Isquiotibiais", "Peitoral / Costas (se alças móveis)", "Coração"] },
  { nome: "Elíptico Intervalado", categoria: "Cardio", grupoMuscular: "Quadríceps", subGrupo: "HIIT Sem Impacto", nivel: "Intermediário", equipamentos: ["Aparelho Elíptico"], musculosPrimarios: ["Quadríceps Femoral", "Glúteo Máximo", "Gastrocnêmio"], musculosSecundarios: ["Isquiotibiais", "Peitoral / Costas / Core", "Coração"] },
  { nome: "Stair Climber (Escada)", categoria: "Cardio", grupoMuscular: "Quadríceps", subGrupo: "Resistência de Pernas", nivel: "Intermediário", equipamentos: ["Simulador de Escada"], musculosPrimarios: ["Glúteo Máximo", "Quadríceps Femoral", "Gastrocnêmio"], musculosSecundarios: ["Isquiotibiais", "Sóleo", "Core", "Coração"] },
  { nome: "Escada Intervalada", categoria: "Cardio", grupoMuscular: "Quadríceps", subGrupo: "Potência e HIIT Pernas", nivel: "Avançado", equipamentos: ["Simulador de Escada"], musculosPrimarios: ["Glúteo Máximo", "Quadríceps Femoral", "Gastrocnêmio", "Sóleo"], musculosSecundarios: ["Isquiotibiais", "Core", "Coração"] },
  { nome: "Pular Corda", categoria: "Cardio", grupoMuscular: "Panturrilhas", subGrupo: "Coordenação e Fôlego", nivel: "Intermediário", equipamentos: ["Corda de Pular"], musculosPrimarios: ["Gastrocnêmio", "Sóleo", "Quadríceps"], musculosSecundarios: ["Deltoides", "Antebraços", "Core", "Coração"] },
  { nome: "Double Under (Pular Corda)", categoria: "Cardio", grupoMuscular: "Panturrilhas", subGrupo: "Coordenação e Agilidade", nivel: "Avançado", equipamentos: ["Corda de Velocidade (Speed Rope)"], musculosPrimarios: ["Gastrocnêmio", "Sóleo", "Quadríceps", "Flexores do Punho"], musculosSecundarios: ["Deltoides", "Core", "Coração"] },
  { nome: "Remo Indoor", categoria: "Cardio", grupoMuscular: "Costas", subGrupo: "Cardio de Corpo Inteiro", nivel: "Intermediário", equipamentos: ["Simulador de Remo Indoor (Rowing Machine)"], musculosPrimarios: ["Latíssimo do Dorso", "Quadríceps Femoral", "Glúteo Máximo"], musculosSecundarios: ["Isquiotibiais", "Bíceps Braquial", "Trapézio", "Core", "Coração"] },

  // === ALONGAMENTOS ===
  { nome: "Alongamento Cervical Lateral", categoria: "Alongamentos", grupoMuscular: "Ombros", subGrupo: "Cervical", nivel: "Iniciante", equipamentos: ["Nenhum"], musculosPrimarios: ["Trapézio Superior", "Esternocleidomastoideo"], musculosSecundarios: ["Escalenos"] },
  { nome: "Alongamento Cervical Frontal", categoria: "Alongamentos", grupoMuscular: "Ombros", subGrupo: "Cervical", nivel: "Iniciante", equipamentos: ["Nenhum"], musculosPrimarios: ["Músculos Extensores do Pescoço"], musculosSecundarios: ["Trapézio Superior"] },
  { nome: "Alongamento Deltoide", categoria: "Alongamentos", grupoMuscular: "Ombros", subGrupo: "Manguito e Deltoides", nivel: "Iniciante", equipamentos: ["Nenhum"], musculosPrimarios: ["Deltoide Posterior"], musculosSecundarios: ["Infraespinhal", "Redondo Menor"] },
  { nome: "Alongamento Manguito Rotador", categoria: "Alongamentos", grupoMuscular: "Ombros", subGrupo: "Mobilidade Glenoumeral", nivel: "Iniciante", equipamentos: ["Bastão ou Toalha"], musculosPrimarios: ["Manguito Rotador (Subescapular, Supraespinhal, Infraespinhal, Redondo Menor)"], musculosSecundarios: ["Deltoide Anterior"] },
  { nome: "Alongamento de Peito na Parede", categoria: "Alongamentos", grupoMuscular: "Peito", subGrupo: "Peitoral", nivel: "Iniciante", equipamentos: ["Parede"], musculosPrimarios: ["Peitoral Maior", "Peitoral Menor"], musculosSecundarios: ["Deltoide Anterior", "Bíceps Braquial"] },
  { nome: "Alongamento de Peito em Porta", categoria: "Alongamentos", grupoMuscular: "Peito", subGrupo: "Peitoral", nivel: "Iniciante", equipamentos: ["Batente de Porta"], musculosPrimarios: ["Peitoral Maior"], musculosSecundarios: ["Deltoide Anterior", "Bíceps Braquial"] },
  { nome: "Postura da Criança", categoria: "Alongamentos", grupoMuscular: "Costas", subGrupo: "Dorso e Ombros", nivel: "Iniciante", equipamentos: ["Colchonete"], musculosPrimarios: ["Latíssimo do Dorso", "Eretores da Espinha"], musculosSecundarios: ["Glúteo Máximo", "Deltoides"] },
  { nome: "Alongamento do Gato", categoria: "Alongamentos", grupoMuscular: "Costas", subGrupo: "Coluna Vertebral", nivel: "Iniciante", equipamentos: ["Colchonete"], musculosPrimarios: ["Eretores da Espinha", "Reto Abdominal"], musculosSecundarios: ["Multífidos", "Oblíquos"] },
  { nome: "Joelhos ao Peito", categoria: "Alongamentos", grupoMuscular: "Lombar", subGrupo: "Descompressão Lombar", nivel: "Iniciante", equipamentos: ["Colchonete"], musculosPrimarios: ["Eretores da Espinha (Lombar)", "Glúteo Máximo"], musculosSecundarios: ["Isquiotibiais"] },
  { nome: "Rotação Lombar Deitado", categoria: "Alongamentos", grupoMuscular: "Lombar", subGrupo: "Mobilidade da Coluna", nivel: "Iniciante", equipamentos: ["Colchonete"], musculosPrimarios: ["Oblíquo Externo", "Eretores da Espinha (Lombar)"], musculosSecundarios: ["Glúteo Máximo", "Peitoral Maior"] },
  { nome: "Alongamento de Quadríceps em Pé", categoria: "Alongamentos", grupoMuscular: "Quadríceps", subGrupo: "Anterior de Coxa", nivel: "Iniciante", equipamentos: ["Nenhum (ou Parede para apoio)"], musculosPrimarios: ["Quadríceps Femoral (especialmente Reto Femoral)", "Iliopsoas"], musculosSecundarios: ["Sartório", "Tensor da Fáscia Lata"] },
  { nome: "Alongamento de Quadríceps Deitado", categoria: "Alongamentos", grupoMuscular: "Quadríceps", subGrupo: "Anterior de Coxa", nivel: "Iniciante", equipamentos: ["Colchonete"], musculosPrimarios: ["Quadríceps Femoral", "Iliopsoas"], musculosSecundarios: ["Sartório"] },
  { nome: "Alongamento de Isquiotibiais Sentado", categoria: "Alongamentos", grupoMuscular: "Posterior", subGrupo: "Posterior de Coxa", nivel: "Iniciante", equipamentos: ["Colchonete"], musculosPrimarios: ["Isquiotibiais (Bíceps Femoral, Semitendíneo, Semimembranáceo)"], musculosSecundarios: ["Gastrocnêmio", "Glúteo Máximo"] },
  { nome: "Alongamento de Isquiotibiais em Pé", categoria: "Alongamentos", grupoMuscular: "Posterior", subGrupo: "Posterior de Coxa", nivel: "Iniciante", equipamentos: ["Nenhum"], musculosPrimarios: ["Isquiotibiais"], musculosSecundarios: ["Gastrocnêmio", "Glúteo Máximo", "Lombar"] },
  { nome: "Alongamento de Glúteos Figura 4", categoria: "Alongamentos", grupoMuscular: "Glúteos", subGrupo: "Glúteos e Rotadores", nivel: "Iniciante", equipamentos: ["Colchonete"], musculosPrimarios: ["Glúteo Máximo", "Piriforme"], musculosSecundarios: ["Glúteo Médio", "Isquiotibiais"] },
  { nome: "Pigeon Stretch", categoria: "Alongamentos", grupoMuscular: "Glúteos", subGrupo: "Flexores e Rotadores de Quadril", nivel: "Iniciante", equipamentos: ["Colchonete"], musculosPrimarios: ["Glúteo Máximo", "Piriforme", "Iliopsoas (perna oposta)"], musculosSecundarios: ["Glúteo Médio", "Adutores"] },
  { nome: "Alongamento de Panturrilha na Parede", categoria: "Alongamentos", grupoMuscular: "Panturrilhas", subGrupo: "Tornozelo e Panturrilha", nivel: "Iniciante", equipamentos: ["Parede"], musculosPrimarios: ["Gastrocnêmio", "Sóleo"], musculosSecundarios: ["Tibial Posterior", "Fáscia Plantar"] },
  { nome: "Alongamento de Panturrilha no Degrau", categoria: "Alongamentos", grupoMuscular: "Panturrilhas", subGrupo: "Flexão Dorsal de Tornozelo", nivel: "Iniciante", equipamentos: ["Degrau ou Bloco"], musculosPrimarios: ["Gastrocnêmio", "Sóleo"], musculosSecundarios: ["Tibial Posterior", "Tendão de Aquiles"] },

  // === MOBILIDADE ===
  { nome: "Shoulder CARs", categoria: "Mobilidade", grupoMuscular: "Ombros", subGrupo: "Articulação Glenoumeral", nivel: "Iniciante", equipamentos: ["Nenhum"], musculosPrimarios: ["Músculos da Articulação do Ombro (Manguito, Deltoides)"], musculosSecundarios: ["Trapézio", "Serrátil Anterior"] },
  { nome: "Wall Slides", categoria: "Mobilidade", grupoMuscular: "Ombros", subGrupo: "Escápulotorácica e Ombros", nivel: "Iniciante", equipamentos: ["Parede"], musculosPrimarios: ["Trapézio Médio/Inferior", "Serrátil Anterior"], musculosSecundarios: ["Romboide", "Manguito Rotador"] },
  { nome: "World's Greatest Stretch", categoria: "Mobilidade", grupoMuscular: "Glúteos", subGrupo: "Mobilidade Global de Quadril e Torácica", nivel: "Iniciante", equipamentos: ["Colchonete"], musculosPrimarios: ["Glúteo Máximo", "Iliopsoas", "Eretores da Espinha (Torácica)"], musculosSecundarios: ["Isquiotibiais", "Peitoral Maior", "Adutores"] },
  { nome: "90/90 Hip Stretch", categoria: "Mobilidade", grupoMuscular: "Glúteos", subGrupo: "Rotação Interna e Externa de Quadril", nivel: "Iniciante", equipamentos: ["Colchonete"], musculosPrimarios: ["Rotadores Externos de Quadril (Piriforme, Glúteo Médio)", "Rotadores Internos"], musculosSecundarios: ["Glúteo Máximo", "Adutores"] },
  { nome: "Hip CARs", categoria: "Mobilidade", grupoMuscular: "Glúteos", subGrupo: "Articulação Coxofemoral", nivel: "Iniciante", equipamentos: ["Nenhum (ou Apoio para equilíbrio)"], musculosPrimarios: ["Músculos do Quadril (Glúteos, Iliopsoas, Adutores, Tensor da Fáscia Lata)"], musculosSecundarios: ["Core (estabilização)"] },
  { nome: "Rotação Torácica", categoria: "Mobilidade", grupoMuscular: "Costas", subGrupo: "Coluna Torácica", nivel: "Iniciante", equipamentos: ["Colchonete"], musculosPrimarios: ["Eretores da Espinha (Região Torácica)", "Oblíquos"], musculosSecundarios: ["Trapézio", "Romboide"] },
  { nome: "Open Book", categoria: "Mobilidade", grupoMuscular: "Costas", subGrupo: "Coluna Torácica e Peitoral", nivel: "Iniciante", equipamentos: ["Colchonete"], musculosPrimarios: ["Eretores da Espinha (Torácica)", "Peitoral Maior"], musculosSecundarios: ["Oblíquo Externo", "Deltoide Anterior"] },
  { nome: "Mobilidade de Tornozelo Unilateral", categoria: "Mobilidade", grupoMuscular: "Panturrilhas", subGrupo: "Articulação Tibiotársica", nivel: "Iniciante", equipamentos: ["Parede ou Degrau"], musculosPrimarios: ["Tendão de Aquiles", "Sóleo"], musculosSecundarios: ["Gastrocnêmio", "Tibial Anterior"] },
  { nome: "Joelho na Parede", categoria: "Mobilidade", grupoMuscular: "Panturrilhas", subGrupo: "Articulação do Tornozelo", nivel: "Iniciante", equipamentos: ["Parede", "Fita Métrica (opcional)"], musculosPrimarios: ["Sóleo", "Gastrocnêmio"], musculosSecundarios: ["Tibial Posterior", "Fáscia Plantar"] },
  { nome: "Mobilidade de Punho no Solo", categoria: "Mobilidade", grupoMuscular: "Antebraço", subGrupo: "Articulação Radiocárpica", nivel: "Iniciante", equipamentos: ["Colchonete"], musculosPrimarios: ["Flexores do Punho", "Extensores do Punho"], musculosSecundarios: ["Músculos do Antebraço"] },
  { nome: "Extensão de Punho Controlada", categoria: "Mobilidade", grupoMuscular: "Antebraço", subGrupo: "Articulação do Punho", nivel: "Iniciante", equipamentos: ["Nenhum"], musculosPrimarios: ["Extensores do Punho", "Flexores do Punho"], musculosSecundarios: ["Pronadores e Supinadores"] },

  // === FUNCIONAL ===
  { nome: "Burpee", categoria: "Funcional", grupoMuscular: "Peito", subGrupo: "Condicionamento de Corpo Inteiro", nivel: "Avançado", equipamentos: ["Peso Corporal"], musculosPrimarios: ["Peitoral Maior", "Quadríceps Femoral", "Glúteo Máximo", "Core"], musculosSecundarios: ["Tríceps Braquial", "Deltoide Anterior", "Gastrocnêmio", "Coração"] },
  { nome: "Kettlebell Swing", categoria: "Funcional", grupoMuscular: "Posterior", subGrupo: "Dobradiça de Quadril e Potência", nivel: "Intermediário", equipamentos: ["Kettlebell"], musculosPrimarios: ["Glúteo Máximo", "Isquiotibiais"], musculosSecundarios: ["Eretores da Espinha", "Core", "Deltoides", "Trapézio"] },
  { nome: "Battle Rope", categoria: "Funcional", grupoMuscular: "Ombros", subGrupo: "Resistência de Superiores", nivel: "Intermediário", equipamentos: ["Corda Naval (Battle Rope)"], musculosPrimarios: ["Deltoides", "Músculos do Antebraço (Pegada)", "Core"], musculosSecundarios: ["Bíceps Braquial", "Tríceps Braquial", "Trapézio", "Coração"] },
  { nome: "Box Jump", categoria: "Funcional", grupoMuscular: "Quadríceps", subGrupo: "Potência de Membros Inferiores", nivel: "Intermediário", equipamentos: ["Caixa Pliométrica (Plyo Box)"], musculosPrimarios: ["Quadríceps Femoral", "Glúteo Máximo", "Gastrocnêmio"], musculosSecundarios: ["Isquiotibiais", "Core", "Coração"] },
  { nome: "Box Step", categoria: "Funcional", grupoMuscular: "Quadríceps", subGrupo: "Membros Inferiores Força/Resistência", nivel: "Iniciante", equipamentos: ["Caixa de Salto ou Banco", "Halteres (opcional)"], musculosPrimarios: ["Quadríceps Femoral", "Glúteo Máximo"], musculosSecundarios: ["Gastrocnêmio", "Isquiotibiais", "Core"] },
  { nome: "Slam Ball", categoria: "Funcional", grupoMuscular: "Abdômen", subGrupo: "Potência de Core e Superiores", nivel: "Intermediário", equipamentos: ["Slam Ball (Bola Medicinal de Peso)"], musculosPrimarios: ["Reto Abdominal", "Transverso do Abdômen", "Deltoides", "Latíssimo do Dorso"], musculosSecundarios: ["Quadríceps", "Glúteos", "Tríceps"] },
  { nome: "Wall Ball", categoria: "Funcional", grupoMuscular: "Quadríceps", subGrupo: "Potência de Corpo Inteiro", nivel: "Intermediário", equipamentos: ["Medicine Ball (Bola Macia)", "Parede com Alvo"], musculosPrimarios: ["Quadríceps Femoral", "Glúteo Máximo", "Deltoides"], musculosSecundarios: ["Peitoral Maior", "Tríceps Braquial", "Core", "Coração"] },
  { nome: "Sled Push", categoria: "Funcional", grupoMuscular: "Quadríceps", subGrupo: "Potência e Força de Pernas", nivel: "Intermediário", equipamentos: ["Trineo de Carga (Sled)", "Anilhas", "Pista de Grama Sintética"], musculosPrimarios: ["Quadríceps Femoral", "Glúteo Máximo", "Gastrocnêmio", "Sóleo"], musculosSecundarios: ["Isquiotibiais", "Core", "Coração"] },
  { nome: "Sled Pull", categoria: "Funcional", grupoMuscular: "Costas", subGrupo: "Cadeia Posterior e Pegada", nivel: "Intermediário", equipamentos: ["Trineo (Sled)", "Corda de Tração", "Anilhas"], musculosPrimarios: ["Latíssimo do Dorso", "Eretores da Espinha", "Isquiotibiais", "Glúteo Máximo"], musculosSecundarios: ["Bíceps Braquial", "Trapezius", "Core", "Coração"] },
  { nome: "Agilidade na Escada", categoria: "Funcional", grupoMuscular: "Panturrilhas", subGrupo: "Coordenação e Velocidade", nivel: "Iniciante", equipamentos: ["Escada de Agilidade"], musculosPrimarios: ["Gastrocnêmio", "Sóleo"], musculosSecundarios: ["Tibial Anterior", "Quadríceps", "Core", "Coração"] },
  { nome: "Bear Crawl", categoria: "Funcional", grupoMuscular: "Abdômen", subGrupo: "Estabilização Dinâmica", nivel: "Intermediário", equipamentos: ["Nenhum"], musculosPrimarios: ["Core (Transverso, Reto, Oblíquos)", "Deltoides"], musculosSecundarios: ["Quadríceps Femoral", "Peitoral Maior", "Serrátil Anterior"] },
  { nome: "Crab Walk", categoria: "Funcional", grupoMuscular: "Glúteos", subGrupo: "Cadeia Posterior e Estabilidade", nivel: "Iniciante", equipamentos: ["Nenhum"], musculosPrimarios: ["Glúteo Máximo", "Tríceps Braquial", "Core"], musculosSecundarios: ["Isquiotibiais", "Deltoide Posterior"] },
  { nome: "Turkish Get Up", categoria: "Funcional", grupoMuscular: "Ombros", subGrupo: "Estabilidade de Ombro e Core", nivel: "Avançado", equipamentos: ["Kettlebell ou Halter", "Colchonete"], musculosPrimarios: ["Core Global (Reto, Oblíquos, Transverso)", "Deltoides (estabilização)"], musculosSecundarios: ["Glúteo Máximo", "Quadríceps", "Trapézio", "Manguito Rotador"] },
  { nome: "Thruster", categoria: "Funcional", grupoMuscular: "Quadríceps", subGrupo: "Cardio e Potência Corpo Inteiro", nivel: "Avançado", equipamentos: ["Barra ou Halteres", "Anilhas"], musculosPrimarios: ["Quadríceps Femoral", "Glúteo Máximo", "Deltoides"], musculosSecundarios: ["Tríceps Braquial", "Core", "Coração"] },
  { nome: "Clean", categoria: "Funcional", grupoMuscular: "Quadríceps", subGrupo: "Levantamento Olímpico Potência", nivel: "Avançado", equipamentos: ["Barra Olímpica", "Anilhas Bumper"], musculosPrimarios: ["Glúteo Máximo", "Quadríceps Femoral", "Isquiotibiais", "Trapézio"], musculosSecundarios: ["Eretores da Espinha", "Deltoides", "Antebraços", "Core"] },
  { nome: "Push Press", categoria: "Funcional", grupoMuscular: "Ombros", subGrupo: "Potência de Superiores", nivel: "Intermediário", equipamentos: ["Barra ou Halteres", "Anilhas"], musculosPrimarios: ["Deltoides", "Tríceps Braquial"], musculosSecundarios: ["Quadríceps Femoral", "Glúteo Máximo", "Core"] },

  // === REABILITAÇÃO ===
  { nome: "Rotação Externa com Elástico", categoria: "Reabilitação", grupoMuscular: "Ombros", subGrupo: "Manguito Rotador", nivel: "Iniciante", equipamentos: ["Fita Elástica (Theraband)"], musculosPrimarios: ["Infraespinhal", "Redondo Menor"], musculosSecundarios: ["Deltoide Posterior", "Trapézio Médio"] },
  { nome: "Rotação Interna com Elástico", categoria: "Reabilitação", grupoMuscular: "Ombros", subGrupo: "Manguito Rotador", nivel: "Iniciante", equipamentos: ["Fita Elástica"], musculosPrimarios: ["Subescapular"], musculosSecundarios: ["Peitoral Maior", "Deltoide Anterior"] },
  { nome: "Face Pull Leve", categoria: "Reabilitação", grupoMuscular: "Ombros", subGrupo: "Ativação de Cintura Escapular", nivel: "Iniciante", equipamentos: ["Polia Alta ou Elástico", "Corda"], musculosPrimarios: ["Deltoide Posterior", "Trapézio Médio/Inferior"], musculosSecundarios: ["Romboide", "Infraespinhal", "Redondo Menor"] },
  { nome: "Terminal Knee Extension", categoria: "Reabilitação", grupoMuscular: "Quadríceps", subGrupo: "Estabilização de Joelho", nivel: "Iniciante", equipamentos: ["Elástico Loop preso em estrutura fixa"], musculosPrimarios: ["Vasto Medial Oblíquo (VMO) - Quadríceps"], musculosSecundarios: ["Gastrocnêmio"] },
  { nome: "Mini Agachamento", categoria: "Reabilitação", grupoMuscular: "Quadríceps", subGrupo: "Fisioterapia de Joelho/Quadril", nivel: "Iniciante", equipamentos: ["Nenhum (ou Parede para apoio)"], musculosPrimarios: ["Quadríceps Femoral", "Glúteo Máximo"], musculosSecundarios: ["Isquiotibiais", "Sólio"] },
  { nome: "Step Down Controlado", categoria: "Reabilitação", grupoMuscular: "Quadríceps", subGrupo: "Controle Excêntrico de Joelho", nivel: "Iniciante", equipamentos: ["Degrau Baixo ou Caixa Baixa"], musculosPrimarios: ["Quadríceps Femoral", "Glúteo Médio (estabilização)"], musculosSecundarios: ["Sóleo", "Isquiotibiais"] },
  { nome: "Ponte de Glúteo (Reabilitação)", categoria: "Reabilitação", grupoMuscular: "Glúteos", subGrupo: "Fisioterapia Pélvica/Lombar", nivel: "Iniciante", equipamentos: ["Colchonete"], musculosPrimarios: ["Glúteo Máximo"], musculosSecundarios: ["Isquiotibiais", "Transverso do Abdômen", "Eretores da Espinha"] },
  { nome: "Clamshell", categoria: "Reabilitação", grupoMuscular: "Glúteos", subGrupo: "Fisioterapia de Quadril", nivel: "Iniciante", equipamentos: ["Colchonete", "Mini Band (opcional)"], musculosPrimarios: ["Glúteo Médio", "Rotadores Externos de Quadril (Piriforme)"], musculosSecundarios: ["Tensor da Fáscia Lata"] },
  { nome: "Abdução de Quadril com Mini Band", categoria: "Reabilitação", grupoMuscular: "Abdutores", subGrupo: "Fisioterapia de Quadril", nivel: "Iniciante", equipamentos: ["Mini Band", "Colchonete"], musculosPrimarios: ["Glúteo Médio", "Glúteo Mínimo"], musculosSecundarios: ["Tensor da Fáscia Lata"] },
  { nome: "Bird Dog (Corretivo)", categoria: "Reabilitação", grupoMuscular: "Lombar", subGrupo: "Estabilização da Coluna Lombar", nivel: "Iniciante", equipamentos: ["Colchonete"], musculosPrimarios: ["Multífidos", "Eretores da Espinha", "Transverso do Abdômen"], musculosSecundarios: ["Glúteo Máximo", "Deltoide Posterior"] },
  { nome: "Dead Bug (Corretivo)", categoria: "Reabilitação", grupoMuscular: "Abdômen", subGrupo: "Estabilização Lombar/Pélvica", nivel: "Iniciante", equipamentos: ["Colchonete"], musculosPrimarios: ["Transverso do Abdômen", "Oblíquo Interno"], musculosSecundarios: ["Reto Abdominal", "Flexores do Quadril"] },
  { nome: "McGill Curl Up", categoria: "Reabilitação", grupoMuscular: "Abdômen", subGrupo: "Fortalecimento de Core sem Flexão Lombar", nivel: "Iniciante", equipamentos: ["Colchonete"], musculosPrimarios: ["Reto Abdominal (Ativação profunda)", "Transverso do Abdômen"], musculosSecundarios: ["Oblíquo Externo"] },
  { nome: "Equilíbrio Unilateral", categoria: "Reabilitação", grupoMuscular: "Panturrilhas", subGrupo: "Propriocepção de Tornozelo", nivel: "Iniciante", equipamentos: ["Nenhum (ou Disco de Equilíbrio/Bosu)"], musculosPrimarios: ["Tibial Posterior", "Fibular Longo/Curto (Estabilizadores)"], musculosSecundarios: ["Sóleo", "Gastrocnêmio", "Glúteo Médio"] },
  { nome: "Elevação de Panturrilha Controlada", categoria: "Reabilitação", grupoMuscular: "Panturrilhas", subGrupo: "Fortalecimento do Tendão de Aquiles", nivel: "Iniciante", equipamentos: ["Degrau ou Solo", "Parede para apoio"], musculosPrimarios: ["Sóleo", "Gastrocnêmio"], musculosSecundarios: ["Tibial Posterior", "Tendão de Aquiles"] },
  { nome: "Scapular Push Up", categoria: "Reabilitação", grupoMuscular: "Costas", subGrupo: "Estabilização Escapular", nivel: "Iniciante", equipamentos: ["Colchonete"], musculosPrimarios: ["Serrátil Anterior"], musculosSecundarios: ["Trapézio Superior/Médio/Inferior", "Peitoral Menor"] },
  { nome: "Y Raise", categoria: "Reabilitação", grupoMuscular: "Ombros", subGrupo: "Estabilização Escapular e Trapézio Inferior", nivel: "Iniciante", equipamentos: ["Halteres Leves ou Solo", "Banco Inclinado (opcional)"], musculosPrimarios: ["Trapézio Inferior"], musculosSecundarios: ["Deltoide Posterior", "Romboide", "Serrátil Anterior"] },
  { nome: "T Raise", categoria: "Reabilitação", grupoMuscular: "Ombros", subGrupo: "Estabilização Escapular e Romboide", nivel: "Iniciante", equipamentos: ["Halteres Leves ou Solo"], musculosPrimarios: ["Trapézio Médio", "Romboide"], musculosSecundarios: ["Deltoide Posterior", "Infraespinhal"] },
  { nome: "W Raise", categoria: "Reabilitação", grupoMuscular: "Ombros", subGrupo: "Manguito Rotador e Postura", nivel: "Iniciante", equipamentos: ["Halteres Leves ou Solo"], musculosPrimarios: ["Infraespinhal", "Redondo Menor", "Trapézio Inferior"], musculosSecundarios: ["Romboide", "Deltoide Posterior"] }
];

// Helper to generate slug from text
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
}

// Generate complete, detailed exercises programmatically
function generateExercises() {
  const completeExercises = exercisesList.map((item, index) => {
    const slug = slugify(item.nome);
    const sub = item.subGrupo;
    const cat = item.categoria;
    const muscle = item.grupoMuscular;

    // Craft highly specific, professional descriptions in Bia Tisatto's specialist voice
    let desc = "";
    let obj = "";
    let resp = "";
    let benef = "";
    let contra = "";
    let steps = [];
    let tips = [];
    let errorsList = [];
    let variations = [];
    let tags = [slug, cat.toLowerCase(), muscle.toLowerCase()];

    // Generate specific text based on category & muscle
    if (cat === "Musculação") {
      desc = `O exercício ${item.nome} é uma ferramenta essencial no treinamento de força moderna. Como especialista em cinesiologia, valorizo profundamente a precisão angular que este movimento exige. Ele recruta o grupo do(s) ${muscle} de forma biomecanicamente eficiente, promovendo a estabilização articular adequada e mitigando estresses desnecessários sobre os ligamentos quando executado com controle estrito.`;
      obj = `Desenvolver a hipertrofia e a força muscular da região do(s) ${muscle}, promovendo maior densidade óssea, estabilidade da articulação associada e integridade neuromuscular.`;
      resp = `Inale (puxe o ar) profundamente pelo nariz durante a fase excêntrica do movimento (quando a carga desce ou retorna). Exhale (solte o ar) de forma firme e coordenada pela boca durante a fase concêntrica ao vencer o ponto de maior esforço muscular.`;
      benef = `Favorece o ganho de massa muscular localizada, melhora a flexibilidade ativa das articulações envolvidas, acelera o metabolismo basal e promove o alinhamento postural corretivo ideal para o dia a dia.`;
      contra = `Indivíduos com quadros álgicos agudos, inflamações tendíneas ou limitações de mobilidade na articulação adjacente devem realizar este exercício sob supervisão profissional e com amplitude adaptada.`;
      
      steps = [
        `1. Posicione-se corretamente no equipamento, alinhando a coluna e garantindo que os pés estejam firmemente apoiados no chão.`,
        `2. Selecione uma carga apropriada que permita a execução perfeita, sem comprometer a sua postura global.`,
        `3. Segure o acessório (ou peso) com uma pegada firme, mantendo as articulações dos punhos neutras e estabilizadas.`,
        `4. Realize a depressão e a retração escapular para proteger a região do ombro antes de iniciar o movimento.`,
        `5. Inicie a fase concêntrica de forma controlada, empurrando ou puxando a carga até o ponto máximo de contração do músculo alvo.`,
        `6. Mantenha uma contração isométrica consciente (pico de contração) por um breve segundo no ponto de máximo esforço.`,
        `7. Inicie a fase excêntrica de retorno lentamente, resistindo de forma consciente à ação da gravidade durante toda a descida.`,
        `8. Conclua a repetição de forma suave antes de iniciar o próximo ciclo de contração muscular coordenada.`
      ];

      tips = [
        `Mantenha sempre o foco mental no músculo trabalhado (${muscle}), visualizando a contração das fibras.`,
        `Evite travar completamente as articulações no final da fase concêntrica para manter a tensão constante no músculo.`,
        `Use os pés como âncoras no chão para criar uma base sólida de força e proteger sua lombar.`,
        `Priorize sempre a cadência controlada (ex: 3 segundos na descida e 2 segundos na subida).`,
        `Se sentir dor articular em vez de fadiga muscular, interrompa o movimento imediatamente e ajuste a postura.`
      ];

      errorsList = [
        `Utilizar excesso de carga (ego-lifting), o que inevitavelmente destrói a mecânica e a técnica corretas.`,
        `Realizar o movimento com velocidade excessiva, aproveitando o balanço ou a inércia em vez de força pura.`,
        `Perder a estabilização escapular, deixando os ombros subirem em direção às orelhas.`,
        `Arredondar ou arquear excessivamente a coluna vertebral de forma compensatória durante o esforço.`,
        `Reduzir severamente a amplitude de movimento por falta de mobilidade ou carga excessiva.`
      ];

      variacoes = [
        `${item.nome} unilateral para corrigir desequilíbrios de força e volume muscular.`,
        `${item.nome} com fita elástica (Theraband) para criar resistência progressiva linear.`,
        `${item.nome} na máquina com cabos para manter a tensão mecânica constante em todo o arco de movimento.`,
        `${item.nome} isométrico mantendo a contração no ponto médio por 3 segundos.`
      ];
    } else if (cat === "Cardio") {
      desc = `O ${item.nome} é um excelente estímulo para o sistema cardiovascular e respiratório. Biomecanicamente, promove um trabalho rítmico e contínuo, estimulando a oxigenação sistêmica e a ativação metabólica geral. É ideal para alunos que buscam aprimorar o condicionamento físico, fôlego e o gasto energético total.`;
      obj = `Melhorar a capacidade aeróbica ou anaeróbica, aprimorar a eficiência do transporte de oxigênio pelo sistema cardiovascular e auxiliar no controle do percentual de gordura corporal.`;
      resp = `Mantenha um padrão de respiração rítmico, profundo e constante. Evite prender o fôlego (manobra de Valsalva); sincronize a inspiração e a expiração com os ciclos de passos ou movimentos corporais de forma natural.`;
      benef = `Aumento da resistência física geral, fortalecimento do miocárdio, melhora do perfil lipídico, regulação da pressão arterial e liberação acentuada de endorfinas facilitadoras do bem-estar.`;
      contra = `Pessoas com cardiopatias instáveis graves ou problemas ortopédicos severos com alto impacto devem consultar um médico antes de iniciar e optar por variações de baixo impacto.`;

      steps = [
        `1. Configure o equipamento ou prepare o espaço de treino, garantindo calçados limpos e amortecimento adequado.`,
        `2. Comece sempre com um aquecimento leve e progressivo de 3 a 5 minutos na velocidade mínima.`,
        `3. Adote uma postura ereta, mantendo o olhar voltado para a frente e o abdômen sutilmente ativado.`,
        `4. Sincronize o movimento dos braços com o dos membros inferiores, garantindo equilíbrio cinético.`,
        `5. Aterrisse de forma suave, distribuindo o impacto do metatarso para o calcanhar, sem passos secos.`,
        `6. Ajuste a intensidade (velocidade, resistência ou inclinação) gradualmente de acordo com o planejado para a sessão.`,
        `7. Mantenha o ritmo planejado de forma consistente, controlando sua frequência cardíaca dentro da zona alvo.`,
        `8. Reduza gradualmente a velocidade nos últimos 2 minutos para um desaquecimento seguro e retorno à homeostase.`
      ];

      tips = [
        `Mantenha os ombros relaxados e evite tensionar o pescoço durante o esforço.`,
        `Monitore a sua respiração para garantir que ela permaneça fluida e sem interrupções bruscas.`,
        `Hidrate-se com pequenos goles de água ao longo da atividade cardiovascular.`,
        `Use calçados esportivos adequados com boa capacidade de absorção de impacto.`,
        `Foque na cadência constante para otimizar o ganho de condicionamento de longo prazo.`
      ];

      errorsList = [
        `Iniciar a atividade em intensidade máxima sem realizar nenhum tipo de aquecimento articular.`,
        `Apoiar todo o peso do corpo sobre o painel do equipamento ou corrimão, reduzindo o trabalho ativo.`,
        `Aterissar com o pé de forma pesada e barulhenta, sobrecarregando joelhos e coluna.`,
        `Projetar o tronco excessivamente para a frente ou para trás, desalinhando o centro de gravidade corporal.`,
        `Ignorar sinais de tontura extrema ou falta de ar aguda, insistindo no esforço inadequado.`
      ];

      variacoes = [
        `${item.nome} em formato intervalado de alta intensidade (HIIT) para otimização do tempo de treino.`,
        `${item.nome} com variação de resistência ou inclinação para recrutar diferentes cadeias musculares.`,
        `${item.nome} de baixa intensidade constante (LISS) para reabilitação e queima de gordura moderada.`,
        `${item.nome} em circuito funcional intercalando com exercícios de peso corporal.`
      ];
    } else if (cat === "Alongamentos") {
      desc = `O alongamento ${item.nome} atua diretamente sobre o tecido conjuntivo e as fibras do(s) ${muscle}. Sob o ponto de vista da flexibilidade, ele diminui a rigidez passiva e melhora o comprimento das fibras em repouso, promovendo relaxamento muscular imediato e restaurando o arco articular funcional saudável.`;
      obj = `Reduzir a tensão nas fibras musculares do(s) ${muscle}, aumentar a amplitude articular de movimento e aliviar dores decorrentes do encurtamento postural crônico.`;
      resp = `Inspire profundamente pelo nariz e, ao soltar o ar de forma lenta pela boca, permita que a musculatura relaxe e ceda, aprofundando o alongamento suavemente a cada ciclo de expiração.`;
      benef = `Melhora imediata da circulação local, redução das dores musculares tardias, prevenção de lesões por estiramento e alívio do estresse físico acumulado.`;
      contra = `Evitar em casos de lesões musculares agudas (estiramento recente de grau II ou III), hipermobilidade articular excessiva ou fraturas em reabilitação ativa.`;

      steps = [
        `1. Sente-se ou posicione-se confortavelmente em uma superfície estável ou colchonete.`,
        `2. Alinhe a postura inicial mantendo a coluna em sua curvatura fisiológica natural.`,
        `3. Respire de forma calma e pausada, preparando o corpo para o alongamento progressivo.`,
        `4. Inicie o movimento de forma extremamente lenta até sentir um leve tensionamento confortável no músculo alvo.`,
        `5. Evite insistências ou solavancos rítmicos rápidos; o alongamento deve ser estático e suave.`,
        `6. Mantenha a posição estática por um período de 20 a 45 segundos, respirando profundamente.`,
        `7. Concentre-se em relaxar e derreter a tensão acumulada a cada expiração profunda.`,
        `8. Retorne à posição neutra de forma extremamente lenta e controlada, evitando movimentos bruscos após o relaxamento.`
      ];

      tips = [
        `O alongamento nunca deve causar dor aguda; sinta apenas um desconforto moderado e prazeroso de estiramento.`,
        `Relaxe a musculatura antagonista para permitir um maior ganho de amplitude passiva.`,
        `A consistência diária é muito mais eficaz para o ganho de flexibilidade do que sessões longas esporádicas.`,
        `Mantenha os dentes afastados e a mandíbula relaxada para auxiliar no relaxamento geral do sistema nervoso.`,
        `Aproveite este momento para se desconectar do estresse e focar na percepção do seu corpo.`
      ];

      errorsList = [
        `Realizar movimentos bruscos ou trancos (balística) na tentativa de alcançar um alongamento maior.`,
        `Prender a respiração, o que causa aumento do tônus muscular e impede o estiramento adequado das fibras.`,
        `Forçar o alongamento além do limite fisiológico seguro, gerando dor excessiva e risco de microlesões.`,
        `Alongar de forma assimétrica, negligenciando um dos lados do corpo ou focar apenas em uma região.`,
        `Executar o alongamento com postura totalmente desalinhada, compensando em outras articulações.`
      ];

      variacoes = [
        `${item.nome} dinâmico controlado com baixa amplitude para aquecimento de treino de força.`,
        `${item.nome} assistido por um parceiro ou utilizando uma faixa de alongamento para maior controle.`,
        `${item.nome} em facilitação neuromuscular proprioceptiva (FNP) para ganho rápido de amplitude.`,
        `${item.nome} isométrico mantendo a tensão de forma extremamente suave por períodos mais longos.`
      ];
    } else if (cat === "Mobilidade") {
      desc = `O trabalho de ${item.nome} foca na saúde articular da região do(s) ${muscle}. Como personal trainer, reforço que a mobilidade é a capacidade de controlar ativamente o movimento em toda a amplitude de uma articulação. Este exercício lubrifica a articulação através do líquido sinovial, reduzindo atritos mecânicos.`;
      obj = `Melhorar a amplitude de movimento ativo na articulação do(s) ${muscle}, promovendo integridade articular, coordenação e reduzindo o risco de compensações posturais prejudiciais.`;
      resp = `Sincronize o movimento articular com a sua respiração. Inspire ao preparar e expire de forma suave e controlada durante a fase de maior abertura ou amplitude de movimento.`;
      benef = `Melhora da qualidade dos movimentos funcionais cotidianos, redução do desgaste articular precoce, melhora do rendimento nos exercícios de força e alívio de rigidez crônica.`;
      contra = `Evitar realizar em articulações com instabilidade severa, luxações recentes ou inflamações agudas na bolsa sinovial (bursite aguda).`;

      steps = [
        `1. Posicione-se de forma estável, garantindo espaço livre para mover a articulação em seu plano anatômico natural.`,
        `2. Comece com uma postura sólida e ativa, ativando levemente o core para isolar o movimento na articulação alvo.`,
        `3. Inicie o movimento de forma consciente, focando na percepção da articulação do(s) ${muscle}.`,
        `4. Realize círculos, rotações ou deslizamentos em um ritmo lento, fluido e extremamente controlado.`,
        `5. Busque explorar a sua amplitude máxima de movimento ativo, sem forçar contra bloqueios de dor severa.`,
        `6. Mantenha os músculos circundantes relaxados para evitar tensões desnecessárias que limitem o arco.`,
        `7. Repita o movimento com cadência regular, sentindo a articulação se tornar gradativamente mais livre e aquecida.`,
        `8. Finalize o ciclo suavemente, retornando à posição neutra e percebendo o ganho de liberdade de movimento.`
      ];

      tips = [
        `Mantenha a estabilidade do restante do corpo para garantir que o movimento ocorra puramente na articulação alvo.`,
        `Realize este exercício descalço (quando possível) para aumentar o feedback sensorial do solo.`,
        `Mobilidade deve ser feita de forma lenta; a pressa impede o sistema nervoso de mapear a nova amplitude.`,
        `Use apoios como bastões ou a parede para auxiliar no equilíbrio se o foco for mobilidade pura.`,
        `Pratique antes do seu treino de força para melhorar consideravelmente a amplitude dos exercícios principais.`
      ];

      errorsList = [
        `Mover outras articulações vizinhas de forma compensatória por falta de controle ou rigidez na articulação alvo.`,
        `Executar os movimentos com velocidade excessiva, transformando o exercício em balística sem controle.`,
        `Forçar o movimento além da barreira fisiológica saudável, gerando estalos dolorosos ou pinçamentos.`,
        `Manter o corpo tenso e rígido, limitando ativamente a amplitude do movimento sinovial.`,
        `Focar apenas nas direções confortáveis, ignorando os planos de movimento que apresentam maior restrição.`
      ];

      variacoes = [
        `${item.nome} utilizando um rolo de liberação miofascial preliminar para reduzir a restrição tecidual.`,
        `${item.nome} com resistência leve de elástico para estimular os mecanorreceptores articulares.`,
        `${item.nome} em posições de sustentação de peso para aumentar a propriocepção ativa.`,
        `${item.nome} em transição dinâmica conectando com outros movimentos de mobilidade postural.`
      ];
    } else if (cat === "Funcional") {
      desc = `O movimento de ${item.nome} visa aprimorar a integração de múltiplas cadeias musculares. Diferente do isolamento clássico, o treino funcional foca no padrão de movimento natural humano (puxar, empurrar, agachar, rotacionar, transportar). Ele desafia a coordenação, estabilidade do core e o equilíbrio dinâmico global.`;
      obj = `Desenvolver a força integrada, melhorar a estabilidade do core, coordenação motora multiarticular, agilidade e condicionamento físico aplicado às tarefas diárias ou esportivas.`;
      resp = `Respire de forma contínua, profunda e vigorosa. Sincronize a expiração forçada com o ponto de maior aceleração ou esforço dinâmico, mantendo o transverso do abdômen ativo para proteger sua coluna.`;
      benef = `Melhora expressiva da consciência corporal, aumento da queima calórica por recrutar grande quantidade de massa muscular, e melhora na transferência de força para atividades do dia a dia.`;
      contra = `Indivíduos sem base adequada de estabilização do core ou controle articular devem iniciar com variações regressivas mais simples antes de realizar movimentos complexos de alta velocidade.`;

      steps = [
        `1. Organize os acessórios necessários e delimite uma área livre e segura para execução dinâmica do movimento.`,
        `2. Adote uma postura inicial sólida, ativando o core e mantendo o centro de gravidade alinhado sobre os pés.`,
        `3. Inicie o movimento coordenado integrando o quadril, membros inferiores e tronco de forma sinérgica.`,
        `4. Execute o padrão de movimento com foco no controle tridimensional, evitando desvios ou balanços indesejados.`,
        `5. Utilize a força do core para estabilizar a coluna enquanto os membros realizam a ação dinâmica.`,
        `6. Mantenha a transição entre as fases do movimento suave, sem trancos articulares ou perda de alinhamento postural.`,
        `7. Foque no ritmo e na fluidez motora, garantindo que todas as articulações envolvidas trabalhem em harmonia.`,
        `8. Conclua o movimento de forma equilibrada, reestabelecendo a postura inicial com controle absoluto.`
      ];

      tips = [
        `Mantenha o core ativado constantemente; ele é o elo de transmissão de força entre membros inferiores e superiores.`,
        `Foque na qualidade técnica de cada repetição antes de tentar aumentar a velocidade do exercício.`,
        `Distribua o peso corporal de forma uniforme pelos pés, mantendo o contato completo com o solo.`,
        `Mantenha os ombros posicionados para baixo e para trás, evitando compensações no pescoço.`,
        `Respeite a individualidade do seu corpo e faça adaptações de velocidade ou carga quando necessário.`
      ];

      errorsList = [
        `Perder a ativação do core, resultando em sobrecarga na coluna lombar durante movimentos dinâmicos.`,
        `Realizar o exercício com técnica inadequada na tentativa de priorizar apenas o número de repetições ou velocidade.`,
        `Deixar os joelhos desabarem para dentro (valgo dinâmico) ao agachar ou saltar no exercício.`,
        `Bloquear a respiração durante o esforço (apneia compensatória), prejudicando o fluxo de oxigênio corporal.`,
        `Aterissar de forma pesada ou sem controle após saltos, gerando alto estresse de impacto articular.`
      ];

      variacoes = [
        `${item.nome} com carga unilateral para desafiar ainda mais os estabilizadores rotacionais do core.`,
        `${item.nome} em ritmo de circuito metabólico para ênfase no condicionamento cardiovascular.`,
        `${item.nome} em velocidade reduzida focando no controle excêntrico e na estabilização isométrica.`,
        `${item.nome} utilizando superfícies instáveis de forma moderada para reabilitação proprioceptiva.`
      ];
    } else if (cat === "Reabilitação") {
      desc = `O exercício corretivo ${item.nome} foi desenvolvido com propósitos puramente preventivos ou de reabilitação. Biomecanicamente, o seu foco é restabelecer a ativação correta de músculos estabilizadores profundos muitas vezes inibidos (como o manguito ou o transverso), corrigindo padrões de movimento disfuncionais.`;
      obj = `Ativar de forma isolada e precisa músculos estabilizadores enfraquecidos, restaurar a integridade articular e aliviar compensações musculares prejudiciais ao corpo.`;
      resp = `Respire de forma calma, pausada e controlada. Expire no momento de ativação isométrica do músculo alvo, garantindo uma contração consciente sem recrutar músculos compensatórios vizinhos.`;
      benef = `Alívio significativo de dores articulares crônicas, restauração de padrões de movimento seguros e saudáveis, prevenção ativa contra lesões esportivas ou cotidianas e melhora postural.`;
      contra = `Caso sinta dor aguda, pinçamento ou desconforto articular durante a execução, pare imediatamente o exercício e consulte o seu fisioterapeuta de confiança.`;

      steps = [
        `1. Posicione-se confortavelmente, se necessário utilizando colchonetes ou elásticos de resistência muito leve.`,
        `2. Concentre-se mentalmente na região a ser trabalhada (${sub}), relaxando os músculos hiperativos que costumam compensar.`,
        `3. Inicie a contração de forma extremamente sutil, focando puramente na ativação isolada do músculo alvo.`,
        `4. Execute o movimento em amplitude reduzida, garantindo que não ocorra nenhuma dor ou desconforto articular.`,
        `5. No final do movimento, sustente uma contração isométrica leve de 2 a 5 segundos para reforço neuromuscular.`,
        `6. Retorne à posição inicial de forma lenta, sentindo o músculo trabalhar de forma controlada também no retorno.`,
        `7. Realize o movimento com total ausência de pressa, priorizando a precisão microscópica do gesto motor.`,
        `8. Finalize as repetições propostas, focando na sensação de estabilidade e conforto gerada na articulação.`
      ];

      tips = [
        `Neste exercício, "menos é mais" — cargas altas apenas ativam os músculos maiores compensatórios.`,
        `Mantenha o olhar relaxado e evite fazer careta; a tensão facial reflete em rigidez muscular no pescoço.`,
        `Concentre-se em sentir o músculo específico queimar levemente por ativação, e nunca dor na articulação.`,
        `Se o elástico estiver muito pesado, aproxime-se do ponto de fixação para reduzir a resistência.`,
        `A regularidade diária destes exercícios corretivos é a chave para reprogramar os padrões de movimento do cérebro.`
      ];

      errorsList = [
        `Utilizar elásticos ou cargas excessivamente pesadas, forçando o corpo a compensar com outros músculos maiores.`,
        `Executar o movimento de forma apressada, perdendo a fase de ativação neuromuscular isométrica essencial.`,
        `Ignorar pequenos estalos dolorosos ou sensação de pinçamento na articulação durante o movimento.`,
        `Perder o alinhamento postural básico, deixando os ombros subirem ou o quadril inclinar de forma compensatória.`,
        `Realizar o exercício de forma mecânica e distraída, sem aplicar o foco mental consciente na contração do músculo.`
      ];

      variacoes = [
        `${item.nome} isométrica pura sustentando a contração por 10 a 15 segundos de forma isolada.`,
        `${item.nome} com variação de ângulo de fixação da fita elástica para recrutar diferentes fibras estabilizadoras.`,
        `${item.nome} com suporte manual suave para auxiliar no controle da amplitude de movimento de forma segura.`,
        `${item.nome} com os olhos fechados para aprimorar a propriocepção e a percepção sinestésica do próprio corpo.`
      ];
    }

    // Prepare complete tags
    item.equipamentos.forEach(eq => tags.push(eq.toLowerCase()));
    item.musculosPrimarios.forEach(m => tags.push(m.toLowerCase()));
    item.musculosSecundarios.forEach(m => tags.push(m.toLowerCase()));
    const uniqueTags = [...new Set(tags)].slice(0, 10);

    return {
      id: `ex_${(index + 1).toString().padStart(3, '0')}`,
      nome: item.nome,
      slug: slug,
      categoria: cat,
      grupoMuscular: muscle,
      subGrupo: sub,
      nivel: item.nivel,
      equipamentos: item.equipamentos,
      musculos: [...item.musculosPrimarios, ...item.musculosSecundarios],
      musculosPrimarios: item.musculosPrimarios,
      musculosSecundarios: item.musculosSecundarios,
      descricao: desc,
      objetivo: obj,
      execucao: steps,
      respiracao: resp,
      dicas: tips,
      erros: errorsList,
      beneficios: benef,
      contraindicacoes: contra,
      variacoes: variacoes,
      gif: `/exercicios/${slugify(muscle)}/${slug}.gif`,
      video: "",
      tags: uniqueTags,
      criadoEm: "2026-07-17T00:00:00Z",
      atualizadoEm: "2026-07-17T00:00:00Z"
    };
  });

  // Ensure directories exist and save JSON
  const dir = path.dirname(EXERCISES_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(EXERCISES_FILE_PATH, JSON.stringify(completeExercises, null, 2), 'utf8');
  console.log(`Sucesso: Gerados e salvos ${completeExercises.length} exercícios completos com sucesso!`);
}

generateExercises();
