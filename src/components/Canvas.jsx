import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { useTrail } from '../hooks/useTrail';
import { getColorAtPosition } from '../utils/color';

// Trail-only canvas - gradient is now CSS-based
const Canvas = forwardRef(({
  nodes,
  trailEnabled,
  isDragging,
  onCanvasClick,
  onMouseMove
}, ref) => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastParticleTimeRef = useRef(0);
  const dimensionsRef = useRef({ width: 0, height: 0 });

  const { addParticle, updateParticles, renderParticles, clearParticles } = useTrail();

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    clearTrail: clearParticles
  }));

  // Handle canvas resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    dimensionsRef.current = { width, height };
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Animation loop for trail particles only
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const animate = () => {
      // Clear canvas (transparent for overlay)
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.scale(dpr, dpr);

      // Update and render trail particles
      if (trailEnabled) {
        updateParticles();
        renderParticles(ctx);
      }

      ctx.restore();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [trailEnabled, updateParticles, renderParticles]);

  // Handle mouse move for trail
  const handleMouseMove = useCallback((e) => {
    const x = e.clientX;
    const y = e.clientY;

    if (onMouseMove) {
      onMouseMove(e);
    }

    // Add trail particles (throttled)
    if (trailEnabled && !isDragging) {
      const now = Date.now();
      if (now - lastParticleTimeRef.current > 25) {
        const color = getColorAtPosition(x, y, nodes);
        addParticle(x, y, color);
        lastParticleTimeRef.current = now;
      }
    }
  }, [trailEnabled, isDragging, nodes, addParticle, onMouseMove]);

  // Handle touch move for mobile
  const handleTouchMove = useCallback((e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
    }
  }, [handleMouseMove]);

  // Handle canvas double-click to add node
  const handleDoubleClick = useCallback((e) => {
    if (onCanvasClick) {
      onCanvasClick(e.clientX, e.clientY);
    }
  }, [onCanvasClick]);

  return (
    <canvas
      ref={canvasRef}
      onDoubleClick={handleDoubleClick}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        cursor: 'default',
        touchAction: 'none',
        zIndex: 10,
        pointerEvents: 'auto'
      }}
    />
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;
