import { useState, useCallback } from 'react';
import { generateGradientCSS } from '../utils/gradient';

function CSSOutput({ config }) {
  const [copied, setCopied] = useState(false);

  const gradientCSS = generateGradientCSS(config);
  const fullCSS = `background: ${gradientCSS};`;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(fullCSS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [fullCSS]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <label style={styles.label}>CSS</label>
        <button
          onClick={handleCopy}
          style={{
            ...styles.copyButton,
            ...(copied ? styles.copyButtonSuccess : {})
          }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre style={styles.code}>
        <code>{fullCSS}</code>
      </pre>
    </div>
  );
}

const styles = {
  container: {
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 16,
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  label: {
    fontSize: 12,
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  copyButton: {
    padding: '6px 14px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: "'Space Grotesk', sans-serif"
  },
  copyButtonSuccess: {
    background: 'rgba(34, 197, 94, 0.2)',
    borderColor: 'rgba(34, 197, 94, 0.4)',
    color: '#22c55e'
  },
  code: {
    margin: 0,
    padding: 12,
    background: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 8,
    color: '#a5f3fc',
    fontSize: 13,
    lineHeight: 1.5,
    fontFamily: "'SF Mono', 'Fira Code', 'Monaco', monospace",
    overflowX: 'auto',
    wordBreak: 'break-all',
    whiteSpace: 'pre-wrap'
  }
};

export default CSSOutput;
