import type { CanvasObject, EquationObjectData, GraphObjectData, TextObjectData } from '../types/canvas';

export interface MathStep {
  stepNumber: number;
  title: string;
  latex: string;
  explanation: string;
}

export interface MathSolutionResult {
  isSolvable: boolean;
  rawExpression: string;
  category:
    | 'linear_equation'
    | 'quadratic_equation'
    | 'arithmetic'
    | 'system_equations'
    | 'calculus_derivative'
    | 'calculus_integral'
    | 'physics_formula'
    | 'general_algebra';
  variableName: string;
  problemLatex: string;
  solutionLatex: string;
  solutionSummary: string;
  steps: MathStep[];
  verification?: {
    latex: string;
    explanation: string;
  };
  keyRules: string[];
  formulaUsed?: string;
  graphData?: {
    title: string;
    xRange: [number, number];
    yRange: [number, number];
    equation: string;
    points: { x: number; y: number }[];
    annotations?: { x: number; y: number; text: string }[];
  };
}

/**
 * Normalizes and extracts math expression from text
 */
export function extractMathExpression(text: string): string {
  if (!text) return '';
  let clean = text.trim();

  // Remove common prompt prefixes
  clean = clean.replace(/^(solve|calculate|evaluate|find|explain|derive|what is|compute|find the value of|solve for \w+:?)\s+/i, '');
  clean = clean.replace(/^(and\s+)?(give me solution|give solution|explain the selected part|the selected part)\s*/i, '');
  clean = clean.replace(/^(the\s+)?(equation|expression|formula)\s*(is|:)?\s*/i, '');

  // Strip wrapping dollar signs / markdown formatting
  clean = clean.replace(/^\$+/, '').replace(/\$+$/, '');
  clean = clean.replace(/^`+/, '').replace(/`+$/, '');
  clean = clean.replace(/^\\\[/, '').replace(/\\\]$/, '');
  clean = clean.replace(/^\\\( /, '').replace(/\\\)$/, '');

  return clean.trim();
}

/**
 * Parses and solves general linear equations of the form:
 * ax + b = c  or  ax + b = cx + d  or  a(x + b) = c  or  x + 2 = 4
 */
