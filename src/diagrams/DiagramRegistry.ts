import type { DiagramObjectData } from '../types/canvas';
import { createCellDiagram } from './CellDiagram';
import { createHeartDiagram } from './HeartDiagram';
import { createNephronDiagram } from './NephronDiagram';
import { createNeuronDiagram } from './NeuronDiagram';
import { createProjectileMotionDiagram } from './ProjectileMotionDiagram';
import {
  generateSolarSystemDiagram,
  generateDNADiagram,
  generateAtomDiagram,
  generateCircuitDiagram,
  generateNeuralNetDiagram,
  generateOrganicChemistryDiagram,
  generateUniversalCustomDiagram,
} from '../ai/dynamicDiagramGenerator';

export interface DiagramTemplateInfo {
  id: string;
  name: string;
  category: 'Biology' | 'Physics' | 'Chemistry' | 'Mathematics' | 'Computer Science' | 'General';
  keywords: string[];
  factory: (x?: number, y?: number, isDark?: boolean) => DiagramObjectData;
}

export const DIAGRAM_TEMPLATES: DiagramTemplateInfo[] = [
  {
    id: 'human-heart',
    name: 'Human Heart Anatomy & Blood Flow',
    category: 'Biology',
    keywords: ['heart', 'cardiac', 'blood flow', 'atrium', 'ventricle', 'aorta', 'cardiovascular', 'heart anatomy'],
    factory: createHeartDiagram,
  },
  {
    id: 'neuron',
    name: 'Neuron Structure & Action Potential',
    category: 'Biology',
    keywords: ['neuron', 'nervous system', 'axon', 'dendrite', 'myelin sheath', 'synapse', 'synaptic', 'action potential'],
    factory: createNeuronDiagram,
  },
  {
    id: 'nephron',
    name: 'Nephron Structure & Urine Formation',
    category: 'Biology',
    keywords: ['nephron', 'renal nephron', 'glomerulus', 'bowman', 'henle', 'loop of henle', 'kidney filtration'],
    factory: createNephronDiagram,
  },
  {
    id: 'projectile-motion',
    name: 'Projectile Motion & Kinematics',
    category: 'Physics',
    keywords: ['projectile', 'projectile motion', 'kinematics trajectory', 'parabolic motion', 'trajectory path'],
    factory: createProjectileMotionDiagram,
  },
  {
    id: 'animal-cell',
    name: 'Animal Cell Ultrastructure & Organelles',
    category: 'Biology',
    keywords: ['animal cell', 'plant cell', 'organelle', 'mitochondria', 'golgi apparatus', 'endoplasmic reticulum', 'cell structure'],
    factory: createCellDiagram,
  },
  {
    id: 'solar-system',
    name: 'Solar System & Planetary Orbits',
    category: 'Physics',
    keywords: ['solar system', 'planetary orbit', 'planets', 'sun and earth', 'heliocentric', 'mars orbit', 'jupiter orbit'],
    factory: (x = 200, y = 100, isDark = false) => generateSolarSystemDiagram(x, y, isDark),
  },
  {
    id: 'dna-helix',
    name: 'DNA Double Helix & Base Pairing',
    category: 'Biology',
    keywords: ['dna', 'dna helix', 'double helix', 'nucleotide', 'adenine thymine', 'guanine cytosine', 'dna base pair', 'rna helix'],
    factory: (x = 200, y = 100, isDark = false) => generateDNADiagram(x, y, isDark),
  },
  {
    id: 'atom-structure',
    name: 'Atomic Model & Quantum Shells',
    category: 'Chemistry',
    keywords: ['atom', 'atomic structure', 'bohr atom', 'electron shell', 'protons and neutrons', 'atomic model', 'quantum atom'],
    factory: (x = 200, y = 100, isDark = false) => generateAtomDiagram(x, y, isDark),
  },
  {
    id: 'electric-circuit',
    name: 'Electric Circuit & Kirchhoff Laws',
    category: 'Physics',
    keywords: ['circuit', 'electric circuit', 'dc circuit', 'kirchhoff circuit', 'resistor battery', 'parallel circuit', 'series circuit'],
    factory: (x = 200, y = 100, isDark = false) => generateCircuitDiagram(x, y, isDark),
  },
  {
    id: 'neural-network',
    name: 'Neural Network Deep Learning Architecture',
    category: 'Computer Science',
    keywords: ['neural network', 'deep learning network', 'multilayer perceptron', 'perceptron model', 'backpropagation algorithm', 'artificial neural'],
    factory: (x = 200, y = 100, isDark = false) => generateNeuralNetDiagram(x, y, isDark),
  },
  {
    id: 'organic-chemistry',
    name: 'Organic Chemistry: SN2/SN1 Reaction Coordinate & Mechanism',
    category: 'Chemistry',
    keywords: ['organic', 'organic chemistry', 'sn1', 'sn2', 'reaction mechanism', 'nucleophile', 'electrophile', 'carbocation', 'walden inversion', 'reaction coordinate'],
    factory: (x = 200, y = 100, isDark = false) => generateOrganicChemistryDiagram(x, y, isDark),
  },
];

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function findDiagramTemplate(query: string): DiagramTemplateInfo | null {
  const norm = query.toLowerCase().trim();
  if (!norm) return null;

  for (const t of DIAGRAM_TEMPLATES) {
    for (const kw of t.keywords) {
      const pattern = new RegExp(`(^|\\s|[^a-zA-Z0-9])${escapeRegex(kw)}($|\\s|[^a-zA-Z0-9])`, 'i');
      if (pattern.test(norm)) {
        return t;
      }
    }
  }
  return null;
}

export function generateFallbackOrCustomDiagram(
  query: string,
  x: number = 200,
  y: number = 100,
  isDark: boolean = false
): DiagramObjectData {
  const matched = findDiagramTemplate(query);
  if (matched) {
    return matched.factory(x, y, isDark);
  }
  return generateUniversalCustomDiagram(query, x, y, isDark);
}
