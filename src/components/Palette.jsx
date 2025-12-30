import { useState, useCallback } from 'react';

function Palette({ nodes, onExportClick }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleSwatchClick = useCallback(async (node, index) => {
    try {
      await navigator.clipboard.writeText(node.color.toUpperCase());
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch (err) {
      console.error('Failed to copy color:', err);
    }
  }, []);

  if (nodes.length === 0) {
    return null;
  }

  return (
    <div style={styles.container}>
      <div style={styles.swatches}>
        {nodes.map((node, index) => (
          <div
            key={node.id}
            style={{
              ...styles.swatch,
              background: node.color,
              boxShadow: `0 0 15px ${node.color}66`
            }}
            onClick={() => handleSwatchClick(node, index)}
            title={`Click to copy ${node.color.toUpperCase()}`}
          >
            {copiedIndex === index && (
              <div style={styles.copied}>Copied!</div>
            )}
          </div>
        ))}
      </div>
      <button
        style={styles.exportButton}
        onClick={onExportClick}
      >
        Export
      </button>
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    bottom: 24,
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(10, 10, 10, 0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    fontFamily: "'Space Grotesk', sans-serif",
    zIndex: 200
  },
  swatches: {
    display: 'flex',
    gap: 8
  },
  swatch: {
    width: 32,
    height: 32,
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    position: 'relative'
  },
  copied: {
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    marginBottom: 8,
    background: 'rgba(255, 255, 255, 0.95)',
    color: '#000',
    padding: '4px 8px',
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 500,
    whiteSpace: 'nowrap',
    animation: 'fadeIn 0.2s ease'
  },
  exportButton: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    color: 'rgba(255, 255, 255, 0.7)',
    padding: '8px 14px',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: "'Space Grotesk', sans-serif"
  }
};

export default Palette;
