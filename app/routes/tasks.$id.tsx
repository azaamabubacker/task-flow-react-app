import { Form, useLoaderData, redirect } from 'react-router';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { loadTasks, saveTasks } from '~/lib/storage';
import type { Task } from '~/types/task';

export async function loader({ params }: LoaderFunctionArgs) {
  const tasks = loadTasks();
  const task = tasks.find((t) => t.id === params.id);
  if (!task) {
    // Let the section error boundary handle this later; 404 for now
    throw new Response('Task not found', { status: 404 });
  }
  return { task };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const form = await request.formData();
  const intent = form.get('intent');
  if (intent === 'delete') {
    const tasks = loadTasks();
    const next = tasks.filter((t) => t.id !== params.id);
    saveTasks(next);
    return redirect('/tasks');
  }
  return redirect(`/tasks/${params.id}`);
}

export default function TaskDetailsPage() {
  const { task } = useLoaderData() as { task: Task };

  return (
    <article>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h3 style={{ margin: 0 }}>Task Details</h3>
        <Form method="post">
          <input type="hidden" name="intent" value="delete" />
          <button type="submit" aria-label={`Delete ${task.title}`}>
            Delete
          </button>
        </Form>
      </header>

      <p style={{ color: '#666', marginTop: 8 }}>
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
