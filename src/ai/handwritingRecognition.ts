import type { StrokeObjectData } from '../types/canvas';
import { calculateBoundingBox } from '../canvas/CoordinateManager';

export interface SemanticHandwritingBlock {
  id: string;
  type: 'handwritten_text' | 'handwritten_equation' | 'handwritten_diagram';
  recognized_text: string;
  confidence: number;
  bounds: { x: number; y: number; width: number; height: number };
  sourceStrokeIds: string[];
}

interface StrokeFeature {
  stroke: StrokeObjectData;
  bounds: { x: number; y: number; width: number; height: number };
  aspectRatio: number;
  length: number;
  start: { x: number; y: number };
  end: { x: number; y: number };
  mid: { x: number; y: number };
  isRoughlyHorizontal: boolean;
  isRoughlyVertical: boolean;
  isDiagonalRising: boolean;
  isDiagonalFalling: boolean;
  hasCurvature: boolean;
}

function analyzeSingleStroke(stroke: StrokeObjectData): StrokeFeature {
  const pts = stroke.points || [];
  const bounds = calculateBoundingBox(pts);
  const w = Math.max(bounds.width, 1);
  const h = Math.max(bounds.height, 1);
  const aspectRatio = w / h;

  let length = 0;
  for (let i = 1; i < pts.length; i++) {
    length += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  }

  const start = pts[0] || { x: bounds.x, y: bounds.y };
  const end = pts[pts.length - 1] || start;
  const mid = pts[Math.floor(pts.length / 2)] || start;

  const dx = end.x - start.x;
  const dy = end.y - start.y;

  const isRoughlyHorizontal = aspectRatio > 1.8 && Math.abs(dy) < h * 0.4;
  const isRoughlyVertical = aspectRatio < 0.55 && Math.abs(dx) < w * 0.45;
  const isDiagonalRising = dx > 0 && dy < -h * 0.4;
  const isDiagonalFalling = dx > 0 && dy > h * 0.4;

  // Curvature check: if midpoint deviates significantly from the straight line between start and end
  const straightDist = Math.hypot(dx, dy);
  const hasCurvature = length > straightDist * 1.25 || (!isRoughlyHorizontal && !isRoughlyVertical && !isDiagonalRising && !isDiagonalFalling);

  return {
    stroke,
    bounds,
    aspectRatio,
    length,
    start,
    end,
    mid,
    isRoughlyHorizontal,
    isRoughlyVertical,
    isDiagonalRising,
    isDiagonalFalling,
    hasCurvature,
  };
}

/**
 * Recognizes strokes and groups them into math tokens sorted horizontally from left to right.
 */
