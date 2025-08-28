import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'New React Router App' }, { name: 'description', content: 'Welcome to React Router!' }];
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
