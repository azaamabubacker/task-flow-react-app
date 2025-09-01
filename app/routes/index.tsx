import type { Route } from './+types/index';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'TaskFlow' },
    { name: 'description', content: 'Note your everyday tasks' },
  ];
}

export default function Home() {
  return (
    <main>
      <h2 style={{ marginTop: 0 }}>Dashboard</h2>
      <p>Welcome to TaskFlow.</p>
    </main>
  );
}
