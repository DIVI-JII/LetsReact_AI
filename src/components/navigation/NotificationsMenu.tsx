import { AnimatePresence, motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { useRef, useState } from 'react';
import { mockNotifications } from '../../data';
import { useDismiss } from '../../hooks/useDismiss';
import { useProgress } from '../../hooks/useProgress';
import { timeAgo } from '../../utils/date';

export function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { progress, markNotificationsRead } = useProgress();
  useDismiss(open, () => setOpen(false), ref);

  const unread = !progress.notificationsRead;

  const toggle = () => {
    setOpen((v) => !v);
    if (!open) markNotificationsRead();
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-label={unread ? 'Notifications, you have unread items' : 'Notifications'}
        aria-expanded={open}
        aria-haspopup="true"
        className="relative rounded-xl p-2.5 text-ink-600 transition hover:bg-ink-100 hover:text-ink-950"
      >
        <Bell size={19} />
        {unread && (
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-path-500 ring-2 ring-white" />
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 top-full z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] origin-top-right overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-xl"
          >
            <div className="border-b border-ink-100 px-4 py-3 text-sm font-bold text-ink-950">
              Notifications
            </div>
            <ul>
              {mockNotifications.map((n) => (
                <li key={n.id} className="border-b border-ink-100 px-4 py-3 last:border-0">
                  <p className="text-sm font-semibold text-ink-900">{n.title}</p>
                  <p className="mt-0.5 text-sm text-ink-600">{n.body}</p>
                  <p className="mt-1 text-xs text-ink-500">{timeAgo(n.at)}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
