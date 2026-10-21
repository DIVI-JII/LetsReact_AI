import { ArrowRight, Clock } from 'lucide-react';
import type { Project } from '../types';
import { getIcon } from '../utils/icons';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

const tones = { Beginner: 'success', Intermediate: 'warning', Advanced: 'dark' } as const;

export function ProjectCard({ project }: { project: Project }) {
  const Icon = getIcon(project.icon);
  return (
    <Card interactive className="flex h-full flex-col p-6">
      <div className="mb-5 flex items-start justify-between">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-path-50 text-path-700">
          <Icon size={24} aria-hidden="true" />
        </span>
        <Badge tone={tones[project.difficulty]}>{project.difficulty}</Badge>
      </div>
      <h3 className="text-xl font-bold">{project.title}</h3>
      <p className="mt-1.5 text-sm leading-6 text-ink-600">{project.summary}</p>
      <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-ink-600">
        <Clock size={15} aria-hidden="true" /> {project.estimatedTime}
      </p>
      <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Concepts you will learn">
        {project.concepts.map((c) => (
          <li key={c} className="rounded-md bg-ink-100 px-2 py-1 text-xs font-medium text-ink-700">
            {c}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex-1" />
      <Button
        to={`/projects/${project.id}`}
        variant="primary"
        size="sm"
        iconRight={<ArrowRight size={16} />}
        className="w-full"
      >
        Start building
      </Button>
    </Card>
  );
}
