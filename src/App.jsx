import { useState, useCallback, useRef, useEffect } from 'react';
import Canvas from './components/Canvas';
import Node from './components/Node';
import Palette from './components/Palette';
import Controls from './components/Controls';
import ExportModal from './components/ExportModal';
import { hexToRgb, positionToColor, randomVibrantColor } from './utils/color';
import './styles/global.css';

// Generate unique ID
let nodeIdCounter = 0;
const generateId = () => `node-${++nodeIdCounter}`;

// Default nodes configuration
const createDefaultNodes = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Darker, more muted colors that glow from the void
  const defaults = [
    { xPercent: 0.20, yPercent: 0.30, color: '#8b1e3f' },  // Deep rose
    { xPercent: 0.80, yPercent: 0.20, color: '#4a1c7a' },  // Deep purple
    { xPercent: 0.70, yPercent: 0.80, color: '#1a4b6e' },  // Deep ocean
    { xPercent: 0.25, yPercent: 0.75, color: '#0d5c4a' }   // Deep teal
  ];

  return defaults.map(({ xPercent, yPercent, color }) => ({
    id: generateId(),
    x: width * xPercent,
    y: height * yPercent,
    baseX: width * xPercent,
    baseY: height * yPercent,
    color,
    rgb: hexToRgb(color),
    animationOffset: Math.random() * Math.PI * 2,
    animationRadius: 3 + Math.random() * 5
  }));
};

function App() {
  const [nodes, setNodes] = useState(() => createDefaultNodes());
  const [trailEnabled, setTrailEnabled] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Ambient animation - gentle node drift
  useEffect(() => {
    const animate = (time) => {
      setNodes(prevNodes =>
        prevNodes.map(node => {
          // Skip animation for dragging nodes
          if (node.id === draggingNodeId) {
            return node;
          }

          // Calculate gentle circular drift
          const drift = time * 0.0003 + node.animationOffset;
          const displayX = node.baseX + Math.cos(drift) * node.animationRadius;
          const displayY = node.baseY + Math.sin(drift * 0.7) * node.animationRadius;

          return {
            ...node,
            displayX,
            displayY
          };
        })
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [draggingNodeId]);

  // Handle window resize - update node positions proportionally
  useEffect(() => {
    let prevWidth = window.innerWidth;
    let prevHeight = window.innerHeight;

    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      const widthRatio = newWidth / prevWidth;
      const heightRatio = newHeight / prevHeight;

      setNodes(prevNodes =>
        prevNodes.map(node => ({
          ...node,
          x: node.x * widthRatio,
          y: node.y * heightRatio,
          baseX: node.baseX * widthRatio,
          baseY: node.baseY * heightRatio
        }))
      );

      prevWidth = newWidth;
      prevHeight = newHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Add new node on canvas click
  const handleCanvasClick = useCallback((x, y) => {
    // Don't add node if we just finished dragging
    if (isDragging) return;

    const color = positionToColor(x, y, window.innerWidth, window.innerHeight);
    const newNode = {
      id: generateId(),
      x,
      y,
      baseX: x,
      baseY: y,
      color,
      rgb: hexToRgb(color),
      animationOffset: Math.random() * Math.PI * 2,
      animationRadius: 3 + Math.random() * 5
    };

    setNodes(prev => [...prev, newNode]);
  }, [isDragging]);

  // Node drag handlers
  const handleDragStart = useCallback((nodeId) => {
    setIsDragging(true);
    setDraggingNodeId(nodeId);
  }, []);

  const handleDrag = useCallback((nodeId, x, y) => {
    setNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === nodeId
          ? { ...node, x, y, baseX: x, baseY: y, displayX: x, displayY: y }
          : node
      )
    );
  }, []);

  const handleDragEnd = useCallback(() => {
    // Delay resetting isDragging to prevent click from adding a node
    setTimeout(() => {
      setIsDragging(false);
      setDraggingNodeId(null);
    }, 50);
  }, []);

  // Change node color
  const handleColorChange = useCallback((nodeId, color) => {
    setNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === nodeId
          ? { ...node, color, rgb: hexToRgb(color) }
          : node
      )
    );
  }, []);

  // Delete node
  const handleDeleteNode = useCallback((nodeId) => {
    setNodes(prevNodes => prevNodes.filter(node => node.id !== nodeId));
  }, []);

  // Clear all nodes and reset to defaults
  const handleClear = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.clearTrail();
      canvasRef.current.clearGradientCache();
    }
    setNodes(createDefaultNodes());
  }, []);

  // Randomize nodes
  const handleRandomize = useCallback(() => {
    const count = 3 + Math.floor(Math.random() * 4); // 3-6 nodes
    const newNodes = [];

    for (let i = 0; i < count; i++) {
      const x = 0.1 * window.innerWidth + Math.random() * 0.8 * window.innerWidth;
      const y = 0.1 * window.innerHeight + Math.random() * 0.8 * window.innerHeight;
      const color = randomVibrantColor();

      newNodes.push({
        id: generateId(),
        x,
        y,
        baseX: x,
        baseY: y,
        color,
        rgb: hexToRgb(color),
        animationOffset: Math.random() * Math.PI * 2,
        animationRadius: 3 + Math.random() * 5
      });
    }

    if (canvasRef.current) {
      canvasRef.current.clearGradientCache();
    }
    setNodes(newNodes);
  }, []);

  // Toggle trail
  const handleToggleTrail = useCallback(() => {
    setTrailEnabled(prev => !prev);
    if (canvasRef.current) {
      canvasRef.current.clearTrail();
    }
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        ref={canvasRef}
        nodes={nodes}
        trailEnabled={trailEnabled}
        isDragging={isDragging}
        onCanvasClick={handleCanvasClick}
      />

      {nodes.map(node => (
        <Node
          key={node.id}
          node={node}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          onColorChange={handleColorChange}
          onDelete={handleDeleteNode}
        />
      ))}

      <Controls
        trailEnabled={trailEnabled}
        onClear={handleClear}
        onRandomize={handleRandomize}
        onToggleTrail={handleToggleTrail}
      />

      <Palette
        nodes={nodes}
        onExportClick={() => setShowExportModal(true)}
      />

      {showExportModal && (
        <ExportModal
          nodes={nodes}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
}

export default App;
