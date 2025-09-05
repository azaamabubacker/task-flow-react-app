import {
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  Link,
} from 'react-router';

export default function TasksSection() {
  return (
    <section aria-labelledby="tasks-heading">
      <header style={styles.header}>
        <h2 id="tasks-heading" style={{ margin: 0 }}>
          Tasks
        </h2>
      </header>
      <Outlet />
    </section>
  );
}

export function ErrorBoundary() {
  const err = useRouteError();
  const isResp = isRouteErrorResponse(err);

  // Friendly, section-scoped error UI
  return (
    <div role="alert" style={styles.errorBox}>
      <h3 style={{ marginTop: 0 }}>
        {isResp ? `${err.status} — ${err.statusText}` : 'Something went wrong'}
      </h3>
      <p style={{ color: '#555' }}>
        {isResp && err.data
          ? String(err.data)
          : 'We couldn’t load this Tasks view.'}
      </p>
      <Link to="/tasks">Back to Tasks</Link>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    marginBottom: 16,
    paddingBottom: 8,
    borderBottom: '1px solid #eee',
  },
  errorBox: {
    border: '1px solid #fca5a5',
    background: '#fef2f2',
    color: '#7f1d1d',
    padding: 16,
    borderRadius: 8,
  },
};
