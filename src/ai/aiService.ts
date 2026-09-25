import type { AICommandPayload, AIResponseAction } from '../types/ai';
import type { CanvasObject, DiagramObjectData, FlashcardObjectData, GraphObjectData, TableObjectData, TextObjectData, StrokeObjectData, EquationObjectData } from '../types/canvas';
import { generateFallbackOrCustomDiagram } from '../diagrams/DiagramRegistry';
import { findOptimalPlacement } from './layoutEngine';
import { aiConfigStore } from '../store/aiConfigStore';
import { callClaudeAI } from './claudeService';
import { solveMathProblem, generateMathSolutionCanvasObjects, extractMathExpression } from './mathSolverEngine';
import { recognizeHandwritingFromStrokes } from './handwritingRecognition';
import { secretApologyStore } from '../store/secretApologyStore';
import { generateSecretApologyCanvasObjects } from './apologyGenerator';

export async function processAICommand(
  payload: AICommandPayload,
  existingObjects: CanvasObject[],
  isDarkTheme: boolean = false
): Promise<AIResponseAction> {
  const query = (payload.query || '').trim();
  const lower = query.toLowerCase();
  const command = payload.command;
  const selected = payload.selectedObjects || [];

  // Optimal placement calculation
  let preferredPos = payload.canvasContext?.centerPosition || { x: 180, y: 120 };
  if (selected.length > 0) {
    const sel = selected[0];
    const selH = (sel as any).height || 180;
    preferredPos = { x: sel.x, y: sel.y + selH + 30 };
  }

  // 1. EXTRACT CONTEXT FROM SELECTED OBJECTS
  let selectedMathExpr = '';
  let selectedTextContent = '';
  let selectedDiagramSubject = '';

  const selectedStrokes = selected.filter((o): o is StrokeObjectData => o.type === 'stroke');
  if (selectedStrokes.length > 0) {
    const recognized = recognizeHandwritingFromStrokes(selectedStrokes);
    if (recognized.length > 0 && recognized[0].recognized_text) {
      selectedMathExpr = recognized[0].recognized_text;
    }
  }

  for (const obj of selected) {
    if (obj.type === 'equation') {
      selectedMathExpr = (obj as EquationObjectData).latex || selectedMathExpr;
    } else if (obj.type === 'text') {
      const txt = (obj as TextObjectData).text || '';
      selectedTextContent += ' ' + txt;
      if (txt.includes('=') || txt.includes('+') || txt.includes('-') || txt.includes('*') || txt.includes('/')) {
        selectedMathExpr = txt;
      }
    } else if (obj.type === 'diagram') {
      selectedDiagramSubject = (obj as DiagramObjectData).subject || (obj as DiagramObjectData).title || '';
    }
  }

  // 1.5. CHECK FOR SECRET APOLOGY TRIGGER ("gogu sorry")
  if (secretApologyStore.matchesSecretCode(query) || secretApologyStore.matchesSecretCode(selectedTextContent)) {
    secretApologyStore.triggerSecret(true);
    const apologyObjects = generateSecretApologyCanvasObjects(preferredPos.x || 100, preferredPos.y || 80, isDarkTheme);
    return {
      canvas_action: 'batch_create',
      subject: 'A Message From My Heart 🌸',
      objects: apologyObjects,
      explanation: '🌸 Rendered sincere handwritten message with blooming hand-drawn roses and romantic background melody.',
    };
  }

  // 2. CHECK IF QUERY OR SELECTION CONTAINS MATH EQUATION OR SOLVE REQUEST
  const extractedQueryMath = extractMathExpression(query);
  const candidateMath = extractedQueryMath || selectedMathExpr;

  const isMathIntent =
    command === 'solve' ||
    command === 'derive_equation' ||
    lower.includes('solve') ||
    lower.includes('solution') ||
    lower.includes('calculate') ||
    lower.includes('find the value') ||
    lower.includes('what is x') ||
    lower.includes('find x') ||
    lower.includes('equation') ||
    lower.includes('root') ||
    lower.includes('algebra') ||
    lower.includes('derivative') ||
    lower.includes('integral') ||
    lower.includes('d/dx') ||
    lower.includes('\\int') ||
    lower.includes('quadratic') ||
    (candidateMath && (candidateMath.includes('=') || candidateMath.includes('+') || candidateMath.includes('-') || candidateMath.includes('*') || candidateMath.includes('^') || candidateMath.includes('/')));

  // Check if live LLM is configured
  const config = aiConfigStore.getState();
  if (
    (config.provider === 'anthropic' && config.anthropicApiKey) ||
    (config.provider === 'openai' && config.openaiApiKey) ||
    config.provider === 'ollama'
  ) {
    try {
      const pos = findOptimalPlacement(960, 600, existingObjects, preferredPos);
      const promptToSend = query || (candidateMath ? `Solve and explain: ${candidateMath}` : 'Explain the selected concept in high detail');
      const llmResult = await callClaudeAI(promptToSend, pos, isDarkTheme);
      if (llmResult.objects.length > 0) {
        return {
          canvas_action: 'batch_create',
          subject: query || candidateMath || 'AI Analysis',
          objects: llmResult.objects,
          explanation: llmResult.explanation,
        };
      }
    } catch (err: any) {
      console.warn('Live LLM call fallback to high-yield mathematical & conceptual reasoning engine:', err);
    }
  }

  // Quick simulated reasoning tick
  await new Promise((resolve) => setTimeout(resolve, 200));

  // 3. EXECUTE MATH & ALGEBRA SOLVER ENGINE
  if (isMathIntent && candidateMath) {
    const mathSolution = solveMathProblem(candidateMath);
    const pos = findOptimalPlacement(460, 520, existingObjects, preferredPos);
    const mathObjects = generateMathSolutionCanvasObjects(mathSolution, pos.x, pos.y, isDarkTheme);

    return {
      canvas_action: 'create_equation',
      subject: `Solution for ${mathSolution.problemLatex}`,
      objects: mathObjects,
      explanation: `Solved ${candidateMath} step-by-step: ${mathSolution.solutionSummary}`,
    };
  }

  // 4. COMPARISON TABLE REQUEST
  if (command === 'make_table' || lower.includes('table') || lower.includes('compare') || lower.includes('matrix') || lower.includes('difference between')) {
    const pos = findOptimalPlacement(600, 360, existingObjects, preferredPos);
    let tableObj: TableObjectData;

    if (lower.includes('mitosis') || lower.includes('meiosis')) {
      tableObj = {
        id: `table-mitosis-${Date.now()}`,
        type: 'table',
        x: pos.x,
        y: pos.y,
        zIndex: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        title: 'Comparison: Mitosis vs Meiosis',
        isHandwrittenStyle: true,
        color: isDarkTheme ? '#F8FAFC' : '#1E293B',
        borderColor: isDarkTheme ? '#A855F7' : '#7C3AED',
        bgColor: isDarkTheme ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        columns: [
          { id: 'feature', header: 'Feature' },
          { id: 'mitosis', header: 'Mitosis' },
          { id: 'meiosis', header: 'Meiosis' },
        ],
        rows: [
          ['Division Type', 'Equational (1 division)', 'Reductional (2 divisions)'],
          ['Daughter Cells', '2 diploid (2n) clones', '4 haploid (n) gametes'],
          ['Crossing Over', 'Does not occur', 'Occurs in Pachytene (Prophase I)'],
          ['Site in Body', 'Somatic cells (growth/repair)', 'Germ cells (testes/ovaries)'],
          ['Genetic Variation', 'Zero (Genetically identical)', 'High (Independent assortment)'],
        ],
      };
    } else if (lower.includes('sn1') || lower.includes('sn2') || lower.includes('substitution')) {
      tableObj = {
        id: `table-sn1-sn2-${Date.now()}`,
        type: 'table',
        x: pos.x,
        y: pos.y,
        zIndex: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        title: 'Organic Chemistry: SN1 vs SN2 Mechanisms',
        isHandwrittenStyle: true,
        color: isDarkTheme ? '#F8FAFC' : '#1E293B',
        borderColor: isDarkTheme ? '#F43F5E' : '#E11D48',
        bgColor: isDarkTheme ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        columns: [
          { id: 'feature', header: 'Reaction Parameter' },
          { id: 'sn2', header: 'SN2 (Bimolecular)' },
          { id: 'sn1', header: 'SN1 (Unimolecular)' },
        ],
        rows: [
          ['Kinetics & Rate Law', 'Rate = k[Substrate][Nu⁻]', 'Rate = k[Substrate]'],
          ['Steps & Intermediate', 'Concerted (1 step, pentacoordinate TS)', '2 steps (Planar carbocation intermediate)'],
          ['Substrate Order', 'Methyl > 1° > 2° >> 3° (Steric hindrance)', '3° > 2° >> 1° > Methyl (Carbocation stability)'],
          ['Stereochemistry', '100% Walden Inversion (Backside attack)', 'Racemization (Top/bottom nucleophilic attack)'],
          ['Preferred Solvent', 'Polar Aprotic (DMSO, DMF, Acetone)', 'Polar Protic (H₂O, EtOH, MeOH stabilizes ions)'],
        ],
      };
    } else {
      const subjectClean = query.replace(/^(make|create|draw)\s+(a\s+)?table\s+(comparing|of|for)?/i, '').trim() || 'Concepts';
      tableObj = {
        id: `table-custom-${Date.now()}`,
        type: 'table',
        x: pos.x,
        y: pos.y,
        zIndex: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        title: `Comparison Table: ${subjectClean}`,
        isHandwrittenStyle: true,
        color: isDarkTheme ? '#F8FAFC' : '#1E293B',
        borderColor: isDarkTheme ? '#38BDF8' : '#0284C7',
        bgColor: isDarkTheme ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        columns: [
          { id: 'parameter', header: 'Parameter' },
          { id: 'categoryA', header: 'Option / State A' },
          { id: 'categoryB', header: 'Option / State B' },
        ],
        rows: [
          ['Primary Mechanism', 'Direct Activation', 'Inhibition / Feedback Loop'],
          ['Energy Requirement', 'High ATP / Exergonic', 'Low / Passive Diffusion'],
          ['Structural Stability', 'Rigid & Dynamic', 'Flexible / Adaptive'],
          ['Operational Outcome', 'Max Throughput', 'Equilibrium Maintenance'],
        ],
      };
    }

    return {
      canvas_action: 'create_table',
      subject: tableObj.title,
      objects: [tableObj],
      explanation: 'Generated structured comparison table on canvas.',
    };
  }

  // 5. SCIENTIFIC GRAPH REQUEST
  if (command === 'make_graph' || lower.includes('graph') || lower.includes('plot')) {
    const pos = findOptimalPlacement(520, 360, existingObjects, preferredPos);
    const graphObj: GraphObjectData = {
      id: `graph-${Date.now()}`,
      type: 'graph',
      x: pos.x,
      y: pos.y,
      width: 500,
      height: 360,
      zIndex: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      title: query ? `Plot: ${query}` : 'Velocity vs Time (Constant Acceleration a = 2 m/s²)',
      xLabel: 'X Axis (Input parameter)',
      yLabel: 'Y Axis (Response value)',
      xRange: [0, 10],
      yRange: [0, 25],
      datasets: [
        {
          label: 'f(x) = y₀ + k·x',
          color: '#2563eb',
          points: [
            { x: 0, y: 5 },
            { x: 2, y: 9 },
            { x: 4, y: 13 },
            { x: 6, y: 17 },
            { x: 8, y: 21 },
            { x: 10, y: 25 },
          ],
        },
      ],
      annotations: [
        { x: 0, y: 5, text: 'Initial Condition y₀ = 5' },
        { x: 6, y: 17, text: 'Slope = Rate of Change' },
      ],
      equations: ['f(x) = 5 + 2x', 'Area under curve = Integrated Total'],
    };

    return {
      canvas_action: 'create_graph',
      subject: graphObj.title,
      objects: [graphObj],
      explanation: 'Generated scientific graph with mathematical formulas and annotations.',
    };
  }

  // 6. FLASHCARDS / QUIZ REQUEST
  if (command === 'create_flashcards' || command === 'quiz_me' || lower.includes('flashcard') || lower.includes('quiz')) {
    const pos = findOptimalPlacement(740, 260, existingObjects, preferredPos);

    const fc1: FlashcardObjectData = {
      id: `fc-1-${Date.now()}`,
      type: 'flashcard',
      x: pos.x,
      y: pos.y,
      question: `What is the fundamental law governing ${query || 'this system'}?`,
      answer: 'Structural-functional relationship: Mechanism dictates output performance.',
      hint: 'Think about conservation laws and feedback regulation.',
      subject: query || 'Core Principles',
      isFlipped: false,
      zIndex: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const fc2: FlashcardObjectData = {
      id: `fc-2-${Date.now()}`,
      type: 'flashcard',
      x: pos.x + 360,
      y: pos.y,
      question: 'How does efficiency scale when load or resistance increases?',
      answer: 'Throughput adjusts proportionally according to inverse feedback constraints.',
      hint: 'Consider rate-limiting steps.',
      subject: query || 'Systems Dynamics',
      isFlipped: false,
      zIndex: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    return {
      canvas_action: 'create_flashcards',
      objects: [fc1, fc2],
      explanation: 'Created interactive self-test flashcards on canvas.',
    };
  }

  // 7. DEEP CONCEPT EXPLANATION (When user asks "explain", "how does it work", or explains a selected diagram/note)
  if (
    command === 'explain' ||
    command === 'summarize' ||
    command === 'create_notes' ||
    lower.includes('explain') ||
    lower.includes('selected part') ||
    lower.includes('how does') ||
    lower.includes('what is') ||
    lower.includes('summary') ||
    lower.includes('notes')
  ) {
    const targetSubject = selectedDiagramSubject || query.replace(/^(explain|summarize|tell me about|what is)\s+(the\s+)?(selected\s+part|this)?/i, '').trim() || 'Core Scientific Principles';

    const pos = findOptimalPlacement(460, 360, existingObjects, preferredPos);
    const cardBg = isDarkTheme ? 'rgba(24, 26, 35, 0.96)' : 'rgba(255, 255, 255, 0.97)';
    const cardBorder = isDarkTheme ? 'rgba(71, 85, 105, 0.45)' : 'rgba(226, 232, 240, 0.95)';
    const accentColor = isDarkTheme ? '#F43F5E' : '#E11D48';

    let explanationBody = `📌 Comprehensive Analysis • ${targetSubject}\n\n`;
    explanationBody += `1. Core Definition & Role:\n`;
    explanationBody += `   The selected component serves as the primary functional unit responsible for driving system equilibrium, regulating throughput, and maintaining physiological/physical stability.\n\n`;
    explanationBody += `2. Mechanism of Action:\n`;
    explanationBody += `   • Upstream Activation: Signals/reagents trigger conformation change.\n`;
    explanationBody += `   • Energy Transduction: Potential energy converts into kinetic/electrochemical work.\n`;
    explanationBody += `   • Feedback Loop: Negative feedback dampens overshoot to ensure homeostasis.\n\n`;
    explanationBody += `💡 High-Yield Exam Takeaway:\n`;
    explanationBody += `   Structure dictates function. Altering boundary conditions shifts output proportionally according to conservation principles.`;

    const noteCard: TextObjectData = {
      id: `card-explain-${Date.now()}`,
      type: 'text',
      x: pos.x,
      y: pos.y,
      width: 460,
      height: 350,
      text: explanationBody,
      fontFamily: 'Kalam, cursive',
      fontSize: 15,
      color: isDarkTheme ? '#F8FAFC' : '#1E293B',
      isHandwrittenStyle: true,
      alignment: 'left',
      cardBgColor: cardBg,
      cardBorderColor: cardBorder,
      cardAccentColor: accentColor,
      cardTitle: `Conceptual Breakdown • ${targetSubject}`,
      cardIcon: '💡',
      zIndex: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    return {
      canvas_action: 'create_text',
      subject: targetSubject,
      objects: [noteCard],
      explanation: `Generated structured conceptual explanation card for "${targetSubject}".`,
    };
  }

  // 8. UNIVERSAL VECTOR DIAGRAM GENERATION (Draws physical/biological/chemical systems)
  const diagramSubject = query.replace(/^(draw|sketch|illustrate|create a diagram of)\s+/i, '').trim() || 'Scientific Model';
  const pos = findOptimalPlacement(960, 600, existingObjects, preferredPos);
  const diagramObj: DiagramObjectData = generateFallbackOrCustomDiagram(diagramSubject, pos.x, pos.y, isDarkTheme);

  return {
    canvas_action: 'create_diagram',
    subject: diagramObj.subject,
    objects: [diagramObj],
    explanation: `Generated detailed vector illustration for "${diagramObj.subject}" with structural paths, labels, callouts, and notes.`,
  };
}
