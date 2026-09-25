import React, { useState } from 'react';
import type { TextObjectData } from '../types/canvas';
import { canvasStore } from '../store/canvasStore';
import { useThemeStore } from '../store/themeStore';

interface Props {
  object: TextObjectData;
}

export const TextObject: React.FC<Props> = ({ object }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(object.text);
  const { isDark } = useThemeStore();

  const handleBlur = () => {
    setIsEditing(false);
    if (editText !== object.text) {
      canvasStore.updateObject(object.id, { text: editText });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(object.text);
    }
  };

  const isCard = Boolean(object.cardBgColor || object.cardTitle || (object.width && object.width > 200));

  if (isCard) {
    const cardW = object.width || 440;
    const cardH = object.height || 250;
    const accentColor = object.cardAccentColor || object.color || (isDark ? '#F43F5E' : '#E11D48');
    const bgColor =
      object.cardBgColor ||
      (isDark ? 'rgba(24, 26, 35, 0.96)' : 'rgba(255, 255, 255, 0.97)');
    const borderColor =
      object.cardBorderColor ||
      (isDark ? 'rgba(71, 85, 105, 0.45)' : 'rgba(226, 232, 240, 0.95)');

    return (
      <g
        transform={`translate(${object.x}, ${object.y}) rotate(${object.rotation || 0})`}
        onDoubleClick={(e) => {
          e.stopPropagation();
          setIsEditing(true);
        }}
        className="cursor-pointer"
      >
        <foreignObject x={0} y={0} width={cardW} height={cardH}>
          {isEditing ? (
            <textarea
              autoFocus
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              style={{
                fontFamily: object.fontFamily || 'Kalam, cursive',
                fontSize: `${object.fontSize || 16}px`,
                color: object.color,
                background: bgColor,
                border: `2px solid ${accentColor}`,
                borderRadius: '16px',
                padding: '12px 16px',
                width: '100%',
                height: '100%',
                outline: 'none',
                resize: 'none',
                boxSizing: 'border-box',
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: bgColor,
                border: `1.5px solid ${borderColor}`,
                borderLeft: `5px solid ${accentColor}`,
                borderRadius: '18px',
                padding: '14px 18px',
                boxSizing: 'border-box',
                fontFamily: object.fontFamily || 'Kalam, cursive',
                color: object.color || (isDark ? '#f8fafc' : '#1e293b'),
                display: 'flex',
                flexDirection: 'column',
                boxShadow: isDark
                  ? '0 6px 20px rgba(0, 0, 0, 0.45)'
                  : '0 4px 18px rgba(0, 0, 0, 0.07)',
                overflow: 'hidden',
                userSelect: 'none',
              }}
            >
              {object.cardTitle && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: `${Math.max((object.fontSize || 16) * 1.05, 17)}px`,
                    fontWeight: 'bold',
                    color: accentColor,
                    marginBottom: '8px',
                    borderBottom: `1px dashed ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.09)'}`,
                    paddingBottom: '6px',
                  }}
                >
                  {object.cardIcon && <span style={{ fontSize: '18px' }}>{object.cardIcon}</span>}
                  <span>{object.cardTitle}</span>
                </div>
              )}

              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  fontSize: `${object.fontSize || 16}px`,
                  lineHeight: '1.45',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {object.text}
              </div>
            </div>
          )}
        </foreignObject>
      </g>
    );
  }

  // Classic handwritten text render
  const lines = object.text.split('\n');
  const lineHeight = object.fontSize * 1.35;

  return (
    <g
      transform={`translate(${object.x}, ${object.y}) rotate(${object.rotation || 0})`}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
      className="cursor-text"
    >
      {isEditing ? (
        <foreignObject x={0} y={0} width={400} height={200}>
          <textarea
            autoFocus
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            style={{
              fontFamily: object.fontFamily,
              fontSize: `${object.fontSize}px`,
              color: object.color,
              background: 'rgba(255, 255, 255, 0.95)',
              border: '1.5px solid #f43f5e',
              borderRadius: '8px',
              padding: '6px 10px',
              width: '100%',
              height: '100%',
              outline: 'none',
              resize: 'both',
            }}
          />
        </foreignObject>
      ) : (
        <text
          x={0}
          y={object.fontSize}
          fill={object.color}
          style={{
            fontFamily: object.fontFamily,
            fontSize: `${object.fontSize}px`,
            fontWeight: object.bold ? 'bold' : 'normal',
            fontStyle: object.italic ? 'italic' : 'normal',
            textAnchor: object.alignment === 'center' ? 'middle' : object.alignment === 'right' ? 'end' : 'start',
            userSelect: 'none',
          }}
        >
          {lines.map((line, idx) => (
            <tspan key={idx} x={0} dy={idx === 0 ? 0 : lineHeight}>
              {line}
            </tspan>
          ))}
        </text>
      )}
    </g>
  );
};
