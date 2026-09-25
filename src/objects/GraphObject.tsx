import React from 'react';
import type { GraphObjectData } from '../types/canvas';

interface Props {
  object: GraphObjectData;
  isSelected?: boolean;
}

export const GraphObject: React.FC<Props> = ({ object }) => {
  const {
    title = 'Scientific Graph',
    xLabel = 'X',
    yLabel = 'Y',
    xRange = [0, 10],
    yRange = [0, 20],
    datasets = [],
    annotations = [],
    equations = [],
    width = 480,
    height = 340,
  } = object || {};

  const padLeft = 60;
  const padRight = 30;
  const padTop = 50;
  const padBottom = 50;

  const plotW = Math.max(100, width - padLeft - padRight);
  const plotH = Math.max(100, height - padTop - padBottom);

  const xSpan = Math.max(0.001, xRange[1] - xRange[0]);
  const ySpan = Math.max(0.001, yRange[1] - yRange[0]);

  const mapX = (val: number) => padLeft + ((val - xRange[0]) / xSpan) * plotW;
  const mapY = (val: number) => padTop + plotH - ((val - yRange[0]) / ySpan) * plotH;

  return (
    <g transform={`translate(${object.x}, ${object.y})`}>
      {/* Background card */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        rx={12}
        ry={12}
        fill="rgba(255, 255, 255, 0.95)"
        stroke="#cbd5e1"
        strokeWidth={1.5}
        filter="drop-shadow(0 4px 12px rgba(0,0,0,0.06))"
      />

      {/* Title */}
      <text
        x={width / 2}
        y={30}
        textAnchor="middle"
        style={{
          fontFamily: 'Kalam, cursive',
          fontSize: '18px',
          fontWeight: 'bold',
          fill: '#0f172a',
        }}
      >
        {title}
      </text>

      {/* Grid Lines */}
      {[0.25, 0.5, 0.75].map((frac, idx) => (
        <g key={idx}>
          {/* Horizontal grid */}
          <line
            x1={padLeft}
            y1={padTop + frac * plotH}
            x2={padLeft + plotW}
            y2={padTop + frac * plotH}
            stroke="#f1f5f9"
            strokeWidth={1}
            strokeDasharray="4 4"
          />
          {/* Vertical grid */}
          <line
            x1={padLeft + frac * plotW}
            y1={padTop}
            x2={padLeft + frac * plotW}
            y2={padTop + plotH}
            stroke="#f1f5f9"
            strokeWidth={1}
            strokeDasharray="4 4"
          />
        </g>
      ))}

      {/* Axes */}
      <line
        x1={padLeft}
        y1={padTop + plotH}
        x2={padLeft + plotW + 15}
        y2={padTop + plotH}
        stroke="#334155"
        strokeWidth={2}
      />
      <line
        x1={padLeft}
        y1={padTop + plotH}
        x2={padLeft}
        y2={padTop - 15}
        stroke="#334155"
        strokeWidth={2}
      />

      {/* Axis Arrows */}
      <path
        d={`M ${padLeft + plotW + 15},${padTop + plotH} L ${padLeft + plotW + 5},${padTop + plotH - 4} L ${padLeft + plotW + 5},${padTop + plotH + 4} Z`}
        fill="#334155"
      />
      <path
        d={`M ${padLeft},${padTop - 15} L ${padLeft - 4},${padTop - 5} L ${padLeft + 4},${padTop - 5} Z`}
        fill="#334155"
      />

      {/* Axis Labels */}
      <text
        x={padLeft + plotW}
        y={padTop + plotH + 34}
        textAnchor="end"
        style={{ fontFamily: 'Kalam, cursive', fontSize: '15px', fill: '#475569' }}
      >
        {xLabel} →
      </text>
      <text
        x={padLeft - 10}
        y={padTop - 8}
        textAnchor="end"
        style={{ fontFamily: 'Kalam, cursive', fontSize: '15px', fill: '#475569' }}
      >
        ↑ {yLabel}
      </text>

      {/* Datasets */}
      {(datasets || []).map((ds, dIdx) => {
        if (!ds || !ds.points || ds.points.length === 0) return null;
        const dPath = ds.points
          .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${mapX(p.x)} ${mapY(p.y)}`)
          .join(' ');

        return (
          <g key={dIdx}>
            <path
              d={dPath}
              fill="none"
              stroke={ds.color || '#2563eb'}
              strokeWidth={3}
              strokeDasharray={ds.isDotted ? '5 5' : undefined}
            />
            {/* Draw points */}
            {ds.points.map((p, pIdx) => (
              <circle
                key={pIdx}
                cx={mapX(p.x)}
                cy={mapY(p.y)}
                r={4}
                fill={ds.color || '#2563eb'}
                stroke="#ffffff"
                strokeWidth={1.5}
              />
            ))}
          </g>
        );
      })}

      {/* Annotations */}
      {(annotations || []).map((ann, aIdx) => (
        <g key={aIdx} transform={`translate(${mapX(ann.x)}, ${mapY(ann.y)})`}>
          <circle cx={0} cy={0} r={3} fill="#ef4444" />
          <text
            x={8}
            y={-8}
            style={{ fontFamily: 'Kalam, cursive', fontSize: '14px', fill: '#ef4444', fontWeight: 'bold' }}
          >
            {ann.text}
          </text>
        </g>
      ))}

      {/* Equations */}
      {equations && equations.length > 0 && (
        <text
          x={padLeft + 10}
          y={padTop + 24}
          style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', fill: '#2563eb' }}
        >
          {equations.join(' | ')}
        </text>
      )}
    </g>
  );
};
