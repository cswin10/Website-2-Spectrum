function GradientControls({ type, angle, position, onTypeChange, onAngleChange, onPositionChange }) {
  const types = [
    { value: 'linear', label: 'Linear' },
    { value: 'radial', label: 'Radial' },
    { value: 'conic', label: 'Conic' }
  ];

  return (
    <div style={styles.container}>
      {/* Gradient Type */}
      <div style={styles.control}>
        <label style={styles.label}>Type</label>
        <div style={styles.typeButtons}>
          {types.map(t => (
            <button
              key={t.value}
              onClick={() => onTypeChange(t.value)}
              style={{
                ...styles.typeButton,
                ...(type === t.value ? styles.typeButtonActive : {})
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Angle (for linear and conic) */}
      {(type === 'linear' || type === 'conic') && (
        <div style={styles.control}>
          <label style={styles.label}>
            Angle <span style={styles.value}>{angle}°</span>
          </label>
          <input
            type="range"
            min="0"
            max="360"
            value={angle}
            onChange={(e) => onAngleChange(Number(e.target.value))}
            style={styles.slider}
          />
          <div style={styles.presetAngles}>
            {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
              <button
                key={a}
                onClick={() => onAngleChange(a)}
                style={{
                  ...styles.anglePreset,
                  ...(angle === a ? styles.anglePresetActive : {})
                }}
              >
                {a}°
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Position (for radial and conic) */}
      {(type === 'radial' || type === 'conic') && (
        <div style={styles.control}>
          <label style={styles.label}>Position</label>
          <div style={styles.positionGrid}>
            {[
              { x: 0, y: 0 }, { x: 50, y: 0 }, { x: 100, y: 0 },
              { x: 0, y: 50 }, { x: 50, y: 50 }, { x: 100, y: 50 },
              { x: 0, y: 100 }, { x: 50, y: 100 }, { x: 100, y: 100 }
            ].map((pos, i) => (
              <button
                key={i}
                onClick={() => onPositionChange(pos)}
                style={{
                  ...styles.positionButton,
                  ...(position.x === pos.x && position.y === pos.y ? styles.positionButtonActive : {})
                }}
              />
            ))}
          </div>
          <div style={styles.positionInputs}>
            <div style={styles.positionInput}>
              <label style={styles.positionLabel}>X</label>
              <input
                type="number"
                min="0"
                max="100"
                value={position.x}
                onChange={(e) => onPositionChange({ ...position, x: Number(e.target.value) })}
                style={styles.numberInput}
              />
            </div>
            <div style={styles.positionInput}>
              <label style={styles.positionLabel}>Y</label>
              <input
                type="number"
                min="0"
                max="100"
                value={position.y}
                onChange={(e) => onPositionChange({ ...position, y: Number(e.target.value) })}
                style={styles.numberInput}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24
  },
  control: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  },
  label: {
    fontSize: 12,
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  value: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'monospace',
    textTransform: 'none'
  },
  typeButtons: {
    display: 'flex',
    gap: 8
  },
  typeButton: {
    flex: 1,
    padding: '10px 16px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: "'Space Grotesk', sans-serif"
  },
  typeButtonActive: {
    background: 'rgba(255, 255, 255, 0.15)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    color: '#fff'
  },
  slider: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    appearance: 'none',
    background: 'rgba(255, 255, 255, 0.1)',
    cursor: 'pointer'
  },
  presetAngles: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4
  },
  anglePreset: {
    padding: '4px 8px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11,
    cursor: 'pointer',
    fontFamily: 'monospace'
  },
  anglePresetActive: {
    background: 'rgba(255, 255, 255, 0.15)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    color: '#fff'
  },
  positionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 4,
    width: 80,
    marginBottom: 12
  },
  positionButton: {
    width: 24,
    height: 24,
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    cursor: 'pointer'
  },
  positionButtonActive: {
    background: 'rgba(255, 255, 255, 0.3)',
    borderColor: 'rgba(255, 255, 255, 0.5)'
  },
  positionInputs: {
    display: 'flex',
    gap: 12
  },
  positionInput: {
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  positionLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)'
  },
  numberInput: {
    width: 60,
    padding: '6px 10px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    color: '#fff',
    fontSize: 13,
    fontFamily: 'monospace'
  }
};

export default GradientControls;
