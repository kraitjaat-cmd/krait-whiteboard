import type { CanvasObject, DiagramObjectData, TextObjectData, DiagramComponent } from '../types/canvas';
import { secretApologyStore } from '../store/secretApologyStore';

/**
 * Creates the vector hand-drawn botanical floral illustration diagram.
 */
export function createHandDrawnFlowerDiagram(
  x: number,
  y: number,
  isDark: boolean
): DiagramObjectData {
  const width = 640;
  const height = 580;

  // Romantic floral colors
  const roseDeep = '#e11d48';
  const roseMid = '#f43f5e';
  const roseSoft = '#fb7185';
  const roseBlush = '#fda4af';
  const leafDark = '#15803d';
  const leafMid = '#22c55e';
  const leafSoft = '#86efac';
  const goldAcc = '#f59e0b';
  const stemColor = isDark ? '#4ade80' : '#16a34a';

  const rawPaths = [
    // 1. Decorative curved vine stems framing the scene
    {
      id: 'stem-main-left',
      name: 'Left Vine Stem',
      type: 'path',
      path: 'M 120 540 C 90 400, 100 240, 180 140 C 220 90, 290 80, 340 100',
      stroke: stemColor,
      strokeWidth: 4.5,
      fill: 'none',
    },
    {
      id: 'stem-main-right',
      name: 'Right Vine Stem',
      type: 'path',
      path: 'M 520 540 C 550 410, 530 250, 460 140 C 420 80, 350 80, 310 100',
      stroke: stemColor,
      strokeWidth: 4.5,
      fill: 'none',
    },
    {
      id: 'stem-curly-branch-1',
      name: 'Left Twig',
      type: 'path',
      path: 'M 140 320 C 70 300, 50 220, 90 170 C 120 140, 160 180, 130 210',
      stroke: stemColor,
      strokeWidth: 2.8,
      fill: 'none',
    },
    {
      id: 'stem-curly-branch-2',
      name: 'Right Twig',
      type: 'path',
      path: 'M 500 320 C 570 300, 590 220, 550 170 C 520 140, 480 180, 510 210',
      stroke: stemColor,
      strokeWidth: 2.8,
      fill: 'none',
    },

    // 2. Botanical Green Leaves
    {
      id: 'leaf-1',
      name: 'Leaf Left',
      type: 'path',
      path: 'M 135 280 Q 90 250 85 210 Q 130 230 140 270 Z',
      fill: leafMid,
      stroke: leafDark,
      strokeWidth: 2,
    },
    {
      id: 'leaf-2',
      name: 'Leaf Lower Left',
      type: 'path',
      path: 'M 155 380 Q 100 370 80 330 Q 130 325 160 370 Z',
      fill: leafSoft,
      stroke: leafDark,
      strokeWidth: 2,
    },
    {
      id: 'leaf-3',
      name: 'Leaf Right',
      type: 'path',
      path: 'M 505 280 Q 550 250 555 210 Q 510 230 500 270 Z',
      fill: leafMid,
      stroke: leafDark,
      strokeWidth: 2,
    },
    {
      id: 'leaf-4',
      name: 'Leaf Lower Right',
      type: 'path',
      path: 'M 485 380 Q 540 370 560 330 Q 510 325 480 370 Z',
      fill: leafSoft,
      stroke: leafDark,
      strokeWidth: 2,
    },
    {
      id: 'leaf-5',
      name: 'Leaf Top Left',
      type: 'path',
      path: 'M 240 100 Q 230 40 270 30 Q 280 80 245 105 Z',
      fill: leafMid,
      stroke: leafDark,
      strokeWidth: 2,
    },
    {
      id: 'leaf-6',
      name: 'Leaf Top Right',
      type: 'path',
      path: 'M 400 100 Q 410 40 370 30 Q 360 80 395 105 Z',
      fill: leafMid,
      stroke: leafDark,
      strokeWidth: 2,
    },

    // 3. Centerpiece Blooming Rose (Top Center)
    {
      id: 'rose-center-outer-1',
      name: 'Rose Outer Petals',
      type: 'path',
      path: 'M 280 100 C 260 50, 380 50, 360 100 C 390 140, 250 140, 280 100 Z',
      fill: roseSoft,
      stroke: roseDeep,
      strokeWidth: 2.5,
    },
    {
      id: 'rose-center-outer-2',
      name: 'Rose Mid Petals',
      type: 'path',
      path: 'M 290 85 C 275 60, 365 60, 350 85 C 370 120, 270 120, 290 85 Z',
      fill: roseMid,
      stroke: roseDeep,
      strokeWidth: 2,
    },
    {
      id: 'rose-center-inner-1',
      name: 'Rose Inner Spiral',
      type: 'path',
      path: 'M 305 90 C 300 75, 340 75, 335 90 C 345 110, 295 110, 305 90 Z',
      fill: roseDeep,
      stroke: '#9f1239',
      strokeWidth: 2,
    },
    {
      id: 'rose-center-core',
      name: 'Rose Center Core',
      type: 'path',
      path: 'M 315 90 C 310 82, 330 82, 325 90 C 330 98, 310 98, 315 90 Z',
      fill: '#ffe4e6',
      stroke: '#be123c',
      strokeWidth: 1.5,
    },

    // 4. Left Hand-Drawn Rose (Medium Bloom)
    {
      id: 'rose-left-outer',
      name: 'Left Rose Bloom',
      type: 'path',
      path: 'M 150 170 C 130 130, 220 130, 200 170 C 220 200, 130 200, 150 170 Z',
      fill: roseBlush,
      stroke: roseDeep,
      strokeWidth: 2,
    },
    {
      id: 'rose-left-inner',
      name: 'Left Rose Petals',
      type: 'path',
      path: 'M 165 165 C 150 145, 205 145, 190 165 C 200 185, 155 185, 165 165 Z',
      fill: roseMid,
      stroke: roseDeep,
      strokeWidth: 1.8,
    },
    {
      id: 'rose-left-center',
      name: 'Left Rose Center',
      type: 'path',
      path: 'M 175 165 C 170 155, 185 155, 180 165 C 185 172, 170 172, 175 165 Z',
      fill: '#fff1f2',
      stroke: '#e11d48',
      strokeWidth: 1.2,
    },

    // 5. Right Hand-Drawn Rose (Medium Bloom)
    {
      id: 'rose-right-outer',
      name: 'Right Rose Bloom',
      type: 'path',
      path: 'M 490 170 C 470 130, 560 130, 540 170 C 560 200, 470 200, 490 170 Z',
      fill: roseBlush,
      stroke: roseDeep,
      strokeWidth: 2,
    },
    {
      id: 'rose-right-inner',
      name: 'Right Rose Petals',
      type: 'path',
      path: 'M 505 165 C 490 145, 545 145, 530 165 C 540 185, 495 185, 505 165 Z',
      fill: roseMid,
      stroke: roseDeep,
      strokeWidth: 1.8,
    },
    {
      id: 'rose-right-center',
      name: 'Right Rose Center',
      type: 'path',
      path: 'M 515 165 C 510 155, 525 155, 520 165 C 525 172, 510 172, 515 165 Z',
      fill: '#fff1f2',
      stroke: '#e11d48',
      strokeWidth: 1.2,
    },

    // 6. Cherry Blossoms / Little Flowers with Golden Centers
    {
      id: 'blossom-1-p1',
      name: 'Blossom 1 Petal A',
      type: 'path',
      path: 'M 120 420 Q 95 400 120 380 Q 145 400 120 420 Z',
      fill: '#fbcfe8',
      stroke: '#f43f5e',
      strokeWidth: 1.5,
    },
    {
      id: 'blossom-1-p2',
      name: 'Blossom 1 Petal B',
      type: 'path',
      path: 'M 120 400 Q 140 375 160 400 Q 140 425 120 400 Z',
      fill: '#fbcfe8',
      stroke: '#f43f5e',
      strokeWidth: 1.5,
    },
    {
      id: 'blossom-1-core',
      name: 'Blossom 1 Gold Core',
      type: 'path',
      path: 'M 120 400 m -5 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0',
      fill: goldAcc,
      stroke: '#d97706',
      strokeWidth: 1.5,
    },

    {
      id: 'blossom-2-p1',
      name: 'Blossom 2 Petal A',
      type: 'path',
      path: 'M 520 420 Q 495 400 520 380 Q 545 400 520 420 Z',
      fill: '#fbcfe8',
      stroke: '#f43f5e',
      strokeWidth: 1.5,
    },
    {
      id: 'blossom-2-p2',
      name: 'Blossom 2 Petal B',
      type: 'path',
      path: 'M 520 400 Q 540 375 560 400 Q 540 425 520 400 Z',
      fill: '#fbcfe8',
      stroke: '#f43f5e',
      strokeWidth: 1.5,
    },
    {
      id: 'blossom-2-core',
      name: 'Blossom 2 Gold Core',
      type: 'path',
      path: 'M 520 400 m -5 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0',
      fill: goldAcc,
      stroke: '#d97706',
      strokeWidth: 1.5,
    },

    // 7. Drifting Rose Petals scattered gracefully
    {
      id: 'petal-scatter-1',
      name: 'Floating Petal 1',
      type: 'path',
      path: 'M 220 230 C 200 215, 230 190, 245 205 C 255 220, 235 240, 220 230 Z',
      fill: roseSoft,
      stroke: roseDeep,
      strokeWidth: 1.2,
    },
    {
      id: 'petal-scatter-2',
      name: 'Floating Petal 2',
      type: 'path',
      path: 'M 420 230 C 440 215, 410 190, 395 205 C 385 220, 405 240, 420 230 Z',
      fill: roseSoft,
      stroke: roseDeep,
      strokeWidth: 1.2,
    },
    {
      id: 'petal-scatter-3',
      name: 'Floating Petal 3',
      type: 'path',
      path: 'M 180 340 C 165 330, 190 310, 200 320 C 210 335, 195 350, 180 340 Z',
      fill: roseBlush,
      stroke: roseMid,
      strokeWidth: 1.2,
    },
    {
      id: 'petal-scatter-4',
      name: 'Floating Petal 4',
      type: 'path',
      path: 'M 460 340 C 475 330, 450 310, 440 320 C 430 335, 445 350, 460 340 Z',
      fill: roseBlush,
      stroke: roseMid,
      strokeWidth: 1.2,
    },
    {
      id: 'petal-scatter-5',
      name: 'Floating Petal 5',
      type: 'path',
      path: 'M 320 500 C 300 485, 335 460, 345 475 C 355 490, 335 510, 320 500 Z',
      fill: '#f43f5e',
      stroke: '#e11d48',
      strokeWidth: 1.2,
    },
  ];

  const components: DiagramComponent[] = rawPaths.map((p) => ({
    id: p.id,
    name: p.name,
    type: p.type,
    path: p.path,
    fill: p.fill,
    stroke: p.stroke,
    strokeWidth: p.strokeWidth,
  }));

  return {
    id: `flower-bouquet-${Date.now()}`,
    type: 'diagram',
    x,
    y,
    width,
    height,
    zIndex: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    title: '🌸 Hand-Drawn Blooming Roses & Floral Vines',
    subject: 'Hand-drawn Botanical Flowers',
    subtitle: 'Delicate hand-illustrated botanical roses, cherry blossoms, and leafy vines.',
    components,
    labels: [
      {
        id: 'lbl-rose-crown',
        text: 'Blooming Rose Garlands',
        x: 320,
        y: 35,
        fontSize: 15,
        isBold: true,
        color: isDark ? '#fda4af' : '#e11d48',
      },
      {
        id: 'lbl-floral-symbol',
        text: 'With Love & Sincerity',
        x: 320,
        y: 545,
        fontSize: 14,
        isBold: true,
        color: isDark ? '#fbcfe8' : '#be123c',
      },
    ],
    arrows: [],
    callouts: [],
    style: 'hand_drawn_scientific',
  };
}

