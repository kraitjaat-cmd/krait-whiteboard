import type { DiagramObjectData } from '../types/canvas';

export function createCellDiagram(
  x: number = 180,
  y: number = 90,
  isDark: boolean = false
): DiagramObjectData {
  const blue = isDark ? '#38BDF8' : '#0284C7';
  const purple = isDark ? '#C084FC' : '#9333EA';
  const green = isDark ? '#4ADE80' : '#16A34A';
  const orange = isDark ? '#FB923C' : '#EA580C';
  const red = isDark ? '#FB7185' : '#E11D48';
  const yellow = isDark ? '#FDE047' : '#CA8A04';
  const outline = isDark ? '#F8FAFC' : '#18181B';

  return {
    id: `diagram-cell-${Date.now()}`,
    type: 'diagram',
    subject: 'Eukaryotic Cell Ultrastructure',
    title: 'Ultrastructure of an Animal Cell & Organelles',
    subtitle: 'Detailed Cytology & Organelle Function Illustration',
    x,
    y,
    width: 980,
    height: 700,
    zIndex: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    style: 'hand_drawn_scientific',
    components: [
      // 1. Plasma Membrane & Cytoplasm (Outer organic blob)
      {
        id: 'plasma-membrane',
        name: 'Plasma Membrane (Phospholipid Bilayer)',
        type: 'membrane',
        path: 'M 350,150 C 500,120 680,180 720,320 C 760,460 680,580 520,610 C 340,640 220,540 200,400 C 180,260 250,170 350,150 Z',
        fill: isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(2, 132, 199, 0.08)',
        stroke: blue,
        strokeWidth: 4.0,
      },
      // 2. Nucleus (Large central double-membrane sphere)
      {
        id: 'nucleus',
        name: 'Nucleus (Double Membrane & Pores)',
        type: 'organelle',
        path: 'M 400,280 C 480,270 530,320 520,400 C 510,470 450,500 380,480 C 320,460 320,380 340,320 C 360,285 380,280 400,280 Z',
        fill: isDark ? 'rgba(192, 132, 252, 0.35)' : 'rgba(147, 51, 234, 0.22)',
        stroke: purple,
        strokeWidth: 3.0,
      },
      // 3. Nucleolus (Dense spherical core of ribosome RNA synthesis)
      {
        id: 'nucleolus',
        name: 'Nucleolus (rRNA Synthesis)',
        type: 'organelle',
        path: 'M 400,350 A 28 28 0 1 0 456,350 A 28 28 0 1 0 400,350 Z',
        fill: purple,
        stroke: outline,
        strokeWidth: 2.0,
      },
      // 4. Rough Endoplasmic Reticulum (RER - Folded cisternae studded with dots)
      {
        id: 'rough-er',
        name: 'Rough Endoplasmic Reticulum (Ribosome Studded)',
        type: 'organelle',
        path: 'M 320,300 C 270,300 260,360 270,420 M 300,280 C 240,280 230,370 240,450 M 280,260 C 210,260 200,390 220,480',
        fill: 'none',
        stroke: blue,
        strokeWidth: 3.5,
      },
      // 5. Mitochondria (Oval with inner folded cristae - Powerhouse of the cell)
      {
        id: 'mitochondria-1',
        name: 'Mitochondrion (ATP Synthesis / Cellular Respiration)',
        type: 'organelle',
        path: 'M 560,200 C 620,180 660,220 640,260 C 620,300 560,290 530,260 C 510,230 530,210 560,200 Z',
        fill: isDark ? 'rgba(249, 115, 22, 0.35)' : 'rgba(234, 88, 12, 0.25)',
        stroke: orange,
        strokeWidth: 2.5,
      },
      // Inner Cristae Folds
      {
        id: 'mitochondria-cristae',
        name: 'Mitochondrial Cristae',
        type: 'detail',
        path: 'M 550,220 C 580,210 600,240 630,230 M 545,245 C 575,235 595,265 625,255',
        fill: 'none',
        stroke: orange,
        strokeWidth: 2.0,
      },
      // 6. Golgi Apparatus (Stacked curved cisternae with secretory vesicles)
      {
        id: 'golgi-body',
        name: 'Golgi Apparatus (Protein Sorting & Packaging)',
        type: 'organelle',
        path: 'M 550,440 C 600,420 630,440 660,470 M 560,465 C 610,445 640,465 670,495 M 570,490 C 620,470 650,490 680,520',
        fill: 'none',
        stroke: green,
        strokeWidth: 4.0,
      },
      // 7. Lysosomes & Peroxisomes (Small circular enzymatic vesicles)
      {
        id: 'lysosome-1',
        name: 'Lysosome (Digestive Enzymes / Autophagy)',
        type: 'vesicle',
        path: 'M 320,530 A 15 15 0 1 0 350,530 A 15 15 0 1 0 320,530 Z',
        fill: isDark ? 'rgba(251, 113, 133, 0.5)' : 'rgba(225, 29, 72, 0.4)',
        stroke: red,
        strokeWidth: 2.0,
      },
      {
        id: 'centrioles',
        name: 'Centrosome / Centrioles (Microtubule Organizing Center)',
        type: 'organelle',
        path: 'M 470,230 L 490,230 M 470,236 L 490,236 M 470,242 L 490,242 M 500,225 L 500,245 M 506,225 L 506,245 M 512,225 L 512,245',
        fill: 'none',
        stroke: yellow,
        strokeWidth: 2.5,
      },
    ],
    labels: [
      {
        id: 'lbl-plasma-mem',
        targetPoint: { x: 300, y: 160 },
        labelPoint: { x: 180, y: 80 },
        text: 'Plasma Membrane',
        description: 'Selective permeability, receptor signaling & transport',
        side: 'top',
        color: blue,
        isKeyFact: true,
      },
      {
        id: 'lbl-nucleus',
        targetPoint: { x: 420, y: 310 },
        labelPoint: { x: 420, y: 120 },
        text: 'Nucleus & Chromatin',
        description: 'Houses genomic DNA; controls transcription & cellular heredity',
        side: 'top',
        color: purple,
        isKeyFact: true,
      },
      {
        id: 'lbl-nucleolus',
        targetPoint: { x: 428, y: 350 },
        labelPoint: { x: 430, y: 440 },
        text: 'Nucleolus',
        description: 'Site of ribosomal RNA (rRNA) synthesis and subunit assembly',
        side: 'bottom',
        color: purple,
      },
      {
        id: 'lbl-rer',
        targetPoint: { x: 250, y: 350 },
        labelPoint: { x: 90, y: 350 },
        text: 'Rough Endoplasmic Reticulum (RER)',
        description: 'Studded with 80S ribosomes for secretory protein synthesis & folding',
        side: 'left',
        color: blue,
      },
      {
        id: 'lbl-mito',
        targetPoint: { x: 600, y: 230 },
        labelPoint: { x: 740, y: 190 },
        text: 'Mitochondrion',
        description: 'Site of Krebs cycle & Oxidative Phosphorylation → ATP synthesis',
        side: 'right',
        color: orange,
        isKeyFact: true,
      },
      {
        id: 'lbl-golgi',
        targetPoint: { x: 630, y: 470 },
        labelPoint: { x: 760, y: 460 },
        text: 'Golgi Apparatus',
        description: 'Post-translational modification, glycosylation, sorting to vesicles',
        side: 'right',
        color: green,
        isKeyFact: true,
      },
      {
        id: 'lbl-lyso',
        targetPoint: { x: 335, y: 530 },
        labelPoint: { x: 200, y: 570 },
        text: 'Lysosome (Hydrolases)',
        description: 'Degrades macromolecules, damaged organelles & phagocytosed pathogens',
        side: 'bottom',
        color: red,
      },
      {
        id: 'lbl-centrioles',
        targetPoint: { x: 490, y: 235 },
        labelPoint: { x: 680, y: 100 },
        text: 'Centrosome / Centrioles',
        description: 'Organizes mitotic spindle fibers during cell division',
        side: 'top',
        color: yellow,
      },
    ],
    arrows: [
      {
        id: 'arrow-secretory-pathway',
        points: [{ x: 270, y: 360 }, { x: 420, y: 430 }, { x: 570, y: 470 }, { x: 700, y: 490 }],
        color: green,
        label: 'Secretory Protein Route (RER → Golgi → Exocytosis)',
        type: 'signal',
      },
    ],
    callouts: [
      {
        id: 'callout-cell-summary',
        x: 40,
        y: 600,
        title: '🧬 Central Dogma of Cell Function',
        content: 'DNA (Nucleus) → Transcription → mRNA → Translation (Ribosomes on RER) → Protein Folding → Vesicular Transport → Golgi Modification → Targeted Destination (Membrane / Lysosome / Secretion)',
        type: 'fact',
      },
    ],
    legend: [
      { label: 'Genetic Machinery (Nucleus/Nucleolus)', color: purple },
      { label: 'Bioenergetics (Mitochondria / ATP)', color: orange },
      { label: 'Secretory / Protein Pathway (RER & Golgi)', color: green },
      { label: 'Digestion & Waste (Lysosomes)', color: red },
    ],
  };
}