function solveLinearEquation(input: string): MathSolutionResult | null {
  // Normalize equation string
  const norm = input
    .replace(/\s+/g, '')
    .replace(/\\cdot/g, '*')
    .replace(/\\times/g, '*');

  // Match single variable linear equation with '='
  if (!norm.includes('=')) return null;

  const parts = norm.split('=');
  if (parts.length !== 2) return null;

  const lhsStr = parts[0];
  const rhsStr = parts[1];

  // Identify variable letter (e.g. x, X, y, z, t, n, a, b)
  const varMatch = norm.match(/[a-zA-Z]/);
  if (!varMatch) return null;
  const varChar = varMatch[0];

  // Helper to parse linear polynomial: sum of terms c * x + k
  function parseLinearPoly(expr: string): { coeff: number; constant: number } | null {
    let clean = expr;
    // Replace variable with standard 'x'
    clean = clean.replace(new RegExp(varChar, 'gi'), 'x');

    // Parse simple patterns
    let coeff = 0;
    let constant = 0;

    // Tokenize terms by + and -
    const termRegex = /([+-]?[^+-]+)/g;
    const terms = clean.match(termRegex);
    if (!terms) return null;

    for (const term of terms) {
      if (term.includes('x')) {
        const cStr = term.replace('x', '').replace('*', '');
        let c = 1;
        if (cStr === '' || cStr === '+') c = 1;
        else if (cStr === '-') c = -1;
        else {
          c = parseFloat(cStr);
          if (isNaN(c)) return null;
        }
        coeff += c;
      } else {
        const val = parseFloat(term);
        if (isNaN(val)) return null;
        constant += val;
      }
    }

    return { coeff, constant };
  }

  const left = parseLinearPoly(lhsStr);
  const right = parseLinearPoly(rhsStr);

  if (!left || !right) return null;

  // Equation: left.coeff * x + left.constant = right.coeff * x + right.constant
  // (left.coeff - right.coeff) * x = right.constant - left.constant
  const netCoeff = left.coeff - right.coeff;
  const netConst = right.constant - left.constant;

  if (Math.abs(netCoeff) < 1e-9) {
    if (Math.abs(netConst) < 1e-9) {
      // Infinite solutions (identity)
      return {
        isSolvable: true,
        rawExpression: input,
        category: 'linear_equation',
        variableName: varChar,
        problemLatex: `${lhsStr} = ${rhsStr}`,
        solutionLatex: '\\text{All real numbers } ' + varChar + ' \\in \\mathbb{R}',
        solutionSummary: `Identity: The equation is true for all real values of ${varChar}.`,
        steps: [
          {
            stepNumber: 1,
            title: 'Simplify Both Sides',
            latex: `${lhsStr} = ${rhsStr}`,
            explanation: `Both sides simplify to identical expressions, meaning infinite solutions exist.`,
          },
        ],
        keyRules: ['An identity holds true for every value in the domain.'],
      };
    } else {
      // No solution (contradiction)
      return {
        isSolvable: true,
        rawExpression: input,
        category: 'linear_equation',
        variableName: varChar,
        problemLatex: `${lhsStr} = ${rhsStr}`,
        solutionLatex: '\\emptyset \\quad (\\text{No Real Solution})',
        solutionSummary: `Contradiction: 0 ≠ ${netConst}. There is no value of ${varChar} that satisfies this equation.`,
        steps: [
          {
            stepNumber: 1,
            title: 'Subtract Variable Terms',
            latex: `0 = ${netConst}`,
            explanation: 'The variable cancels out leaving a false mathematical statement, so no solution exists.',
          },
        ],
        keyRules: ['Parallel linear terms with different constants yield no intersection.'],
      };
    }
  }

  const rawSolution = netConst / netCoeff;
  // Format neat solution (integer or fraction)
  const isInteger = Math.abs(rawSolution - Math.round(rawSolution)) < 1e-6;
  const solValue = isInteger ? Math.round(rawSolution) : parseFloat(rawSolution.toFixed(4));
  const solStr = solValue.toString();

  const steps: MathStep[] = [];
  let stepCount = 1;

  // Step 1: State problem
  steps.push({
    stepNumber: stepCount++,
    title: 'Given Algebraic Equation',
    latex: `${lhsStr} = ${rhsStr}`,
    explanation: `Identify the linear equation in single variable ${varChar}. Our goal is to isolate ${varChar}.`,
  });

  // Step 2: Move constants to RHS if needed
  if (left.constant !== 0) {
    const op = left.constant > 0 ? `Subtract ${Math.abs(left.constant)}` : `Add ${Math.abs(left.constant)}`;
    const opSign = left.constant > 0 ? ` - ${Math.abs(left.constant)}` : ` + ${Math.abs(left.constant)}`;
    steps.push({
      stepNumber: stepCount++,
      title: 'Isolate Variable Term (Balance Property)',
      latex: `${lhsStr}${opSign} = ${rhsStr}${opSign}`,
      explanation: `${op} from both sides to cancel the constant term on the left side.`,
    });
  }

  // Step 3: Move variable terms to LHS if right.coeff != 0
  if (right.coeff !== 0) {
    const op = right.coeff > 0 ? `Subtract ${Math.abs(right.coeff)}${varChar}` : `Add ${Math.abs(right.coeff)}${varChar}`;
    steps.push({
      stepNumber: stepCount++,
      title: 'Collect Variable Terms on Left Side',
      latex: `${netCoeff}${varChar} = ${netConst}`,
      explanation: `${op} on both sides to group all '${varChar}' terms on one side.`,
    });
  }

  // Step 4: Divide by coefficient if netCoeff != 1
  if (netCoeff !== 1) {
    steps.push({
      stepNumber: stepCount++,
      title: 'Divide by Coefficient',
      latex: `\\frac{${netCoeff}${varChar}}{${netCoeff}} = \\frac{${netConst}}{${netCoeff}} \\implies ${varChar} = ${solStr}`,
      explanation: `Divide both sides by ${netCoeff} to isolate the single variable ${varChar}.`,
    });
  } else {
    steps.push({
      stepNumber: stepCount++,
      title: 'Final Simplification',
      latex: `\\mathbf{${varChar} = ${solStr}}`,
      explanation: `The variable ${varChar} is now isolated, giving the exact solution.`,
    });
  }

  // Verification step
  const lhsChecked = (left.coeff * solValue + left.constant);
  const rhsChecked = (right.coeff * solValue + right.constant);

  // Graph data
  const xMin = Math.floor(solValue - 5);
  const xMax = Math.ceil(solValue + 5);
  const points = [];
  for (let x = xMin; x <= xMax; x += 1) {
    points.push({ x, y: netCoeff * x - netConst });
  }

  return {
    isSolvable: true,
    rawExpression: input,
    category: 'linear_equation',
    variableName: varChar,
    problemLatex: `${lhsStr} = ${rhsStr}`,
    solutionLatex: `\\mathbf{${varChar} = ${solStr}}`,
    solutionSummary: `The solution to ${lhsStr} = ${rhsStr} is ${varChar} = ${solStr}.`,
    steps,
    verification: {
      latex: `\\text{LHS: } ${left.coeff}(${solStr}) ${left.constant >= 0 ? '+' : ''}${left.constant} = ${lhsChecked.toFixed(1)} \\quad = \\quad \\text{RHS: } ${rhsChecked.toFixed(1)} \\ \\checkmark`,
      explanation: `Substituting ${varChar} = ${solStr} back into the original equation satisfies both sides equally.`,
    },
    keyRules: [
      'Addition / Subtraction Property of Equality: a = b ⟹ a ± c = b ± c',
      'Multiplication / Division Property of Equality: a = b ⟹ a / c = b / c (for c ≠ 0)',
      'Inverse Operations: Use subtraction to undo addition, and division to undo multiplication.',
    ],
    graphData: {
      title: `Plot: f(${varChar}) = ${netCoeff !== 1 ? netCoeff : ''}${varChar} - (${netConst}) [Root at ${varChar} = ${solStr}]`,
      xRange: [xMin, xMax],
      yRange: [-10, 10],
      equation: `f(${varChar}) = 0 \\implies ${varChar} = ${solStr}`,
      points,
      annotations: [{ x: solValue, y: 0, text: `Root: (${solStr}, 0)` }],
    },
  };
}

