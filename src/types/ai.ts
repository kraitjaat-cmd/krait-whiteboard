import type { CanvasObject } from './canvas';

export type AICommandType =
  | 'explain'
  | 'solve'
  | 'research'
  | 'summarize'
  | 'expand'
  | 'simplify'
  | 'draw_diagram'
  | 'draw_scientific'
  | 'make_graph'
  | 'make_table'
  | 'create_notes'
  | 'create_flashcards'
  | 'quiz_me'
  | 'give_examples'
  | 'compare'
  | 'derive_equation'
  | 'find_mistake'
  | 'continue_notes';

export interface AICommandPayload {
  command: AICommandType;
  query?: string;
  selectedObjects?: CanvasObject[];
  canvasContext?: {
    nearbyText?: string[];
    currentSubject?: string;
    themeIsDark?: boolean;
    centerPosition: { x: number; y: number };
  };
}

export interface AIResponseAction {
  canvas_action:
    | 'create_diagram'
    | 'create_equation'
    | 'create_graph'
    | 'create_table'
    | 'create_text'
    | 'create_flashcards'
    | 'annotate_selection'
    | 'batch_create';
  subject?: string;
  style?: string;
  objects: CanvasObject[];
  explanation?: string;
  sources?: { title: string; url?: string; snippet?: string }[];
}
