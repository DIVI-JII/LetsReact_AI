import type { Challenge } from '../types';

export interface TestResult {
  id: string;
  label: string;
  passed: boolean;
  failHint: string;
}

/**
 * Challenges are checked by reading the code the learner wrote. This is a
 * deliberate first-version shortcut: no code is executed, so the app stays safe
 * and dependency-free. A backend or sandbox can replace this later.
 */
/**
 * Removes line comments and block comments (including JSX comment braces) but leaves string
 * contents alone, so a URL such as "https://..." survives. Without this, code that
 * only appears inside a comment would wrongly satisfy a test.
 */
export function stripComments(code: string): string {
  return code.replace(
    /("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|\/\/[^\n]*|\/\*[\s\S]*?\*\//g,
    (_match, str: string | undefined) => str ?? '',
  );
}

export function runTests(code: string, challenge: { tests: Challenge['tests'] }): TestResult[] {
  const source = stripComments(code);
  return challenge.tests.map((test) => {
    let passed = false;
    try {
      passed = new RegExp(test.pattern).test(source);
    } catch {
      passed = false;
    }
    return { id: test.id, label: test.label, passed, failHint: test.failHint };
  });
}

export function allPassed(results: TestResult[]): boolean {
  return results.length > 0 && results.every((r) => r.passed);
}

export interface CounterFeatures {
  display: boolean;
  actions: ('increase' | 'decrease' | 'reset')[];
}

/** Works out what the live preview should render from the test results. */
export function getCounterFeatures(results: TestResult[]): CounterFeatures {
  const ok = (id: string) => results.find((r) => r.id === id)?.passed ?? false;
  const hasButtons = ok('buttons');
  const actions: CounterFeatures['actions'] = [];
  if (hasButtons && ok('increase')) actions.push('increase');
  if (hasButtons && ok('decrease')) actions.push('decrease');
  if (hasButtons && ok('reset')) actions.push('reset');
  return { display: ok('display') && ok('state'), actions };
}
