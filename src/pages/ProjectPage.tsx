import { Clock } from 'lucide-react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TaskManagerDemo } from '../components/TaskManagerDemo';
import { TutorChat } from '../components/tutor/TutorChat';
import { Badge } from '../components/ui/Badge';
import { PageHeader } from '../components/ui/PageHeader';
import { PageShell } from '../components/ui/PageShell';
import { CodeWorkspace } from '../components/workspace/CodeWorkspace';
import { getLesson, getProject } from '../data';
import { useProgress } from '../hooks/useProgress';
import { trackEvent } from '../lib/api';
import type { Project } from '../types';
import NotFound from './NotFound';

const tones = { Beginner: 'success', Intermediate: 'warning', Advanced: 'dark' } as const;

export default function ProjectPage() {
  const { projectId } = useParams();
  const project = projectId ? getProject(projectId) : undefined;
  if (!project) {
    return (
      <NotFound
        title="We couldn’t find that project"
        description="Browse the projects page to see what you can build."
      />
    );
  }
  return <ProjectView key={project.id} project={project} />;
}

function ProjectView({ project }: { project: Project }) {
  const { progress, recordChallengeAttempt, setRequirementsDone } = useProgress();
  const lesson = getLesson(project.lessonId);
  const { workspace } = project;

  useEffect(() => {
    trackEvent('project_viewed', project.id);
  }, [project.id]);

  const attemptKey = `project:${project.id}`;
  const doneIds = progress.projectRequirements[project.id] ?? [];
  const solved = project.requirements.every((r) => doneIds.includes(r.id));

  const header = (
    <div className="mt-3 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={tones[project.difficulty]}>{project.difficulty}</Badge>
        <span className="inline-flex items-center gap-1.5 text-sm text-ink-600">
          <Clock size={14} aria-hidden="true" /> {project.estimatedTime}
        </span>
      </div>
      <p className="text-sm leading-6 text-ink-700">{project.description}</p>
      <ul className="flex flex-wrap gap-1.5" aria-label="Concepts you will practice">
        {project.concepts.map((c) => (
          <li key={c} className="rounded-md bg-ink-100 px-2 py-1 text-xs font-medium text-ink-700">
            {c}
          </li>
        ))}
      </ul>
      <p className="text-sm font-semibold text-ink-900" aria-live="polite">
        {doneIds.filter((id) => project.requirements.some((r) => r.id === id)).length} / {project.requirements.length} requirements completed so far
      </p>
      {project.steps.length > 0 && (
        <details className="rounded-xl border border-ink-100 bg-ink-50 p-3 text-sm">
          <summary className="cursor-pointer font-semibold text-ink-900">How to build it</summary>
          <ol className="mt-3 space-y-2.5">
            {project.steps.map((step, i) => (
              <li key={step.title} className="flex gap-2.5">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink-950 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span>
                  <span className="font-semibold text-ink-950">{step.title}. </span>
                  <span className="text-ink-600">{step.description}</span>
                </span>
              </li>
            ))}
          </ol>
        </details>
      )}
    </div>
  );

  return (
    <PageShell className="max-w-[88rem]">
      <PageHeader
        title={`Build a ${project.title}`}
        description={project.summary}
        back={{ to: '/projects', label: 'All projects' }}
      />
      <CodeWorkspace
        storageId={`project:${project.id}`}
        title="Requirements"
        summary="Write the code, run the tests, and each requirement ticks off when its tests pass."
        header={header}
        filename={workspace.filename}
        starterCode={workspace.starterCode}
        solution={workspace.solution}
        tests={workspace.tests}
        hints={workspace.hints}
        requirements={project.requirements.map((r) => ({ label: r.label, testIds: r.testIds }))}
        expected={workspace.expected}
        attempts={progress.challengeAttempts[attemptKey] ?? 0}
        solved={solved}
        below={project.id === 'task-manager' ? <TaskManagerDemo /> : undefined}
        celebration={{
          text: `You built the ${project.title}.`,
          backTo: '/projects',
          backLabel: 'Back to projects',
        }}
        onAttempt={() => recordChallengeAttempt(attemptKey)}
        onResults={(passed, allDone) => {
          const met = project.requirements
            .filter((r) => r.testIds.every((id) => passed.includes(id)))
            .map((r) => r.id);
          setRequirementsDone(project.id, met, allDone ? project.title : undefined);
        }}
        onComplete={() => undefined}
      />
      {lesson && <TutorChat key={lesson.id} lessonId={lesson.id} lessonTitle={lesson.title} />}
    </PageShell>
  );
}
