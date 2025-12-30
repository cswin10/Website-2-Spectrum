import { presets, generateGradientCSS } from '../utils/gradient';

function PresetGallery({ onSelect }) {
  return (
    <div style={styles.container}>
      <label style={styles.label}>Presets</label>
      <div style={styles.grid}>
        {presets.map((preset, index) => (
          <button
            key={index}
            onClick={() => onSelect(preset)}
            style={{
              ...styles.preset,
              background: generateGradientCSS(preset)
            }}
            title={preset.name}
          >
            <span style={styles.presetName}>{preset.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginBottom: 24
  },
  label: {
    display: 'block',
    fontSize: 12,
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 8
  },
  preset: {
    aspectRatio: '1',
    border: '2px solid transparent',
    borderRadius: 10,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
    overflow: 'hidden'
  },
  presetName: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '16px 4px 4px',
    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
    color: '#fff',
    fontSize: 10,
    fontWeight: 500,
    textAlign: 'center'
  }
};

export default PresetGallery;
