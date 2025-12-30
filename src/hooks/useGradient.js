import { useCallback, useRef } from 'react';

// Render gradient at lower resolution for performance
const RENDER_SCALE = 0.25;

// How quickly colors fade to black (higher = faster falloff)
const FALLOFF_STRENGTH = 0.00008;

// Base darkness - colors blend with this
const BASE_COLOR = { r: 5, g: 5, b: 5 };

export function useGradient() {
  const gradientCacheRef = useRef(null);
  const lastNodeStateRef = useRef(null);

  const renderGradient = useCallback((ctx, nodes, width, height) => {
    if (nodes.length === 0) {
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);
      return;
    }

    const renderWidth = Math.ceil(width * RENDER_SCALE);
    const renderHeight = Math.ceil(height * RENDER_SCALE);

    // Check if we can use cached gradient
    const nodeState = JSON.stringify(nodes.map(n => ({
      x: n.displayX ?? n.x,
      y: n.displayY ?? n.y,
      color: n.color
    })));

    if (gradientCacheRef.current &&
        lastNodeStateRef.current === nodeState &&
        gradientCacheRef.current.width === renderWidth &&
        gradientCacheRef.current.height === renderHeight) {
      ctx.drawImage(gradientCacheRef.current, 0, 0, width, height);
      return;
    }

    // Create offscreen canvas for rendering at lower resolution
    const offscreen = document.createElement('canvas');
    offscreen.width = renderWidth;
    offscreen.height = renderHeight;
    const offCtx = offscreen.getContext('2d');

    const imageData = offCtx.createImageData(renderWidth, renderHeight);
    const data = imageData.data;

    // Precompute node data for performance
    const nodesData = nodes.map(node => ({
      x: (node.displayX ?? node.x) * RENDER_SCALE,
      y: (node.displayY ?? node.y) * RENDER_SCALE,
      r: node.rgb.r,
      g: node.rgb.g,
      b: node.rgb.b
    }));

    for (let y = 0; y < renderHeight; y++) {
      for (let x = 0; x < renderWidth; x++) {
        let totalWeight = 0;
        let r = 0, g = 0, b = 0;
        let minDistSq = Infinity;

        for (const node of nodesData) {
          const dx = x - node.x;
          const dy = y - node.y;
          const distanceSquared = dx * dx + dy * dy;
          const weight = 1 / (distanceSquared + 1);
          totalWeight += weight;
          r += node.r * weight;
          g += node.g * weight;
          b += node.b * weight;

          if (distanceSquared < minDistSq) {
            minDistSq = distanceSquared;
          }
        }

        // Calculate blended color
        r = r / totalWeight;
        g = g / totalWeight;
        b = b / totalWeight;

        // Apply falloff to black based on distance from nearest node
        // Colors glow near nodes but fade to void in between
        const falloff = Math.exp(-minDistSq * FALLOFF_STRENGTH);

        r = BASE_COLOR.r + (r - BASE_COLOR.r) * falloff;
        g = BASE_COLOR.g + (g - BASE_COLOR.g) * falloff;
        b = BASE_COLOR.b + (b - BASE_COLOR.b) * falloff;

        const i = (y * renderWidth + x) * 4;
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
        data[i + 3] = 255;
      }
    }

    offCtx.putImageData(imageData, 0, 0);

    // Cache the gradient
    gradientCacheRef.current = offscreen;
    lastNodeStateRef.current = nodeState;

    // Draw scaled up to main canvas with smooth interpolation
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(offscreen, 0, 0, width, height);
  }, []);

  const clearCache = useCallback(() => {
    gradientCacheRef.current = null;
    lastNodeStateRef.current = null;
  }, []);

  return { renderGradient, clearCache };
}
