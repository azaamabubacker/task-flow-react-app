export default function Navbar() {
  return (
    <header style={styles.header} role="banner" aria-label="Top navigation bar">
      <h1 style={styles.title}>TaskFlow</h1>
      <nav aria-label="user actions" />
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    height: 56,
    borderBottom: '1px solid #eee',
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
  },
  title: {
    margin: 0,
    fontSize: 16,
  },
};
