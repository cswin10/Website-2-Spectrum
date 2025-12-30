import { useCallback, useRef } from 'react';

// Render gradient at lower resolution for performance
const RENDER_SCALE = 0.25;

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

        for (const node of nodesData) {
          const dx = x - node.x;
          const dy = y - node.y;
          const distanceSquared = dx * dx + dy * dy;
          const weight = 1 / (distanceSquared + 1);
          totalWeight += weight;
          r += node.r * weight;
          g += node.g * weight;
          b += node.b * weight;
        }

        const i = (y * renderWidth + x) * 4;
        data[i] = r / totalWeight;
        data[i + 1] = g / totalWeight;
        data[i + 2] = b / totalWeight;
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
