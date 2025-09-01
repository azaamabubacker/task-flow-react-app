import { Outlet } from 'react-router';

export default function TasksSection() {
  return (
    <section aria-labelledby="Tasks heading">
      <header style={styles.header}>
        <h2 id="tasks-heading" style={{ margin: 0 }}>
          Tasks
        </h2>
      </header>
      <Outlet />
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    marginBottom: 16,
    paddingBottom: 8,
    border: '1px solid #eee',
  },
};
