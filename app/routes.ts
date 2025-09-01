import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  route('', 'routes/__layout.tsx', [
    index('routes/index.tsx'),
    route('/tasks', 'routes/tasks.tsx'),
  ]),
  route('/login', 'routes/login.tsx'),
] satisfies RouteConfig;
