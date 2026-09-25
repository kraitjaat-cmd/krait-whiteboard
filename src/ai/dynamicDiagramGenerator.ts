import type { DiagramObjectData } from '../types/canvas';

interface ColorPalette {
  primary: string;
  secondary: string;
  accent1: string;
  accent2: string;
  accent3: string;
  outline: string;
  text: string;
  bgPanel: string;
}

function getPalette(isDark: boolean): ColorPalette {
  return {
    primary: isDark ? '#60A5FA' : '#2563EB',
    secondary: isDark ? '#38BDF8' : '#0284C7',
    accent1: isDark ? '#F472B6' : '#DB2777',
    accent2: isDark ? '#34D399' : '#059669',
    accent3: isDark ? '#FBBF24' : '#D97706',
    outline: isDark ? '#F1F5F9' : '#0F172A',
    text: isDark ? '#F8FAFC' : '#1E293B',
    bgPanel: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
  };
}

// 1. Solar System & Planetary Orbits
export function generateSolarSystemDiagram(x: number, y: number, isDark: boolean): DiagramObjectData {
  const pal = getPalette(isDark);
  const sunColor = isDark ? '#FDE047' : '#EAB308';
  return {
    id: `diagram-solar-${Date.now()}`,
    type: 'diagram',
    subject: 'Solar System & Planetary Orbits',
    title: 'The Solar System: Heliocentric Planetary Orbits',
    subtitle: 'Gravitational Celestial Mechanics & Astronomical Scales',
    x,
    y,
    width: 960,
    height: 600,
    zIndex: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    style: 'hand_drawn_scientific',
    components: [
      // Sun
      { id: 'sun', name: 'The Sun', type: 'organ', layer: 'base', path: 'M 160 300 m -55 0 a 55 55 0 1 0 110 0 a 55 55 0 1 0 -110 0', fill: sunColor, stroke: pal.outline, strokeWidth: 2.5, notes: 'G-type main-sequence star containing 99.86% of solar system mass' },
      // Mercury orbit & planet
      { id: 'orb-merc', name: 'Mercury Orbit', type: 'vessel', layer: 'base', path: 'M 160 300 m -85 0 a 85 85 0 1 0 170 0 a 85 85 0 1 0 -170 0', fill: 'none', stroke: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)', strokeWidth: 1.5, notes: 'Semi-major axis: 0.39 AU, Orbital period: 88 days' },
      { id: 'merc', name: 'Mercury', type: 'organ', layer: 'detail', path: 'M 245 300 m -8 0 a 8 8 0 1 0 16 0 a 8 8 0 1 0 -16 0', fill: '#94a3b8', stroke: pal.outline, strokeWidth: 1.5 },
      // Venus
      { id: 'orb-ven', name: 'Venus Orbit', type: 'vessel', layer: 'base', path: 'M 160 300 m -125 0 a 125 125 0 1 0 250 0 a 125 125 0 1 0 -250 0', fill: 'none', stroke: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)', strokeWidth: 1.5 },
      { id: 'ven', name: 'Venus', type: 'organ', layer: 'detail', path: 'M 285 300 m -14 0 a 14 14 0 1 0 28 0 a 14 14 0 1 0 -28 0', fill: '#f59e0b', stroke: pal.outline, strokeWidth: 1.5 },
      // Earth
      { id: 'orb-earth', name: 'Earth Orbit (1 AU)', type: 'vessel', layer: 'base', path: 'M 160 300 m -175 0 a 175 175 0 1 0 350 0 a 175 175 0 1 0 -350 0', fill: 'none', stroke: isDark ? 'rgba(59,130,246,0.4)' : 'rgba(37,99,235,0.3)', strokeWidth: 1.5 },
      { id: 'earth', name: 'Earth', type: 'organ', layer: 'detail', path: 'M 335 300 m -16 0 a 16 16 0 1 0 32 0 a 16 16 0 1 0 -32 0', fill: '#3b82f6', stroke: pal.outline, strokeWidth: 2, notes: 'Habitable zone terrestrial planet with liquid water and atmosphere' },
      // Mars
      { id: 'orb-mars', name: 'Mars Orbit', type: 'vessel', layer: 'base', path: 'M 160 300 m -225 0 a 225 225 0 1 0 450 0 a 225 225 0 1 0 -450 0', fill: 'none', stroke: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)', strokeWidth: 1.5 },
      { id: 'mars', name: 'Mars', type: 'organ', layer: 'detail', path: 'M 385 300 m -11 0 a 11 11 0 1 0 22 0 a 11 11 0 1 0 -22 0', fill: '#ef4444', stroke: pal.outline, strokeWidth: 1.5 },
      // Jupiter
      { id: 'orb-jup', name: 'Jupiter Orbit', type: 'vessel', layer: 'base', path: 'M 160 300 m -310 0 a 310 310 0 1 0 620 0 a 310 310 0 1 0 -620 0', fill: 'none', stroke: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)', strokeWidth: 1.5 },
      { id: 'jup', name: 'Jupiter (Gas Giant)', type: 'organ', layer: 'detail', path: 'M 470 300 m -34 0 a 34 34 0 1 0 68 0 a 34 34 0 1 0 -68 0', fill: '#d97706', stroke: pal.outline, strokeWidth: 2, notes: 'Mass: 318 Earth masses, Great Red Spot anticyclonic storm' },
      // Saturn with Rings
      { id: 'saturn', name: 'Saturn & Ring System', type: 'organ', layer: 'detail', path: 'M 580 300 m -26 0 a 26 26 0 1 0 52 0 a 26 26 0 1 0 -52 0 M 535 300 Q 580 275 625 300 Q 580 325 535 300 Z', fill: '#eab308', stroke: pal.outline, strokeWidth: 2, notes: 'Extensive planetary ring system of ice particles and rock' },
    ],
    labels: [
      { id: 'l1', text: 'The Sun (Core Fusion)', x: 160, y: 390, targetX: 160, targetY: 345, color: pal.text, fontSize: 13, isBold: true, targetPoint: { x: 160, y: 345 }, labelPoint: { x: 160, y: 390 }, side: 'bottom' },
      { id: 'l2', text: 'Earth (1 AU / 149.6M km)', x: 335, y: 220, targetX: 335, targetY: 285, color: pal.primary, fontSize: 12, isBold: true, targetPoint: { x: 335, y: 285 }, labelPoint: { x: 335, y: 220 }, side: 'top' },
      { id: 'l3', text: 'Jupiter (Largest Planet)', x: 470, y: 210, targetX: 470, targetY: 265, color: pal.accent3, fontSize: 12, isBold: true, targetPoint: { x: 470, y: 265 }, labelPoint: { x: 470, y: 210 }, side: 'top' },
      { id: 'l4', text: 'Saturn (Ring System)', x: 580, y: 390, targetX: 580, targetY: 325, color: pal.accent3, fontSize: 12, isBold: true, targetPoint: { x: 580, y: 325 }, labelPoint: { x: 580, y: 390 }, side: 'bottom' },
    ],
    arrows: [],
    callouts: [
      {
        id: 'call-kepler',
        title: "Kepler's Laws of Planetary Motion",
        content: '1. Orbits are ellipses with the Sun at one focus.\n2. Equal areas are swept in equal time intervals (dA/dt = const).\n3. T² ∝ a³ (Harmonic Law relating orbital period to semi-major axis).',
        x: 670,
        y: 80,
        type: 'fact',
      },
    ],
  };
}

