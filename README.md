# ⚡ KRAIT — AI-Powered Infinite Study Whiteboard

**KRAIT** is an infinite digital whiteboard and digital notebook optimized for pen tablets, stylus hardware, and AI-assisted scientific study. Built with React, TypeScript, Vite, Tailwind CSS, and vector graphics.

---

## ✨ Features

- **Infinite Vector Canvas**: Seamless pan & zoom navigation with gesture/wheel support and coordinate isolation.
- **Pressure-Sensitive Freehand Inking**: Fountain pen, graphite pencil, marker, art brush, and highlighter powered by `perfect-freehand`.
- **Polygon Lasso & Multi-Object Dragging**: Select any object or group of freehand strokes, text cards, equations, or diagrams and drag them anywhere across the canvas.
- **Clean Selection System**: Rose-accented selection bounds with corner grip points and floating action pills.
- **AI Scientific Vector Illustrator & Math Engine**:
  - Direct natural language generation for scientific diagrams, anatomical models, physics systems, and circuits.
  - Formulates LaTeX equations with mathematical step breakdowns (e.g., Mean Deviation, Schrödinger equation, Bayes Theorem, Kinematics).
  - Generates structured comparison tables and scientific function graphs.
  - Interactive self-study flashcards.
- **AI Literature Research**: Evidence-based scientific concept exploration with key findings and academic citations.
- **Custom Board Themes & Ruling Patterns**: Cream Paper, Dark Blackboard, Blueprint, Midnight, and Dark Rose with grid, dot, ruled, and engineering graph overlays.
- **Multi-Notebook & Chapter Hierarchy**: Organize work across notebooks, chapters, and pages.
- **Neumorphic Soft UI**: Modern neumorphic aesthetic with dark pink and crimson accents.
- **Export Capabilities**: High-resolution PNG snapshot export and JSON notebook backup.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` or `yarn` or `pnpm`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/krait-whiteboard.git

# 2. Navigate to the project directory
cd krait-whiteboard

# 3. Install dependencies
npm install
```

### Running Locally

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

### Building for Production

```bash
npm run build
```

The production assets will be built into the `dist/` directory.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom Neumorphic Design System
- **Stroke Engine**: [`perfect-freehand`](https://github.com/steveruizok/perfect-freehand)
- **Math Rendering**: [KaTeX](https://katex.org/)
- **Typography**: Kalam, Caveat, JetBrains Mono, Inter

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
