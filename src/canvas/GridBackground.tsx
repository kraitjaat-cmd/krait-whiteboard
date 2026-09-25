import React from 'react';
import { BOARD_THEMES } from '../themes/boardThemes';
import type { BoardThemeId, PaperStyleId } from '../types/canvas';

interface Props {
  themeId: BoardThemeId;
  paperStyle: PaperStyleId;
  customBgColor?: string;
  viewport: { x: number; y: number; scale: number };
}

export const GridBackground: React.FC<Props> = ({
  themeId,
  paperStyle,
  customBgColor,
  viewport,
}) => {
  const theme = BOARD_THEMES[themeId] || BOARD_THEMES.cream;
  const bg = customBgColor || theme.bg;
  const gridColor = theme.gridColor;

  const renderPattern = () => {
    switch (paperStyle) {
      case 'dots':
        return (
          <pattern
            id="bg-pattern-dots"
            x={viewport.x % (30 * viewport.scale)}
            y={viewport.y % (30 * viewport.scale)}
            width={30 * viewport.scale}
            height={30 * viewport.scale}
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx={15 * viewport.scale}
              cy={15 * viewport.scale}
              r={1.2 * Math.max(0.7, Math.min(1.5, viewport.scale))}
              fill={gridColor}
            />
          </pattern>
        );

      case 'small-grid':
        return (
          <pattern
            id="bg-pattern-small-grid"
            x={viewport.x % (16 * viewport.scale)}
            y={viewport.y % (16 * viewport.scale)}
            width={16 * viewport.scale}
            height={16 * viewport.scale}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${16 * viewport.scale} 0 L 0 0 0 ${16 * viewport.scale}`}
              fill="none"
              stroke={gridColor}
              strokeWidth="0.8"
            />
          </pattern>
        );

      case 'ruled':
        return (
          <pattern
            id="bg-pattern-ruled"
            x={0}
            y={viewport.y % (32 * viewport.scale)}
            width="100%"
            height={32 * viewport.scale}
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="0"
              y1={32 * viewport.scale}
              x2="100%"
              y2={32 * viewport.scale}
              stroke={gridColor}
              strokeWidth="1.2"
            />
          </pattern>
        );

      case 'engineering':
      case 'graph-paper':
        return (
          <pattern
            id="bg-pattern-engineering"
            x={viewport.x % (40 * viewport.scale)}
            y={viewport.y % (40 * viewport.scale)}
            width={40 * viewport.scale}
            height={40 * viewport.scale}
            patternUnits="userSpaceOnUse"
          >
            {/* Minor grid 10px */}
            {[10, 20, 30].map((offset) => (
              <g key={offset}>
                <line
                  x1={offset * viewport.scale}
                  y1="0"
                  x2={offset * viewport.scale}
                  y2={40 * viewport.scale}
                  stroke={gridColor}
                  strokeWidth="0.6"
                  opacity="0.6"
                />
                <line
                  x1="0"
                  y1={offset * viewport.scale}
                  x2={40 * viewport.scale}
                  y2={offset * viewport.scale}
                  stroke={gridColor}
                  strokeWidth="0.6"
                  opacity="0.6"
                />
              </g>
            ))}
            {/* Major grid 40px */}
            <path
              d={`M ${40 * viewport.scale} 0 L 0 0 0 ${40 * viewport.scale}`}
              fill="none"
              stroke={gridColor}
              strokeWidth="1.5"
            />
          </pattern>
        );

      case 'grid':
      default:
        return (
          <pattern
            id="bg-pattern-grid"
            x={viewport.x % (30 * viewport.scale)}
            y={viewport.y % (30 * viewport.scale)}
            width={30 * viewport.scale}
            height={30 * viewport.scale}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${30 * viewport.scale} 0 L 0 0 0 ${30 * viewport.scale}`}
              fill="none"
              stroke={gridColor}
              strokeWidth="1.0"
            />
          </pattern>
        );
    }
  };

  const getPatternUrl = () => {
    if (paperStyle === 'plain') return 'none';
    if (paperStyle === 'dots') return 'url(#bg-pattern-dots)';
    if (paperStyle === 'small-grid') return 'url(#bg-pattern-small-grid)';
    if (paperStyle === 'ruled') return 'url(#bg-pattern-ruled)';
    if (paperStyle === 'engineering' || paperStyle === 'graph-paper') return 'url(#bg-pattern-engineering)';
    return 'url(#bg-pattern-grid)';
  };

  return (
    <g className="grid-background-layer">
      <defs>{renderPattern()}</defs>
      {/* Solid board color */}
      <rect width="100%" height="100%" fill={bg} />
      {/* Pattern overlay */}
      {paperStyle !== 'plain' && <rect width="100%" height="100%" fill={getPatternUrl()} />}
    </g>
  );
};
