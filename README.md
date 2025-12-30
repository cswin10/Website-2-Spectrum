# Spectrum

An interactive color exploration playground where users create living, breathing gradient compositions.

## Features

- **Full-Screen Gradient Canvas** - The entire viewport is the canvas with mesh gradient interpolation
- **Color Nodes** - Click anywhere to place nodes, drag to reposition, click to change color, double-click to delete
- **Mouse Trail Effect** - Cursor leaves a trail of fading particles that sample colors from the gradient
- **Ambient Animation** - Gentle node drift and breathing animation keeps the gradient alive
- **Palette Panel** - View and copy colors from your composition
- **Export Functionality** - Export your palette in HEX, RGB, CSS Variables, or Tailwind config format

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Controls

| Action | Result |
|--------|--------|
| Click empty space | Add new node at that position |
| Click existing node | Open color picker for that node |
| Double-click node | Delete that node |
| Drag node | Reposition node, gradient updates live |
| Mouse move | Trail particles follow cursor |
| Click palette swatch | Copy HEX to clipboard |
| Click export | Open export modal |
| Randomize button | Generate new random nodes and colors |
| Clear button | Reset to default nodes |
| Trail toggle | Turn mouse trail on/off |

## Tech Stack

- React 19
- Vite
- Canvas API for rendering
