import { ArrowRight, Eye, Play, RotateCcw, Target } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { ChallengeTest } from '../../types';
import { allPassed, runTests } from '../../utils/challenge';
import type { TestResult } from '../../utils/challenge';
import { ChallengePanel } from '../ChallengePanel';
import { CodeEditor } from '../CodeEditor';
import { TestResults } from '../TestResults';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { SuccessBurst } from '../ui/SuccessBurst';

export interface WorkspaceRequirement {
  label: string;
  testIds: string[];
}

interface CodeWorkspaceProps {
  /** Unique id, used to keep each learner's code separate. */
  storageId: string;
  title: string;
  summary: string;
  filename: string;
  starterCode: string;
  solution: string;
  tests: ChallengeTest[];
  hints: string[];
  requirements: WorkspaceRequirement[];
  expected: string[];
  attempts: number;
  solved: boolean;
  /** Shown inside the instructions card under the summary. */
  header?: ReactNode;
  /** Replaces the "what it should do" card with a live preview. */
  preview?: (results: TestResult[], hasRun: boolean) => ReactNode;
  celebration: { text: string; backTo: string; backLabel: string };
  onAttempt: () => void;
  /** Called after every run with the ids of the tests that passed. */
  onResults?: (passedIds: string[], allDone: boolean) => void;
  onComplete: () => void;
  /** Extra content below the editor (e.g. a project demo). */
  below?: ReactNode;
}

/** Instructions + editor + test results: the one workspace behind challenges and projects. */
export function CodeWorkspace(props: CodeWorkspaceProps) {
  const { user } = useAuth();
  const { storageId, tests, starterCode, solution, requirements } = props;
  // Per-user key so two people on one browser never see each other's code.
  const key = `LetsReact_AI:code:${user?.id ?? 'guest'}:${storageId}`;
  const [code, setCode] = useLocalStorage<string>(key, () => starterCode);
  const [results, setResults] = useState<TestResult[]>(() => runTests(code, { tests }));
  const [hasRun, setHasRun] = useState(false);
  const [hintsShown, setHintsShown] = useState(0);
  const [celebrate, setCelebrate] = useState(false);

  const passed = useMemo(() => new Set(results.filter((r) => r.passed).map((r) => r.id)), [results]);
  const requirementsMet = requirements.map((r) => hasRun && r.testIds.every((id) => passed.has(id)));

  useEffect(() => {
    setHasRun(false);
  }, [code]);

  const run = () => {
    const next = runTests(code, { tests });
    setResults(next);
    setHasRun(true);
    props.onAttempt();
    const ids = next.filter((r) => r.passed).map((r) => r.id);
    const done = allPassed(next);
    props.onResults?.(ids, done);
    if (done) {
      props.onComplete();
      setCelebrate(true);
    }
  };

  const resetCode = () => {
    setCode(starterCode);
    setResults(runTests(starterCode, { tests }));
    setHasRun(false);
  };

  const showSolution = () => {
    setCode(solution);
    setHasRun(false);
  };

  return (
    <>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] xl:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_minmax(0,1fr)]">
        <ChallengePanel
          challenge={{ title: props.title, summary: props.summary, requirements: requirements.map((r) => r.label), hints: props.hints }}
          header={props.header}
          attempts={props.attempts}
          hintsShown={hintsShown}
          onShowHint={() => setHintsShown((n) => Math.min(n + 1, props.hints.length))}
          requirementsMet={requirementsMet}
        />

        <div className="flex min-w-0 flex-col gap-3">
          <CodeEditor value={code} onChange={setCode} filename={props.filename} />
          <div className="flex flex-wrap gap-2">
            <Button variant="accent" icon={<Play size={16} />} onClick={run}>
              {hasRun ? 'Run tests again' : 'Run tests'}
            </Button>
            <Button variant="secondary" icon={<RotateCcw size={16} />} onClick={resetCode}>
              Start over
            </Button>
            {props.attempts >= 3 && (
              <Button variant="ghost" icon={<Eye size={16} />} onClick={showSolution}>
                Show solution
              </Button>
            )}
          </div>
          {props.solved && (
            <p className="text-sm text-emerald-700">You’ve already completed this. Feel free to experiment.</p>
          )}
          {props.below}
        </div>

        <div className="flex min-w-0 flex-col gap-5 lg:col-span-2 xl:col-span-1">
          {props.preview ? (
            props.preview(results, hasRun)
          ) : (
            <Card className="p-5">
              <h3 className="flex items-center gap-2 text-base font-bold">
                <Target size={16} aria-hidden="true" /> What it should do
              </h3>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-ink-700">
                {props.expected.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </Card>
          )}
          <TestResults results={results} hasRun={hasRun} />
        </div>
      </div>

      <Modal open={celebrate} onClose={() => setCelebrate(false)} label="Complete" hideClose>
        <div className="flex flex-col items-center px-6 py-10 text-center">
          <SuccessBurst />
          <h2 className="mt-6 text-3xl font-extrabold">Complete!</h2>
          <p className="mt-2 max-w-sm text-ink-600">
            All {results.length} tests pass. {props.celebration.text}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button to={props.celebration.backTo} variant="accent" iconRight={<ArrowRight size={16} />}>
              {props.celebration.backLabel}
            </Button>
            <Button variant="secondary" onClick={() => setCelebrate(false)}>
              Keep editing
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
