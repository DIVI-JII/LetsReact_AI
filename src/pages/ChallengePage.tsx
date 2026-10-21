import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CounterPreview } from '../components/CounterPreview';
import { TutorChat } from '../components/tutor/TutorChat';
import { PageHeader } from '../components/ui/PageHeader';
import { PageShell } from '../components/ui/PageShell';
import { CodeWorkspace } from '../components/workspace/CodeWorkspace';
import { getChallenge, getLesson } from '../data';
import { useProgress } from '../hooks/useProgress';
import { trackEvent } from '../lib/api';
import type { Challenge } from '../types';
import { getCounterFeatures } from '../utils/challenge';
import NotFound from './NotFound';

export default function ChallengePage() {
  const { challengeId } = useParams();
  const challenge = challengeId ? getChallenge(challengeId) : undefined;
  if (!challenge) {
    return (
      <NotFound
        title="We couldn’t find that challenge"
        description="Head to Practice to see the challenges that are open."
      />
    );
  }
  return <ChallengeView key={challenge.id} challenge={challenge} />;
}

function ChallengeView({ challenge }: { challenge: Challenge }) {
  const { progress, recordChallengeAttempt, completeChallenge } = useProgress();
  const lesson = getLesson(challenge.lessonId);

  useEffect(() => {
    trackEvent('challenge_viewed', challenge.id);
  }, [challenge.id]);

  const requirements = challenge.requirements.map((label, i) => ({
    label,
    testIds: challenge.requirementTests?.[i] ?? [],
  }));

  return (
    <PageShell className="max-w-[88rem]">
      <PageHeader
        title="Coding challenge"
        description="Build it, run the tests, and read the feedback. Every attempt teaches you something."
        back={{ to: '/practice', label: 'Practice' }}
      />
      <CodeWorkspace
        storageId={`challenge:${challenge.id}`}
        title={challenge.title}
        summary={challenge.summary}
        filename={challenge.filename}
        starterCode={challenge.starterCode}
        solution={challenge.solution}
        tests={challenge.tests}
        hints={challenge.hints}
        requirements={requirements}
        expected={challenge.expected}
        attempts={progress.challengeAttempts[challenge.id] ?? 0}
        solved={progress.completedChallenges.includes(challenge.id)}
        preview={
          challenge.id === 'build-a-counter'
            ? (results, hasRun) => <CounterPreview features={getCounterFeatures(hasRun ? results : [])} />
            : undefined
        }
        celebration={{
          text: `You solved “${challenge.title}”.`,
          backTo: '/practice',
          backLabel: 'Back to practice',
        }}
        onAttempt={() => recordChallengeAttempt(challenge.id)}
        onComplete={() => completeChallenge(challenge.id, challenge.title)}
      />
      {lesson && <TutorChat key={lesson.id} lessonId={lesson.id} lessonTitle={lesson.title} />}
    </PageShell>
  );
}
