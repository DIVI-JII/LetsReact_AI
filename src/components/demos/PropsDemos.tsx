import { motion } from 'framer-motion';
import { Shuffle } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../utils/cn';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { Button } from '../ui/Button';
import { DemoFrame } from './DemoFrame';

interface Person {
  name: string;
  role: string;
  online: boolean;
}

const people: Person[] = [
  { name: 'Ada', role: 'Engineer', online: true },
  { name: 'Grace', role: 'Designer', online: false },
  { name: 'Linus', role: 'Reviewer', online: true },
];

function ProfileCardPreview({ name, role, online }: Person) {
  return (
    <motion.div
      layout
      className="flex w-full max-w-[16rem] items-center gap-3 rounded-2xl border border-ink-200 bg-white p-4 shadow-sm"
    >
      <span className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-path-100 font-display text-lg font-bold text-path-800">
        {(name[0] ?? '?').toUpperCase()}
        <span
          className={cn(
            'absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-white',
            online ? 'bg-emerald-500' : 'bg-ink-300',
          )}
          title={online ? 'Online' : 'Offline'}
        />
      </span>
      <span className="min-w-0">
        <span className="block truncate font-display text-lg font-bold text-ink-950">
          <AnimatedNumber value={name || 'Name'} />
        </span>
        <span className="block truncate text-sm text-ink-600">{role || 'Role'}</span>
      </span>
    </motion.div>
  );
}

function propsCode({ name, role, online }: Person): string {
  return `<ProfileCard\n  name="${name}"\n  role="${role}"\n  online={${online}}\n/>`;
}

export function PropsVisual() {
  const [i, setI] = useState(0);
  const person = people[i % people.length];
  return (
    <DemoFrame
      filename="App.jsx"
      code={propsCode(person)}
      footer={
        <Button variant="accent" size="sm" icon={<Shuffle size={15} />} onClick={() => setI(i + 1)}>
          Next person
        </Button>
      }
    >
      <ProfileCardPreview {...person} />
    </DemoFrame>
  );
}

export function PropsInteractive() {
  const [person, setPerson] = useState<Person>(people[0]);
  return (
    <DemoFrame
      filename="App.jsx"
      code={propsCode(person)}
      footer={
        <div className="grid w-full gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="prop-name" className="mb-1 block text-sm font-medium text-ink-700">
              name
            </label>
            <input
              id="prop-name"
              className="field"
              value={person.name}
              maxLength={16}
              onChange={(e) => setPerson({ ...person, name: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="prop-role" className="mb-1 block text-sm font-medium text-ink-700">
              role
            </label>
            <input
              id="prop-role"
              className="field"
              value={person.role}
              maxLength={20}
              onChange={(e) => setPerson({ ...person, role: e.target.value })}
            />
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-ink-700 sm:col-span-2">
            <input
              type="checkbox"
              checked={person.online}
              onChange={(e) => setPerson({ ...person, online: e.target.checked })}
              className="h-4 w-4 accent-path-600"
            />
            online
          </label>
        </div>
      }
    >
      <ProfileCardPreview {...person} />
    </DemoFrame>
  );
}