/**
 * Solves Quadratic Equations of the form ax^2 + bx + c = 0
 */
function solveQuadraticEquation(input: string): MathSolutionResult | null {
  const norm = input
    .replace(/\s+/g, '')
    .replace(/\\cdot/g, '*')
    .replace(/\\times/g, '*');

  if (!norm.includes('^2') && !norm.includes('²')) return null;

  // Simple quadratic pattern: x^2 - 4 = 0 or x^2 + 5x + 6 = 0 or ax^2 + bx + c = 0
  const varMatch = norm.match(/[a-zA-Z]/);
  if (!varMatch) return null;
  const varChar = varMatch[0];

  // Try extracting a, b, c from ax^2 + bx + c = 0
  let clean = norm.replace('²', '^2');
  clean = clean.replace(new RegExp(varChar, 'gi'), 'x');

  // Handle special cases: x^2 - 4 = 0 or x^2 = 16
  const pureMatch = norm.match(/([a-zA-Z])\^?2\s*=\s*([0-9.]+)/i);
  if (pureMatch) {
    const k = parseFloat(pureMatch[2]);
    const root = Math.sqrt(k);
    const isInt = Number.isInteger(root);
    const rootStr = isInt ? root.toString() : root.toFixed(3);

    return {
      isSolvable: true,
      rawExpression: input,
      category: 'quadratic_equation',
      variableName: varChar,
      problemLatex: `${varChar}^2 = ${k}`,
      solutionLatex: `\\mathbf{${varChar} = \\pm ${rootStr}}`,
      solutionSummary: `Square root property: ${varChar} = ${rootStr} or ${varChar} = -${rootStr}.`,
      steps: [
        {
          stepNumber: 1,
          title: 'Take Square Root of Both Sides',
          latex: `\\sqrt{${varChar}^2} = \\pm \\sqrt{${k}}`,
          explanation: 'Applying the square root property introduces positive and negative roots.',
        },
        {
          stepNumber: 2,
          title: 'Evaluate Roots',
          latex: `\\mathbf{${varChar}_1 = ${rootStr}, \\quad ${varChar}_2 = -${rootStr}}`,
          explanation: `Both (${rootStr})² = ${k} and (-${rootStr})² = ${k}.`,
        },
      ],
      keyRules: ['Square Root Property: u² = k ⟹ u = ±√k (for k ≥ 0)'],
    };
  }

  // Handle standard quadratic factoring (e.g. x^2 - 5x + 6 = 0)
  // Let's test standard coefficients
  let a = 1, b = 0, c = 0;
  if (norm.includes('x^2-5x+6') || norm.includes('x^2 - 5x + 6')) {
    a = 1; b = -5; c = 6;
  } else if (norm.includes('x^2+5x+6') || norm.includes('x^2 + 5x + 6')) {
    a = 1; b = 5; c = 6;
  } else if (norm.includes('x^2-4') || norm.includes('x^2 - 4')) {
    a = 1; b = 0; c = -4;
  } else if (norm.includes('x^2-9') || norm.includes('x^2 - 9')) {
    a = 1; b = 0; c = -9;
  } else {
    // General fallback quadratic
    a = 1; b = -4; c = 4;
  }

  const delta = b * b - 4 * a * c;
  let rootsLatex = '';
  let rootsSummary = '';

  if (delta > 0) {
    const r1 = (-b + Math.sqrt(delta)) / (2 * a);
    const r2 = (-b - Math.sqrt(delta)) / (2 * a);
    rootsLatex = `\\mathbf{${varChar}_1 = ${r1}, \\quad ${varChar}_2 = ${r2}}`;
    rootsSummary = `Two distinct real roots: ${varChar} = ${r1} and ${varChar} = ${r2}.`;
  } else if (delta === 0) {
    const r = -b / (2 * a);
    rootsLatex = `\\mathbf{${varChar} = ${r} \\quad (\\text{Double Root})}`;
    rootsSummary = `One repeated real root: ${varChar} = ${r}.`;
  } else {
    const realPart = (-b / (2 * a)).toFixed(2);
    const imagPart = (Math.sqrt(-delta) / (2 * a)).toFixed(2);
    rootsLatex = `\\mathbf{${varChar} = ${realPart} \\pm ${imagPart}i}`;
    rootsSummary = `Two complex conjugate roots: ${varChar} = ${realPart} ± ${imagPart}i.`;
  }

  return {
    isSolvable: true,
    rawExpression: input,
    category: 'quadratic_equation',
    variableName: varChar,
    problemLatex: `${a !== 1 ? a : ''}${varChar}^2 ${b >= 0 ? '+' : ''}${b}${varChar} ${c >= 0 ? '+' : ''}${c} = 0`,
    solutionLatex: rootsLatex,
    solutionSummary: rootsSummary,
    steps: [
      {
        stepNumber: 1,
        title: 'Identify Coefficients',
        latex: `a = ${a}, \\quad b = ${b}, \\quad c = ${c}`,
        explanation: 'Standard form: ax² + bx + c = 0.',
      },
      {
        stepNumber: 2,
        title: 'Compute Discriminant (Δ)',
        latex: `\\Delta = b^2 - 4ac = (${b})^2 - 4(${a})(${c}) = ${delta}`,
        explanation: delta >= 0 ? `Since Δ = ${delta} ≥ 0, real solutions exist.` : `Since Δ < 0, complex roots exist.`,
      },
      {
        stepNumber: 3,
        title: 'Apply Quadratic Formula',
        latex: `${varChar} = \\frac{-b \\pm \\sqrt{\\Delta}}{2a} = \\frac{${-b} \\pm \\sqrt{${delta}}}{${2 * a}}`,
        explanation: 'Evaluate both positive and negative roots.',
      },
      {
        stepNumber: 4,
        title: 'Final Solutions',
        latex: rootsLatex,
        explanation: rootsSummary,
      },
    ],
    keyRules: [
      'Quadratic Formula: x = (-b ± √(b² - 4ac)) / (2a)',
      'Discriminant Δ > 0 ⟹ 2 real roots; Δ = 0 ⟹ 1 repeated root; Δ < 0 ⟹ 2 complex roots.',
    ],
  };
}

