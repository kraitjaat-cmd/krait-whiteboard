import type { DiagramObjectData } from '../types/canvas';

export function createNephronDiagram(
  x: number = 180,
  y: number = 80,
  isDark: boolean = false
): DiagramObjectData {
  const red = isDark ? '#FB7185' : '#E11D48';
  const blue = isDark ? '#38BDF8' : '#0284C7';
  const yellow = isDark ? '#FDE047' : '#D97706';
  const green = isDark ? '#4ADE80' : '#16A34A';
  const purple = isDark ? '#C084FC' : '#7C3AED';
  const outline = isDark ? '#F8FAFC' : '#18181B';

  return {
    id: `diagram-nephron-${Date.now()}`,
    type: 'diagram',
    subject: 'Nephron Anatomy & Urine Formation',
    title: 'Structure of the Renal Nephron & Urine Formation Mechanism',
    subtitle: 'Detailed Renal Physiology Educational Illustration',
    x,
    y,
    width: 1000,
    height: 740,
    zIndex: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    style: 'hand_drawn_scientific',
    components: [
      // 1. Bowman's Capsule (Double-walled cup)
      {
        id: 'bowmans-capsule',
        name: "Bowman's Capsule",
        type: 'capsule',
        path: 'M 210,130 C 140,140 130,240 210,270 C 230,280 260,250 255,200 C 250,150 230,130 210,130 Z',
        fill: isDark ? 'rgba(56, 189, 248, 0.3)' : 'rgba(2, 132, 199, 0.2)',
        stroke: outline,
        strokeWidth: 2.8,
      },
      // 2. Glomerulus (Capillary tuft inside Bowman's cup)
      {
        id: 'glomerulus',
        name: 'Glomerulus (Capillary Knot)',
        type: 'vessel',
        path: 'M 170,165 C 190,150 220,160 215,185 C 210,210 180,210 190,230 C 200,245 225,230 220,210 C 210,180 180,180 170,195',
        fill: 'none',
        stroke: red,
        strokeWidth: 4.5,
      },
      // 3. Afferent Arteriole (Enters glomerulus - Wider)
      {
        id: 'afferent-arteriole',
        name: 'Afferent Arteriole (Wide Lumen)',
        type: 'vessel',
        path: 'M 100,140 C 130,145 155,160 170,165',
        fill: 'none',
        stroke: red,
        strokeWidth: 5.5,
      },
      // 4. Efferent Arteriole (Exits glomerulus - Narrower to build filtration pressure)
      {
        id: 'efferent-arteriole',
        name: 'Efferent Arteriole (Narrow Lumen)',
        type: 'vessel',
        path: 'M 220,210 C 250,220 270,260 280,310',
        fill: 'none',
        stroke: red,
        strokeWidth: 3.2,
      },
      // 5. Proximal Convoluted Tubule (PCT - Coiled loops near capsule)
      {
        id: 'pct-tubule',
        name: 'Proximal Convoluted Tubule (PCT)',
        type: 'tubule',
        path: 'M 215,270 C 240,300 270,280 290,250 C 310,220 350,230 360,270 C 370,310 390,320 400,280 C 410,240 440,240 450,280',
        fill: 'none',
        stroke: isDark ? '#FDE047' : '#D97706',
        strokeWidth: 8.0,
      },
      // 6. Loop of Henle - Descending Limb (Thin limb penetrating medulla)
      {
        id: 'loop-descending',
        name: 'Descending Limb of Loop of Henle (Permeable to Water)',
        type: 'tubule',
        path: 'M 450,280 C 450,360 450,460 450,560 C 450,590 470,610 490,610',
        fill: 'none',
        stroke: blue,
        strokeWidth: 5.0,
      },
      // 7. Loop of Henle - Hairpin Bend
      {
        id: 'loop-bend',
        name: 'Hairpin Turn (Medulla)',
        type: 'tubule',
        path: 'M 490,610 C 510,610 530,590 530,560',
        fill: 'none',
        stroke: purple,
        strokeWidth: 6.0,
      },
      // 8. Loop of Henle - Ascending Limb (Thick limb - Impermeable to water, pumps NaCl)
      {
        id: 'loop-ascending',
        name: 'Ascending Limb of Loop of Henle (Active Na⁺/Cl⁻ Transport)',
        type: 'tubule',
        path: 'M 530,560 C 530,460 530,360 530,280',
        fill: 'none',
        stroke: yellow,
        strokeWidth: 8.0,
      },
      // 9. Distal Convoluted Tubule (DCT - Coiled tubule in cortex)
      {
        id: 'dct-tubule',
        name: 'Distal Convoluted Tubule (DCT)',
        type: 'tubule',
        path: 'M 530,280 C 550,240 580,240 600,270 C 620,300 660,290 680,250 C 700,220 730,240 760,250',
        fill: 'none',
        stroke: isDark ? '#FDE047' : '#D97706',
        strokeWidth: 8.0,
      },
      // 10. Collecting Duct (Straight vertical branch receiving multiple DCTs)
      {
        id: 'collecting-duct',
        name: 'Collecting Duct (Urine Drainage)',
        type: 'tubule',
        path: 'M 760,180 L 760,600 M 760,250 L 790,260 M 760,340 L 730,330 M 760,450 L 790,460',
        fill: 'none',
        stroke: green,
        strokeWidth: 10.0,
      },
      // 11. Peritubular Capillaries / Vasa Recta (Network around loop)
      {
        id: 'vasa-recta',
        name: 'Vasa Recta Capillary Loop',
        type: 'vessel',
        path: 'M 280,310 C 350,380 430,420 430,520 C 430,580 480,590 510,580 C 550,580 560,500 560,400 C 560,340 620,320 680,350 L 720,380',
        fill: 'none',
        stroke: isDark ? 'rgba(248, 113, 113, 0.6)' : 'rgba(225, 29, 72, 0.5)',
        strokeWidth: 2.2,
      },
      // 12. Cortex / Medulla Boundary (Dotted horizon line)
      {
        id: 'cortex-medulla-boundary',
        name: 'Corticomedullary Boundary',
        type: 'boundary',
        path: 'M 60,320 L 880,320',
        fill: 'none',
        stroke: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
        strokeWidth: 1.5,
      },
    ],
    labels: [
      {
        id: 'lbl-afferent',
        targetPoint: { x: 120, y: 145 },
        labelPoint: { x: 60, y: 80 },
        text: 'Afferent Arteriole',
        description: 'Wide vessel bringing renal arterial blood into glomerulus',
        side: 'top',
        color: red,
      },
      {
        id: 'lbl-glomerulus',
        targetPoint: { x: 195, y: 190 },
        labelPoint: { x: 60, y: 190 },
        text: "Glomerulus & Bowman's Capsule",
        description: 'Site of Ultrafiltration: GFR ≈ 125 mL/min (180 L/day)',
        side: 'left',
        color: red,
        isKeyFact: true,
      },
      {
        id: 'lbl-efferent',
        targetPoint: { x: 250, y: 230 },
        labelPoint: { x: 260, y: 100 },
        text: 'Efferent Arteriole',
        description: 'Narrower vessel creates high hydrostatic pressure (~55 mmHg)',
        side: 'top',
        color: red,
      },
      {
        id: 'lbl-pct',
        targetPoint: { x: 370, y: 270 },
        labelPoint: { x: 370, y: 140 },
        text: 'Proximal Convoluted Tubule (PCT)',
        description: 'Major site of reabsorption: 100% glucose & amino acids, 85% water & NaCl',
        side: 'top',
        color: yellow,
        isKeyFact: true,
      },
      {
        id: 'lbl-desc-limb',
        targetPoint: { x: 450, y: 440 },
        labelPoint: { x: 290, y: 450 },
        text: 'Descending Limb (Henle)',
        description: 'Permeable to H₂O (osmosis into hypertonic medulla), impermeable to ions',
        side: 'left',
        color: blue,
      },
      {
        id: 'lbl-asc-limb',
        targetPoint: { x: 530, y: 440 },
        labelPoint: { x: 600, y: 450 },
        text: 'Ascending Limb (Henle)',
        description: 'Impermeable to H₂O; active Na⁺/K⁺/2Cl⁻ symporters create osmotic gradient',
        side: 'right',
        color: yellow,
      },
      {
        id: 'lbl-dct',
        targetPoint: { x: 650, y: 270 },
        labelPoint: { x: 650, y: 140 },
        text: 'Distal Convoluted Tubule (DCT)',
        description: 'Hormonal regulation (Aldosterone: Na⁺ reabsorption, Parathyroid: Ca²⁺)',
        side: 'top',
        color: yellow,
      },
      {
        id: 'lbl-cd',
        targetPoint: { x: 760, y: 380 },
        labelPoint: { x: 820, y: 260 },
        text: 'Collecting Duct',
        description: 'ADH (Vasopressin) inserts Aquaporin-2 channels to concentrate urine',
        side: 'right',
        color: green,
        isKeyFact: true,
      },
      {
        id: 'lbl-cortex-tag',
        targetPoint: { x: 100, y: 310 },
        labelPoint: { x: 80, y: 300 },
        text: 'RENAL CORTEX',
        side: 'left',
        color: isDark ? '#94A3B8' : '#64748B',
      },
      {
        id: 'lbl-medulla-tag',
        targetPoint: { x: 100, y: 340 },
        labelPoint: { x: 80, y: 350 },
        text: 'RENAL MEDULLA',
        side: 'left',
        color: isDark ? '#94A3B8' : '#64748B',
      },
    ],
    arrows: [
      // H2O leaving descending limb
      {
        id: 'arrow-water-out',
        points: [{ x: 450, y: 420 }, { x: 410, y: 420 }],
        color: blue,
        label: 'H₂O (Osmosis)',
        type: 'filtration',
      },
      // NaCl leaving ascending limb
      {
        id: 'arrow-nacl-out',
        points: [{ x: 530, y: 420 }, { x: 570, y: 420 }],
        color: yellow,
        label: 'Na⁺ / Cl⁻ (Active)',
        type: 'filtration',
      },
    ],
    callouts: [
      {
        id: 'callout-steps',
        x: 40,
        y: 630,
        title: '🧪 3 Steps of Urine Formation',
        content: '1. Ultrafiltration: Blood filtered across podocyte slit diaphragms into Bowman\'s space (GFR ~125 mL/min)\n2. Selective Reabsorption: Useful solutes recovered back into peritubular capillaries\n3. Tubular Secretion: Active transport of excess H⁺, K⁺, NH₄⁺, drugs into filtrate to maintain pH 7.4',
        type: 'fact',
      },
      {
        id: 'callout-loop-gradient',
        x: 520,
        y: 630,
        title: '🔁 Countercurrent Multiplier System',
        content: 'Flow in opposite directions in adjacent limbs + differential permeabilities creates a steep vertical osmotic gradient (300 mOsm/L at cortex → 1200 mOsm/L at inner medullary hairpin bend), enabling mammalian hypertonic urine concentration.',
        type: 'clinical',
      },
    ],
    legend: [
      { label: 'Renal Blood Supply (Arterioles/Capillaries)', color: red },
      { label: 'Tubular System (PCT / DCT / Loop)', color: yellow },
      { label: 'Water Reabsorption Pathway', color: blue },
      { label: 'Collecting Duct & Final Urine', color: green },
    ],
  };
}
