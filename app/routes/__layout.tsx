import { Outlet, useNavigation } from 'react-router';
import Navbar from '~/components/Navbar';
import SideBar from '~/components/Sidebar';

export default function Layout() {
  const nav = useNavigation();
  const isBusy = nav.state === 'loading' || nav.state === 'submitting';

  return (
    <div style={styles.app}>
      {/* top pending bar */}
      <div
        aria-hidden={!isBusy}
        style={{
          position: 'fixed',
          insetInline: 0,
          top: 0,
          height: isBusy ? 3 : 0,
          background:
            nav.state === 'submitting'
              ? '#f59e0b' /* amber */
              : '#3b82f6' /* blue */,
          transition: 'height 120ms ease',
          zIndex: 50,
        }}
      />
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

// Optional: you can also export an ErrorBoundary here if you want a global fallback.
