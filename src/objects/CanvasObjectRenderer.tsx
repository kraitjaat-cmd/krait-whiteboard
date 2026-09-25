import React from 'react';
import type { CanvasObject } from '../types/canvas';
import { DiagramObject } from './DiagramObject';
import { EquationObject } from './EquationObject';
import { FlashcardObject } from './FlashcardObject';
import { GraphObject } from './GraphObject';
import { ShapeObject } from './ShapeObject';
import { StrokeObject } from './StrokeObject';
import { TableObject } from './TableObject';
import { TextObject } from './TextObject';

interface Props {
  object: CanvasObject;
  isSelected?: boolean;
}

export const CanvasObjectRenderer: React.FC<Props> = React.memo(({ object }) => {
  if (!object || !object.type) return null;

  try {
    switch (object.type) {
      case 'stroke':
        return <StrokeObject object={object} />;
      case 'text':
        return <TextObject object={object} />;
      case 'shape':
        return <ShapeObject object={object} />;
      case 'equation':
        return <EquationObject object={object} />;
      case 'table':
        return <TableObject object={object} />;
      case 'graph':
        return <GraphObject object={object} />;
      case 'diagram':
        return <DiagramObject object={object} />;
      case 'flashcard':
        return <FlashcardObject object={object} />;
      default:
        return null;
    }
  } catch (err) {
    console.error('CanvasObjectRenderer caught render error on object:', object.id, err);
    return null;
  }
});