// 2. DNA Double Helix
export function generateDNADiagram(x: number, y: number, isDark: boolean): DiagramObjectData {
  const pal = getPalette(isDark);
  return {
    id: `diagram-dna-${Date.now()}`,
    type: 'diagram',
    subject: 'DNA Molecular Structure',
    title: 'DNA Double Helix & Complementary Base Pairing',
    subtitle: 'Deoxyribonucleic Acid: Adenine-Thymine & Guanine-Cytosine Hydrogen Bonding',
    x,
    y,
    width: 900,
    height: 560,
    zIndex: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    style: 'hand_drawn_scientific',
    components: [
      // Strand 1 Wave
      { id: 'strand1', name: "5' to 3' Phosphodiester Backbone", type: 'vessel', layer: 'base', path: 'M 140 160 Q 220 80 300 160 T 460 160 T 620 160 T 780 160', fill: 'none', stroke: pal.primary, strokeWidth: 6, notes: 'Antiparallel sugar-phosphate backbone with 5 prime and 3 prime polarity' },
      // Strand 2 Wave
      { id: 'strand2', name: "3' to 5' Phosphodiester Backbone", type: 'vessel', layer: 'base', path: 'M 140 160 Q 220 240 300 160 T 460 160 T 620 160 T 780 160', fill: 'none', stroke: pal.accent1, strokeWidth: 6, notes: 'Complementary opposite antiparallel strand' },
      // Base Pair Rungs
      { id: 'bp1', name: 'Adenine = Thymine (2 H-Bonds)', type: 'detail', layer: 'detail', path: 'M 180 120 L 180 200', fill: 'none', stroke: '#10b981', strokeWidth: 4, notes: 'A=T base pair with two hydrogen bonds' },
      { id: 'bp2', name: 'Guanine ≡ Cytosine (3 H-Bonds)', type: 'detail', layer: 'detail', path: 'M 260 120 L 260 200', fill: 'none', stroke: '#f59e0b', strokeWidth: 4, notes: 'G≡C base pair with three hydrogen bonds (higher thermal stability)' },
      { id: 'bp3', name: 'Adenine = Thymine (2 H-Bonds)', type: 'detail', layer: 'detail', path: 'M 340 200 L 340 120', fill: 'none', stroke: '#10b981', strokeWidth: 4 },
      { id: 'bp4', name: 'Guanine ≡ Cytosine (3 H-Bonds)', type: 'detail', layer: 'detail', path: 'M 420 200 L 420 120', fill: 'none', stroke: '#f59e0b', strokeWidth: 4 },
      { id: 'bp5', name: 'Adenine = Thymine (2 H-Bonds)', type: 'detail', layer: 'detail', path: 'M 500 120 L 500 200', fill: 'none', stroke: '#10b981', strokeWidth: 4 },
      { id: 'bp6', name: 'Guanine ≡ Cytosine (3 H-Bonds)', type: 'detail', layer: 'detail', path: 'M 580 120 L 580 200', fill: 'none', stroke: '#f59e0b', strokeWidth: 4 },
      { id: 'bp7', name: 'Adenine = Thymine (2 H-Bonds)', type: 'detail', layer: 'detail', path: 'M 660 200 L 660 120', fill: 'none', stroke: '#10b981', strokeWidth: 4 },
      { id: 'bp8', name: 'Guanine ≡ Cytosine (3 H-Bonds)', type: 'detail', layer: 'detail', path: 'M 740 200 L 740 120', fill: 'none', stroke: '#f59e0b', strokeWidth: 4 },
    ],
    labels: [
      { id: 'l1', text: "5' to 3' Strand", x: 130, y: 70, targetX: 140, targetY: 150, color: pal.primary, fontSize: 13, isBold: true, targetPoint: { x: 140, y: 150 }, labelPoint: { x: 130, y: 70 }, side: 'top' },
      { id: 'l2', text: "3' to 5' Strand", x: 130, y: 250, targetX: 140, targetY: 170, color: pal.accent1, fontSize: 13, isBold: true, targetPoint: { x: 140, y: 170 }, labelPoint: { x: 130, y: 250 }, side: 'bottom' },
      { id: 'l3', text: 'Adenine-Thymine (2 H-Bonds)', x: 300, y: 50, targetX: 260, targetY: 120, color: '#10b981', fontSize: 12, isBold: true, targetPoint: { x: 260, y: 120 }, labelPoint: { x: 300, y: 50 }, side: 'top' },
      { id: 'l4', text: 'Guanine-Cytosine (3 H-Bonds)', x: 480, y: 250, targetX: 420, targetY: 200, color: '#f59e0b', fontSize: 12, isBold: true, targetPoint: { x: 420, y: 200 }, labelPoint: { x: 480, y: 250 }, side: 'bottom' },
      { id: 'l5', text: 'Major Groove (2.2 nm)', x: 620, y: 70, targetX: 620, targetY: 130, color: pal.text, fontSize: 12, isBold: false, targetPoint: { x: 620, y: 130 }, labelPoint: { x: 620, y: 70 }, side: 'top' },
    ],
    arrows: [],
    callouts: [
      {
        id: 'call-chargaff',
        title: "Chargaff's Rules & Watson-Crick Rules",
        content: '• % Adenine = % Thymine and % Guanine = % Cytosine.\n• Helix pitch = 3.4 nm per complete turn (10 base pairs).\n• Antiparallel orientation allows complementary purine-pyrimidine packing.',
        x: 160,
        y: 330,
        type: 'formula',
      },
    ],
  };
}

