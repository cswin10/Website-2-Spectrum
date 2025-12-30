// Gradient generation utilities

export function generateGradientCSS(config) {
  const { type, angle, stops, position } = config;

  const colorStops = stops
    .sort((a, b) => a.position - b.position)
    .map(stop => `${stop.color} ${stop.position}%`)
    .join(', ');

  switch (type) {
    case 'linear':
      return `linear-gradient(${angle}deg, ${colorStops})`;
    case 'radial':
      return `radial-gradient(circle at ${position.x}% ${position.y}%, ${colorStops})`;
    case 'conic':
      return `conic-gradient(from ${angle}deg at ${position.x}% ${position.y}%, ${colorStops})`;
    default:
      return `linear-gradient(${angle}deg, ${colorStops})`;
  }
}

export function generateFullCSS(config) {
  const gradient = generateGradientCSS(config);
  return `background: ${gradient};`;
}

// Curated preset gradients
export const presets = [
  {
    name: 'Sunset',
    type: 'linear',
    angle: 135,
    position: { x: 50, y: 50 },
    stops: [
      { id: 1, color: '#ff6b6b', position: 0 },
      { id: 2, color: '#feca57', position: 50 },
      { id: 3, color: '#ff9ff3', position: 100 }
    ]
  },
  {
    name: 'Ocean',
    type: 'linear',
    angle: 180,
    position: { x: 50, y: 50 },
    stops: [
      { id: 1, color: '#667eea', position: 0 },
      { id: 2, color: '#764ba2', position: 100 }
    ]
  },
  {
    name: 'Aurora',
    type: 'linear',
    angle: 135,
    position: { x: 50, y: 50 },
    stops: [
      { id: 1, color: '#00d2ff', position: 0 },
      { id: 2, color: '#3a7bd5', position: 50 },
      { id: 3, color: '#6441A5', position: 100 }
    ]
  },
  {
    name: 'Peach',
    type: 'linear',
    angle: 90,
    position: { x: 50, y: 50 },
    stops: [
      { id: 1, color: '#ee9ca7', position: 0 },
      { id: 2, color: '#ffdde1', position: 100 }
    ]
  },
  {
    name: 'Midnight',
    type: 'linear',
    angle: 180,
    position: { x: 50, y: 50 },
    stops: [
      { id: 1, color: '#0f0c29', position: 0 },
      { id: 2, color: '#302b63', position: 50 },
      { id: 3, color: '#24243e', position: 100 }
    ]
  },
  {
    name: 'Flame',
    type: 'radial',
    angle: 0,
    position: { x: 50, y: 50 },
    stops: [
      { id: 1, color: '#f12711', position: 0 },
      { id: 2, color: '#f5af19', position: 100 }
    ]
  },
  {
    name: 'Forest',
    type: 'linear',
    angle: 160,
    position: { x: 50, y: 50 },
    stops: [
      { id: 1, color: '#134e5e', position: 0 },
      { id: 2, color: '#71b280', position: 100 }
    ]
  },
  {
    name: 'Candy',
    type: 'linear',
    angle: 45,
    position: { x: 50, y: 50 },
    stops: [
      { id: 1, color: '#ff0844', position: 0 },
      { id: 2, color: '#ffb199', position: 100 }
    ]
  },
  {
    name: 'Cosmic',
    type: 'conic',
    angle: 0,
    position: { x: 50, y: 50 },
    stops: [
      { id: 1, color: '#8360c3', position: 0 },
      { id: 2, color: '#2ebf91', position: 50 },
      { id: 3, color: '#8360c3', position: 100 }
    ]
  },
  {
    name: 'Royal',
    type: 'linear',
    angle: 135,
    position: { x: 50, y: 50 },
    stops: [
      { id: 1, color: '#141e30', position: 0 },
      { id: 2, color: '#243b55', position: 100 }
    ]
  },
  {
    name: 'Citrus',
    type: 'linear',
    angle: 90,
    position: { x: 50, y: 50 },
    stops: [
      { id: 1, color: '#f7971e', position: 0 },
      { id: 2, color: '#ffd200', position: 100 }
    ]
  },
  {
    name: 'Berry',
    type: 'linear',
    angle: 135,
    position: { x: 50, y: 50 },
    stops: [
      { id: 1, color: '#8e2de2', position: 0 },
      { id: 2, color: '#4a00e0', position: 100 }
    ]
  }
];

// Generate a random vibrant gradient
export function generateRandomGradient() {
  const types = ['linear', 'radial', 'conic'];
  const type = types[Math.floor(Math.random() * types.length)];
  const numStops = 2 + Math.floor(Math.random() * 2); // 2-3 stops

  const stops = [];
  for (let i = 0; i < numStops; i++) {
    stops.push({
      id: Date.now() + i,
      color: randomColor(),
      position: i === 0 ? 0 : i === numStops - 1 ? 100 : Math.round((i / (numStops - 1)) * 100)
    });
  }

  return {
    type,
    angle: Math.round(Math.random() * 360),
    position: { x: 50, y: 50 },
    stops
  };
}

function randomColor() {
  const hue = Math.random() * 360;
  const saturation = 60 + Math.random() * 40;
  const lightness = 40 + Math.random() * 30;
  return hslToHex(hue, saturation, lightness);
}

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
