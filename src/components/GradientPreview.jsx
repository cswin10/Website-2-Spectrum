import { generateGradientCSS } from '../utils/gradient';

function GradientPreview({ config }) {
  const gradientCSS = generateGradientCSS(config);

  return (
    <div style={styles.container}>
      <div
        style={{
          ...styles.preview,
          background: gradientCSS
        }}
      />
    </div>
  );
}

const styles = {
  container: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    minHeight: 300
  },
  preview: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    minHeight: 300
  }
};

export default GradientPreview;
