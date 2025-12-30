import { useState, useCallback, useMemo } from 'react';
import { hexToRgb } from '../utils/color';

function ExportModal({ nodes, onClose }) {
  const [copiedFormat, setCopiedFormat] = useState(null);

  const formats = useMemo(() => {
    const colors = nodes.map(n => n.color.toUpperCase());
    const rgbColors = colors.map(c => {
      const rgb = hexToRgb(c);
      return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    });

    return {
      hex: {
        label: 'HEX',
        content: colors.join('\n')
      },
      rgb: {
        label: 'RGB',
        content: rgbColors.join('\n')
      },
      css: {
        label: 'CSS Variables',
        content: colors.map((c, i) => `--color-${i + 1}: ${c};`).join('\n')
      },
      tailwind: {
        label: 'Tailwind Config',
        content: `colors: {\n${colors.map((c, i) => `  'spectrum-${i + 1}': '${c}'`).join(',\n')}\n}`
      }
    };
  }, [nodes]);

  const handleCopy = useCallback(async (formatKey) => {
    try {
      await navigator.clipboard.writeText(formats[formatKey].content);
      setCopiedFormat(formatKey);
      setTimeout(() => setCopiedFormat(null), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [formats]);

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  return (
    <div style={styles.backdrop} onClick={handleBackdropClick}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>Export Palette</h2>
          <button style={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div style={styles.colorPreview}>
          {nodes.map((node) => (
            <div
              key={node.id}
              style={{
                ...styles.previewSwatch,
                background: node.color,
                boxShadow: `0 0 20px ${node.color}66`
              }}
            />
          ))}
        </div>

        <div style={styles.formats}>
          {Object.entries(formats).map(([key, { label, content }]) => (
            <div key={key} style={styles.formatSection}>
              <div style={styles.formatHeader}>
                <span style={styles.formatLabel}>{label}</span>
                <button
                  style={styles.copyButton}
                  onClick={() => handleCopy(key)}
                >
                  {copiedFormat === key ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre style={styles.codeBlock}>{content}</pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    fontFamily: "'Space Grotesk', sans-serif"
  },
  modal: {
    background: 'rgba(15, 15, 15, 0.95)',
    backdropFilter: 'blur(30px)',
    WebkitBackdropFilter: 'blur(30px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 32,
    minWidth: 400,
    maxWidth: '90vw',
    maxHeight: '80vh',
    overflowY: 'auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  },
  title: {
    margin: 0,
    fontSize: 20,
    fontWeight: 500,
    color: '#fff'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 28,
    cursor: 'pointer',
    padding: 0,
    lineHeight: 1,
    transition: 'color 0.2s ease'
  },
  colorPreview: {
    display: 'flex',
    gap: 8,
    marginBottom: 24,
    flexWrap: 'wrap'
  },
  previewSwatch: {
    width: 40,
    height: 40,
    borderRadius: 10,
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  formats: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16
  },
  formatSection: {
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    padding: 16,
    border: '1px solid rgba(255, 255, 255, 0.05)'
  },
  formatHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  formatLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    fontWeight: 500
  },
  copyButton: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: 6,
    color: 'rgba(255, 255, 255, 0.8)',
    padding: '6px 12px',
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: "'Space Grotesk', sans-serif"
  },
  codeBlock: {
    margin: 0,
    padding: 12,
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    lineHeight: 1.6,
    fontFamily: "'SF Mono', 'Fira Code', 'Monaco', monospace",
    overflowX: 'auto',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all'
  }
};

export default ExportModal;
