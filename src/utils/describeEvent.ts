import { getLesson } from '../data/lessons';
import { getProject } from '../data/projects';
import { getChallenge } from '../data/challenges';
import type { ActivityEvent } from '../types/api';

function lessonName(id: string | null): string {
  return (id && getLesson(id)?.title) || id || 'a lesson';
}
function challengeName(id: string | null): string {
  return (id && getChallenge(id)?.title) || id || 'a challenge';
}
function projectName(id: string | null): string {
  return (id && getProject(id)?.title) || id || 'a project';
}

/** Turns a stored activity event into a sentence an admin can read at a glance. */
export function describeEvent(e: ActivityEvent): string {
  const d = e.detail ?? {};
  switch (e.type) {
    case 'registered':
      return 'Created their account';
    case 'login':
      return 'Signed in';
    case 'lesson_viewed':
      return `Opened lesson “${lessonName(e.refId)}”`;
    case 'section_completed':
      return `Finished section ${String(d.sections ?? '')} of “${lessonName(e.refId)}”`;
    case 'quiz_completed':
      return `Scored ${String(d.percent ?? '?')}% on the “${lessonName(e.refId)}” quiz`;
    case 'lesson_completed':
      return `Completed lesson “${lessonName(e.refId)}”`;
    case 'challenge_viewed':
      return `Opened challenge “${challengeName(e.refId)}”`;
    case 'challenge_attempt':
      return `Attempted challenge “${challengeName(e.refId)}” (attempt ${String(d.attempts ?? '?')})`;
    case 'challenge_completed':
      return `Solved challenge “${challengeName(e.refId)}”`;
    case 'project_viewed':
      return `Opened project “${projectName(e.refId)}”`;
    case 'project_requirement_done':
      return `Ticked off a requirement in “${projectName(e.refId)}”`;
    case 'project_requirement_undone':
      return `Unticked a requirement in “${projectName(e.refId)}”`;
    case 'badge_earned':
      return `Earned badge “${e.refId ?? ''}”`;
    default:
      return e.type.replace(/_/g, ' ');
  }
}
