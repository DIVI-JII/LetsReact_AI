import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Compass } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ease } from '../../animations/variants';
import { Button } from '../ui/Button';
import { CodeBlock } from '../ui/CodeBlock';
import { CodePreview } from '../ui/CodePreview';

const CODE = `function Welcome() {\n  return <h1>Hello React</h1>;\n}`;

/** Types the snippet out once, then stops. Skips straight to the end if motion is reduced. */
function useTyped(text: string, startDelay = 800, speed = 42): number {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduce) {
      setCount(text.length);
      return;
    }
    let interval: number | undefined;
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        setCount((c) => {
          if (c >= text.length) {
            window.clearInterval(interval);
            return c;
          }
          return c + 1;
        });
      }, speed);
    }, startDelay);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
    };
  }, [text, startDelay, speed, reduce]);

  return count;
}

const stats = [
  { value: '12 Weeks', label: 'Structured learning' },
  { value: '50+ Lessons', label: 'Short practical lessons' },
  { value: 'Interactive', label: 'Learn by doing' },
  { value: 'Projects', label: 'Build real applications' },
];

export function Hero() {
  const typed = useTyped(CODE);
  const done = typed >= CODE.length;

  return (
    <section className="container-x pb-16 pt-12 sm:pt-16 lg:pt-24">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="text-5xl font-extrabold leading-[1.02] sm:text-6xl lg:text-[76px]"
          >
            Learn React by Building.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.12 }}
            className="mt-6 max-w-xl text-lg leading-8 text-ink-600 sm:text-xl"
          >
            A practical, interactive journey from React beginner to confident developer.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.24 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <Button to="/dashboard" size="lg" iconRight={<ArrowRight size={18} />}>
              Start Learning
            </Button>
            <Button to="/course" size="lg" variant="secondary" icon={<Compass size={18} />}>
              Explore Course
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.2 }}
          className="relative"
        >
          <div
            className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-path-200/60 via-path-100/30 to-transparent blur-2xl"
            aria-hidden="true"
          />
          <div className="animate-float space-y-4">
            <CodeBlock
              code={CODE.slice(0, typed)}
              filename="Welcome.jsx"
              caret={!done}
              className="min-h-[9.5rem] shadow-xl shadow-ink-950/10"
            />
            <CodePreview title="Live preview" className="shadow-xl shadow-ink-950/5" bodyClassName="min-h-[7.5rem]">
              <AnimatePresence mode="wait">
                {done ? (
                  <motion.h2
                    key="hello"
                    initial={{ opacity: 0, scale: 0.92, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                    className="font-display text-4xl font-extrabold text-ink-950"
                  >
                    Hello React
                  </motion.h2>
                ) : (
                  <motion.p key="wait" exit={{ opacity: 0 }} className="text-sm text-ink-400">
                    Waiting for code…
                  </motion.p>
                )}
              </AnimatePresence>
            </CodePreview>
          </div>
        </motion.div>
      </div>

      <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-ink-200 pt-8 lg:mt-24 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.value}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease, delay: i * 0.06 }}
          >
            <p className="font-display text-2xl font-extrabold text-ink-950 sm:text-3xl">{s.value}</p>
            <p className="mt-1 text-sm text-ink-600">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
