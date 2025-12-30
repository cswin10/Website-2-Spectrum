import { useCallback, useRef } from 'react';

function ColorStops({ stops, onChange }) {
  const trackRef = useRef(null);

  const handleStopChange = useCallback((id, updates) => {
    onChange(stops.map(stop =>
      stop.id === id ? { ...stop, ...updates } : stop
    ));
  }, [stops, onChange]);

  const handleAddStop = useCallback((e) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const position = Math.round(((e.clientX - rect.left) / rect.width) * 100);

    // Find colors to interpolate between
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    let color = '#888888';

    for (let i = 0; i < sortedStops.length - 1; i++) {
      if (position >= sortedStops[i].position && position <= sortedStops[i + 1].position) {
        color = sortedStops[i].color;
        break;
      }
    }

    const newStop = {
      id: Date.now(),
      color,
      position
    };

    onChange([...stops, newStop]);
  }, [stops, onChange]);

  const handleRemoveStop = useCallback((id) => {
    if (stops.length <= 2) return; // Keep at least 2 stops
    onChange(stops.filter(stop => stop.id !== id));
  }, [stops, onChange]);

  const handleDrag = useCallback((id) => {
    if (!trackRef.current) return;

    const onMove = (moveEvent) => {
      const rect = trackRef.current.getBoundingClientRect();
      const position = Math.max(0, Math.min(100,
        Math.round(((moveEvent.clientX - rect.left) / rect.width) * 100)
      ));
      handleStopChange(id, { position });
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [handleStopChange]);

  const sortedStops = [...stops].sort((a, b) => a.position - b.position);
  const gradientPreview = sortedStops
    .map(s => `${s.color} ${s.position}%`)
    .join(', ');

  return (
    <div style={styles.container}>
      <label style={styles.label}>Color Stops</label>

      {/* Gradient track */}
      <div
        ref={trackRef}
        style={{
          ...styles.track,
          background: `linear-gradient(90deg, ${gradientPreview})`
        }}
        onDoubleClick={handleAddStop}
      >
        {stops.map(stop => (
          <div
            key={stop.id}
            style={{
              ...styles.stopHandle,
              left: `${stop.position}%`
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              handleDrag(stop.id, e);
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              handleRemoveStop(stop.id);
            }}
          >
            <div
              style={{
                ...styles.stopColor,
                background: stop.color
              }}
            />
          </div>
        ))}
      </div>

      <p style={styles.hint}>Double-click track to add • Double-click stop to remove • Drag to reposition</p>

      {/* Color inputs */}
      <div style={styles.colorInputs}>
        {sortedStops.map((stop) => (
          <div key={stop.id} style={styles.colorInput}>
            <input
              type="color"
              value={stop.color}
              onChange={(e) => handleStopChange(stop.id, { color: e.target.value })}
              style={styles.picker}
            />
            <span style={styles.colorLabel}>
              {stop.position}%
            </span>
          </div>
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
  track: {
    position: 'relative',
    height: 24,
    borderRadius: 12,
    cursor: 'pointer',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  stopHandle: {
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: 20,
    height: 28,
    cursor: 'grab',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  stopColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    border: '2px solid white',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
  },
  hint: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 8,
    marginBottom: 16
  },
  colorInputs: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12
  },
  colorInput: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '6px 10px',
    borderRadius: 8
  },
  picker: {
    width: 28,
    height: 28,
    padding: 0,
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    background: 'transparent'
  },
  colorLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'monospace'
  }
};

export default ColorStops;
