import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  redirect,
} from 'react-router';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { z } from 'zod';
import { createId } from '~/lib/id';
import { loadTasks, saveTasks } from '~/lib/storage';
import type { Task } from '~/types/task';

export async function loader(_args: LoaderFunctionArgs) {
  return { tasks: loadTasks() as Task[] };
}

const createSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
});

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const intent = form.get('intent');
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
    // Redirect to clear POST state and keep URL sharable
    return redirect('/tasks');
  }
  return { error: 'Unknown action' };
}

export default function TasksListPage() {
  const { tasks } = useLoaderData() as { tasks: Task[] };
  const actionData = useActionData() as { error?: string } | undefined;

  return (
    <div>
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
          />
          <input type="hidden" name="intent" value="create" />
          <button type="submit">Add</button>
        </Form>
        {actionData?.error ? (
          <p role="alert" style={{ color: '#b00020', marginTop: 6 }}>
            {actionData.error}
          </p>
        ) : null}
      </section>

      <section>
        <h3 style={{ margin: 0 }}>Tasks</h3>
        {tasks.length === 0 ? (
          <p style={{ color: '#666', marginTop: 8 }}>
            No tasks yet. Add your first one above.
          </p>
        ) : (
          <ul style={{ marginTop: 8, padding: 0, listStyle: 'none' }}>
            {tasks.map((t) => (
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
                {/* Toggle done is coming in next step; keeping list read-only for now */}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
