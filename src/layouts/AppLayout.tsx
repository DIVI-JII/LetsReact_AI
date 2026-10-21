import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { pageTransition } from '../animations/variants';
import { Logo } from '../components/navigation/Logo';
import { Navbar } from '../components/navigation/Navbar';

function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-white/60">
      <div className="container-x flex flex-col items-start justify-between gap-4 py-8 text-sm text-ink-600 sm:flex-row sm:items-center">
        <Logo />
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          <Link to="/course" className="hover:text-ink-950">Course</Link>
          <Link to="/practice" className="hover:text-ink-950">Practice</Link>
          <Link to="/projects" className="hover:text-ink-950">Projects</Link>
          <Link to="/progress" className="hover:text-ink-950">Progress</Link>
        </nav>
        <p>Learn React by building it.</p>
      </div>
    </footer>
  );
}

export function AppLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only z-[100] rounded-lg bg-ink-950 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Navbar />
      <motion.main
        id="main"
        key={pathname}
        variants={pageTransition}
        initial="initial"
        animate="animate"
        className="flex-1"
      >
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  );
}
