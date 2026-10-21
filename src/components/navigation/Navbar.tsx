import { motion } from 'framer-motion';
import { Menu, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useProgress } from '../../hooks/useProgress';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { Drawer } from '../ui/Drawer';
import { Logo } from './Logo';
import { NotificationsMenu } from './NotificationsMenu';
import { SearchPalette } from './SearchPalette';
import { UserMenu } from './UserMenu';

interface NavLink {
  label: string;
  to: string;
  match: string[];
}

const learnerLinks: NavLink[] = [
  { label: 'Learn', to: '/course', match: ['/course', '/lessons', '/dashboard'] },
  { label: 'Practice', to: '/practice', match: ['/practice', '/challenges'] },
  { label: 'Projects', to: '/projects', match: ['/projects'] },
  { label: 'Progress', to: '/progress', match: ['/progress'] },
];

const adminLink: NavLink = { label: 'Admin', to: '/admin', match: ['/admin'] };

/** Tiny save indicator. Quiet when all is well, visible when something needs attention. */
function SyncIndicator() {
  const { syncStatus } = useProgress();
  const text =
    syncStatus === 'saving'
      ? 'Saving…'
      : syncStatus === 'saved'
        ? 'Saved'
        : syncStatus === 'error'
          ? 'Offline, retrying'
          : syncStatus === 'conflict'
            ? 'Updated from another device'
            : null;
  if (!text) return null;
  return (
    <span
      role="status"
      className={cn(
        'hidden text-xs font-medium lg:inline',
        syncStatus === 'error' || syncStatus === 'conflict' ? 'text-amber-700' : 'text-ink-500',
      )}
    >
      {text}
    </span>
  );
}

export function Navbar() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const links = user ? (user.role === 'admin' ? [...learnerLinks, adminLink] : learnerLinks) : [];

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!user) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [user]);

  const isActive = (match: string[]) => match.some((m) => pathname.startsWith(m));

  return (
    <>
      <header className="glass sticky top-0 z-50 border-x-0 border-t-0 border-ink-100/80">
        <div className="container-x flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-10">
            <Logo />
            <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
              {links.map((link) => {
                const active = isActive(link.match);
                return (
                  <Link
                    key={link.label}
                    to={link.to}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative rounded-xl px-3.5 py-2 text-[15px] font-semibold transition-colors',
                      active ? 'text-ink-950' : 'text-ink-600 hover:text-ink-950',
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-xl bg-ink-100"
                        transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                      />
                    )}
                    <span className="relative">{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {user ? (
            <div className="flex items-center gap-1.5">
              <SyncIndicator />
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="inline-flex items-center gap-2 rounded-xl p-2.5 text-ink-600 transition hover:bg-ink-100 hover:text-ink-950 lg:border lg:border-ink-200 lg:bg-white lg:px-3 lg:py-2"
              >
                <Search size={18} />
                <span className="hidden text-sm text-ink-500 lg:inline">Search</span>
                <kbd className="hidden rounded border border-ink-200 px-1.5 text-xs text-ink-500 lg:inline">Ctrl K</kbd>
              </button>
              <NotificationsMenu />
              <div className="ml-1">
                <UserMenu />
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                className="ml-1 rounded-xl p-2.5 text-ink-700 transition hover:bg-ink-100 md:hidden"
              >
                <Menu size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button to="/login" variant="ghost" size="sm">
                Sign in
              </Button>
              <Button to="/register" size="sm">
                Get started
              </Button>
            </div>
          )}
        </div>
      </header>

      {user && (
        <>
          <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} title="Menu" side="right">
            <nav aria-label="Mobile" className="flex flex-col gap-1 p-3">
              {[{ label: 'Dashboard', to: '/dashboard', match: ['/dashboard'] }, ...links].map((link, i) => {
                const active = isActive(link.match);
                return (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.04 }}
                  >
                    <Link
                      to={link.to}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'block rounded-xl px-4 py-3.5 text-lg font-semibold transition',
                        active ? 'bg-path-50 text-path-800' : 'text-ink-800 hover:bg-ink-50',
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
          </Drawer>
          <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
        </>
      )}
    </>
  );
}
