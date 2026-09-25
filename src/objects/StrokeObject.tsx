import React from 'react';
import type { StrokeObjectData } from '../types/canvas';
import { getSmoothedPoints, getStrokeOutline } from '../canvas/StrokeEngine';

interface Props {
  object: StrokeObjectData;
  isSelected?: boolean;
}

export const StrokeObject: React.FC<Props> = React.memo(({ object }) => {
  const { points, color, size, opacity, tool } = object;

  if (!points || points.length === 0) return null;

  const smoothed = getSmoothedPoints(points, tool);
  const pathData = object.pathData || getStrokeOutline(smoothed, {
    size,
    tool,
    isComplete: true,
  });

  const isHighlighter = tool === 'highlighter';

  return (
    <g className="stroke-object-group">
      <path
        d={pathData}
        fill={isHighlighter ? color : color}
        opacity={isHighlighter ? 0.45 : opacity}
        style={{
          mixBlendMode: isHighlighter ? 'multiply' : 'normal',
          filter: tool === 'pencil' ? 'url(#pencil-texture)' : undefined,
        }}
      />
    </g>
  );
});
