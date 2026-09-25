import React, { useRef, useState, useEffect } from 'react';
import type { CanvasObject, StrokePoint } from '../types/canvas';
import { screenToWorld, zoomAtScreenPoint, isPointInPolygon, doBoxesIntersect, calculateBoundingBox } from './CoordinateManager';
import { GridBackground } from './GridBackground';
import { CanvasObjectRenderer } from '../objects/CanvasObjectRenderer';
import { SelectionBox } from '../objects/SelectionBox';
import { getSmoothedPoints, getStrokeOutline } from './StrokeEngine';
import { useCanvasStore, canvasStore } from '../store/canvasStore';
import { useToolStore, toolStore } from '../store/toolStore';
import { useThemeStore } from '../store/themeStore';

interface Props {
  onOpenAIForSelection?: () => void;
}

export const InfiniteCanvas: React.FC<Props> = ({ onOpenAIForSelection }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const { objects, selectedIds, transform, isAiGenerating } = useCanvasStore();
  const toolState = useToolStore();
  const { themeId, paperStyle, customBgColor } = useThemeStore();

  // Active interaction state
  const [isInteracting, setIsInteracting] = useState(false);
  const [currentStrokePoints, setCurrentStrokePoints] = useState<StrokePoint[]>([]);
  const [lassoPoints, setLassoPoints] = useState<{ x: number; y: number }[]>([]);
  const [dragStartPoint, setDragStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [currentDragPoint, setCurrentDragPoint] = useState<{ x: number; y: number } | null>(null);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isDraggingSelected, setIsDraggingSelected] = useState(false);
  const lastPanPointRef = useRef<{ x: number; y: number } | null>(null);
  const activePenIdRef = useRef<number | null>(null);

  // Selected objects list
  const selectedObjects = objects.filter((o) => selectedIds.includes(o.id));

  // Native non-passive wheel and gesture listener to isolate zoom & pan strictly to canvas
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const rect = container.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;

      if (e.ctrlKey || e.metaKey) {
        // Precise Cursor-Centered Zoom
        const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
        const currentTransform = canvasStore.getState().transform;
        const newTransform = zoomAtScreenPoint(screenX, screenY, zoomFactor, currentTransform);
        canvasStore.setTransform(newTransform);
      } else {
        // Smooth 2-finger / Wheel Pan
        canvasStore.panBy(-e.deltaX, -e.deltaY);
      }
    };

    const preventGesture = (e: Event) => {
      e.preventDefault();
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('gesturestart', preventGesture, { passive: false });
    window.addEventListener('gesturechange', preventGesture, { passive: false });
    window.addEventListener('gestureend', preventGesture, { passive: false });

    return () => {
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('gesturestart', preventGesture);
      window.removeEventListener('gesturechange', preventGesture);
      window.removeEventListener('gestureend', preventGesture);
    };
  }, []);

  // Handle Spacebar pan shortcut & global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isSpacePressed && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setIsSpacePressed(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          canvasStore.redo();
        } else {
          canvasStore.undo();
        }
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (!(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
          canvasStore.deleteSelected();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isSpacePressed]);

  // Object bounds helper
  const getObjectBounds = (obj: CanvasObject) => {
    if (obj.type === 'stroke') {
      return calculateBoundingBox(obj.points || [{ x: obj.x, y: obj.y }]);
    }
    if (obj.type === 'diagram') {
      return { x: obj.x, y: obj.y, width: obj.width || 960, height: obj.height || 680 };
    }
    if (obj.type === 'graph') {
      return { x: obj.x, y: obj.y, width: obj.width || 480, height: obj.height || 340 };
    }
    if (obj.type === 'table') {
      return { x: obj.x, y: obj.y, width: obj.width || 560, height: obj.height || 360 };
    }
    if (obj.type === 'equation') {
      return { x: obj.x, y: obj.y, width: obj.width || 460, height: obj.height || 180 };
    }
    if (obj.type === 'flashcard') {
      return { x: obj.x, y: obj.y, width: obj.width || 360, height: obj.height || 220 };
    }
    if (obj.type === 'text') {
      const lines = (obj.text || '').split('\n');
      const maxLineLen = lines.reduce((max, l) => Math.max(max, l.length), 0);
      const fs = obj.fontSize || 18;
      return {
        x: obj.x,
        y: obj.y,
        width: Math.max(obj.width || 0, maxLineLen * (fs * 0.64) + 30),
        height: Math.max(obj.height || 0, lines.length * (fs * 1.45) + 20),
      };
    }
    if (obj.type === 'arrow' || obj.type === 'line') {
      const sx = Math.min((obj as any).startX ?? obj.x, (obj as any).endX ?? (obj.x + 80));
      const sy = Math.min((obj as any).startY ?? obj.y, (obj as any).endY ?? (obj.y + 40));
      const sw = Math.max(Math.abs(((obj as any).endX ?? (obj.x + 80)) - ((obj as any).startX ?? obj.x)), 20);
      const sh = Math.max(Math.abs(((obj as any).endY ?? (obj.y + 40)) - ((obj as any).startY ?? obj.y)), 20);
      return { x: sx, y: sy, width: sw, height: sh };
    }
    return { x: obj.x, y: obj.y, width: obj.width || 140, height: obj.height || 80 };
  };

  const isPointHittingObject = (point: { x: number; y: number }, obj: CanvasObject): boolean => {
    if (obj.type === 'stroke') {
      return (obj.points || []).some((p) => Math.hypot(p.x - point.x, p.y - point.y) < Math.max(14, (obj.size || 3) * 2));
    }
    const b = getObjectBounds(obj);
    return point.x >= b.x - 8 && point.x <= b.x + b.width + 8 && point.y >= b.y - 8 && point.y <= b.y + b.height + 8;
  };

  // Pointer Down
  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    // Palm Rejection: If drawing with pen, ignore touch events
    if (activePenIdRef.current !== null && e.pointerType === 'touch' && e.pointerId !== activePenIdRef.current) {
      return;
    }

    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const world = screenToWorld(screenX, screenY, transform);

    // Capture pointer
    svgRef.current?.setPointerCapture(e.pointerId);
    if (e.pointerType === 'pen') {
      activePenIdRef.current = e.pointerId;
    }

    // Middle click, Right click, spacebar, or pan tool -> Pan
    if (e.button === 1 || e.button === 2 || isSpacePressed || toolState.activeTool === 'pan') {
      setIsInteracting(true);
      lastPanPointRef.current = { x: e.clientX, y: e.clientY };
      return;
    }

    if (e.button !== 0) return; // Only primary button

    setIsInteracting(true);

    const activeTool = toolState.activeTool;

    // 1. Check if clicking on an already selected object to immediately drag it anywhere
    if (selectedIds.length > 0 && (activeTool === 'select' || activeTool === 'lasso')) {
      const isHittingSelected = selectedObjects.some((obj) => isPointHittingObject(world, obj));
      if (isHittingSelected) {
        setIsDraggingSelected(true);
        setDragStartPoint(world);
        setCurrentDragPoint(world);
        return;
      }
    }

    if (activeTool === 'pen' || activeTool === 'pencil' || activeTool === 'marker' || activeTool === 'highlighter' || activeTool === 'brush') {
      const point: StrokePoint = {
        x: world.x,
        y: world.y,
        pressure: toolState.pressureSensitivity ? e.pressure : 0.5,
        tiltX: e.tiltX,
        tiltY: e.tiltY,
        time: Date.now(),
      };
      setCurrentStrokePoints([point]);
    } else if (activeTool === 'lasso') {
      setLassoPoints([{ x: world.x, y: world.y }]);
    } else if (activeTool === 'select') {
      setDragStartPoint(world);
      setCurrentDragPoint(world);

      // Check hit on any object
      const hitObj = [...objects].reverse().find((obj) => isPointHittingObject(world, obj));

      if (hitObj) {
        if (!selectedIds.includes(hitObj.id) && !e.shiftKey) {
          canvasStore.setSelectedIds([hitObj.id]);
        } else if (e.shiftKey) {
          canvasStore.selectObject(hitObj.id, true);
        }
        // Immediately start dragging on first click-drag
        setIsDraggingSelected(true);
      } else if (!e.shiftKey) {
        canvasStore.clearSelection();
      }
    } else if (activeTool === 'eraser') {
      eraseAtWorldPoint(world.x, world.y);
    } else if (activeTool === 'shape' || activeTool === 'arrow' || activeTool === 'line') {
      setDragStartPoint(world);
      setCurrentDragPoint(world);
    } else if (activeTool === 'text') {
      // Create new text object at clicked location
      const newText: CanvasObject = {
        id: `text-${Date.now()}`,
        type: 'text',
        x: world.x,
        y: world.y,
        text: 'Handwritten Notes...',
        fontFamily: toolState.textFontFamily,
        fontSize: toolState.textFontSize,
        color: toolState.textColor,
        isHandwrittenStyle: toolState.textIsHandwritten,
        alignment: 'left',
        zIndex: objects.length + 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      canvasStore.addObject(newText);
      canvasStore.setSelectedIds([newText.id]);
      toolStore.setActiveTool('select');
      setIsInteracting(false);
    }
  };

  // Pointer Move
  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isInteracting) return;

    // Pan Mode Dragging
    if (lastPanPointRef.current) {
      const dx = e.clientX - lastPanPointRef.current.x;
      const dy = e.clientY - lastPanPointRef.current.y;
      lastPanPointRef.current = { x: e.clientX, y: e.clientY };
      canvasStore.panBy(dx, dy);
      return;
    }

    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const world = screenToWorld(screenX, screenY, transform);

    const activeTool = toolState.activeTool;

    if (isDraggingSelected && dragStartPoint) {
      const dx = world.x - dragStartPoint.x;
      const dy = world.y - dragStartPoint.y;
      canvasStore.moveSelectedObjects(dx, dy);
      setDragStartPoint(world);
      return;
    }

    if (activeTool === 'pen' || activeTool === 'pencil' || activeTool === 'marker' || activeTool === 'highlighter' || activeTool === 'brush') {
      const newPoint: StrokePoint = {
        x: world.x,
        y: world.y,
        pressure: toolState.pressureSensitivity ? e.pressure : 0.5,
        tiltX: e.tiltX,
        tiltY: e.tiltY,
        time: Date.now(),
      };
      setCurrentStrokePoints((prev) => [...prev, newPoint]);
    } else if (activeTool === 'lasso') {
      setLassoPoints((prev) => [...prev, { x: world.x, y: world.y }]);
    } else if (activeTool === 'select' || activeTool === 'shape' || activeTool === 'arrow' || activeTool === 'line') {
      setCurrentDragPoint(world);
    } else if (activeTool === 'eraser') {
      eraseAtWorldPoint(world.x, world.y);
    }
  };

  // Erase items intersecting world point
  const eraseAtWorldPoint = (wx: number, wy: number) => {
    const eraserRadius = toolState.eraserSize / transform.scale;
    const toDeleteIds: string[] = [];

    for (const obj of objects) {
      if (obj.type === 'stroke') {
        const hit = (obj.points || []).some((p) => Math.hypot(p.x - wx, p.y - wy) < eraserRadius + (obj.size || 3));
        if (hit) toDeleteIds.push(obj.id);
      } else {
        const b = getObjectBounds(obj);
        if (wx >= b.x - eraserRadius && wx <= b.x + b.width + eraserRadius && wy >= b.y - eraserRadius && wy <= b.y + b.height + eraserRadius) {
          toDeleteIds.push(obj.id);
        }
      }
    }

    if (toDeleteIds.length > 0) {
      const deleteSet = new Set(toDeleteIds);
      canvasStore.setObjects(objects.filter((o) => !deleteSet.has(o.id)));
    }
  };

  // Pointer Up
  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isInteracting) return;
    setIsInteracting(false);
    lastPanPointRef.current = null;
    setIsDraggingSelected(false);

    if (e.pointerId === activePenIdRef.current) {
      activePenIdRef.current = null;
    }

    const activeTool = toolState.activeTool;

    if ((activeTool === 'pen' || activeTool === 'pencil' || activeTool === 'marker' || activeTool === 'highlighter' || activeTool === 'brush') && currentStrokePoints.length > 0) {
      const tool = activeTool;
      const color = tool === 'highlighter' ? toolState.highlighterColor : toolState.penColor;
      const size = tool === 'highlighter' ? toolState.highlighterSize : tool === 'marker' ? toolState.markerSize : tool === 'pencil' ? toolState.pencilSize : tool === 'brush' ? toolState.brushSize : toolState.penSize;
      const opacity = tool === 'pencil' ? 0.8 : toolState.penOpacity;

      const smoothed = getSmoothedPoints(currentStrokePoints, tool);
      const pathData = getStrokeOutline(smoothed, { size, tool, isComplete: true });

      const newStroke: CanvasObject = {
        id: `stroke-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        type: 'stroke',
        tool,
        x: currentStrokePoints[0].x,
        y: currentStrokePoints[0].y,
        points: currentStrokePoints,
        color,
        size,
        opacity,
        pathData,
        zIndex: objects.length + 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      canvasStore.addObject(newStroke);
      setCurrentStrokePoints([]);
    } else if (activeTool === 'lasso' && lassoPoints.length > 2) {
      // Find all objects inside lasso polygon
      const selected: string[] = [];
      for (const obj of objects) {
        if (obj.type === 'stroke') {
          const insideCount = (obj.points || []).filter((p) => isPointInPolygon(p, lassoPoints)).length;
          if (insideCount > 0 && insideCount >= (obj.points?.length || 1) * 0.25) {
            selected.push(obj.id);
          }
        } else {
          const b = getObjectBounds(obj);
          const testPoints = [
            { x: b.x, y: b.y },
            { x: b.x + b.width, y: b.y },
            { x: b.x, y: b.y + b.height },
            { x: b.x + b.width, y: b.y + b.height },
            { x: b.x + b.width / 2, y: b.y + b.height / 2 },
          ];
          if (testPoints.some((pt) => isPointInPolygon(pt, lassoPoints))) {
            selected.push(obj.id);
          }
        }
      }
      canvasStore.setSelectedIds(selected);
      setLassoPoints([]);
      if (selected.length > 0) {
        // Automatically set active tool to select so user can drag immediately
        toolStore.setActiveTool('select');
      }
    } else if (activeTool === 'select' && dragStartPoint && currentDragPoint && !isDraggingSelected) {
      // Marquee selection
      const sx = Math.min(dragStartPoint.x, currentDragPoint.x);
      const sy = Math.min(dragStartPoint.y, currentDragPoint.y);
      const sw = Math.abs(currentDragPoint.x - dragStartPoint.x);
      const sh = Math.abs(currentDragPoint.y - dragStartPoint.y);

      if (sw > 5 || sh > 5) {
        const marqueeBox = { x: sx, y: sy, width: sw, height: sh };
        const selected: string[] = [];

        for (const obj of objects) {
          const objBox = getObjectBounds(obj);
          if (doBoxesIntersect(marqueeBox, objBox)) {
            selected.push(obj.id);
          }
        }
        canvasStore.setSelectedIds(selected);
      }
      setDragStartPoint(null);
      setCurrentDragPoint(null);
    } else if ((activeTool === 'shape' || activeTool === 'arrow' || activeTool === 'line') && dragStartPoint && currentDragPoint) {
      const sx = Math.min(dragStartPoint.x, currentDragPoint.x);
      const sy = Math.min(dragStartPoint.y, currentDragPoint.y);
      const sw = Math.max(20, Math.abs(currentDragPoint.x - dragStartPoint.x));
      const sh = Math.max(20, Math.abs(currentDragPoint.y - dragStartPoint.y));

      if (activeTool === 'arrow' || activeTool === 'line') {
        const newArrow: CanvasObject = {
          id: `arrow-${Date.now()}`,
          type: 'arrow',
          x: dragStartPoint.x,
          y: dragStartPoint.y,
          startX: dragStartPoint.x,
          startY: dragStartPoint.y,
          endX: currentDragPoint.x,
          endY: currentDragPoint.y,
          color: toolState.arrowColor,
          width: toolState.arrowWidth,
          arrowHead: activeTool === 'arrow' ? 'end' : 'none',
          isCurved: toolState.arrowCurved,
          zIndex: objects.length + 1,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        canvasStore.addObject(newArrow);
      } else {
        const newShape: CanvasObject = {
          id: `shape-${Date.now()}`,
          type: 'shape',
          shapeType: toolState.shapeType,
          x: sx,
          y: sy,
          width: sw,
          height: sh,
          strokeColor: toolState.shapeStrokeColor,
          fillColor: toolState.shapeFillColor,
          strokeWidth: toolState.shapeStrokeWidth,
          strokeStyle: toolState.shapeHandDrawn ? 'hand-drawn' : 'solid',
          zIndex: objects.length + 1,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        canvasStore.addObject(newShape);
      }

      setDragStartPoint(null);
      setCurrentDragPoint(null);
      toolStore.setActiveTool('select');
    } else {
      setDragStartPoint(null);
      setCurrentDragPoint(null);
    }
  };

  // Live stroke preview
  const liveStrokePath =
    currentStrokePoints.length > 0
      ? getStrokeOutline(getSmoothedPoints(currentStrokePoints, toolState.activeTool), {
          size:
            toolState.activeTool === 'highlighter'
              ? toolState.highlighterSize
              : toolState.activeTool === 'marker'
              ? toolState.markerSize
              : toolState.penSize,
          tool: toolState.activeTool as any,
        })
      : '';

  return (
    <div
      ref={containerRef}
      className={`canvas-container tool-${isSpacePressed ? 'pan' : toolState.activeTool}`}
      style={{ width: '100vw', height: '100vh', touchAction: 'none' }}
    >
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onContextMenu={(e) => e.preventDefault()}
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        {/* SVG Filter for realistic graphite pencil grain */}
        <defs>
          <filter id="pencil-texture" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        {/* 1. Infinite Adaptive Grid / Paper Layer */}
        <GridBackground
          themeId={themeId}
          paperStyle={paperStyle}
          customBgColor={customBgColor}
          viewport={transform}
        />

        {/* 2. World Coordinate Layer (Transformed by Infinite Pan & Zoom) */}
        <g
          transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}
          className={isAiGenerating ? 'ai-generating' : undefined}
        >
          {/* Render All Native Objects */}
          {objects.map((obj) => (
            <CanvasObjectRenderer
              key={obj.id}
              object={obj}
              isSelected={selectedIds.includes(obj.id)}
            />
          ))}

          {/* Live Drawing Stroke Preview */}
          {liveStrokePath && (
            <path
              d={liveStrokePath}
              fill={
                toolState.activeTool === 'highlighter'
                  ? toolState.highlighterColor
                  : toolState.penColor
              }
              opacity={toolState.activeTool === 'pencil' ? 0.8 : toolState.penOpacity}
            />
          )}

          {/* Live Shape / Arrow Drag Preview */}
          {dragStartPoint && currentDragPoint && (toolState.activeTool === 'shape' || toolState.activeTool === 'arrow' || toolState.activeTool === 'line') && (
            <g opacity="0.6">
              {toolState.activeTool === 'arrow' || toolState.activeTool === 'line' ? (
                <line
                  x1={dragStartPoint.x}
                  y1={dragStartPoint.y}
                  x2={currentDragPoint.x}
                  y2={currentDragPoint.y}
                  stroke={toolState.arrowColor}
                  strokeWidth={toolState.arrowWidth}
                  strokeDasharray="4 4"
                />
              ) : (
                <rect
                  x={Math.min(dragStartPoint.x, currentDragPoint.x)}
                  y={Math.min(dragStartPoint.y, currentDragPoint.y)}
                  width={Math.abs(currentDragPoint.x - dragStartPoint.x)}
                  height={Math.abs(currentDragPoint.y - dragStartPoint.y)}
                  fill="rgba(244, 63, 94, 0.08)"
                  stroke={toolState.shapeStrokeColor || '#f43f5e'}
                  strokeWidth="2"
                  rx={8}
                />
              )}
            </g>
          )}

          {/* Live Lasso Selection Loop Preview (Rose-tinted) */}
          {lassoPoints.length > 1 && (
            <polygon
              points={lassoPoints.map((p) => `${p.x},${p.y}`).join(' ')}
              fill="rgba(244, 63, 94, 0.08)"
              stroke="#f43f5e"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          )}

          {/* Live Marquee Box Selection Preview (Rose-tinted) */}
          {dragStartPoint && currentDragPoint && toolState.activeTool === 'select' && !isDraggingSelected && (
            <rect
              x={Math.min(dragStartPoint.x, currentDragPoint.x)}
              y={Math.min(dragStartPoint.y, currentDragPoint.y)}
              width={Math.abs(currentDragPoint.x - dragStartPoint.x)}
              height={Math.abs(currentDragPoint.y - dragStartPoint.y)}
              fill="rgba(244, 63, 94, 0.06)"
              stroke="#f43f5e"
              strokeWidth="1.2"
              rx={6}
            />
          )}

          {/* Selection Box & Transform Handles */}
          {selectedObjects.length > 0 && (
            <SelectionBox
              selectedObjects={selectedObjects}
              onTriggerAI={onOpenAIForSelection}
            />
          )}
        </g>
      </svg>
    </div>
  );
};
