import { useState } from 'react';

function Controls({ trailEnabled, onClear, onRandomize, onToggleTrail }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.container,
        opacity: isHovered ? 1 : 0.4
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        style={styles.button}
        onClick={onClear}
        title="Clear all nodes"
      >
        Clear
      </button>
      <button
        style={styles.button}
        onClick={onRandomize}
        title="Generate random nodes"
      >
        Randomize
      </button>
      <button
        style={{
          ...styles.button,
          background: trailEnabled ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'
        }}
        onClick={onToggleTrail}
        title="Toggle mouse trail"
      >
        Trail {trailEnabled ? 'On' : 'Off'}
      </button>
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    top: 24,
    right: 24,
    display: 'flex',
    gap: 8,
    transition: 'opacity 0.3s ease',
    zIndex: 200,
    fontFamily: "'Space Grotesk', sans-serif"
  },
  button: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    color: 'rgba(255, 255, 255, 0.7)',
    padding: '8px 12px',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: "'Space Grotesk', sans-serif"
  }
};

export default Controls;
