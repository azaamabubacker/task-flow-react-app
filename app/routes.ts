import {
  type RouteConfig,
  index,
  route,
  layout,
} from '@react-router/dev/routes';

export default [
  // Public route (no layout)
  route('/login', 'routes/login.tsx'),

  // Layout (pathless) wrapping dashboard pages
  layout('routes/__layout.tsx', [
    index('routes/index.tsx'),

    // Tasks section parent
    route('/tasks', 'routes/tasks.tsx', [
      index('routes/tasks._index.tsx'),
      route(':id', 'routes/tasks.$id.tsx'),
    ]),
  ]),
] satisfies RouteConfig;
