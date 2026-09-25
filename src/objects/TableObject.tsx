import React from 'react';
import type { TableObjectData } from '../types/canvas';

interface Props {
  object: TableObjectData;
  isSelected?: boolean;
}

export const TableObject: React.FC<Props> = ({ object }) => {
  const { title, columns = [], rows = [], color, borderColor, bgColor } = object || {};

  const colWidth = 160;
  const rowHeight = 44;
  const headerHeight = 50;
  const totalWidth = Math.max(320, (columns.length || 2) * colWidth + 20);
  const totalHeight = headerHeight + (rows.length || 1) * rowHeight + (title ? 40 : 10);

  return (
    <g transform={`translate(${object.x}, ${object.y})`}>
      <foreignObject x={0} y={0} width={totalWidth + 30} height={totalHeight + 30}>
        <div
          style={{
            fontFamily: 'Kalam, cursive',
            fontSize: '17px',
            color: color || '#1e293b',
            background: bgColor || 'rgba(255, 255, 255, 0.92)',
            border: `2px solid ${borderColor || '#64748b'}`,
            borderRadius: '12px',
            padding: '12px',
            boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
            userSelect: 'none',
          }}
        >
          {title && (
            <div
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '8px',
                textAlign: 'center',
                color: '#2563eb',
                borderBottom: `1.5px dashed ${borderColor || '#cbd5e1'}`,
                paddingBottom: '4px',
              }}
            >
              {title}
            </div>
          )}

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${borderColor || '#475569'}` }}>
                {columns.map((col, idx) => (
                  <th
                    key={col.id || idx}
                    style={{
                      padding: '8px 12px',
                      textAlign: 'left',
                      fontWeight: 'bold',
                      fontSize: '18px',
                      color: '#0f172a',
                    }}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  style={{
                    borderBottom: rIdx < rows.length - 1 ? `1px dashed ${borderColor || '#e2e8f0'}` : 'none',
                    backgroundColor: rIdx % 2 === 1 ? 'rgba(0,0,0,0.02)' : 'transparent',
                  }}
                >
                  {(row || []).map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      style={{
                        padding: '8px 12px',
                        verticalAlign: 'top',
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </foreignObject>
    </g>
  );
};
