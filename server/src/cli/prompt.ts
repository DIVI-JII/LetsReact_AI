import { createInterface } from 'node:readline';

/** Parses `--key value` pairs from the command line. */
export function parseArgs(argv: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--') && i + 1 < argv.length && !argv[i + 1].startsWith('--')) {
      out[arg.slice(2)] = argv[++i];
    }
  }
  return out;
}

/** Reads a line without echoing it. Falls back to a plain stdin line when not a terminal. */
export function promptHidden(question: string): Promise<string> {
  if (!process.stdin.isTTY) {
    return new Promise((resolve) => {
      let data = '';
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', (chunk) => (data += chunk));
      process.stdin.on('end', () => resolve(data.split(/\r?\n/)[0] ?? ''));
    });
  }

  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    // Hide everything typed after the prompt itself has been printed.
    let muted = false;
    const writable = rl as unknown as { _writeToOutput: (s: string) => void };
    const original = writable._writeToOutput.bind(rl);
    writable._writeToOutput = (s: string) => {
      if (!muted) original(s);
    };
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write('\n');
      resolve(answer);
    });
    muted = true;
  });
}
