import { useMemo } from 'react';

function GradientBackground({ nodes }) {
  const gradientStyle = useMemo(() => {
    if (nodes.length === 0) {
      return { background: '#050505' };
    }

    // Build radial gradients for each node
    const gradients = nodes.map(node => {
      const x = ((node.displayX ?? node.x) / window.innerWidth) * 100;
      const y = ((node.displayY ?? node.y) / window.innerHeight) * 100;
      return `radial-gradient(circle at ${x}% ${y}%, ${node.color} 0%, transparent 60%)`;
    });

    // Layer all gradients with base color
    return {
      background: [...gradients, '#050505'].join(', ')
    };
  }, [nodes]);

  return (
    <>
      {/* Blurred layer for soft glow */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          ...gradientStyle,
          filter: 'blur(60px)',
          opacity: 0.8,
          zIndex: 0
        }}
      />
      {/* Sharp layer for color vibrancy */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          ...gradientStyle,
          filter: 'blur(30px)',
          mixBlendMode: 'screen',
          zIndex: 1
        }}
      />
    </>
  );
}

export default GradientBackground;