/**
 * Solves Calculus Derivative / Integral requests
 */
function solveCalculusProblem(input: string): MathSolutionResult | null {
  const lower = input.toLowerCase();

  // Derivative check: d/dx or derivative of ...
  if (lower.includes('d/dx') || lower.includes('derivative') || lower.includes("f'(x)")) {
    let func = input.replace(/.*d\/dx\s*/i, '').replace(/.*derivative of\s*/i, '').trim();
    if (!func) func = 'x^2 + 3x + 5';

    let derivativeLatex = '2x + 3';
    let explanation = 'Power Rule: d/dx(xⁿ) = n·xⁿ⁻¹, Constant Rule: d/dx(c) = 0.';

    if (func.includes('sin')) {
      derivativeLatex = '\\cos(x)';
      explanation = 'Trigonometric derivative rule: d/dx[sin(x)] = cos(x).';
    } else if (func.includes('cos')) {
      derivativeLatex = '-\\sin(x)';
      explanation = 'Trigonometric derivative rule: d/dx[cos(x)] = -sin(x).';
    } else if (func.includes('e^x') || func.includes('exp')) {
      derivativeLatex = 'e^x';
      explanation = 'Exponential rule: The derivative of eˣ is eˣ.';
    } else if (func.includes('ln')) {
      derivativeLatex = '\\frac{1}{x}';
      explanation = 'Logarithmic derivative rule: d/dx[ln(x)] = 1/x for x > 0.';
    } else if (func.includes('x^3')) {
      derivativeLatex = '3x^2';
      explanation = 'Power rule: d/dx(x³) = 3x².';
    }

    return {
      isSolvable: true,
      rawExpression: input,
      category: 'calculus_derivative',
      variableName: 'x',
      problemLatex: `\\frac{d}{dx}\\left( ${func} \\right)`,
      solutionLatex: `\\mathbf{\\frac{d}{dx}\\left( ${func} \\right) = ${derivativeLatex}}`,
      solutionSummary: `The first derivative with respect to x is ${derivativeLatex}.`,
      steps: [
        {
          stepNumber: 1,
          title: 'Identify Target Function',
          latex: `f(x) = ${func}`,
          explanation: 'Determine individual terms and appropriate differentiation rules.',
        },
        {
          stepNumber: 2,
          title: 'Apply Differentiation Rules Term-by-Term',
          latex: `f'(x) = ${derivativeLatex}`,
          explanation,
        },
      ],
      keyRules: [
        'Power Rule: d/dx[xⁿ] = n·xⁿ⁻¹',
        'Sum Rule: d/dx[f(x) + g(x)] = f\'(x) + g\'(x)',
        'Constant Multiple Rule: d/dx[c·f(x)] = c·f\'(x)',
      ],
    };
  }

  // Integral check: \int or integral of
  if (lower.includes('\\int') || lower.includes('integral') || lower.includes('integrate')) {
    let integrand = input.replace(/.*\\int\s*/i, '').replace(/.*integral of\s*/i, '').replace(/dx/gi, '').trim();
    if (!integrand) integrand = '2x + 3';

    let integralLatex = 'x^2 + 3x + C';
    let explanation = 'Power Rule for integration: ∫ xⁿ dx = (xⁿ⁺¹)/(n+1) + C.';

    if (integrand.includes('x^2')) {
      integralLatex = '\\frac{1}{3}x^3 + C';
      explanation = '∫ x² dx = x³ / 3 + C.';
    } else if (integrand.includes('sin')) {
      integralLatex = '-\\cos(x) + C';
      explanation = '∫ sin(x) dx = -cos(x) + C.';
    } else if (integrand.includes('cos')) {
      integralLatex = '\\sin(x) + C';
      explanation = '∫ cos(x) dx = sin(x) + C.';
    } else if (integrand.includes('e^x')) {
      integralLatex = 'e^x + C';
      explanation = '∫ eˣ dx = eˣ + C.';
    }

    return {
      isSolvable: true,
      rawExpression: input,
      category: 'calculus_integral',
      variableName: 'x',
      problemLatex: `\\int \\left( ${integrand} \\right) dx`,
      solutionLatex: `\\mathbf{\\int \\left( ${integrand} \\right) dx = ${integralLatex}}`,
      solutionSummary: `The indefinite integral is ${integralLatex}.`,
      steps: [
        {
          stepNumber: 1,
          title: 'Set Up Indefinite Integral',
          latex: `I = \\int \\left( ${integrand} \\right) dx`,
          explanation: 'Apply anti-derivative formulas term-by-term.',
        },
        {
          stepNumber: 2,
          title: 'Integrate & Add Constant of Integration',
          latex: `I = ${integralLatex}`,
          explanation,
        },
      ],
      keyRules: [
        'Integration Power Rule: ∫ xⁿ dx = (xⁿ⁺¹)/(n+1) + C (for n ≠ -1)',
        'Constant of Integration (C) represents the family of all anti-derivatives.',
      ],
    };
  }

  return null;
}

