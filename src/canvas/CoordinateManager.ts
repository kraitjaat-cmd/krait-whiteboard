import type { BoundingBox, TransformState } from '../types/canvas';

export function screenToWorld(
  screenX: number,
  screenY: number,
  transform: TransformState
): { x: number; y: number } {
  return {
    x: (screenX - transform.x) / transform.scale,
    y: (screenY - transform.y) / transform.scale,
  };
}

export function worldToScreen(
  worldX: number,
  worldY: number,
  transform: TransformState
): { x: number; y: number } {
  return {
    x: worldX * transform.scale + transform.x,
    y: worldY * transform.scale + transform.y,
  };
}

export function zoomAtScreenPoint(
  screenX: number,
  screenY: number,
  deltaScale: number,
  current: TransformState,
  minScale = 0.1,
  maxScale = 5.0
): TransformState {
  const newScale = Math.min(Math.max(current.scale * deltaScale, minScale), maxScale);
  const actualRatio = newScale / current.scale;

  const newX = screenX - (screenX - current.x) * actualRatio;
  const newY = screenY - (screenY - current.y) * actualRatio;

  return {
    x: newX,
    y: newY,
    scale: newScale,
  };
}

export function calculateBoundingBox(points: { x: number; y: number }[]): BoundingBox {
  if (!points || points.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }

  return {
    x: minX,
    y: minY,
    width: Math.max(1, maxX - minX),
    height: Math.max(1, maxY - minY),
  };
}

/**
 * Point in polygon test for Lasso selection (Ray casting algorithm)
 */
export function isPointInPolygon(point: { x: number; y: number }, polygon: { x: number; y: number }[]): boolean {
  if (polygon.length < 3) return false;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;

    const intersect = yi > point.y !== yj > point.y && point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export function doBoxesIntersect(a: BoundingBox, b: BoundingBox): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