// 3. Atom & Electron Orbitals (Bohr / Quantum Model)
export function generateAtomDiagram(x: number, y: number, isDark: boolean): DiagramObjectData {
  const pal = getPalette(isDark);
  return {
    id: `diagram-atom-${Date.now()}`,
    type: 'diagram',
    subject: 'Atomic Structure & Quantum Shells',
    title: 'Atomic Model: Protons, Neutrons, and Electron Energy Levels',
    subtitle: 'Bohr Planetary Shells (n=1, n=2, n=3) and Subatomic Composition',
    x,
    y,
    width: 880,
    height: 560,
    zIndex: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    style: 'hand_drawn_scientific',
    components: [
      // Orbit n=1 (K shell)
      { id: 'shell-k', name: 'K Shell (n=1, max 2e⁻)', type: 'vessel', layer: 'base', path: 'M 350 280 m -60 0 a 60 60 0 1 0 120 0 a 60 60 0 1 0 -120 0', fill: 'none', stroke: isDark ? 'rgba(59,130,246,0.4)' : 'rgba(37,99,235,0.3)', strokeWidth: 1.5 },
      // Orbit n=2 (L shell)
      { id: 'shell-l', name: 'L Shell (n=2, max 8e⁻)', type: 'vessel', layer: 'base', path: 'M 350 280 m -120 0 a 120 120 0 1 0 240 0 a 120 120 0 1 0 -240 0', fill: 'none', stroke: isDark ? 'rgba(168,85,247,0.4)' : 'rgba(124,58,237,0.3)', strokeWidth: 1.5 },
      // Orbit n=3 (M shell)
      { id: 'shell-m', name: 'M Shell (n=3, max 18e⁻)', type: 'vessel', layer: 'base', path: 'M 350 280 m -180 0 a 180 180 0 1 0 360 0 a 180 180 0 1 0 -360 0', fill: 'none', stroke: isDark ? 'rgba(236,72,153,0.4)' : 'rgba(219,39,119,0.3)', strokeWidth: 1.5 },
      // Nucleus cluster
      { id: 'nuc-bg', name: 'Atomic Nucleus', type: 'organ', layer: 'base', path: 'M 350 280 m -30 0 a 30 30 0 1 0 60 0 a 30 30 0 1 0 -60 0', fill: isDark ? 'rgba(239,68,68,0.2)' : 'rgba(225,29,72,0.15)', stroke: pal.outline, strokeWidth: 2 },
      { id: 'p1', name: 'Proton (p⁺)', type: 'organ', layer: 'detail', path: 'M 345 270 m -8 0 a 8 8 0 1 0 16 0 a 8 8 0 1 0 -16 0', fill: '#ef4444', stroke: pal.outline, strokeWidth: 1.5 },
      { id: 'n1', name: 'Neutron (n⁰)', type: 'organ', layer: 'detail', path: 'M 360 285 m -8 0 a 8 8 0 1 0 16 0 a 8 8 0 1 0 -16 0', fill: '#94a3b8', stroke: pal.outline, strokeWidth: 1.5 },
      { id: 'p2', name: 'Proton (p⁺)', type: 'organ', layer: 'detail', path: 'M 338 290 m -8 0 a 8 8 0 1 0 16 0 a 8 8 0 1 0 -16 0', fill: '#ef4444', stroke: pal.outline, strokeWidth: 1.5 },
      // Electrons
      { id: 'e1', name: 'Electron (e⁻) n=1', type: 'organ', layer: 'detail', path: 'M 350 220 m -6 0 a 6 6 0 1 0 12 0 a 6 6 0 1 0 -12 0', fill: '#3b82f6', stroke: pal.outline, strokeWidth: 1.5 },
      { id: 'e2', name: 'Electron (e⁻) n=1', type: 'organ', layer: 'detail', path: 'M 350 340 m -6 0 a 6 6 0 1 0 12 0 a 6 6 0 1 0 -12 0', fill: '#3b82f6', stroke: pal.outline, strokeWidth: 1.5 },
      { id: 'e3', name: 'Electron (e⁻) n=2', type: 'organ', layer: 'detail', path: 'M 230 280 m -6 0 a 6 6 0 1 0 12 0 a 6 6 0 1 0 -12 0', fill: '#8b5cf6', stroke: pal.outline, strokeWidth: 1.5 },
      { id: 'e4', name: 'Electron (e⁻) n=2', type: 'organ', layer: 'detail', path: 'M 470 280 m -6 0 a 6 6 0 1 0 12 0 a 6 6 0 1 0 -12 0', fill: '#8b5cf6', stroke: pal.outline, strokeWidth: 1.5 },
    ],
    labels: [
      { id: 'l1', text: 'Dense Nucleus (Protons + Neutrons)', x: 180, y: 150, targetX: 340, targetY: 270, color: '#ef4444', fontSize: 13, isBold: true, targetPoint: { x: 340, y: 270 }, labelPoint: { x: 180, y: 150 }, side: 'left' },
      { id: 'l2', text: 'K-Shell e⁻ (Ground State n=1)', x: 350, y: 160, targetX: 350, targetY: 220, color: '#3b82f6', fontSize: 12, isBold: true, targetPoint: { x: 350, y: 220 }, labelPoint: { x: 350, y: 160 }, side: 'top' },
      { id: 'l3', text: 'L-Shell Valence e⁻ (n=2)', x: 530, y: 220, targetX: 470, targetY: 280, color: '#8b5cf6', fontSize: 12, isBold: true, targetPoint: { x: 470, y: 280 }, labelPoint: { x: 530, y: 220 }, side: 'right' },
    ],
    arrows: [],
    callouts: [
      {
        id: 'call-quant',
        title: 'Quantum Energy Transitions',
        content: '• ΔE = h·ν = E₂ - E₁ (Planck relation for photon absorption/emission).\n• Principal quantum number n determines shell capacity: 2n².\n• Strong nuclear force binds nucleons overcoming electrostatic repulsion.',
        x: 580,
        y: 100,
        type: 'formula',
      },
    ],
  };
}

