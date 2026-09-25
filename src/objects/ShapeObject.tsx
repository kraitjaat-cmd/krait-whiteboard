import React from 'react';
import type { ShapeObjectData } from '../types/canvas';

interface Props {
  object: ShapeObjectData;
  isSelected?: boolean;
}

export const ShapeObject: React.FC<Props> = ({ object }) => {
  const { shapeType, width, height, strokeColor, fillColor, strokeWidth, text, strokeStyle } = object;

  const isDashed = strokeStyle === 'dashed';

  const renderShapeContent = () => {
    switch (shapeType) {
      case 'rectangle':
        return (
          <rect
            x={0}
            y={0}
            width={width}
            height={height}
            rx={6}
            ry={6}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={isDashed ? '6 4' : undefined}
          />
        );

      case 'ellipse':
        return (
          <ellipse
            cx={width / 2}
            cy={height / 2}
            rx={width / 2}
            ry={height / 2}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={isDashed ? '6 4' : undefined}
          />
        );

      case 'triangle':
        return (
          <polygon
            points={`${width / 2},0 ${width},${height} 0,${height}`}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={isDashed ? '6 4' : undefined}
          />
        );

      case 'sticky':
        return (
          <g>
            {/* Sticky note shadow */}
            <path
              d={`M 0,0 L ${width},0 L ${width},${height - 14} L ${width - 14},${height} L 0,${height} Z`}
              fill={fillColor !== 'transparent' ? fillColor : '#FEF08A'}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              filter="drop-shadow(2px 4px 6px rgba(0,0,0,0.12))"
            />
            {/* Folded corner */}
            <path
              d={`M ${width - 14},${height - 14} L ${width},${height - 14} L ${width - 14},${height} Z`}
              fill="rgba(0, 0, 0, 0.12)"
              stroke={strokeColor}
              strokeWidth={1}
            />
          </g>
        );

      case 'callout':
        return (
          <path
            d={`M 10,0 L ${width - 10},0 C ${width},0 ${width},0 ${width},10 L ${width},${height - 30} C ${width},${height - 20} ${width},${height - 20} ${width - 10},${height - 20} L 50,${height - 20} L 20,${height} L 30,${height - 20} L 10,${height - 20} C 0,${height - 20} 0,${height - 20} 0,${height - 30} L 0,10 C 0,0 0,0 10,0 Z`}
            fill={fillColor !== 'transparent' ? fillColor : 'rgba(255,255,255,0.9)'}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        );

      default:
        return (
          <rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        );
    }
  };

  return (
    <g transform={`translate(${object.x}, ${object.y}) rotate(${object.rotation || 0})`}>
      {renderShapeContent()}

      {text && (
        <text
          x={width / 2}
          y={height / 2 + 6}
          textAnchor="middle"
          fill={strokeColor}
          style={{
            fontFamily: 'Kalam, cursive',
            fontSize: '18px',
            userSelect: 'none',
          }}
        >
          {text}
        </text>
      )}
    </g>
  );
};
