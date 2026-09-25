import type { BoundingBox, CanvasObject } from '../types/canvas';
import { calculateBoundingBox } from '../canvas/CoordinateManager';

export function findOptimalPlacement(
  newWidth: number,
  newHeight: number,
  existingObjects: CanvasObject[],
  preferredPos?: { x: number; y: number }
): { x: number; y: number } {
  if (existingObjects.length === 0) {
    return preferredPos || { x: 160, y: 120 };
  }

  // If a preferred position is given (e.g. viewport center or right below selected object)
  if (preferredPos) {
    let testX = preferredPos.x;
    let testY = preferredPos.y;

    // Check collision with existing objects
    const hasCollision = existingObjects.some((obj) => {
      const b = getObjectBounds(obj);
      return (
        testX < b.x + b.width + 40 &&
        testX + newWidth > b.x - 40 &&
        testY < b.y + b.height + 40 &&
        testY + newHeight > b.y - 40
      );
    });

    if (!hasCollision) {
      return { x: testX, y: testY };
    }
  }

  // Find max bounds of current content to place adjacent or below
  let maxRight = 100;
  let maxBottom = 100;

  for (const obj of existingObjects) {
    const b = getObjectBounds(obj);
    if (b.x + b.width > maxRight) maxRight = b.x + b.width;
    if (b.y + b.height > maxBottom) maxBottom = b.y + b.height;
  }

  // If there is wide horizontal space, place to the right; else place below
  if (maxRight < 2000) {
    return { x: maxRight + 60, y: 120 };
  } else {
    return { x: 160, y: maxBottom + 60 };
  }
}

export function getObjectBounds(obj: CanvasObject): BoundingBox {
  if (obj.type === 'stroke') {
    return calculateBoundingBox(obj.points);
  }
  return {
    x: obj.x,
    y: obj.y,
    width: obj.width || 200,
    height: obj.height || 100,
  };
}