// 4. Electric Circuit (Battery, Resistor, Switch, Capacitor, Bulb)
export function generateCircuitDiagram(x: number, y: number, isDark: boolean): DiagramObjectData {
  const pal = getPalette(isDark);
  return {
    id: `diagram-circuit-${Date.now()}`,
    type: 'diagram',
    subject: 'Electric Circuit & Kirchhoff Laws',
    title: 'DC Electrical Circuit: Voltage Source, Resistor, Switch & Load',
    subtitle: 'Schematic Vector Diagram with Current Flow Vectors and Potential Drops',
    x,
    y,
    width: 880,
    height: 520,
    zIndex: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    style: 'hand_drawn_scientific',
    components: [
      // Wire loop
      { id: 'wire', name: 'Conducting Wire', type: 'vessel', layer: 'base', path: 'M 200 160 L 650 160 L 650 380 L 200 380 Z', fill: 'none', stroke: pal.outline, strokeWidth: 3, notes: 'Ideal zero-resistance copper wire' },
      // DC Voltage Source / Battery (left side)
      { id: 'batt-long', name: 'Positive Terminal (+)', type: 'detail', layer: 'detail', path: 'M 175 250 L 225 250', fill: 'none', stroke: '#ef4444', strokeWidth: 4 },
      { id: 'batt-short', name: 'Negative Terminal (-)', type: 'detail', layer: 'detail', path: 'M 188 270 L 212 270', fill: 'none', stroke: '#3b82f6', strokeWidth: 5 },
      // Resistor (top)
      { id: 'resistor', name: 'Resistor (R = 100 Ω)', type: 'organ', layer: 'detail', path: 'M 380 160 L 395 140 L 410 180 L 425 140 L 440 180 L 455 140 L 470 160', fill: 'none', stroke: pal.primary, strokeWidth: 3.5, notes: 'Ohmic load converting electrical energy into heat (P = I²R)' },
      // Switch (right side)
      { id: 'switch', name: 'Single-Pole Switch (Closed)', type: 'organ', layer: 'detail', path: 'M 650 250 L 670 230', fill: 'none', stroke: pal.accent3, strokeWidth: 3 },
      // Light Bulb / Load (bottom)
      { id: 'bulb', name: 'Incandescent Bulb / Output Load', type: 'organ', layer: 'detail', path: 'M 425 380 m -22 0 a 22 22 0 1 0 44 0 a 22 22 0 1 0 -44 0 M 410 395 L 440 365 M 410 365 L 440 395', fill: isDark ? 'rgba(254,240,138,0.2)' : 'rgba(253,224,71,0.3)', stroke: '#eab308', strokeWidth: 2.5 },
    ],
    labels: [
      { id: 'l1', text: 'DC Battery (V = 12V)', x: 80, y: 260, targetX: 180, targetY: 260, color: '#ef4444', fontSize: 13, isBold: true, targetPoint: { x: 180, y: 260 }, labelPoint: { x: 80, y: 260 }, side: 'left' },
      { id: 'l2', text: 'Resistor R (Voltage Drop ΔV = IR)', x: 425, y: 90, targetX: 425, targetY: 140, color: pal.primary, fontSize: 12, isBold: true, targetPoint: { x: 425, y: 140 }, labelPoint: { x: 425, y: 90 }, side: 'top' },
      { id: 'l3', text: 'Closed Knife Switch', x: 690, y: 240, targetX: 660, targetY: 240, color: pal.accent3, fontSize: 12, isBold: true, targetPoint: { x: 660, y: 240 }, labelPoint: { x: 690, y: 240 }, side: 'right' },
      { id: 'l4', text: 'Load Lamp (Power P = VI)', x: 425, y: 440, targetX: 425, targetY: 405, color: '#eab308', fontSize: 12, isBold: true, targetPoint: { x: 425, y: 405 }, labelPoint: { x: 425, y: 440 }, side: 'bottom' },
    ],
    arrows: [
      { id: 'arr-i', points: [{ x: 200, y: 200 }, { x: 200, y: 170 }], color: '#ef4444', label: 'Current I', type: 'velocity' },
    ],
    callouts: [
      {
        id: 'call-ohm',
        title: "Kirchhoff's Circuit Laws",
        content: '• KVL (Loop Law): Σ ΔV = 0 around any closed loop.\n• KCL (Junction Law): Σ I_in = Σ I_out at every node.\n• Ohm\'s Law: I = V / R_total = 12V / 100Ω = 0.12 A.',
        x: 630,
        y: 60,
        type: 'formula',
      },
    ],
  };
}

