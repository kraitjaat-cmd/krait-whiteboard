import React, { useState } from 'react';
import type { CanvasObject } from '../types/canvas';
import { calculateBoundingBox } from '../canvas/CoordinateManager';
import { canvasStore } from '../store/canvasStore';
import { useThemeStore } from '../store/themeStore';
import { processAICommand } from '../ai/aiService';

interface Props {
  selectedObjects: CanvasObject[];
  onTriggerAI?: () => void;
}

export const SelectionBox: React.FC<Props> = ({ selectedObjects, onTriggerAI }) => {
  const [isSolving, setIsSolving] = useState(false);
  const { isDark } = useThemeStore();

  if (!selectedObjects || selectedObjects.length === 0) return null;

  // Calculate combined bounding box across all object types
  const allPoints: { x: number; y: number }[] = [];

  for (const obj of selectedObjects) {
    if (obj.type === 'stroke') {
      if (obj.points && obj.points.length > 0) {
        allPoints.push(...obj.points);
      }
    } else if (obj.type === 'diagram') {
      const dw = obj.width || 960;
      const dh = obj.height || 680;
      allPoints.push(
        { x: obj.x, y: obj.y },
        { x: obj.x + dw, y: obj.y + dh }
      );
    } else if (obj.type === 'graph') {
      const gw = obj.width || 480;
      const gh = obj.height || 340;
      allPoints.push(
        { x: obj.x, y: obj.y },
        { x: obj.x + gw, y: obj.y + gh }
      );
    } else if (obj.type === 'table') {
      const tw = obj.width || 560;
      const th = obj.height || 360;
      allPoints.push(
        { x: obj.x, y: obj.y },
        { x: obj.x + tw, y: obj.y + th }
      );
    } else if (obj.type === 'equation') {
      const ew = obj.width || 460;
      const eh = obj.height || 180;
      allPoints.push(
        { x: obj.x, y: obj.y },
        { x: obj.x + ew, y: obj.y + eh }
      );
    } else if (obj.type === 'flashcard') {
      const fw = obj.width || 360;
      const fh = obj.height || 220;
      allPoints.push(
        { x: obj.x, y: obj.y },
        { x: obj.x + fw, y: obj.y + fh }
      );
    } else if (obj.type === 'text') {
      const lines = (obj.text || '').split('\n');
      const maxLineLen = lines.reduce((max, l) => Math.max(max, l.length), 0);
      const fontSize = obj.fontSize || 18;
      const computedWidth = Math.max(obj.width || 0, maxLineLen * (fontSize * 0.64) + 30);
      const computedHeight = Math.max(obj.height || 0, lines.length * (fontSize * 1.45) + 20);
      allPoints.push(
        { x: obj.x, y: obj.y },
        { x: obj.x + computedWidth, y: obj.y + computedHeight }
      );
    } else if (obj.type === 'arrow' || obj.type === 'line') {
      allPoints.push(
        { x: (obj as any).startX ?? obj.x, y: (obj as any).startY ?? obj.y },
        { x: (obj as any).endX ?? (obj.x + 100), y: (obj as any).endY ?? (obj.y + 50) }
      );
    } else {
      allPoints.push(
        { x: obj.x, y: obj.y },
        { x: obj.x + (obj.width || 140), y: obj.y + (obj.height || 80) }
      );
    }
  }

  if (allPoints.length === 0) return null;

  const box = calculateBoundingBox(allPoints);
  const pad = 12;
  const bx = box.x - pad;
  const by = box.y - pad;
  const bw = Math.max(box.width + pad * 2, 40);
  const bh = Math.max(box.height + pad * 2, 30);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    canvasStore.deleteSelected();
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cloned = selectedObjects.map((obj) => ({
      ...JSON.parse(JSON.stringify(obj)),
      id: `obj-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      x: obj.x + 30,
      y: obj.y + 30,
    }));
    canvasStore.addObjects(cloned);
    canvasStore.setSelectedIds(cloned.map((o) => o.id));
  };

  const handleDirectSolve = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSolving) return;

    setIsSolving(true);
    canvasStore.setAiGenerating(true);

    try {
      const response = await processAICommand(
        {
          command: 'solve',
          query: 'Solve step-by-step and explain in deep educational detail',
          selectedObjects,
          canvasContext: {
            themeIsDark: isDark,
            centerPosition: { x: bx, y: by + bh + 30 },
          },
        },
        canvasStore.getState().objects,
        isDark
      );

      if (response.objects && response.objects.length > 0) {
        canvasStore.addObjects(response.objects);
        canvasStore.setSelectedIds(response.objects.map((o) => o.id));
      }
    } catch (err) {
      console.error('Direct solve execution error:', err);
    } finally {
      setIsSolving(false);
      canvasStore.setAiGenerating(false);
    }
  };

  return (
    <g className="selection-box-overlay pointer-events-none">
      {/* Sleek Solid Rose-Tinted Frame (Clean, No Blue Dotted Lines) */}
      <rect
        x={bx}
        y={by}
        width={bw}
        height={bh}
        fill="rgba(244, 63, 94, 0.03)"
        stroke="#f43f5e"
        strokeWidth="1.75"
        rx={10}
        ry={10}
      />

      {/* 4 Corner Neumorphic Grip Points */}
      {[
        { x: bx, y: by },
        { x: bx + bw, y: by },
        { x: bx, y: by + bh },
        { x: bx + bw, y: by + bh },
      ].map((pt, idx) => (
        <circle
          key={idx}
          cx={pt.x}
          cy={pt.y}
          r={4.5}
          fill="#ffffff"
          stroke="#f43f5e"
          strokeWidth="2"
        />
      ))}

      {/* Floating Neumorphic Action Menu with Solve, AI, Copy, Del */}
      <foreignObject
        x={Math.max(10, bx + bw - 270)}
        y={Math.max(10, by - 46)}
        width={280}
        height={44}
        className="pointer-events-auto"
      >
        <div
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: '#16181f',
            borderRadius: '16px',
            padding: '5px 8px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5), 0 2px 6px rgba(244,63,94,0.2)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {/* Direct 1-Click Solve & Explain Button */}
          <button
            onClick={handleDirectSolve}
            disabled={isSolving}
            title="Solve & explain this equation or concept step-by-step"
            style={{
              background: 'linear-gradient(135deg, #f43f5e, #be123c)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: isSolving ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 2px 10px rgba(244, 63, 94, 0.45)',
              transition: 'all 0.15s ease',
            }}
          >
            <span>{isSolving ? '⏳' : '🧮'}</span>
            <span>{isSolving ? 'Solving...' : 'Solve'}</span>
          </button>

          {/* AI Prompt Modal Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTriggerAI?.();
            }}
            title="Ask AI custom prompt about selected items"
            style={{
              background: 'linear-gradient(135deg, #a855f7, #4f46e5)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '4px 9px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 2px 8px rgba(168, 85, 247, 0.4)',
            }}
          >
            <span>✨</span>
            <span>AI</span>
          </button>

          {/* Duplicate Button */}
          <button
            onClick={handleDuplicate}
            title="Duplicate selected"
            style={{
              background: 'rgba(255,255,255,0.08)',
              color: '#e2e8f0',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
            }}
          >
            <span>📋</span>
            <span>Copy</span>
          </button>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            title="Delete selected"
            style={{
              background: 'rgba(225, 29, 72, 0.3)',
              color: '#fda4af',
              border: '1px solid rgba(244, 63, 94, 0.4)',
              borderRadius: '10px',
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              boxShadow: '0 2px 8px rgba(225, 29, 72, 0.3)',
            }}
          >
            <span>🗑️</span>
            <span>Del</span>
          </button>
        </div>
      </foreignObject>
    </g>
  );
};
