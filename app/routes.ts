import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes';

export default [
  route('/login', 'routes/login.tsx'),
  layout('routes/__layout.tsx', [
    index('routes/index.tsx'),
    route('/tasks', 'routes/tasks.tsx', [
      index('routes/tasks._index.tsx'),
      route(':id', 'routes/tasks.$id.tsx'), // <-- this line must exist
    ]),
  ]),
] satisfies RouteConfig;
