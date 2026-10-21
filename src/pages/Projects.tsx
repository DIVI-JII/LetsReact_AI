import { motion } from 'framer-motion';
import { ProjectCard } from '../components/ProjectCard';
import { PageHeader } from '../components/ui/PageHeader';
import { PageShell } from '../components/ui/PageShell';
import { fadeUp, stagger } from '../animations/variants';
import { projects } from '../data';

export default function Projects() {
  return (
    <PageShell>
      <PageHeader
        title="Projects"
        description="Put your lessons to work. Every project has a code editor and tests, just like the challenges."
      />
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((p) => (
          <motion.div key={p.id} variants={fadeUp}>
            <ProjectCard project={p} />
          </motion.div>
        ))}
      </motion.div>
    </PageShell>
  );
}
