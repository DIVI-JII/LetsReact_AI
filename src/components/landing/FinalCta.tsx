import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';

export function FinalCta() {
  return (
    <section className="container-x py-20 sm:py-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-ink-950 px-6 py-16 text-center sm:px-12 sm:py-24">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 -top-24 h-80 w-80 animate-drift rounded-full bg-path-500/30 blur-3xl" />
            <div
              className="absolute -bottom-28 -right-16 h-96 w-96 animate-drift rounded-full bg-path-300/20 blur-3xl"
              style={{ animationDelay: '-7s' }}
            />
          </div>
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
              Your React journey starts here.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-lg text-ink-300">
              Twelve weeks. One short lesson at a time.
            </p>
            <Button
              to="/dashboard"
              variant="light"
              size="lg"
              className="mt-9"
              iconRight={<ArrowRight size={18} />}
            >
              Start Learning React
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
