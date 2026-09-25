export type ToolType =
  | 'select'
  | 'lasso'
  | 'pen'
  | 'pencil'
  | 'marker'
  | 'highlighter'
  | 'brush'
  | 'eraser'
  | 'text'
  | 'shape'
  | 'arrow'
  | 'line'
  | 'equation'
  | 'table'
  | 'graph'
  | 'pan';

export type ShapeType = 'rectangle' | 'ellipse' | 'triangle' | 'callout' | 'sticky' | 'star';

export type PaperStyleId =
  | 'plain'
  | 'grid'
  | 'small-grid'
  | 'dots'
  | 'ruled'
  | 'engineering'
  | 'graph-paper'
  | 'dark-grid';

export type BoardThemeId =
  | 'white'
  | 'cream'
  | 'warm-paper'
  | 'light-beige'
  | 'peach'
  | 'pale-pink'
  | 'pale-blue'
  | 'pale-green'
  | 'sage'
  | 'lavender'
  | 'dark-graphite'
  | 'dark-rose'
  | 'blackboard';

export interface BoardTheme {
  id: BoardThemeId;
  name: string;
  bg: string;
  isDark: boolean;
  gridColor: string;
  defaultInkColor: string;
  secondaryInkColor: string;
  accentColors: {
    blue: string;
    red: string;
    green: string;
    purple: string;
    orange: string;
    yellow: string;
    graphite: string;
  };
}

export interface StrokePoint {
  x: number;
  y: number;
  pressure?: number;
  tiltX?: number;
  tiltY?: number;
  time?: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TransformState {
  x: number;
  y: number;
  scale: number;
}

export interface BaseCanvasObject {
  id: string;
  type: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  zIndex: number;
  createdAt: number;
  updatedAt: number;
  isSelected?: boolean;
  isLocked?: boolean;
  groupId?: string;
  semanticContext?: string;
}

export interface StrokeObjectData extends BaseCanvasObject {
  type: 'stroke';
  tool: 'pen' | 'pencil' | 'marker' | 'highlighter' | 'brush';
  points: StrokePoint[];
  color: string;
  size: number;
  opacity: number;
  pathData?: string; // Precomputed SVG path
  recognizedText?: string; // Semantic handwriting recognition layer
}

export interface TextObjectData extends BaseCanvasObject {
  type: 'text';
  text: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  isHandwrittenStyle: boolean;
  alignment: 'left' | 'center' | 'right';
  bold?: boolean;
  italic?: boolean;
  cardBgColor?: string;
  cardBorderColor?: string;
  cardAccentColor?: string;
  cardTitle?: string;
  cardIcon?: string;
}

export interface ShapeObjectData extends BaseCanvasObject {
  type: 'shape';
  shapeType: ShapeType;
  width: number;
  height: number;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  strokeStyle: 'solid' | 'dashed' | 'hand-drawn';
  text?: string;
}

export interface ArrowObjectData extends BaseCanvasObject {
  type: 'arrow' | 'line';
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  width: number;
  arrowHead: 'none' | 'end' | 'both';
  isCurved?: boolean;
  controlPoint?: { x: number; y: number };
  label?: string;
}

export interface EquationObjectData extends BaseCanvasObject {
  type: 'equation';
  latex: string;
  rawText?: string;
  fontSize: number;
  color: string;
  explanation?: string;
  isDerived?: boolean;
}

export interface TableColumn {
  id: string;
  header: string;
  width?: number;
}

export interface TableObjectData extends BaseCanvasObject {
  type: 'table';
  title?: string;
  columns: TableColumn[];
  rows: string[][];
  color: string;
  borderColor: string;
  bgColor?: string;
  isHandwrittenStyle: boolean;
}

export interface GraphDataset {
  label: string;
  color: string;
  formula?: string;
  points?: { x: number; y: number }[];
  isDotted?: boolean;
}

export interface GraphObjectData extends BaseCanvasObject {
  type: 'graph';
  title: string;
  xLabel: string;
  yLabel: string;
  xRange: [number, number];
  yRange: [number, number];
  datasets: GraphDataset[];
  annotations?: { x: number; y: number; text: string }[];
  equations?: string[];
  width: number;
  height: number;
}

export interface DiagramComponent {
  id: string;
  name: string;
  type: string;
  path: string; // SVG path data or shape descriptor
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity?: number;
  layer?: 'back' | 'base' | 'internal' | 'vessel' | 'detail' | 'front';
  oxygenated?: boolean; // For anatomical/biological color coding
  notes?: string;
}

export interface DiagramLabel {
  id: string;
  targetComponentId?: string;
  targetPoint?: { x: number; y: number }; // Relative to diagram (x, y)
  labelPoint?: { x: number; y: number };
  text: string;
  description?: string;
  color?: string;
  bgColor?: string;
  side?: 'left' | 'right' | 'top' | 'bottom';
  leaderLineStyle?: 'straight' | 'elbow' | 'curved';
  isKeyFact?: boolean;
  x?: number;
  y?: number;
  targetX?: number;
  targetY?: number;
  fontSize?: number;
  isBold?: boolean;
}

export interface DiagramFlowArrow {
  id: string;
  points: { x: number; y: number }[];
  color: string;
  label?: string;
  type?: 'oxygenated' | 'deoxygenated' | 'signal' | 'filtration' | 'velocity';
  isDotted?: boolean;
}

export interface DiagramCallout {
  id: string;
  x: number;
  y: number;
  title: string;
  content: string;
  type?: 'fact' | 'clinical' | 'formula' | 'legend' | 'note';
  color?: string;
  width?: number;
  height?: number;
  style?: string;
}

export interface DiagramObjectData extends BaseCanvasObject {
  type: 'diagram';
  subject: string;
  title: string;
  subtitle?: string;
  width: number;
  height: number;
  components: DiagramComponent[];
  labels: DiagramLabel[];
  arrows: DiagramFlowArrow[];
  callouts: DiagramCallout[];
  legend?: { label: string; color: string; description?: string }[];
  style: 'hand_drawn_scientific' | 'vector_clean';
}

export interface FlashcardObjectData extends BaseCanvasObject {
  type: 'flashcard';
  question: string;
  answer: string;
  hint?: string;
  subject?: string;
  isFlipped: boolean;
  isAnswerRevealed?: boolean;
  userScore?: 'easy' | 'medium' | 'hard' | null;
}

export type CanvasObject =
  | StrokeObjectData
  | TextObjectData
  | ShapeObjectData
  | ArrowObjectData
  | EquationObjectData
  | TableObjectData
  | GraphObjectData
  | DiagramObjectData
  | FlashcardObjectData;
