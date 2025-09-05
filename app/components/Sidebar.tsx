import { NavLink } from 'react-router';

export default function Sidebar() {
  return (
    <aside style={styles.aside} aria-label="Sidebar">
      <nav aria-label="Primary">
        <ul style={styles.list}>
          <li>
            <NavLink to="/" style={linkStyle}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/tasks" style={linkStyle}>
              Tasks
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

function linkStyle({ isActive }: { isActive: boolean }): React.CSSProperties {
  return {
    display: 'block',
    padding: '8px 10px',
    borderRadius: 8,
    textDecoration: 'none',
    color: isActive ? '#fff' : '#222',
    background: isActive ? '#111' : 'transparent',
  };
}

const styles: Record<string, React.CSSProperties> = {
  aside: {
    borderRight: '1px solid #eee',
    background: '#fff',
    padding: 16,
  },
  list: { listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 },
};