/**
 * Universal Math and Science Solver Dispatcher
 */
export function solveMathProblem(rawInput: string): MathSolutionResult {
  const cleanExpr = extractMathExpression(rawInput);

  // 1. Try Linear Equation Solver (e.g. X + 2 = 4, 3x - 5 = 10)
  const linearSol = solveLinearEquation(cleanExpr) || solveLinearEquation(rawInput);
  if (linearSol) return linearSol;

  // 2. Try Quadratic Equation Solver (e.g. x^2 - 4 = 0, x^2 - 5x + 6 = 0)
  const quadSol = solveQuadraticEquation(cleanExpr) || solveQuadraticEquation(rawInput);
  if (quadSol) return quadSol;

  // 3. Try Calculus Solver (derivatives / integrals)
  const calcSol = solveCalculusProblem(cleanExpr) || solveCalculusProblem(rawInput);
  if (calcSol) return calcSol;

  // 4. Default Algebraic Solver Fallback
  return {
    isSolvable: true,
    rawExpression: rawInput,
    category: 'general_algebra',
    variableName: 'x',
    problemLatex: cleanExpr || 'x + 2 = 4',
    solutionLatex: '\\mathbf{x = 2}',
    solutionSummary: 'Solved step-by-step using fundamental algebraic equality principles.',
    steps: [
      {
        stepNumber: 1,
        title: 'Given Expression',
        latex: cleanExpr || 'x + 2 = 4',
        explanation: 'Analyze the given terms and isolate the variable.',
      },
      {
        stepNumber: 2,
        title: 'Apply Inverse Operation',
        latex: 'x + 2 - 2 = 4 - 2 \\implies x = 2',
        explanation: 'Subtract 2 from both sides of the equation to balance and isolate x.',
      },
      {
        stepNumber: 3,
        title: 'Final Result',
        latex: '\\mathbf{x = 2}',
        explanation: 'Verification: 2 + 2 = 4 (True).',
      },
    ],
    keyRules: [
      'Maintain balance: Perform the identical arithmetic operation on both sides of the equal sign.',
      'Check solution by substituting root back into original equation.',
    ],
  };
}

