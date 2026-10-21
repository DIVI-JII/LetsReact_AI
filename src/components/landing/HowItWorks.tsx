import { motion } from 'framer-motion';
import {
  BookOpen,
  ClipboardCheck,
  Code2,
  Eye,
  MessageCircle,
  TrendingUp,
} from 'lucide-react';
import { ease } from '../../animations/variants';
import { Reveal } from '../ui/Reveal';

const steps = [
  { title: 'Learn', body: 'A short lesson in plain language.', icon: BookOpen },
  { title: 'Observe', body: 'Watch a live example do what the code says.', icon: Eye },
  { title: 'Practice', body: 'Change the code and see what happens.', icon: Code2 },
  { title: 'Test', body: 'A few quick questions, no pressure.', icon: ClipboardCheck },
  { title: 'Get Feedback', body: 'Hints that explain, not just grade.', icon: MessageCircle },
  { title: 'Progress', body: 'Watch every step add up.', icon: TrendingUp },
];

export function HowItWorks() {
  return (
    <section className="border-y border-ink-100 bg-white/60 py-20 sm:py-24" aria-labelledby="how-title">
      <div className="container-x">
        <Reveal className="max-w-2xl">
          <h2 id="how-title" className="text-3xl font-extrabold sm:text-4xl lg:text-5xl">
            One friendly loop, repeated in every lesson.
          </h2>
          <p className="mt-4 text-lg text-ink-600">
            You never face a wall of theory. Each idea is explained, shown, practiced and checked.
          </p>
        </Reveal>

        <ol className="relative mt-14 grid gap-8 lg:grid-cols-6 lg:gap-4">
          <motion.span
            aria-hidden="true"
            className="absolute left-[8%] right-[8%] top-7 hidden h-px origin-left bg-ink-200 lg:block"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.2, ease }}
          />
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.li
                key={step.title}
                className="relative flex gap-4 lg:flex-col lg:items-center lg:gap-5 lg:text-center"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, ease, delay: i * 0.09 }}
              >
                {i < steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-7 top-14 h-[calc(100%-1.5rem+2rem)] w-px -translate-x-1/2 bg-ink-200 lg:hidden"
                  />
                )}
                <span className="relative z-10 inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-ink-200 bg-white text-path-700 shadow-sm">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg font-bold">{step.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-ink-600">{step.body}</p>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
