import { useState, useCallback } from 'react';
import GradientPreview from './components/GradientPreview';
import GradientControls from './components/GradientControls';
import ColorStops from './components/ColorStops';
import CSSOutput from './components/CSSOutput';
import PresetGallery from './components/PresetGallery';
import { generateRandomGradient, presets } from './utils/gradient';
import './styles/global.css';

const initialConfig = presets[0];

function App() {
  const [config, setConfig] = useState({
    type: initialConfig.type,
    angle: initialConfig.angle,
    position: { ...initialConfig.position },
    stops: initialConfig.stops.map(s => ({ ...s }))
  });

  const handleTypeChange = useCallback((type) => {
    setConfig(prev => ({ ...prev, type }));
  }, []);

  const handleAngleChange = useCallback((angle) => {
    setConfig(prev => ({ ...prev, angle }));
  }, []);

  const handlePositionChange = useCallback((position) => {
    setConfig(prev => ({ ...prev, position }));
  }, []);

  const handleStopsChange = useCallback((stops) => {
    setConfig(prev => ({ ...prev, stops }));
  }, []);

  const handlePresetSelect = useCallback((preset) => {
    setConfig({
      type: preset.type,
      angle: preset.angle,
      position: { ...preset.position },
      stops: preset.stops.map(s => ({ ...s, id: Date.now() + Math.random() }))
    });
  }, []);

  const handleRandomize = useCallback(() => {
    const random = generateRandomGradient();
    setConfig(random);
  }, []);

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>Gradient Generator</h1>
        <button onClick={handleRandomize} style={styles.randomButton}>
          Randomize
        </button>
      </header>

      <div style={styles.main}>
        {/* Left Panel - Controls */}
        <aside style={styles.sidebar}>
          <PresetGallery onSelect={handlePresetSelect} />

          <GradientControls
            type={config.type}
            angle={config.angle}
            position={config.position}
            onTypeChange={handleTypeChange}
            onAngleChange={handleAngleChange}
            onPositionChange={handlePositionChange}
          />

          <div style={{ marginTop: 24 }}>
            <ColorStops
              stops={config.stops}
              onChange={handleStopsChange}
            />
          </div>
        </aside>

        {/* Center - Preview */}
        <main style={styles.preview}>
          <GradientPreview config={config} />
        </main>

        {/* Right Panel - Output */}
        <aside style={styles.output}>
          <CSSOutput config={config} />

          <div style={styles.tips}>
            <h3 style={styles.tipsTitle}>Quick Tips</h3>
            <ul style={styles.tipsList}>
              <li>Click a preset to start</li>
              <li>Drag color stops to reposition</li>
              <li>Double-click track to add stops</li>
              <li>Double-click stop to remove</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0a0a0a',
    color: '#fff',
    fontFamily: "'Space Grotesk', -apple-system, sans-serif"
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 32px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  title: {
    margin: 0,
    fontSize: 20,
    fontWeight: 600,
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  randomButton: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    border: 'none',
    borderRadius: 8,
    color: '#fff',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: "'Space Grotesk', sans-serif",
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  },
  main: {
    display: 'grid',
    gridTemplateColumns: '320px 1fr 300px',
    gap: 0,
    height: 'calc(100vh - 73px)'
  },
  sidebar: {
    padding: 24,
    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
    overflowY: 'auto'
  },
  preview: {
    display: 'flex',
    background: '#050505'
  },
  output: {
    padding: 24,
    borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: 24
  },
  tips: {
    marginTop: 'auto',
    padding: 16,
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    border: '1px solid rgba(255, 255, 255, 0.05)'
  },
  tipsTitle: {
    margin: '0 0 12px 0',
    fontSize: 13,
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.6)'
  },
  tipsList: {
    margin: 0,
    padding: '0 0 0 16px',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
    lineHeight: 1.8
  }
};

export default App;
