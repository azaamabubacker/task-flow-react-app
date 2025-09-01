export default function Login() {
  return (
    <main style={styles.main}>
      <section style={styles.card} aria-labelledby="login-heading">
        <h2 id="login-heading" style={{ marginTop: 0 }}>
          Login
        </h2>
        <p style={{ color: '#666' }}>
          Public page (no dashboard layout). We’ll wire auth later.
        </p>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    display: 'grid',
    placeItems: 'center',
    minHeight: '100dvh',
  },

  card: {
    width: 360,
    background: '#fff',
    border: '1px solid #eee',
    borderRadius: 12,
    padding: 20,
    boxShadow: '0 4px 16px (0,0,0,0.04)',
  },
};
