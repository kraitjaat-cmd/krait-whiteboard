import React, { useMemo } from 'react';
import type { EquationObjectData } from '../types/canvas';

interface Props {
  object: EquationObjectData;
  isSelected?: boolean;
}

declare global {
  interface Window {
    katex?: {
      renderToString: (tex: string, options?: { throwOnError?: boolean; displayMode?: boolean }) => string;
    };
  }
}

export const EquationObject: React.FC<Props> = ({ object }) => {
  const html = useMemo(() => {
    if (typeof window !== 'undefined' && window.katex) {
      try {
        return window.katex.renderToString(object.latex, {
          throwOnError: false,
          displayMode: true,
        });
      } catch {
        return `<code>${object.latex}</code>`;
      }
    }
    return `<code>${object.latex}</code>`;
  }, [object.latex]);

  return (
    <g transform={`translate(${object.x}, ${object.y})`}>
      <foreignObject x={0} y={0} width={420} height={object.explanation ? 180 : 90}>
        <div
          style={{
            fontFamily: 'KaTeX_Main, Times New Roman, serif',
            color: object.color,
            fontSize: `${object.fontSize || 24}px`,
            background: 'rgba(255, 255, 255, 0.92)',
            padding: '12px 18px',
            borderRadius: '10px',
            border: '1.5px solid rgba(0, 0, 0, 0.1)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
            userSelect: 'none',
          }}
        >
          <div
            dangerouslySetInnerHTML={{ __html: html || object.latex }}
            style={{ display: 'flex', justifyContent: 'center' }}
          />

          {object.explanation && (
            <div
              style={{
                marginTop: '8px',
                paddingTop: '8px',
                borderTop: '1px dashed #cbd5e1',
                fontFamily: 'Kalam, cursive',
                fontSize: '15px',
                color: '#475569',
              }}
            >
              <div style={{ fontWeight: 'bold', color: '#2563eb' }}>Derivation / Meaning:</div>
              <div>{object.explanation}</div>
            </div>
          )}
        </div>
      </foreignObject>
    </g>
  );
};
