import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useSearchParams,
  redirect,
  type ClientActionFunctionArgs,
  type ClientLoaderFunctionArgs,
} from 'react-router';
import { z } from 'zod';
import { loadTasks, saveTasks } from '~/lib/storage';
import type { Task } from '~/types/task';

// ---------- READ ----------
export async function clientLoader({ request }: ClientLoaderFunctionArgs) {
  const url = new URL(request.url);
  const filter = (url.searchParams.get('filter') ?? 'all').toLowerCase() as
    | 'all'
    | 'active'
    | 'completed';

  const tasks = loadTasks() as Task[];
  const visible =
    filter === 'active'
      ? tasks.filter((t) => !t.completed)
      : filter === 'completed'
        ? tasks.filter((t) => t.completed)
        : tasks;

  return {
    tasks,
    visible,
    filter,
    counts: {
      total: tasks.length,
      active: tasks.filter((t) => !t.completed).length,
      completed: tasks.filter((t) => t.completed).length,
    },
  };
}

const createSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
});

// ---------- WRITE ----------
export async function clientAction({ request }: ClientActionFunctionArgs) {
  const form = await request.formData();
  const intent = String(form.get('intent') ?? '');

  // create
  if (intent === 'create') {
    const parsed = createSchema.safeParse({ title: form.get('title') });
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? 'Invalid title' };
    }
    const tasks = loadTasks();
    const newTask: Task = {
      id: createId(),
      title: parsed.data.title,
      completed: false,
      createdAt: Date.now(),
    };
    saveTasks([newTask, ...tasks]);
    return redirect('/tasks'); // clears POST state
  }

  // toggle
  if (intent === 'toggle') {
    const id = String(form.get('id') ?? '');
    const tasks = loadTasks();
    saveTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
    const referer = request.headers.get('referer') ?? '/tasks';
    return redirect(referer); // keep current ?filter
  }

  // clear completed
  if (intent === 'clearCompleted') {
    const tasks = loadTasks();
    saveTasks(tasks.filter((t) => !t.completed));
    const referer = request.headers.get('referer') ?? '/tasks';
    return redirect(referer);
  }

  return { error: 'Unknown action' };
}

// ---------- UI ----------
export default function TasksListPage() {
  const { visible, filter, counts } = useLoaderData() as {
    tasks: Task[];
    visible: Task[];
    filter: 'all' | 'active' | 'completed';
    counts: { total: number; active: number; completed: number };
  };
  const actionData = useActionData() as { error?: string } | undefined;
  const [sp, setSp] = useSearchParams();

  function setFilter(next: 'all' | 'active' | 'completed') {
    sp.set('filter', next);
    setSp(sp, { replace: true });
  }

  return (
    <div>
      {/* Create */}
      <section style={{ marginBottom: 16 }}>
        <h3 style={{ margin: 0 }}>Add Task</h3>
        <Form
          method="post"
          replace
          style={{ display: 'flex', gap: 8, marginTop: 8 }}
        >
          <input
            name="title"
            placeholder="Task title"
            aria-label="Task title"
            required
          />
          <input type="hidden" name="intent" value="create" />
          <button type="submit">Add</button>
        </Form>
        {actionData?.error && (
          <p role="alert" style={{ color: '#b00020', marginTop: 6 }}>
            {actionData.error}
          </p>
        )}
      </section>

      {/* Toolbar */}
      <section
        aria-label="Task tools"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 8,
        }}
      >
        <div
          role="tablist"
          aria-label="Filters"
          style={{ display: 'flex', gap: 8 }}
        >
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              style={{
                border: '1px solid #ddd',
                padding: '6px 10px',
                borderRadius: 999,
                background: filter === f ? '#222' : '#f2f2f2',
                color: filter === f ? '#fff' : '#222',
                textTransform: 'capitalize',
                cursor: 'pointer',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        <Form method="post" replace>
          <input type="hidden" name="intent" value="clearCompleted" />
          <button
            type="submit"
            disabled={counts.completed === 0}
            aria-disabled={counts.completed === 0}
          >
            Clear completed ({counts.completed})
          </button>
        </Form>
      </section>

      {/* List */}
      <section>
        <h3 style={{ margin: 0 }}>
          Tasks — Total {counts.total} • Active {counts.active} • Done{' '}
          {counts.completed}
        </h3>

        {visible.length === 0 ? (
          <p style={{ color: '#666', marginTop: 8 }}>
            {filter === 'completed'
              ? 'No completed tasks yet.'
              : filter === 'active'
                ? 'No active tasks. Take a break?'
                : 'No tasks yet. Add your first one above.'}
          </p>
        ) : (
          <ul style={{ marginTop: 8, padding: 0, listStyle: 'none' }}>
            {visible.map((t) => (
              <li
                key={t.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '8px 0',
                  borderBottom: '1px solid #eee',
                }}
              >
                {/* Toggle */}
                <Form method="post" replace aria-label={`Toggle ${t.title}`}>
                  <input type="hidden" name="intent" value="toggle" />
                  <input type="hidden" name="id" value={t.id} />
                  <button
                    type="submit"
                    aria-pressed={t.completed}
                    title={t.completed ? 'Mark as active' : 'Mark as completed'}
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 4,
                      border: '1px solid #ccc',
                      background: t.completed ? '#222' : '#fff',
                    }}
                  />
                </Form>

                {/* Title → details */}
                <span
                  style={{
                    flex: 1,
                    opacity: t.completed ? 0.6 : 1,
                    textDecoration: t.completed ? 'line-through' : 'none',
                  }}
                >
                  <Link to={`/tasks/${t.id}`} aria-label={`Open ${t.title}`}>
                    {t.title}
                  </Link>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
