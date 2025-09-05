import type { Task } from '~/types/task';

const KEY = 'taskFlow:tasks:v1';

export function loadTasks(): Task[] {
  try {
    if (typeof window === 'undefined') return [];
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Task[]) : [];
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(KEY, JSON.stringify(tasks));
  } catch {
    // ignore errors
  }
}
