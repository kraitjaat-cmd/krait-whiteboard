import type { CanvasObject, FlashcardObjectData } from '../types/canvas';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  subject: string;
}

export function generateQuizFromCanvas(
  objects: CanvasObject[]
): { questions: QuizQuestion[]; flashcards: FlashcardObjectData[] } {
  // Inspect objects to determine subjects
  const isBiology = objects.some(
    (o) =>
      (o.type === 'diagram' && (o.subject.includes('Heart') || o.subject.includes('Neuron') || o.subject.includes('Nephron') || o.subject.includes('Cell'))) ||
      (o.type === 'text' && o.text.toLowerCase().includes('blood'))
  );

  const isPhysics = objects.some(
    (o) =>
      (o.type === 'diagram' && o.subject.includes('Projectile')) ||
      (o.type === 'graph') ||
      (o.type === 'equation' && (o.latex.includes('v_0') || o.latex.includes('V = I')))
  );

  const questions: QuizQuestion[] = [];
  const flashcards: FlashcardObjectData[] = [];

  if (isBiology || (!isPhysics && true)) {
    questions.push(
      {
        id: 'q-bio-1',
        question: 'Which heart chamber pumps oxygenated blood into the aorta for systemic circulation?',
        options: ['Right Atrium', 'Right Ventricle', 'Left Atrium', 'Left Ventricle'],
        correctIndex: 3,
        explanation: 'The Left Ventricle has the thickest myocardium to generate high systolic blood pressure (~120 mmHg) to supply systemic organs.',
        subject: 'Human Heart Anatomy',
      },
      {
        id: 'q-bio-2',
        question: 'What is the function of the myelin sheath formed by Schwann cells in motor neurons?',
        options: ['Synthesize neurotransmitters', 'Increase speed of action potential via saltatory conduction', 'Store glycogen', 'Anchor the soma'],
        correctIndex: 1,
        explanation: 'Myelin acts as electrical insulation, enabling the nerve impulse to jump between Nodes of Ranvier at speeds up to 120 m/s.',
        subject: 'Neurobiology',
      },
      {
        id: 'q-bio-3',
        question: 'In the nephron, 100% of glucose and amino acids are selectively reabsorbed in which segment?',
        options: ['Proximal Convoluted Tubule (PCT)', 'Loop of Henle', 'Distal Convoluted Tubule (DCT)', 'Collecting Duct'],
        correctIndex: 0,
        explanation: 'The PCT has extensive brush border microvilli and active Na+/glucose cotransporters that recover 100% of essential nutrients.',
        subject: 'Renal Physiology',
      }
    );

    flashcards.push(
      {
        id: `fc-study-1-${Date.now()}`,
        type: 'flashcard',
        x: 200,
        y: 200,
        question: 'Why does the left ventricle have a 3x thicker muscular wall than the right ventricle?',
        answer: 'Because the left ventricle must pump blood against high systemic vascular resistance (~120 mmHg), whereas the right ventricle only pumps into the low-resistance pulmonary circuit (~25 mmHg).',
        hint: 'Think about pressure differences between systemic vs pulmonary circuits.',
        subject: 'Cardiovascular Physiology',
        isFlipped: false,
        zIndex: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: `fc-study-2-${Date.now()}`,
        type: 'flashcard',
        x: 560,
        y: 200,
        question: 'What happens at the synapse when an action potential reaches the terminal bouton?',
        answer: 'Voltage-gated Ca2+ channels open → Ca2+ influx causes synaptic vesicles to fuse with the presynaptic membrane → neurotransmitters diffuse across the 20nm cleft to bind postsynaptic receptors.',
        hint: 'Key ion involved is Ca2+ triggering vesicle exocytosis.',
        subject: 'Neurotransmission',
        isFlipped: false,
        zIndex: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
    );
  }

  if (isPhysics) {
    questions.push(
      {
        id: 'q-phys-1',
        question: 'At the apex (maximum height) of a 2D projectile trajectory, which velocity component is zero?',
        options: ['Horizontal velocity vx', 'Vertical velocity vy', 'Total velocity v', 'None of the above'],
        correctIndex: 1,
        explanation: 'At maximum height H, vertical upward motion momentarily halts (vy = 0), while horizontal velocity vx = v0 cos θ remains constant.',
        subject: 'Kinematics',
      },
      {
        id: 'q-phys-2',
        question: 'According to Ohm\'s Law, what happens to the electric current if the circuit resistance is doubled while keeping voltage constant?',
        options: ['Current doubles', 'Current is halved', 'Current quadruples', 'Current remains unchanged'],
        correctIndex: 1,
        explanation: 'I = V / R. Since current is inversely proportional to resistance, doubling R halves I.',
        subject: 'Electric Circuits',
      }
    );
  }

  return { questions, flashcards };
}
