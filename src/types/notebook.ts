import type { BoardThemeId, CanvasObject, PaperStyleId } from './canvas';

export interface PageData {
  id: string;
  title: string;
  notebookId: string;
  themeId: BoardThemeId;
  paperStyle: PaperStyleId;
  objects: CanvasObject[];
  viewport: {
    x: number;
    y: number;
    scale: number;
  };
  createdAt: number;
  updatedAt: number;
}

export interface Notebook {
  id: string;
  name: string;
  subject: 'Biology' | 'Physics' | 'Chemistry' | 'Mathematics' | 'General';
  color: string;
  icon?: string;
  pageIds: string[];
  createdAt: number;
  updatedAt: number;
}