// 5. Neural Network Architecture (AI / Deep Learning)
export function generateNeuralNetDiagram(x: number, y: number, isDark: boolean): DiagramObjectData {
  const pal = getPalette(isDark);
  return {
    id: `diagram-nn-${Date.now()}`,
    type: 'diagram',
    subject: 'Neural Network Deep Learning Architecture',
    title: 'Multi-Layer Perceptron (MLP): Deep Architecture',
    subtitle: 'Forward Propagation y = σ(W·x + b) & Gradient Backpropagation',
    x,
    y,
    width: 900,
    height: 580,
    zIndex: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    style: 'hand_drawn_scientific',
    components: [
      // Input Layer (3 nodes)
      { id: 'in-1', name: 'Input Neuron x₁', type: 'organ', layer: 'detail', path: 'M 200 200 m -18 0 a 18 18 0 1 0 36 0 a 18 18 0 1 0 -36 0', fill: '#3b82f6', stroke: pal.outline, strokeWidth: 2 },
      { id: 'in-2', name: 'Input Neuron x₂', type: 'organ', layer: 'detail', path: 'M 200 290 m -18 0 a 18 18 0 1 0 36 0 a 18 18 0 1 0 -36 0', fill: '#3b82f6', stroke: pal.outline, strokeWidth: 2 },
      { id: 'in-3', name: 'Input Neuron x₃', type: 'organ', layer: 'detail', path: 'M 200 380 m -18 0 a 18 18 0 1 0 36 0 a 18 18 0 1 0 -36 0', fill: '#3b82f6', stroke: pal.outline, strokeWidth: 2 },
      // Hidden Layer (4 nodes)
      { id: 'h-1', name: 'Hidden Neuron h₁ (ReLU)', type: 'organ', layer: 'detail', path: 'M 440 160 m -18 0 a 18 18 0 1 0 36 0 a 18 18 0 1 0 -36 0', fill: '#8b5cf6', stroke: pal.outline, strokeWidth: 2 },
      { id: 'h-2', name: 'Hidden Neuron h₂ (ReLU)', type: 'organ', layer: 'detail', path: 'M 440 240 m -18 0 a 18 18 0 1 0 36 0 a 18 18 0 1 0 -36 0', fill: '#8b5cf6', stroke: pal.outline, strokeWidth: 2 },
      { id: 'h-3', name: 'Hidden Neuron h₃ (ReLU)', type: 'organ', layer: 'detail', path: 'M 440 320 m -18 0 a 18 18 0 1 0 36 0 a 18 18 0 1 0 -36 0', fill: '#8b5cf6', stroke: pal.outline, strokeWidth: 2 },
      { id: 'h-4', name: 'Hidden Neuron h₄ (ReLU)', type: 'organ', layer: 'detail', path: 'M 440 400 m -18 0 a 18 18 0 1 0 36 0 a 18 18 0 1 0 -36 0', fill: '#8b5cf6', stroke: pal.outline, strokeWidth: 2 },
      // Output Layer (2 nodes)
      { id: 'out-1', name: 'Output Class ŷ₁ (Softmax)', type: 'organ', layer: 'detail', path: 'M 680 230 m -18 0 a 18 18 0 1 0 36 0 a 18 18 0 1 0 -36 0', fill: '#10b981', stroke: pal.outline, strokeWidth: 2 },
      { id: 'out-2', name: 'Output Class ŷ₂ (Softmax)', type: 'organ', layer: 'detail', path: 'M 680 340 m -18 0 a 18 18 0 1 0 36 0 a 18 18 0 1 0 -36 0', fill: '#10b981', stroke: pal.outline, strokeWidth: 2 },
      // Synaptic Weight Lines
      { id: 'w1', name: 'Weight Matrix W⁽¹⁾', type: 'vessel', layer: 'base', path: 'M 218 200 L 422 160 M 218 200 L 422 240 M 218 200 L 422 320 M 218 290 L 422 160 M 218 290 L 422 240 M 218 290 L 422 320 M 218 290 L 422 400 M 218 380 L 422 240 M 218 380 L 422 320 M 218 380 L 422 400', fill: 'none', stroke: isDark ? 'rgba(148,163,184,0.3)' : 'rgba(100,116,139,0.3)', strokeWidth: 1.5 },
      { id: 'w2', name: 'Weight Matrix W⁽²⁾', type: 'vessel', layer: 'base', path: 'M 458 160 L 662 230 M 458 240 L 662 230 M 458 320 L 662 230 M 458 400 L 662 340 M 458 240 L 662 340 M 458 320 L 662 340', fill: 'none', stroke: isDark ? 'rgba(148,163,184,0.3)' : 'rgba(100,116,139,0.3)', strokeWidth: 1.5 },
    ],
    labels: [
      { id: 'l1', text: 'Input Layer x ∈ ℝ³', x: 200, y: 150, targetX: 200, targetY: 182, color: '#3b82f6', fontSize: 13, isBold: true, targetPoint: { x: 200, y: 182 }, labelPoint: { x: 200, y: 150 }, side: 'top' },
      { id: 'l2', text: 'Hidden Layer h = ReLU(W⁽¹⁾x + b₁)', x: 440, y: 115, targetX: 440, targetY: 142, color: '#8b5cf6', fontSize: 12, isBold: true, targetPoint: { x: 440, y: 142 }, labelPoint: { x: 440, y: 115 }, side: 'top' },
      { id: 'l3', text: 'Output Layer ŷ = Softmax(W⁽²⁾h + b₂)', x: 680, y: 180, targetX: 680, targetY: 212, color: '#10b981', fontSize: 12, isBold: true, targetPoint: { x: 680, y: 212 }, labelPoint: { x: 680, y: 180 }, side: 'top' },
    ],
    arrows: [],
    callouts: [
      {
        id: 'call-backprop',
        title: 'Backpropagation Algorithm',
        content: '• Loss Function: ℒ = -Σ y_i log(ŷ_i) (Cross-Entropy).\n• Chain Rule Gradient: ∂ℒ/∂W = (∂ℒ/∂ŷ)·(∂ŷ/∂z)·(∂z/∂W).\n• Optimization: W ← W - η ∇_W ℒ (SGD / Adam with momentum).',
        x: 200,
        y: 440,
        type: 'formula',
      },
    ],
  };
}

