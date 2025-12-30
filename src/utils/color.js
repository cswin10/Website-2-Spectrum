// Color conversion utilities

export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

export function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

// Generate a vibrant color based on position (X maps to hue, Y to lightness)
export function positionToColor(x, y, width, height) {
  const hue = (x / width) * 360;
  const saturation = 80 + (y / height) * 20; // 80-100%
  const lightness = 45 + ((1 - y / height) * 20); // 45-65%

  const rgb = hslToRgb(hue, saturation, lightness);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

// Generate a random vibrant color
export function randomVibrantColor() {
  const hue = Math.random() * 360;
  const saturation = 75 + Math.random() * 25; // 75-100%
  const lightness = 45 + Math.random() * 20; // 45-65%

  const rgb = hslToRgb(hue, saturation, lightness);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

// Get color at a specific position based on node distances
export function getColorAtPosition(x, y, nodes) {
  if (nodes.length === 0) {
    return { r: 5, g: 5, b: 5 };
  }

  let totalWeight = 0;
  let r = 0, g = 0, b = 0;

  for (const node of nodes) {
    const nodeX = node.displayX ?? node.x;
    const nodeY = node.displayY ?? node.y;
    const distance = Math.sqrt((x - nodeX) ** 2 + (y - nodeY) ** 2);
    const weight = 1 / (distance ** 2 + 1);
    totalWeight += weight;
    r += node.rgb.r * weight;
    g += node.rgb.g * weight;
    b += node.rgb.b * weight;
  }

  return {
    r: Math.round(r / totalWeight),
    g: Math.round(g / totalWeight),
    b: Math.round(b / totalWeight)
  };
}
