import { projects } from '../../data';
import { ProjectCard } from '../ProjectCard';
import { Reveal } from '../ui/Reveal';

export function ProjectsSection() {
  return (
    <section className="border-t border-ink-100 bg-white/60 py-20 sm:py-24" aria-labelledby="projects-title">
      <div className="container-x">
        <Reveal className="max-w-2xl">
          <h2 id="projects-title" className="text-3xl font-extrabold sm:text-4xl lg:text-5xl">
            Build real projects, not toy examples.
          </h2>
          <p className="mt-4 text-lg text-ink-600">
            Every project puts the lessons to work in something you can show someone.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 0.07} className="h-full">
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
