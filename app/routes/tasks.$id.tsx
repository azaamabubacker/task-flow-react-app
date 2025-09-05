import {
  Form,
  useLoaderData,
  useActionData,
  redirect,
  type ClientActionFunctionArgs,
  type ClientLoaderFunctionArgs,
} from 'react-router';
import { z } from 'zod';
import { loadTasks, saveTasks } from '~/lib/storage';

// ---------- READ ----------
export async function clientLoader({ params }: ClientLoaderFunctionArgs) {
  const tasks = loadTasks();
  const task = tasks.find((t) => t.id === params.id);
  if (!task) throw new Response('Task not found', { status: 404 });
  return { task };
}

// ---------- WRITE ----------
const updateSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
});

export async function clientAction({
  request,
  params,
}: ClientActionFunctionArgs) {
  const form = await request.formData();
  const intent = String(form.get('intent') ?? '');

  if (intent === 'delete') {
    const tasks = loadTasks();
    saveTasks(tasks.filter((t) => t.id !== params.id));
    return redirect('/tasks');
  }

  if (intent === 'toggle') {
    const tasks = loadTasks();
    saveTasks(
      tasks.map((t) =>
        t.id === params.id ? { ...t, completed: !t.completed } : t,
      ),
    );
    return redirect(`/tasks/${params.id}`);
  }

  if (intent === 'update') {
    const parsed = updateSchema.safeParse({ title: form.get('title') });
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? 'Invalid title' };
    }
    const tasks = loadTasks();
    const next = tasks.map((t) =>
      t.id === params.id ? { ...t, title: parsed.data.title } : t,
    );
    saveTasks(next);
    return redirect(`/tasks/${params.id}`);
  }

  return redirect(`/tasks/${params.id}`);
}

// ---------- UI ----------
export default function TaskDetailsPage() {
  const { task } = useLoaderData() as { task: Task };
  const actionData = useActionData() as { error?: string } | undefined;

  return (
    <article>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <h3 style={{ margin: 0 }}>Task Details</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <Form method="post">
            <input type="hidden" name="intent" value="toggle" />
            <button type="submit" aria-pressed={task.completed}>
              {task.completed ? 'Mark Active' : 'Mark Completed'}
            </button>
          </Form>
          <Form method="post">
            <input type="hidden" name="intent" value="delete" />
            <button type="submit" aria-label={`Delete ${task.title}`}>
              Delete
            </button>
          </Form>
        </div>
      </header>

      {/* Edit title */}
      <section style={{ marginTop: 16 }}>
        <Form
          method="post"
          style={{ display: 'flex', gap: 8, alignItems: 'center' }}
        >
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            defaultValue={task.title}
            aria-describedby="title-help title-error"
          />
          <input type="hidden" name="intent" value="update" />
          <button type="submit">Save</button>
        </Form>
        <p id="title-help" style={{ color: '#666', marginTop: 6 }}>
          Update the task title and click Save.
        </p>
        {actionData?.error && (
          <p
            id="title-error"
            role="alert"
            style={{ color: '#b00020', marginTop: 6 }}
          >
            {actionData.error}
          </p>
        )}
      </section>

      <section style={{ color: '#666', marginTop: 16 }}>
        <p>
          <strong>Status:</strong> {task.completed ? 'Completed' : 'Active'}
        </p>
        <p>
          <strong>Created:</strong> {new Date(task.createdAt).toLocaleString()}
        </p>
      </section>
    </article>
  );
}
