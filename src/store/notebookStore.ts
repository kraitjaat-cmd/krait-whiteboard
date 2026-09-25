import { useState, useEffect } from 'react';
import type { CanvasObject } from '../types/canvas';
import type { Notebook, PageData } from '../types/notebook';
import { canvasStore } from './canvasStore';
import { themeStore } from './themeStore';

const STORAGE_KEY = 'krait_whiteboard_notebooks_v2';

export interface NotebookState {
  notebooks: Notebook[];
  activeNotebookId: string;
  activePageId: string;
  pages: Record<string, PageData>;
}

const DEFAULT_PAGE_ID = 'page-default-1';
const DEFAULT_NOTEBOOK_ID = 'nb-main';

const INITIAL_NOTEBOOKS: Notebook[] = [
  {
    id: DEFAULT_NOTEBOOK_ID,
    name: 'My Notebook',
    subject: 'General',
    color: '#F43F5E',
    pageIds: [DEFAULT_PAGE_ID],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

const INITIAL_PAGES: Record<string, PageData> = {
  [DEFAULT_PAGE_ID]: {
    id: DEFAULT_PAGE_ID,
    title: 'Untitled Note',
    notebookId: DEFAULT_NOTEBOOK_ID,
    themeId: 'cream',
    paperStyle: 'grid',
    objects: [],
    viewport: { x: 100, y: 80, scale: 1.0 },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
};

class NotebookStore {
  private state: NotebookState;
  private listeners = new Set<() => void>();
  private isSyncing = false;
  private saveTimeout: number | null = null;

  constructor() {
    this.state = this.loadFromStorage() || {
      notebooks: INITIAL_NOTEBOOKS,
      activeNotebookId: DEFAULT_NOTEBOOK_ID,
      activePageId: DEFAULT_PAGE_ID,
      pages: INITIAL_PAGES,
    };

    // Hydrate canvas and theme from the restored active page
    this.hydrateStoresFromActivePage();

    // Setup auto-synchronization
    this.setupAutoSync();
  }

  private loadFromStorage(): NotebookState | null {
    try {
      // Clean up legacy storage if present
      localStorage.removeItem('whiteboard_notebooks_v1');
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed && parsed.notebooks && parsed.notebooks.length > 0 && parsed.activePageId && parsed.pages) {
          // Ensure active page actually exists in pages dictionary
          if (parsed.pages[parsed.activePageId]) {
            return parsed;
          } else {
            const firstKey = Object.keys(parsed.pages)[0];
            if (firstKey) {
              parsed.activePageId = firstKey;
              return parsed;
            }
          }
        }
      }
    } catch {
      // Storage unavailable or corrupted
    }
    return null;
  }

  private hydrateStoresFromActivePage() {
    this.isSyncing = true;
    try {
      const activePage = this.state.pages[this.state.activePageId];
      if (activePage) {
        if (activePage.objects) {
          canvasStore.setObjects(activePage.objects, false);
        }
        if (activePage.viewport) {
          canvasStore.setTransform(activePage.viewport);
        }
        if (activePage.themeId) {
          themeStore.setTheme(activePage.themeId);
        }
        if (activePage.paperStyle) {
          themeStore.setPaperStyle(activePage.paperStyle);
        }
      }
    } finally {
      this.isSyncing = false;
    }
  }

  private setupAutoSync() {
    // 1. Listen to canvas changes (objects, zoom, pan)
    canvasStore.subscribe(() => {
      if (this.isSyncing) return;
      const cState = canvasStore.getState();
      const page = this.state.pages[this.state.activePageId];
      if (page) {
        page.objects = cState.objects;
        page.viewport = cState.transform;
        page.updatedAt = Date.now();
        this.scheduleSave();
      }
    });

    // 2. Listen to theme / paper style changes
    themeStore.subscribe(() => {
      if (this.isSyncing) return;
      const tState = themeStore.getState();
      const page = this.state.pages[this.state.activePageId];
      if (page) {
        page.themeId = tState.themeId;
        page.paperStyle = tState.paperStyle;
        page.updatedAt = Date.now();
        this.scheduleSave();
      }
    });

    // 3. Flush to localStorage on unload (page refresh, tab close)
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.flush();
      });
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this.flush();
        }
      });
    }
  }

  private scheduleSave() {
    if (this.saveTimeout !== null) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = window.setTimeout(() => {
      this.saveTimeout = null;
      this.saveToStorage();
    }, 200);
  }

  public flush() {
    if (this.saveTimeout !== null) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = null;
    }
    const page = this.state.pages[this.state.activePageId];
    if (page) {
      const cState = canvasStore.getState();
      page.objects = cState.objects;
      page.viewport = cState.transform;
      page.themeId = themeStore.getState().themeId;
      page.paperStyle = themeStore.getState().paperStyle;
      page.updatedAt = Date.now();
    }
    this.saveToStorage();
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // Quota exceeded or error
    }
  }

  getState(): NotebookState {
    return this.state;
  }

  private emit() {
    this.saveToStorage();
    this.listeners.forEach((l) => l());
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  saveCurrentPage(objects: CanvasObject[]) {
    const page = this.state.pages[this.state.activePageId];
    if (page) {
      page.objects = objects;
      page.viewport = canvasStore.getState().transform;
      page.themeId = themeStore.getState().themeId;
      page.paperStyle = themeStore.getState().paperStyle;
      page.updatedAt = Date.now();
      this.emit();
    }
  }

  switchPage(pageId: string) {
    // Save active page first
    this.flush();

    const targetPage = this.state.pages[pageId];
    if (targetPage) {
      this.state.activePageId = pageId;
      this.state.activeNotebookId = targetPage.notebookId;

      this.isSyncing = true;
      try {
        canvasStore.setObjects(targetPage.objects || [], false);
        if (targetPage.viewport) {
          canvasStore.setTransform(targetPage.viewport);
        }
        if (targetPage.themeId) {
          themeStore.setTheme(targetPage.themeId);
        }
        if (targetPage.paperStyle) {
          themeStore.setPaperStyle(targetPage.paperStyle);
        }
      } finally {
        this.isSyncing = false;
      }

      this.emit();
    }
  }

  createPage(notebookId: string, title = 'New Note'): string {
    const newId = `page-${Date.now()}`;
    const newPage: PageData = {
      id: newId,
      title,
      notebookId,
      themeId: themeStore.getState().themeId,
      paperStyle: themeStore.getState().paperStyle,
      objects: [],
      viewport: { x: 100, y: 80, scale: 1.0 },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.state.pages[newId] = newPage;
    const nb = this.state.notebooks.find((n) => n.id === notebookId);
    if (nb) {
      nb.pageIds.push(newId);
      nb.updatedAt = Date.now();
    }

    this.emit();
    this.switchPage(newId);
    return newId;
  }

  deletePage(pageId: string) {
    const page = this.state.pages[pageId];
    if (!page) return;

    const nb = this.state.notebooks.find((n) => n.id === page.notebookId);
    if (nb) {
      nb.pageIds = nb.pageIds.filter((id) => id !== pageId);
      nb.updatedAt = Date.now();
    }

    delete this.state.pages[pageId];

    if (this.state.activePageId === pageId) {
      // Find another page in same notebook or first notebook
      const otherPageId = nb?.pageIds[0] || Object.keys(this.state.pages)[0];
      if (otherPageId) {
        this.switchPage(otherPageId);
      } else {
        // Create an empty fallback page
        this.createPage(this.state.activeNotebookId || DEFAULT_NOTEBOOK_ID);
      }
    } else {
      this.emit();
    }
  }

  createNotebook(
    name: string,
    subject: 'Biology' | 'Physics' | 'Chemistry' | 'Mathematics' | 'General' = 'General',
    color = '#F43F5E'
  ): string {
    const newId = `nb-${Date.now()}`;
    const firstPageId = `page-${Date.now()}`;

    const newPage: PageData = {
      id: firstPageId,
      title: `${name} - Page 1`,
      notebookId: newId,
      themeId: themeStore.getState().themeId,
      paperStyle: themeStore.getState().paperStyle,
      objects: [],
      viewport: { x: 100, y: 80, scale: 1.0 },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const newNotebook: Notebook = {
      id: newId,
      name,
      subject,
      color,
      pageIds: [firstPageId],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.state.notebooks.push(newNotebook);
    this.state.pages[firstPageId] = newPage;
    this.emit();
    this.switchPage(firstPageId);
    return newId;
  }

  deleteNotebook(notebookId: string) {
    if (this.state.notebooks.length <= 1) return; // Keep at least one

    const nb = this.state.notebooks.find((n) => n.id === notebookId);
    if (nb) {
      nb.pageIds.forEach((pid) => {
        delete this.state.pages[pid];
      });
    }

    this.state.notebooks = this.state.notebooks.filter((n) => n.id !== notebookId);

    if (this.state.activeNotebookId === notebookId) {
      const firstNb = this.state.notebooks[0];
      if (firstNb && firstNb.pageIds[0]) {
        this.switchPage(firstNb.pageIds[0]);
      }
    } else {
      this.emit();
    }
  }

  updatePageTitle(pageId: string, title: string) {
    const page = this.state.pages[pageId];
    if (page) {
      page.title = title;
      page.updatedAt = Date.now();
      this.emit();
    }
  }
}

export const notebookStore = new NotebookStore();

export function useNotebookStore(): NotebookState {
  const [state, setState] = useState(notebookStore.getState());

  useEffect(() => {
    return notebookStore.subscribe(() => {
      setState({ ...notebookStore.getState() });
    });
  }, []);

  return state;
}
