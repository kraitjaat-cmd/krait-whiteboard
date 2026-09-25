import { useState, useEffect } from 'react';
import type { CanvasObject, TransformState } from '../types/canvas';

interface CanvasState {
  objects: CanvasObject[];
  selectedIds: string[];
  transform: TransformState;
  isAiGenerating: boolean;
  history: CanvasObject[][];
  redoStack: CanvasObject[][];
}

type Listener = () => void;

class CanvasStore {
  private state: CanvasState = {
    objects: [],
    selectedIds: [],
    transform: { x: 100, y: 80, scale: 1.0 },
    isAiGenerating: false,
    history: [],
    redoStack: [],
  };

  private listeners = new Set<Listener>();

  getState(): CanvasState {
    return this.state;
  }

  private emit() {
    this.listeners.forEach((l) => l());
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private saveHistory() {
    this.state.history.push(JSON.parse(JSON.stringify(this.state.objects)));
    if (this.state.history.length > 50) {
      this.state.history.shift();
    }
    this.state.redoStack = [];
  }

  setObjects(objects: CanvasObject[], recordHistory = true) {
    if (recordHistory) this.saveHistory();
    this.state.objects = objects;
    this.emit();
  }

  addObject(obj: CanvasObject, recordHistory = true) {
    if (recordHistory) this.saveHistory();
    this.state.objects.push(obj);
    this.emit();
  }

  addObjects(objs: CanvasObject[], recordHistory = true) {
    if (recordHistory) this.saveHistory();
    this.state.objects.push(...objs);
    this.emit();
  }

  updateObject(id: string, updates: Partial<CanvasObject>, recordHistory = false) {
    if (recordHistory) this.saveHistory();
    this.state.objects = this.state.objects.map((obj) =>
      obj.id === id ? ({ ...obj, ...updates, updatedAt: Date.now() } as CanvasObject) : obj
    );
    this.emit();
  }

  deleteSelected() {
    if (this.state.selectedIds.length === 0) return;
    this.saveHistory();
    const idSet = new Set(this.state.selectedIds);
    this.state.objects = this.state.objects.filter((obj) => !idSet.has(obj.id));
    this.state.selectedIds = [];
    this.emit();
  }

  setSelectedIds(ids: string[]) {
    this.state.selectedIds = ids;
    this.emit();
  }

  selectObject(id: string, additive = false) {
    if (additive) {
      if (this.state.selectedIds.includes(id)) {
        this.state.selectedIds = this.state.selectedIds.filter((i) => i !== id);
      } else {
        this.state.selectedIds.push(id);
      }
    } else {
      this.state.selectedIds = [id];
    }
    this.emit();
  }

  clearSelection() {
    if (this.state.selectedIds.length > 0) {
      this.state.selectedIds = [];
      this.emit();
    }
  }

  moveSelectedObjects(dx: number, dy: number) {
    if (this.state.selectedIds.length === 0) return;
    const idSet = new Set(this.state.selectedIds);
    this.state.objects = this.state.objects.map((obj) => {
      if (!idSet.has(obj.id)) return obj;
      if (obj.type === 'stroke') {
        return {
          ...obj,
          points: obj.points.map((p) => ({ ...p, x: p.x + dx, y: p.y + dy })),
          x: obj.x + dx,
          y: obj.y + dy,
        };
      }
      if (obj.type === 'arrow' || obj.type === 'line') {
        return {
          ...obj,
          startX: obj.startX + dx,
          startY: obj.startY + dy,
          endX: obj.endX + dx,
          endY: obj.endY + dy,
          x: obj.x + dx,
          y: obj.y + dy,
        };
      }
      return {
        ...obj,
        x: obj.x + dx,
        y: obj.y + dy,
      };
    });
    this.emit();
  }

  undo() {
    if (this.state.history.length === 0) return;
    const prev = this.state.history.pop()!;
    this.state.redoStack.push(JSON.parse(JSON.stringify(this.state.objects)));
    this.state.objects = prev;
    this.state.selectedIds = [];
    this.emit();
  }

  redo() {
    if (this.state.redoStack.length === 0) return;
    const next = this.state.redoStack.pop()!;
    this.state.history.push(JSON.parse(JSON.stringify(this.state.objects)));
    this.state.objects = next;
    this.emit();
  }

  setTransform(transform: TransformState) {
    this.state.transform = transform;
    this.emit();
  }

  panBy(dx: number, dy: number) {
    this.state.transform = {
      ...this.state.transform,
      x: this.state.transform.x + dx,
      y: this.state.transform.y + dy,
    };
    this.emit();
  }

  setAiGenerating(generating: boolean) {
    this.state.isAiGenerating = generating;
    this.emit();
  }

  clearAll() {
    this.saveHistory();
    this.state.objects = [];
    this.state.selectedIds = [];
    this.emit();
  }
}

export const canvasStore = new CanvasStore();

export function useCanvasStore(): CanvasState {
  const [state, setState] = useState(() => canvasStore.getState());

  useEffect(() => {
    return canvasStore.subscribe(() => {
      setState({ ...canvasStore.getState() });
    });
  }, []);

  return state;
}