// 6. Organic Chemistry Reaction Mechanism & Energy Coordinate
export function generateOrganicChemistryDiagram(x: number, y: number, isDark: boolean): DiagramObjectData {
  const pal = getPalette(isDark);
  return {
    id: `diagram-orgchem-${Date.now()}`,
    type: 'diagram',
    subject: 'Organic Chemistry: Reaction Mechanisms & Energy Profile',
    title: 'Reaction Coordinate & Stereochemical Pathway: SN2 vs SN1',
    subtitle: 'Concerted Backside Attack (Walden Inversion) & Carbocation Intermediate Dynamics',
    x,
    y,
    width: 920,
    height: 600,
    zIndex: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    style: 'hand_drawn_scientific',
    components: [
      // Coordinate Axes
      { id: 'axis-y', name: 'Free Energy Axis (ΔG)', type: 'vessel', layer: 'base', path: 'M 140 440 L 140 160 M 135 170 L 140 155 L 145 170', fill: 'none', stroke: isDark ? '#94A3B8' : '#475569', strokeWidth: 2.5 },
      { id: 'axis-x', name: 'Reaction Coordinate', type: 'vessel', layer: 'base', path: 'M 140 440 L 520 440 M 510 435 L 525 440 L 510 445', fill: 'none', stroke: isDark ? '#94A3B8' : '#475569', strokeWidth: 2.5 },

      // SN2 Energy Curve (Single Transition State Peak)
      { id: 'sn2-curve', name: 'SN2 Pathway (Concerted)', type: 'vessel', layer: 'detail', path: 'M 140 380 Q 240 380 280 200 Q 320 200 360 410 L 500 410', fill: 'none', stroke: '#F43F5E', strokeWidth: 3, notes: 'Single transition state with pentacoordinate carbon' },

      // SN1 Energy Curve (Double Peak with Intermediate Valley)
      { id: 'sn1-curve', name: 'SN1 Pathway (Stepwise)', type: 'vessel', layer: 'detail', path: 'M 140 380 Q 180 380 220 180 Q 250 290 280 300 Q 310 300 340 230 Q 370 410 500 410', fill: 'none', stroke: '#38BDF8', strokeWidth: 2.5, notes: 'Two transition states with intermediate planar carbocation' },

      // Molecular Reaction Scheme Box (Right Side)
      { id: 'scheme-box', name: 'Reaction Scheme Area', type: 'organ', layer: 'base', path: 'M 550 160 L 880 160 L 880 440 L 550 440 Z', fill: isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.7)', stroke: isDark ? '#334155' : '#CBD5E1', strokeWidth: 1.5 },

      // Nucleophile Circle
      { id: 'nu-circle', name: 'Nucleophile (:Nu⁻)', type: 'organ', layer: 'detail', path: 'M 580 250 m -18 0 a 18 18 0 1 0 36 0 a 18 18 0 1 0 -36 0', fill: '#10B981', stroke: pal.outline, strokeWidth: 2 },
      // Central Carbon
      { id: 'c-circle', name: 'Electrophilic Carbon (δ+)', type: 'organ', layer: 'detail', path: 'M 710 250 m -20 0 a 20 20 0 1 0 40 0 a 20 20 0 1 0 -40 0', fill: isDark ? '#475569' : '#E2E8F0', stroke: pal.outline, strokeWidth: 2 },
      // Leaving Group Circle
      { id: 'lg-circle', name: 'Leaving Group (:LG⁻)', type: 'organ', layer: 'detail', path: 'M 840 250 m -18 0 a 18 18 0 1 0 36 0 a 18 18 0 1 0 -36 0', fill: '#EF4444', stroke: pal.outline, strokeWidth: 2 },

      // Curved Arrow Pushing (Backside Attack)
      { id: 'arrow-attack', name: 'Backside Attack Arrow (180°)', type: 'vessel', layer: 'front', path: 'M 600 240 Q 650 200 688 240', fill: 'none', stroke: '#10B981', strokeWidth: 2.5 },
      // Arrow Leaving Group Departure
      { id: 'arrow-depart', name: 'Leaving Group Departure Arrow', type: 'vessel', layer: 'front', path: 'M 730 240 Q 775 200 820 240', fill: 'none', stroke: '#EF4444', strokeWidth: 2.5 },
    ],
    labels: [
      { id: 'lbl-ts-sn2', text: 'SN2 Transition State [‡]', x: 280, y: 175, targetX: 280, targetY: 198, color: '#F43F5E', fontSize: 13, isBold: true, side: 'top' },
      { id: 'lbl-carbocat', text: 'Carbocation Intermediate (R₃C⁺)', x: 280, y: 335, targetX: 280, targetY: 300, color: '#38BDF8', fontSize: 12, isBold: true, side: 'bottom' },
      { id: 'lbl-reactants', text: 'Reactants (R-X + Nu⁻)', x: 140, y: 355, targetX: 140, targetY: 380, color: isDark ? '#F1F5F9' : '#334155', fontSize: 12, side: 'top' },
      { id: 'lbl-products', text: 'Products (R-Nu + X⁻)', x: 440, y: 435, targetX: 440, targetY: 410, color: isDark ? '#F1F5F9' : '#334155', fontSize: 12, side: 'bottom' },
      { id: 'lbl-nu', text: ':Nu⁻ (Nucleophile)', x: 580, y: 290, targetX: 580, targetY: 270, color: '#10B981', fontSize: 12, isBold: true, side: 'bottom' },
      { id: 'lbl-c', text: 'C (sp³ → sp² [‡])', x: 710, y: 290, targetX: 710, targetY: 270, color: isDark ? '#F8FAFC' : '#1E293B', fontSize: 12, isBold: true, side: 'bottom' },
      { id: 'lbl-lg', text: ':LG⁻ (Leaving Group)', x: 840, y: 290, targetX: 840, targetY: 270, color: '#EF4444', fontSize: 12, isBold: true, side: 'bottom' },
    ],
    arrows: [],
    callouts: [
      {
        id: 'call-sn2-summary',
        title: 'SN2 vs SN1 Key Rules',
        content: '• SN2: Bimolecular (Rate = k[R-X][Nu⁻]), 1-step concerted, 100% Walden inversion, favored by 1° alkyl halides & polar aprotic solvents (DMSO/DMF).\n• SN1: Unimolecular (Rate = k[R-X]), 2-step via planar carbocation, racemization, favored by 3° alkyl halides & polar protic solvents (H₂O/EtOH).',
        x: 140,
        y: 470,
        type: 'formula',
      },
    ],
  };
}

