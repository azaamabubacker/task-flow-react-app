import {
  Form,
  useLoaderData,
  redirect,
  type ClientActionFunctionArgs,
  type ClientLoaderFunctionArgs,
} from 'react-router';
import { loadTasks, saveTasks } from '~/lib/storage';

// ---------- READ ----------
export async function clientLoader({ params }: ClientLoaderFunctionArgs) {
  const tasks = loadTasks();
  const task = tasks.find((t) => t.id === params.id);
  if (!task) throw new Response('Task not found', { status: 404 });
  return { task };
}

// ---------- WRITE ----------
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

  return redirect(`/tasks/${params.id}`);
}

// ---------- UI ----------
export default function TaskDetailsPage() {
  const { task } = useLoaderData() as { task: Task };

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

      <p style={{ color: '#666', marginTop: 12 }}>
        <strong>Title:</strong> {task.title}
      </p>
      <p style={{ color: '#666' }}>
        <strong>Status:</strong> {task.completed ? 'Completed' : 'Active'}
      </p>
      <p style={{ color: '#666' }}>
        <strong>Created:</strong> {new Date(task.createdAt).toLocaleString()}
      </p>
    </article>
  );
}
