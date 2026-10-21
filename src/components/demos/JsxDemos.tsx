import { Shuffle } from 'lucide-react';
import { useState } from 'react';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { Button } from '../ui/Button';
import { DemoFrame } from './DemoFrame';

const names = ['Ada', 'Grace', 'Linus'];

export function JsxVisual() {
  const [i, setI] = useState(0);
  const name = names[i % names.length];
  return (
    <DemoFrame
      filename="Greeting.jsx"
      code={`const name = '${name}';\n\nreturn <h1>Hello, {name}</h1>;`}
      footer={
        <Button variant="accent" size="sm" icon={<Shuffle size={15} />} onClick={() => setI(i + 1)}>
          Next name
        </Button>
      }
    >
      <h1 className="font-display text-3xl font-extrabold">
        Hello, <AnimatedNumber value={name} />
      </h1>
    </DemoFrame>
  );
}

export function JsxInteractive() {
  const [name, setName] = useState('Ada');
  const [excited, setExcited] = useState(false);
  const heading = `Hello, ${name}${excited ? '!' : ''}`;
  return (
    <DemoFrame
      filename="Greeting.jsx"
      code={`const name = '${name}';\n\nreturn <h1>Hello, {name}${excited ? '!' : ''}</h1>;`}
      footer={
        <div className="flex w-full flex-wrap items-center gap-4">
          <div className="min-w-[10rem] flex-1">
            <label htmlFor="jsx-name" className="mb-1 block text-sm font-medium text-ink-700">
              Name
            </label>
            <input
              id="jsx-name"
              className="field"
              value={name}
              maxLength={20}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <label className="flex items-center gap-2 pt-5 text-sm font-medium text-ink-700">
            <input
              type="checkbox"
              checked={excited}
              onChange={(e) => setExcited(e.target.checked)}
              className="h-4 w-4 accent-path-600"
            />
            Add excitement
          </label>
        </div>
      }
    >
      <h1 className="break-all font-display text-3xl font-extrabold">{heading}</h1>
    </DemoFrame>
  );
}
