import type { StrokePoint } from '../types/canvas';

export interface StrokeOptions {
  size?: number;
  thinning?: number;
  smoothing?: number;
  streamline?: number;
  simulatePressure?: boolean;
  tool?: 'pen' | 'pencil' | 'marker' | 'highlighter' | 'brush';
  isComplete?: boolean;
}

/**
 * Calculates average / smoothed pressure with velocity backup
 */
export function getSmoothedPoints(rawPoints: StrokePoint[], tool: string = 'pen'): StrokePoint[] {
  if (rawPoints.length <= 1) return rawPoints;

  const result: StrokePoint[] = [];
  let prevPoint = rawPoints[0];
  result.push(prevPoint);

  for (let i = 1; i < rawPoints.length; i++) {
    const curr = rawPoints[i];
    const prev = rawPoints[i - 1];

    // Compute distance and velocity
    const dx = curr.x - prev.x;
    const dy = curr.y - prev.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const dt = Math.max(1, (curr.time || 0) - (prev.time || 0));
    const speed = dist / dt;

    // Determine pressure: use hardware pressure if available, else derive from speed
    let pressure = curr.pressure;
    if (pressure === undefined || pressure === 0 || pressure === 0.5) {
      // Synthesize dynamic pressure from speed (slower = more ink, faster = tapered ink)
      const normalizedSpeed = Math.min(Math.max(speed, 0.05), 3.0);
      pressure = Math.max(0.2, Math.min(1.0, 1.1 - normalizedSpeed * 0.28));
    }

    // Pencil has subtle tactile texture
    if (tool === 'pencil') {
      pressure = pressure * 0.85;
    }

    result.push({
      x: curr.x,
      y: curr.y,
      pressure,
      tiltX: curr.tiltX,
      tiltY: curr.tiltY,
      time: curr.time,
    });
  }

  return result;
}

/**
 * Generates an organic variable-width polygon outline for a stroke
 * Replaces external libraries with an ultra-smooth Catmull-Rom & variable-offset ribbon algorithm
 */
export function getStrokeOutline(points: StrokePoint[], options: StrokeOptions = {}): string {
  if (points.length === 0) return '';
  if (points.length === 1) {
    const p = points[0];
    const r = ((options.size || 3) * (p.pressure || 0.5)) / 2;
    return `M ${p.x - r} ${p.y} A ${r} ${r} 0 1 0 ${p.x + r} ${p.y} A ${r} ${r} 0 1 0 ${p.x - r} ${p.y} Z`;
  }

  const baseSize = options.size || 3;
  const tool = options.tool || 'pen';

  const leftPoints: { x: number; y: number }[] = [];
  const rightPoints: { x: number; y: number }[] = [];

  for (let i = 0; i < points.length; i++) {
    const curr = points[i];
    const prev = points[Math.max(0, i - 1)];
    const next = points[Math.min(points.length - 1, i + 1)];

    // Tangent vector
    let dx = next.x - prev.x;
    let dy = next.y - prev.y;
    if (dx === 0 && dy === 0) {
      dx = 1;
      dy = 0;
    }
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx = -dy / len;
    const ny = dx / len;

    // Pressure & tool profile calculation
    let pressureFactor = curr.pressure ?? 0.5;
    if (tool === 'marker') {
      pressureFactor = 0.9 + pressureFactor * 0.1; // Marker is mostly uniform
    } else if (tool === 'highlighter') {
      pressureFactor = 1.0; // Highlighter is broad
    } else if (tool === 'brush') {
      pressureFactor = Math.pow(pressureFactor, 1.4) * 1.5; // Brush has extreme dynamic range
    }

    // Start and end tapering
    let taper = 1.0;
    if (i === 0 && points.length > 2) taper = 0.2;
    else if (i === 1 && points.length > 3) taper = 0.6;
    else if (i === points.length - 1 && options.isComplete) taper = 0.2;
    else if (i === points.length - 2 && options.isComplete) taper = 0.6;

    const radius = Math.max(0.8, (baseSize / 2) * pressureFactor * taper);

    leftPoints.push({
      x: curr.x + nx * radius,
      y: curr.y + ny * radius,
    });
    rightPoints.push({
      x: curr.x - nx * radius,
      y: curr.y - ny * radius,
    });
  }

  // Build smooth bezier path around the stroke boundary
  let path = `M ${leftPoints[0].x.toFixed(1)} ${leftPoints[0].y.toFixed(1)}`;

  for (let i = 1; i < leftPoints.length; i++) {
    const prev = leftPoints[i - 1];
    const curr = leftPoints[i];
    const midX = (prev.x + curr.x) / 2;
    const midY = (prev.y + curr.y) / 2;
    path += ` Q ${prev.x.toFixed(1)} ${prev.y.toFixed(1)}, ${midX.toFixed(1)} ${midY.toFixed(1)}`;
  }
  const lastLeft = leftPoints[leftPoints.length - 1];
  path += ` L ${lastLeft.x.toFixed(1)} ${lastLeft.y.toFixed(1)}`;

  // Cap at end
  const lastRight = rightPoints[rightPoints.length - 1];
  path += ` L ${lastRight.x.toFixed(1)} ${lastRight.y.toFixed(1)}`;

  // Reverse right points back to start
  for (let i = rightPoints.length - 2; i >= 0; i--) {
    const prev = rightPoints[i + 1];
    const curr = rightPoints[i];
    const midX = (prev.x + curr.x) / 2;
    const midY = (prev.y + curr.y) / 2;
    path += ` Q ${prev.x.toFixed(1)} ${prev.y.toFixed(1)}, ${midX.toFixed(1)} ${midY.toFixed(1)}`;
  }

  path += ' Z';
  return path;
}
