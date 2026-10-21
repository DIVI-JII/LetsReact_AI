import { Layers, MousePointerClick, Rocket } from 'lucide-react';
import { Card } from '../ui/Card';
import { Reveal } from '../ui/Reveal';

const groups = [
  {
    title: 'React Foundations',
    summary: 'How React thinks about the screen.',
    icon: Layers,
    topics: ['JSX', 'Components', 'Props', 'Events', 'State'],
  },
  {
    title: 'Interactive Applications',
    summary: 'Screens that respond to people.',
    icon: MousePointerClick,
    topics: ['Lists', 'Conditional rendering', 'Forms', 'Validation', 'API requests', 'Navigation'],
  },
  {
    title: 'Professional React',
    summary: 'Habits that make code last.',
    icon: Rocket,
    topics: ['Context', 'Custom hooks', 'Reusable logic', 'Debugging', 'Testing', 'Deployment'],
  },
];

export function WhatYouWillLearn() {
  return (
    <section className="container-x py-20 sm:py-24" aria-labelledby="learn-title">
      <Reveal className="max-w-2xl">
        <h2 id="learn-title" className="text-3xl font-extrabold sm:text-4xl lg:text-5xl">
          What you’ll learn, month by month.
        </h2>
      </Reveal>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {groups.map((g, i) => {
          const Icon = g.icon;
          return (
            <Reveal key={g.title} delay={i * 0.08} className="h-full">
              <Card interactive className="group h-full p-7">
                <span className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-950 text-path-300 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <h3 className="text-xl font-bold">{g.title}</h3>
                <p className="mt-1 text-sm text-ink-600">{g.summary}</p>
                <ul className="mt-6 space-y-2.5">
                  {g.topics.map((t) => (
                    <li
                      key={t}
                      className="flex items-center gap-3 text-[15px] font-medium text-ink-800 transition-transform duration-200 group-hover:translate-x-1"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-path-400 transition-colors group-hover:bg-path-600" />
                      {t}
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
