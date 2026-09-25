import React, { useState } from 'react';
import type { DiagramObjectData } from '../types/canvas';
import { useThemeStore } from '../store/themeStore';

interface Props {
  object: DiagramObjectData;
  isSelected?: boolean;
}

export const DiagramObject: React.FC<Props> = ({ object }) => {
  const [hoveredComponentId, setHoveredComponentId] = useState<string | null>(null);
  const { isDark } = useThemeStore();

  const {
    title = 'Educational Diagram',
    subtitle,
    components = [],
    labels = [],
    arrows = [],
    callouts = [],
    legend,
    width = 960,
    height = 680,
  } = object || {};

  const cardBg = isDark ? 'rgba(30, 41, 59, 0.96)' : 'rgba(255, 255, 255, 0.95)';
  const cardBorder = isDark ? '#475569' : '#cbd5e1';
  const titleColor = isDark ? '#f8fafc' : '#0f172a';
  const subtitleColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <g transform={`translate(${object.x}, ${object.y})`} className="diagram-object-root">
      {/* Background card for educational sheet appearance */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        rx={16}
        ry={16}
        fill={cardBg}
        stroke={cardBorder}
        strokeWidth={1.5}
        filter="drop-shadow(0 10px 25px rgba(0, 0, 0, 0.08))"
      />

      {/* Header / Title Banner */}
      <g transform="translate(30, 40)">
        <text
          x={0}
          y={0}
          style={{
            fontFamily: 'Kalam, cursive',
            fontSize: '26px',
            fontWeight: 'bold',
            fill: titleColor,
          }}
        >
          {title}
        </text>
        {subtitle && (
          <text
            x={0}
            y={24}
            style={{
              fontFamily: 'Kalam, cursive',
              fontSize: '15px',
              fill: subtitleColor,
            }}
          >
            {subtitle}
          </text>
        )}
      </g>

      {/* Render Diagram Components (Back, Base, Vessels, Internal, Details) */}
      <g className="diagram-components-group">
        {(components || []).map((comp, idx) => {
          if (!comp) return null;
          const isHovered = hoveredComponentId === comp.id;
          return (
            <path
              key={comp.id || idx}
              d={comp.path || ''}
              fill={comp.fill || 'none'}
              stroke={comp.stroke || (isDark ? '#F8FAFC' : '#1E293B')}
              strokeWidth={isHovered ? (comp.strokeWidth || 2.5) + 1.5 : (comp.strokeWidth || 2.5)}
              opacity={comp.opacity ?? 1.0}
              style={{
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                filter: isHovered ? 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.6))' : undefined,
              }}
              onMouseEnter={() => setHoveredComponentId(comp.id || `comp-${idx}`)}
              onMouseLeave={() => setHoveredComponentId(null)}
            />
          );
        })}
      </g>

      {/* Render Flow Arrows (e.g. Blood flow, impulse direction) */}
      <g className="diagram-arrows-group">
        {(arrows || []).map((arr, arrIdx) => {
          if (!arr || !arr.points || arr.points.length < 2) return null;
          const pStr = arr.points
            .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
            .join(' ');
          const endP = arr.points[arr.points.length - 1];
          const prevP = arr.points[arr.points.length - 2];
          if (!endP || !prevP) return null;

          // Calculate arrowhead
          const dx = endP.x - prevP.x;
          const dy = endP.y - prevP.y;
          const angle = Math.atan2(dy, dx);
          const arrowLen = 10;
          const headP1X = endP.x - arrowLen * Math.cos(angle - Math.PI / 6);
          const headP1Y = endP.y - arrowLen * Math.sin(angle - Math.PI / 6);
          const headP2X = endP.x - arrowLen * Math.cos(angle + Math.PI / 6);
          const headP2Y = endP.y - arrowLen * Math.sin(angle + Math.PI / 6);
          const arrowColor = arr.color || (isDark ? '#38BDF8' : '#0284C7');

          return (
            <g key={arr.id || arrIdx}>
              <path
                d={pStr}
                fill="none"
                stroke={arrowColor}
                strokeWidth={3}
                strokeDasharray={arr.isDotted ? '4 4' : undefined}
              />
              <polygon
                points={`${endP.x},${endP.y} ${headP1X},${headP1Y} ${headP2X},${headP2Y}`}
                fill={arrowColor}
              />
              {arr.label && (
                <text
                  x={(arr.points[0].x + endP.x) / 2}
                  y={(arr.points[0].y + endP.y) / 2 - 8}
                  textAnchor="middle"
                  style={{
                    fontFamily: 'Kalam, cursive',
                    fontSize: '13px',
                    fill: arrowColor,
                    fontWeight: 'bold',
                  }}
                >
                  {arr.label}
                </text>
              )}
            </g>
          );
        })}
      </g>

      {/* Render Labels & Leader Lines */}
      <g className="diagram-labels-group">
        {(labels || []).map((lbl, lblIdx) => {
          if (!lbl) return null;
          // Supports both Format A: targetPoint / labelPoint and Format B: targetX / targetY / x / y
          const tx = lbl.targetPoint?.x ?? (lbl as any).targetX ?? (lbl as any).x ?? 0;
          const ty = lbl.targetPoint?.y ?? (lbl as any).targetY ?? (lbl as any).y ?? 0;
          const lx = lbl.labelPoint?.x ?? (lbl as any).x ?? tx;
          const ly = lbl.labelPoint?.y ?? (lbl as any).y ?? ty;
          const labelText = lbl.text || '';
          const desc = lbl.description;
          const labelColor = lbl.color || (isDark ? '#F8FAFC' : '#0F172A');
          const isKeyFact = lbl.isKeyFact ?? (lbl as any).isBold ?? false;
          const fontSize = (lbl as any).fontSize ?? 14;
          const side = lbl.side || (lx < tx ? 'left' : 'right');

          const hasLeader = Math.hypot(tx - lx, ty - ly) > 8;

          return (
            <g key={lbl.id || lblIdx} className="label-item">
              {hasLeader && (
                <>
                  {/* Leader Line */}
                  <path
                    d={`M ${tx} ${ty} L ${lx} ${ly}`}
                    fill="none"
                    stroke={labelColor}
                    strokeWidth={1.5}
                    strokeDasharray="3 3"
                    opacity={0.65}
                  />
                  {/* Target Dot */}
                  <circle
                    cx={tx}
                    cy={ty}
                    r={3.5}
                    fill={labelColor}
                    stroke={isDark ? '#1e293b' : '#ffffff'}
                    strokeWidth={1.5}
                  />
                </>
              )}

              {/* Label Text Container */}
              <g transform={`translate(${lx}, ${ly})`}>
                <text
                  x={side === 'left' ? -6 : 6}
                  y={0}
                  textAnchor={side === 'left' ? 'end' : 'start'}
                  style={{
                    fontFamily: 'Kalam, cursive',
                    fontSize: `${fontSize}px`,
                    fontWeight: isKeyFact ? 'bold' : '600',
                    fill: labelColor,
                  }}
                >
                  {labelText}
                </text>
                {desc && (
                  <text
                    x={side === 'left' ? -6 : 6}
                    y={fontSize + 2}
                    textAnchor={side === 'left' ? 'end' : 'start'}
                    style={{
                      fontFamily: 'Kalam, cursive',
                      fontSize: '12px',
                      fill: isDark ? '#94A3B8' : '#64748B',
                    }}
                  >
                    {desc}
                  </text>
                )}
              </g>
            </g>
          );
        })}
      </g>

      {/* Render Callout Cards */}
      <g className="diagram-callouts-group">
        {(callouts || []).map((c, cIdx) => {
          if (!c) return null;
          const cWidth = (c as any).width || 340;
          const cHeight = (c as any).height || 140;
          return (
            <g key={c.id || cIdx} transform={`translate(${c.x || 0}, ${c.y || 0})`}>
              <foreignObject x={0} y={0} width={cWidth} height={cHeight}>
                <div
                  style={{
                    fontFamily: 'Kalam, cursive',
                    background: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(248, 250, 252, 0.95)',
                    border: `1.5px dashed ${isDark ? '#475569' : '#94A3B8'}`,
                    borderRadius: '10px',
                    padding: '8px 12px',
                    fontSize: '13px',
                    lineHeight: '1.35',
                    color: isDark ? '#E2E8F0' : '#334155',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    maxHeight: '100%',
                    overflowY: 'auto',
                  }}
                >
                  <div style={{ fontWeight: 'bold', color: isDark ? '#60A5FA' : '#1E293B', marginBottom: '4px' }}>
                    {c.title}
                  </div>
                  <div style={{ whiteSpace: 'pre-line' }}>{c.content}</div>
                </div>
              </foreignObject>
            </g>
          );
        })}
      </g>

      {/* Render Legend if provided */}
      {legend && legend.length > 0 && (
        <g transform={`translate(${width - 320}, 40)`}>
          <rect
            x={0}
            y={0}
            width={300}
            height={legend.length * 26 + 24}
            rx={8}
            ry={8}
            fill={isDark ? 'rgba(30, 41, 59, 0.92)' : 'rgba(248, 250, 252, 0.92)'}
            stroke={isDark ? '#475569' : '#E2E8F0'}
            strokeWidth={1}
          />
          <text
            x={12}
            y={18}
            style={{ fontFamily: 'Kalam, cursive', fontSize: '13px', fontWeight: 'bold', fill: isDark ? '#CBD5E1' : '#475569' }}
          >
            LEGEND & NOTATIONS
          </text>
          {legend.map((item, idx) => (
            <g key={idx} transform={`translate(12, ${34 + idx * 24})`}>
              <rect x={0} y={0} width={16} height={10} rx={2} ry={2} fill={item.color} />
              <text
                x={24}
                y={9}
                style={{ fontFamily: 'Kalam, cursive', fontSize: '12px', fill: isDark ? '#E2E8F0' : '#334155' }}
              >
                {item.label}
              </text>
            </g>
          ))}
        </g>
      )}
    </g>
  );
};
