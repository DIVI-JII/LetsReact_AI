import { BookOpen, FolderKanban, Search, Swords } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { challenges, lessons, projects } from '../../data';
import { cn } from '../../utils/cn';
import { Modal } from '../ui/Modal';

interface SearchPaletteProps {
  open: boolean;
  onClose: () => void;
}

interface Result {
  id: string;
  title: string;
  kind: 'Lesson' | 'Challenge' | 'Project';
  detail: string;
  to: string;
}

const allResults: Result[] = [
  ...lessons.map<Result>((l) => ({
    id: `lesson-${l.id}`,
    title: l.title,
    kind: 'Lesson',
    detail: `Week ${l.weekNumber}`,
    to: `/lessons/${l.id}`,
  })),
  ...challenges.map<Result>((c) => ({
    id: `challenge-${c.id}`,
    title: c.title,
    kind: 'Challenge',
    detail: 'Coding challenge',
    to: `/challenges/${c.id}`,
  })),
  ...projects.map<Result>((p) => ({
    id: `project-${p.id}`,
    title: p.title,
    kind: 'Project',
    detail: p.difficulty,
    to: `/projects/${p.id}`,
  })),
];

const kindIcon = { Lesson: BookOpen, Challenge: Swords, Project: FolderKanban } as const;

// Shown before the learner types anything.
const suggested = [
  'lesson-understanding-state',
  'challenge-build-a-counter',
  'project-task-manager',
  'lesson-jsx-fundamentals',
];

export function SearchPalette({ open, onClose }: SearchPaletteProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setQuery('');
      // Wait for the dialog to mount before focusing.
      const t = window.setTimeout(() => inputRef.current?.focus(), 30);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allResults.filter((r) => suggested.includes(r.id));
    return allResults
      .filter((r) => r.title.toLowerCase().includes(q) || r.kind.toLowerCase().includes(q))
      .slice(0, 7);
  }, [query]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (results[0]) {
      navigate(results[0].to);
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose} label="Search LetsReact_AI" align="top" hideClose className="max-w-xl">
      <form onSubmit={onSubmit} role="search" className="border-b border-ink-100">
        <label htmlFor="global-search" className="sr-only">
          Search lessons, challenges and projects
        </label>
        <div className="flex items-center gap-3 px-5 py-4">
          <Search size={18} className="text-ink-400" aria-hidden="true" />
          <input
            id="global-search"
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lessons, challenges and projects"
            className="w-full bg-transparent text-base text-ink-900 outline-none placeholder:text-ink-400"
            autoComplete="off"
          />
          <kbd className="hidden rounded-md border border-ink-200 px-1.5 py-0.5 text-xs text-ink-500 sm:block">
            Esc
          </kbd>
        </div>
      </form>
      <ul className="max-h-[50vh] overflow-y-auto p-2">
        {results.length === 0 && (
          <li className="px-4 py-8 text-center text-sm text-ink-600">
            Nothing matches “{query}”. Try a topic like props or state.
          </li>
        )}
        {results.map((r, i) => {
          const Icon = kindIcon[r.kind];
          return (
            <li key={r.id}>
              <Link
                to={r.to}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-ink-50',
                  i === 0 && query && 'bg-path-50/70',
                )}
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-ink-100 text-ink-600">
                  <Icon size={17} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-ink-900">{r.title}</span>
                  <span className="block text-xs text-ink-500">
                    {r.kind} · {r.detail}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </Modal>
  );
}
