import React from 'react';
import type { FlashcardObjectData } from '../types/canvas';
import { canvasStore } from '../store/canvasStore';

interface Props {
  object: FlashcardObjectData;
  isSelected?: boolean;
}

export const FlashcardObject: React.FC<Props> = ({ object }) => {
  const { question, answer, hint, subject, isFlipped, isAnswerRevealed, userScore } = object;

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    canvasStore.updateObject(object.id, { isFlipped: !isFlipped });
  };

  const handleReveal = (e: React.MouseEvent) => {
    e.stopPropagation();
    canvasStore.updateObject(object.id, { isAnswerRevealed: !isAnswerRevealed });
  };

  const handleScore = (e: React.MouseEvent, score: 'easy' | 'medium' | 'hard') => {
    e.stopPropagation();
    canvasStore.updateObject(object.id, { userScore: score });
  };

  return (
    <g transform={`translate(${object.x}, ${object.y})`}>
      <foreignObject x={0} y={0} width={340} height={220}>
        <div
          style={{
            fontFamily: 'Kalam, cursive',
            background: isFlipped ? '#F0FDF4' : '#FFFDF5',
            border: `2px solid ${isFlipped ? '#86EFAC' : '#FDE047'}`,
            borderRadius: '14px',
            padding: '14px',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            userSelect: 'none',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px dashed #CBD5E1',
              paddingBottom: '6px',
            }}
          >
            <span
              style={{
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                color: '#3B82F6',
              }}
            >
              📝 {subject || 'Study Flashcard'}
            </span>
            <button
              onClick={handleFlip}
              style={{
                background: 'rgba(0,0,0,0.06)',
                border: 'none',
                borderRadius: '6px',
                padding: '2px 8px',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              🔄 Flip Card
            </button>
          </div>

          {/* Content */}
          <div style={{ flex: 1, paddingTop: '10px' }}>
            {!isFlipped ? (
              <div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1E293B', marginBottom: '6px' }}>
                  Q: {question}
                </div>
                {hint && (
                  <div style={{ fontSize: '13px', color: '#64748B', fontStyle: 'italic' }}>
                    💡 Hint: {hint}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#15803D', marginBottom: '4px' }}>
                  ✓ ANSWER:
                </div>
                <div style={{ fontSize: '15px', color: '#1E293B' }}>{answer}</div>
              </div>
            )}
          </div>

          {/* Footer controls */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '6px',
              borderTop: '1px dashed #E2E8F0',
            }}
          >
            <button
              onClick={handleReveal}
              style={{
                background: isAnswerRevealed ? '#E2E8F0' : '#DBEAFE',
                color: '#1E40AF',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              {isAnswerRevealed ? 'Hide Answer' : '👁 Reveal'}
            </button>

            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={(e) => handleScore(e, 'hard')}
                style={{
                  background: userScore === 'hard' ? '#F87171' : '#FEE2E2',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '2px 6px',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                Hard
              </button>
              <button
                onClick={(e) => handleScore(e, 'easy')}
                style={{
                  background: userScore === 'easy' ? '#4ADE80' : '#DCFCE7',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '2px 6px',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                Easy
              </button>
            </div>
          </div>
        </div>
      </foreignObject>
    </g>
  );
};
