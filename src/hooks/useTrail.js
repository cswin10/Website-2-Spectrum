import { useCallback, useRef } from 'react';

const PARTICLE_LIFETIME = 1500; // 1.5 seconds
const MAX_PARTICLES = 100;

export function useTrail() {
  const particlesRef = useRef([]);

  const addParticle = useCallback((x, y, color) => {
    const particles = particlesRef.current;

    // Remove oldest particles if we hit the limit
    if (particles.length >= MAX_PARTICLES) {
      particles.shift();
    }

    particles.push({
      x,
      y,
      color,
      opacity: 1,
      size: 6 + Math.random() * 6,
      createdAt: Date.now()
    });
  }, []);

  const updateParticles = useCallback(() => {
    const now = Date.now();
    const particles = particlesRef.current;

    // Remove dead particles
    particlesRef.current = particles.filter(p => now - p.createdAt < PARTICLE_LIFETIME);

    // Update opacity based on age
    particlesRef.current.forEach(p => {
      const age = now - p.createdAt;
      p.opacity = 1 - (age / PARTICLE_LIFETIME);
    });
  }, []);

  const renderParticles = useCallback((ctx) => {
    const particles = particlesRef.current;

    particles.forEach(p => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.opacity, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.opacity * 0.5})`;
      ctx.shadowColor = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.opacity * 0.8})`;
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.restore();
    });
  }, []);

  const clearParticles = useCallback(() => {
    particlesRef.current = [];
  }, []);

  const getParticleCount = useCallback(() => {
    return particlesRef.current.length;
  }, []);

  return {
    addParticle,
    updateParticles,
    renderParticles,
    clearParticles,
    getParticleCount
  };
}
