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
      <section>
        <h1>Welcome Taskflow app</h1>
      </section>
    </main>
  );
}
