import { AnimatePresence, motion } from 'framer-motion';
import { LayoutDashboard, LogOut, Settings, ShieldCheck } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useDismiss } from '../../hooks/useDismiss';

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? '?') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}

export function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);
  useDismiss(open, close, ref);

  if (!user) return null;

  const onLogout = async () => {
    close();
    await logout().catch(() => undefined);
    navigate('/', { replace: true });
  };

  const item = 'flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-ink-800 transition hover:bg-ink-50';

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        aria-expanded={open}
        aria-haspopup="true"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-path-400 to-path-700 text-xs font-bold text-white ring-2 ring-white transition hover:scale-105"
      >
        {initials(user.name)}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 top-full z-50 mt-2 w-64 origin-top-right rounded-2xl border border-ink-100 bg-white p-2 shadow-xl"
          >
            <div className="px-3 py-2.5">
              <p className="truncate text-sm font-bold text-ink-950">{user.name}</p>
              <p className="truncate text-xs text-ink-500">{user.email}</p>
            </div>
            <Link to="/dashboard" onClick={close} className={item}>
              <LayoutDashboard size={16} /> Dashboard
            </Link>
            <Link to="/account" onClick={close} className={item}>
              <Settings size={16} /> Account
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin" onClick={close} className={item}>
                <ShieldCheck size={16} /> Admin portal
              </Link>
            )}
            <button type="button" onClick={onLogout} className={item}>
              <LogOut size={16} /> Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