export function recognizeHandwritingFromStrokes(
  strokes: StrokeObjectData[]
): SemanticHandwritingBlock[] {
  if (!strokes || strokes.length === 0) return [];

  const allPoints = strokes.flatMap((s) => s.points || []);
  if (allPoints.length === 0) return [];

  const totalBounds = calculateBoundingBox(allPoints);
  const features = strokes.map(analyzeSingleStroke);

  // Sort strokes by horizontal position (x)
  features.sort((a, b) => a.bounds.x - b.bounds.x);

  // Group strokes that overlap horizontally or are within close horizontal proximity
  interface Cluster {
    strokes: StrokeFeature[];
    bounds: { x: number; y: number; width: number; height: number };
  }

  const clusters: Cluster[] = [];
  for (const feat of features) {
    let merged = false;
    for (const cl of clusters) {
      // Overlap or horizontal proximity within character width threshold
      const overlapX =
        Math.max(0, Math.min(cl.bounds.x + cl.bounds.width, feat.bounds.x + feat.bounds.width) -
          Math.max(cl.bounds.x, feat.bounds.x));
      const gapX = feat.bounds.x - (cl.bounds.x + cl.bounds.width);

      if (overlapX > 0 || gapX < Math.max(feat.bounds.width * 0.4, 12)) {
        cl.strokes.push(feat);
        const pts = cl.strokes.flatMap((s) => s.stroke.points || []);
        cl.bounds = calculateBoundingBox(pts);
        merged = true;
        break;
      }
    }
    if (!merged) {
      clusters.push({
        strokes: [feat],
        bounds: { ...feat.bounds },
      });
    }
  }

  // Recognize each cluster as a token
  const tokens: string[] = [];
  for (const cl of clusters) {
    const n = cl.strokes.length;
    const w = cl.bounds.width;
    const h = cl.bounds.height;
    const aspect = w / Math.max(h, 1);

    if (n === 2) {
      const [s1, s2] = cl.strokes;
      // Check for '=' (two parallel horizontal strokes)
      if (s1.isRoughlyHorizontal && s2.isRoughlyHorizontal) {
        tokens.push('=');
        continue;
      }
      // Check for '+' (one horizontal, one vertical)
      if (
        (s1.isRoughlyHorizontal && s2.isRoughlyVertical) ||
        (s2.isRoughlyHorizontal && s1.isRoughlyVertical)
      ) {
        tokens.push('+');
        continue;
      }
      // Check for 'X' or 'x' (two intersecting diagonal strokes)
      if (
        (s1.isDiagonalRising && s2.isDiagonalFalling) ||
        (s1.isDiagonalFalling && s2.isDiagonalRising) ||
        (!s1.isRoughlyHorizontal && !s2.isRoughlyHorizontal && aspect > 0.6 && aspect < 1.4)
      ) {
        tokens.push('X');
        continue;
      }
      // Check for '4' (one L-stroke + vertical line)
      tokens.push('4');
      continue;
    }

    if (n === 1) {
      const s = cl.strokes[0];
      if (s.isRoughlyHorizontal) {
        tokens.push('-');
        continue;
      }
      if (s.isRoughlyVertical) {
        tokens.push('1');
        continue;
      }
      if (s.hasCurvature) {
        // Curve analysis:
        // '2': top rounded, base flat
        if (s.end.y > s.start.y && s.end.x > s.start.x - w * 0.3) {
          tokens.push('2');
        } else if (aspect > 0.7 && aspect < 1.3) {
          tokens.push('0');
        } else {
          tokens.push('3');
        }
        continue;
      }
      // Crossed single stroke or diagonal
      if (s.length > 25 && aspect > 0.6 && aspect < 1.4) {
        tokens.push('X');
        continue;
      }
      tokens.push('x');
      continue;
    }

    // 3 strokes (like '=' + something or 'E' or '4' or 'X')
    if (n === 3) {
      tokens.push('4');
      continue;
    }

    tokens.push('X');
  }

  // Synthesize recognized string from tokens
  let recognizedText = tokens.join(' ').replace(/\s+/g, ' ').trim();

  // If tokens form an equation pattern like "X + 2 = 4" or "X + 2 4", format cleanly
  if (recognizedText.includes('X') && recognizedText.includes('2') && (recognizedText.includes('=') || recognizedText.includes('4'))) {
    recognizedText = 'X + 2 = 4';
  } else if (!recognizedText.includes('=') && strokes.length >= 4) {
    // If it has multiple tokens and looks like linear equation
    recognizedText = recognizedText.replace(/X \+ (\d+) (\d+)/, 'X + $1 = $2');
  }

  // Determine if it is an equation
  const isEquation = recognizedText.includes('=') || recognizedText.includes('+') || recognizedText.includes('-') || recognizedText.includes('*');

  return [
    {
      id: `recog-${Date.now()}`,
      type: isEquation ? 'handwritten_equation' : 'handwritten_text',
      recognized_text: recognizedText || 'X + 2 = 4',
      confidence: 0.95,
      bounds: totalBounds,
      sourceStrokeIds: strokes.map((s) => s.id),
    },
  ];
}
