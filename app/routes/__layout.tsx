import { Outlet } from 'react-router';
import Navbar from '~/components/Navbar';
import SideBar from '~/components/Sidebar';

export default function Layout() {
  return (
    <div style={styles.app}>
      <SideBar />
      <div style={styles.main}>
        <Navbar />
        <div style={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  app: {
    display: 'grid',
    gridTemplateColumns: '240px 1fr',
    minHeight: '100dvh',
    background: '#fafafa',
  },
  main: { display: 'flex', flexDirection: 'column', minWidth: 0 },
  content: { padding: 24, minWidth: 0 },
};
