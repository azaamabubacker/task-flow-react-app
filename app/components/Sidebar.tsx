import { Link } from 'react-router';

export default function SideBar() {
  return (
    <aside aria-label="Sidebar" style={styles.aside}>
      <nav aria-label="Primary">
        <ul style={styles.list}>
          <li>
            <Link to={'/'}>Home</Link>
            <Link to={'/tasks'}>Tasks</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

const styles: Record<string, React.CSSProperties> = {
  aside: {
    borderRight: '1px solde #eee',
    background: '#fff',
    padding: 16,
  },
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'grid',
    gap: 8,
  },
};