/**
 * Generates the full Apology Experience canvas objects (Parchment letter + Botanical Art + Dedication).
 */
export function generateSecretApologyCanvasObjects(
  startX: number = 80,
  startY: number = 60,
  isDark: boolean = false
): CanvasObject[] {
  const config = secretApologyStore.getState();
  const now = Date.now();
  const objects: CanvasObject[] = [];

  const recipient = config.recipientName || 'Akansha';
  const sender = config.senderName || 'Forever Here';
  const title = config.title || 'All The Words I Never Got To Say 🌸';
  const content = config.letterContent;

  // 1. The Handwritten Apology Parchment Letter Card (Width: 720, Height: 1180)
  const letterCardBg = isDark ? 'rgba(28, 18, 26, 0.98)' : 'rgba(255, 250, 252, 0.99)';
  const letterBorder = isDark ? 'rgba(244, 63, 94, 0.5)' : 'rgba(251, 113, 133, 0.65)';
  const letterAccent = '#f43f5e';
  const letterTextColor = isDark ? '#fff1f2' : '#3b0712';

  const fullLetterText = `Dear ${recipient},\n\n${content}\n\n— ${sender} ❤️`;

  const letterCard: TextObjectData = {
    id: `apology-letter-${now}`,
    type: 'text',
    x: startX,
    y: startY,
    width: 740,
    height: 1240,
    text: fullLetterText,
    fontFamily: 'Caveat, cursive',
    fontSize: 21,
    color: letterTextColor,
    isHandwrittenStyle: true,
    alignment: 'left',
    cardBgColor: letterCardBg,
    cardBorderColor: letterBorder,
    cardAccentColor: letterAccent,
    cardTitle: `💌 ${title}`,
    cardIcon: '🌸',
    zIndex: 2,
    createdAt: now,
    updatedAt: now,
  };
  objects.push(letterCard);

  // 2. Hand-Drawn Floral Botanical Art Placed Right Beside the Letter (Width: 640, Height: 580)
  const flowerDiagramTop = createHandDrawnFlowerDiagram(startX + 780, startY + 20, isDark);
  objects.push(flowerDiagramTop);

  // 3. Heartfelt Dedication & Quote Banner Placed Below the Flowers (Width: 640, Height: 180)
  const quoteBg = isDark ? 'rgba(38, 20, 32, 0.95)' : 'rgba(255, 241, 242, 0.96)';
  const quoteBorder = isDark ? 'rgba(244, 63, 94, 0.35)' : 'rgba(244, 63, 94, 0.4)';

  const quoteBanner: TextObjectData = {
    id: `apology-quote-${now + 1}`,
    type: 'text',
    x: startX + 780,
    y: startY + 630,
    width: 640,
    height: 240,
    text: `"If I had one wish, I would just give you my eyes for a single second so you could finally see yourself the way I do.\n\nMaybe then you would understand why you mean so much, and why a broken part of me will always be grateful that the universe threw you into my path."\n\n✨ Click the music player at the bottom-right to listen.`,
    fontFamily: 'Patrick Hand, cursive',
    fontSize: 17,
    color: isDark ? '#fda4af' : '#881337',
    isHandwrittenStyle: true,
    alignment: 'center',
    cardBgColor: quoteBg,
    cardBorderColor: quoteBorder,
    cardAccentColor: '#fb7185',
    cardTitle: '💖 For Akansha',
    cardIcon: '✨',
    zIndex: 3,
    createdAt: now,
    updatedAt: now,
  };
  objects.push(quoteBanner);

  return objects;
}