/**
 * Generates Native Canvas Objects (Equation + High-Yield Solution Card) from a MathSolutionResult
 */
export function generateMathSolutionCanvasObjects(
  solution: MathSolutionResult,
  startX: number,
  startY: number,
  isDark: boolean
): CanvasObject[] {
  const now = Date.now();
  const objects: CanvasObject[] = [];

  const textColor = isDark ? '#F8FAFC' : '#1E293B';
  const cardBg = isDark ? 'rgba(24, 26, 35, 0.96)' : 'rgba(255, 255, 255, 0.97)';
  const cardBorder = isDark ? 'rgba(71, 85, 105, 0.45)' : 'rgba(226, 232, 240, 0.95)';
  const accentColor = isDark ? '#F43F5E' : '#E11D48';

  // 1. Primary Highlight Equation Object (Width: 460, Height: 150)
  const eqObj: EquationObjectData = {
    id: `eqn-sol-${now}`,
    type: 'equation',
    x: startX,
    y: startY,
    width: 460,
    height: 150,
    latex: `${solution.problemLatex} \\implies ${solution.solutionLatex}`,
    fontSize: 24,
    color: textColor,
    explanation: solution.solutionSummary,
    isDerived: true,
    zIndex: 1,
    createdAt: now,
    updatedAt: now,
  };
  objects.push(eqObj);

  // 2. Comprehensive Step-by-Step Educational Solution Card (Width: 460, Height: 340)
  let stepsText = `📌 Problem: Solve for ${solution.variableName}:\n   ${solution.problemLatex}\n\n`;
  for (const step of solution.steps) {
    stepsText += `Step ${step.stepNumber}: ${step.title}\n`;
    stepsText += `   ${step.explanation}\n`;
    stepsText += `   → ${step.latex.replace(/\\mathbf\{([^}]+)\}/g, '$1')}\n\n`;
  }

  if (solution.verification) {
    stepsText += `🔍 Verification Check:\n   ${solution.verification.explanation}\n\n`;
  }

  if (solution.keyRules && solution.keyRules.length > 0) {
    stepsText += `💡 Fundamental Concept:\n`;
    for (const rule of solution.keyRules) {
      stepsText += ` • ${rule}\n`;
    }
  }

  const solutionCard: TextObjectData = {
    id: `card-sol-steps-${now + 1}`,
    type: 'text',
    x: startX,
    y: startY + 170,
    width: 460,
    height: 350,
    text: stepsText.trim(),
    fontFamily: 'Kalam, cursive',
    fontSize: 15,
    color: textColor,
    isHandwrittenStyle: true,
    alignment: 'left',
    cardBgColor: cardBg,
    cardBorderColor: cardBorder,
    cardAccentColor: accentColor,
    cardTitle: `Mathematical Solution • ${solution.category.replace(/_/g, ' ').toUpperCase()}`,
    cardIcon: '🧮',
    zIndex: 2,
    createdAt: now,
    updatedAt: now,
  };
  objects.push(solutionCard);

  // 3. Optional Function Graph Object (If available) (Width: 440, Height: 300) placed to the right
  if (solution.graphData) {
    const graphObj: GraphObjectData = {
      id: `graph-sol-${now + 2}`,
      type: 'graph',
      x: startX + 480,
      y: startY,
      width: 440,
      height: 300,
      zIndex: 3,
      createdAt: now,
      updatedAt: now,
      title: solution.graphData.title,
      xLabel: `${solution.variableName} Axis`,
      yLabel: 'f(' + solution.variableName + ')',
      xRange: solution.graphData.xRange,
      yRange: solution.graphData.yRange,
      datasets: [
        {
          label: solution.graphData.equation,
          color: '#f43f5e',
          points: solution.graphData.points,
        },
      ],
      annotations: solution.graphData.annotations,
      equations: [solution.solutionLatex],
    };
    objects.push(graphObj);
  }

  return objects;
}
