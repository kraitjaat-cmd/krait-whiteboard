import { useState, useEffect } from 'react';
import type { ShapeType, ToolType } from '../types/canvas';

export interface ToolState {
  activeTool: ToolType;
  penColor: string;
  penSize: number;
  penOpacity: number;
  pressureSensitivity: boolean;

  pencilSize: number;
  markerSize: number;
  brushSize: number;

  highlighterColor: string;
  highlighterSize: number;

  eraserSize: number;
  eraserMode: 'stroke' | 'pixel';

  shapeType: ShapeType;
  shapeStrokeColor: string;
  shapeFillColor: string;
  shapeStrokeWidth: number;
  shapeHandDrawn: boolean;

  textColor: string;
  textFontSize: number;
  textFontFamily: string;
  textIsHandwritten: boolean;

  arrowColor: string;
  arrowWidth: number;
  arrowCurved: boolean;

  handwritingStyleProfile: {
    slant: number; // degrees
    jitter: number;
    baselineVariation: number;
    strokeThickness: number;
    font: string;
  };
}

class ToolStore {
  private state: ToolState = {
    activeTool: 'pen',
    penColor: '#262320', // Warm graphite ink default
    penSize: 3.5,
    penOpacity: 1.0,
    pressureSensitivity: true,

    pencilSize: 2.5,
    markerSize: 6.0,
    brushSize: 8.0,

    highlighterColor: 'rgba(254, 240, 138, 0.45)',
    highlighterSize: 22,

    eraserSize: 24,
    eraserMode: 'stroke',

    shapeType: 'rectangle',
    shapeStrokeColor: '#262320',
    shapeFillColor: 'transparent',
    shapeStrokeWidth: 2,
    shapeHandDrawn: true,

    textColor: '#262320',
    textFontSize: 22,
    textFontFamily: 'Kalam',
    textIsHandwritten: true,

    arrowColor: '#262320',
    arrowWidth: 2.5,
    arrowCurved: false,

    handwritingStyleProfile: {
      slant: -2,
      jitter: 0.15,
      baselineVariation: 1.2,
      strokeThickness: 1.0,
      font: 'Kalam',
    },
  };

  private listeners = new Set<() => void>();

  getState(): ToolState {
    return this.state;
  }

  private emit() {
    this.listeners.forEach((l) => l());
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  setActiveTool(tool: ToolType) {
    this.state.activeTool = tool;
    this.emit();
  }

  setPenColor(color: string) {
    this.state.penColor = color;
    this.state.shapeStrokeColor = color;
    this.state.textColor = color;
    this.state.arrowColor = color;
    this.emit();
  }

  setPenSize(size: number) {
    this.state.penSize = size;
    this.emit();
  }

  setPenOpacity(opacity: number) {
    this.state.penOpacity = opacity;
    this.emit();
  }

  setPressureSensitivity(enabled: boolean) {
    this.state.pressureSensitivity = enabled;
    this.emit();
  }

  setHighlighterColor(color: string) {
    this.state.highlighterColor = color;
    this.emit();
  }

  setHighlighterSize(size: number) {
    this.state.highlighterSize = size;
    this.emit();
  }

  setShapeType(type: ShapeType) {
    this.state.shapeType = type;
    this.emit();
  }

  setShapeFillColor(color: string) {
    this.state.shapeFillColor = color;
    this.emit();
  }

  setHandwritingProfile(profile: Partial<ToolState['handwritingStyleProfile']>) {
    this.state.handwritingStyleProfile = {
      ...this.state.handwritingStyleProfile,
      ...profile,
    };
    this.emit();
  }

  setSettings(updates: Partial<ToolState>) {
    this.state = { ...this.state, ...updates };
    this.emit();
  }
}

export const toolStore = new ToolStore();

export function useToolStore(): ToolState {
  const [state, setState] = useState(() => toolStore.getState());

  useEffect(() => {
    return toolStore.subscribe(() => {
      setState({ ...toolStore.getState() });
    });
  }, []);

  return state;
}
