import { AnimatePresence, motion } from 'framer-motion';
import { Check, ClipboardList, Plus, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { cn } from '../utils/cn';
import { Button } from './ui/Button';
import { CodePreview } from './ui/CodePreview';

interface Task {
  id: number;
  text: string;
  done: boolean;
}

type Filter = 'all' | 'active' | 'done';

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'done', label: 'Done' },
];

const emptyMessages: Record<Filter, { title: string; body: string }> = {
  all: { title: 'No tasks yet', body: 'Add your first task above to get started.' },
  active: { title: 'Nothing left to do', body: 'Every task is done. Nice work.' },
  done: { title: 'Nothing finished yet', body: 'Tick a task and it shows up here.' },
};

/** A small working preview of the app the learner builds in this project. */
export function TaskManagerDemo() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: 'Read the state lesson', done: true },
    { id: 2, text: 'Build the counter challenge', done: false },
    { id: 3, text: 'Try this task manager', done: false },
  ]);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const nextId = useRef(4);

  const visible = tasks.filter((t) =>
    filter === 'all' ? true : filter === 'done' ? t.done : !t.done,
  );
  const remaining = tasks.filter((t) => !t.done).length;

  const add = (e: FormEvent) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    setTasks((prev) => [...prev, { id: nextId.current++, text: value, done: false }]);
    setText('');
  };

  const toggle = (id: number) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id: number) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const empty = emptyMessages[filter];

  return (
    <CodePreview title="Task Manager · try it" bodyClassName="block p-4 sm:p-6">
      <form onSubmit={add} className="flex gap-2">
        <label htmlFor="new-task" className="sr-only">
          New task
        </label>
        <input
          id="new-task"
          className="field"
          placeholder="What needs doing?"
          value={text}
          maxLength={80}
          onChange={(e) => setText(e.target.value)}
        />
        <Button type="submit" variant="primary" icon={<Plus size={16} />}>
          Add
        </Button>
      </form>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex gap-1.5" role="group" aria-label="Filter tasks">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={cn(
                'rounded-full px-3 py-1.5 text-sm font-semibold transition',
                filter === f.id ? 'bg-ink-950 text-white' : 'text-ink-600 hover:bg-ink-100',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-ink-600" aria-live="polite">
          {remaining} left
        </p>
      </div>

      <ul className="mt-3 space-y-2">
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map((task) => (
            <motion.li
              key={task.id}
              layout
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 24 }}
              className="flex items-center gap-3 rounded-xl border border-ink-100 bg-white px-3 py-2.5"
            >
              <button
                type="button"
                role="checkbox"
                aria-checked={task.done}
                aria-label={`Mark “${task.text}” as ${task.done ? 'not done' : 'done'}`}
                onClick={() => toggle(task.id)}
                className={cn(
                  'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition',
                  task.done
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : 'border-ink-300 hover:border-path-500',
                )}
              >
                {task.done && <Check size={14} strokeWidth={3} />}
              </button>
              <span
                className={cn(
                  'min-w-0 flex-1 break-words text-[15px]',
                  task.done ? 'text-ink-500 line-through' : 'text-ink-900',
                )}
              >
                {task.text}
              </span>
              <button
                type="button"
                onClick={() => remove(task.id)}
                aria-label={`Remove “${task.text}”`}
                className="rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-900"
              >
                <Trash2 size={16} />
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {visible.length === 0 && (
        <div className="mt-3 flex flex-col items-center rounded-xl border border-dashed border-ink-200 px-4 py-8 text-center">
          <ClipboardList size={22} className="text-ink-400" aria-hidden="true" />
          <p className="mt-2 font-semibold text-ink-900">{empty.title}</p>
          <p className="text-sm text-ink-600">{empty.body}</p>
        </div>
      )}
    </CodePreview>
  );
}