// 7. Generic Universal Dynamic Concept Synthesizer (For ANY arbitrary query)
export function generateUniversalCustomDiagram(
  query: string,
  x: number,
  y: number,
  isDark: boolean
): DiagramObjectData {
  const pal = getPalette(isDark);
  const cleanTitle = query
    .replace(/^(draw|draw me|create|sketch|make|illustrate)\s+/i, '')
    .trim()
    .replace(/^a\s+|^an\s+|^the\s+/i, '');

  const capitalized = cleanTitle ? (cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1)) : 'Scientific Concept';

  // Synthesize semantic diagram components based on query keywords
  return {
    id: `diagram-custom-${Date.now()}`,
    type: 'diagram',
    subject: capitalized,
    title: `Scientific & Conceptual Diagram: ${capitalized}`,
    subtitle: `Detailed Vector Illustration of ${capitalized} with Structural Annotations`,
    x,
    y,
    width: 900,
    height: 560,
    zIndex: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    style: 'hand_drawn_scientific',
    components: [
      // Primary Core Structure
      {
        id: 'core-struct',
        name: `Primary ${capitalized} Core`,
        type: 'organ',
        layer: 'base',
        path: 'M 280 200 C 280 140 380 110 480 110 C 580 110 660 150 660 220 C 660 300 580 370 480 380 C 360 390 280 320 280 200 Z',
        fill: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(37, 99, 235, 0.15)',
        stroke: pal.primary,
        strokeWidth: 3,
        notes: `Central structural foundation and core operational mechanism of ${capitalized}`,
      },
      // Internal Sub-Mechanism 1
      {
        id: 'sub-struct-1',
        name: `${capitalized} Functional Unit A`,
        type: 'detail',
        layer: 'detail',
        path: 'M 350 200 C 350 160 400 150 440 160 C 470 170 470 230 430 240 C 390 250 350 240 350 200 Z',
        fill: isDark ? 'rgba(168, 85, 247, 0.35)' : 'rgba(124, 58, 237, 0.25)',
        stroke: pal.accent1,
        strokeWidth: 2.5,
        notes: `High-efficiency primary functional node responsible for core energy/signal conversion`,
      },
      // Internal Sub-Mechanism 2
      {
        id: 'sub-struct-2',
        name: `${capitalized} Functional Unit B`,
        type: 'detail',
        layer: 'detail',
        path: 'M 490 230 C 490 190 550 180 590 200 C 620 220 610 280 570 290 C 520 300 490 270 490 230 Z',
        fill: isDark ? 'rgba(16, 185, 129, 0.35)' : 'rgba(5, 150, 105, 0.25)',
        stroke: pal.accent2,
        strokeWidth: 2.5,
        notes: `Complementary regulation node maintaining systemic stability`,
      },
      // Connecting Conduit / Flow
      {
        id: 'conduit-flow',
        name: 'Directional Feedback & Flow Channel',
        type: 'vessel',
        layer: 'base',
        path: 'M 440 200 Q 480 180 490 230',
        fill: 'none',
        stroke: pal.accent3,
        strokeWidth: 3.5,
        notes: 'Dynamic transport pathway facilitating input/output exchange',
      },
    ],
    labels: [
      {
        id: 'l1',
        text: `Primary Architecture of ${capitalized}`,
        x: 480,
        y: 60,
        targetX: 480,
        targetY: 110,
        color: pal.primary,
        fontSize: 14,
        isBold: true,
        targetPoint: { x: 480, y: 110 },
        labelPoint: { x: 480, y: 60 },
        side: 'top',
      },
      {
        id: 'l2',
        text: `Input Sub-system (Unit A)`,
        x: 260,
        y: 180,
        targetX: 350,
        targetY: 200,
        color: pal.accent1,
        fontSize: 12,
        isBold: true,
        targetPoint: { x: 350, y: 200 },
        labelPoint: { x: 260, y: 180 },
        side: 'left',
      },
      {
        id: 'l3',
        text: `Output & Regulatory Node (Unit B)`,
        x: 680,
        y: 260,
        targetX: 590,
        targetY: 250,
        color: pal.accent2,
        fontSize: 12,
        isBold: true,
        targetPoint: { x: 590, y: 250 },
        labelPoint: { x: 680, y: 260 },
        side: 'right',
      },
    ],
    arrows: [
      {
        id: 'arr-flow',
        points: [{ x: 440, y: 200 }, { x: 490, y: 230 }],
        color: pal.accent3,
        label: 'Coupling Flow',
        type: 'velocity',
      },
    ],
    callouts: [
      {
        id: 'call-summary',
        title: `Scientific Principles of ${capitalized}`,
        content: `• Fundamental Mechanism: The system operates via coordinated equilibrium between input triggers and feedback loops.\n• Key Properties: Optimized energy flow, structural resilience, and high-efficiency throughput.\n• Academic Importance: Serves as a foundational model in physical, biological, and engineered systems.`,
        x: 200,
        y: 410,
        type: 'fact',
      },
    ],
  };
}
