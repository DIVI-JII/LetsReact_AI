import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, GraduationCap, Send, X } from 'lucide-react';
import { Fragment, useEffect, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ApiError, api } from '../../lib/api';
import { cn } from '../../utils/cn';

interface TutorReply {
  kind: 'answer' | 'other_module' | 'off_topic' | 'unavailable';
  text: string;
  lesson?: { id: string; title: string; weekNumber: number };
}

interface Msg {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  kind?: TutorReply['kind'];
  lesson?: TutorReply['lesson'];
}

const STARTERS = ['Explain this lesson simply', 'Give me an example', 'Quiz me on this'];
const AFTER_ANSWER = ['Got it, thanks', 'Explain it differently'];

/** Renders **bold** and `code` without ever inserting raw HTML. */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2)
      return (
        <code key={i} className="rounded bg-ink-100 px-1 py-0.5 font-mono text-[0.85em] text-ink-900">
          {part.slice(1, -1)}
        </code>
      );
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function RichText({ text }: { text: string }) {
  const blocks = text.split(/```[a-zA-Z]*\n?/g);
  return (
    <div className="space-y-2">
      {blocks.map((block, i) =>
        i % 2 === 1 ? (
          <pre key={i} className="overflow-x-auto rounded-lg bg-ink-950 p-3 font-mono text-xs leading-5 text-ink-50">
            <code>{block.trim()}</code>
          </pre>
        ) : (
          block
            .split(/\n{2,}/)
            .filter((p) => p.trim())
            .map((p, j) => (
              <p key={`${i}-${j}`} className="whitespace-pre-wrap">
                {inline(p.trim())}
              </p>
            ))
        ),
      )}
    </div>
  );
}

function storageKey(lessonId: string) {
  return `LetsReact_AI:tutor:${lessonId}`;
}

function loadMessages(lessonId: string): Msg[] {
  try {
    const raw = sessionStorage.getItem(storageKey(lessonId));
    const parsed = raw ? (JSON.parse(raw) as Msg[]) : [];
    return Array.isArray(parsed) ? parsed.slice(-40) : [];
  } catch {
    return [];
  }
}

export function TutorChat({ lessonId, lessonTitle }: { lessonId: string; lessonTitle: string }) {
  // null = still checking; the button is always shown so learners can find the tutor.
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(() => loadMessages(lessonId));
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nextId = useRef(messages.length + 1);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .get<{ enabled: boolean }>('/api/tutor/status')
      .then((s) => !cancelled && setEnabled(s.enabled))
      .catch(() => !cancelled && setEnabled(false));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey(lessonId), JSON.stringify(messages.slice(-40)));
    } catch {
      /* private mode or storage blocked: the chat still works for this visit */
    }
  }, [lessonId, messages]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const send = async (text: string) => {
    const content = text.trim().slice(0, 1000);
    if (!content || busy || enabled === false) return;
    const userMsg: Msg = { id: nextId.current++, role: 'user', text: content };
    const history = [...messages, userMsg];
    setMessages(history);
    setDraft('');
    setError(null);
    setBusy(true);
    try {
      const res = await api.post<TutorReply>('/api/tutor/chat', {
        lessonId,
        messages: history.slice(-8).map((m) => ({ role: m.role, content: m.text })),
      });
      setMessages((prev) => [
        ...prev,
        { id: nextId.current++, role: 'assistant', text: res.text, kind: res.kind, lesson: res.lesson },
      ]);
    } catch (e) {
      setError(
        e instanceof ApiError && e.status === 429
          ? 'You’re asking quickly. Take a breath and try again in a minute.'
          : e instanceof ApiError
            ? e.message
            : 'Something went wrong. Please try again.',
      );
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(draft);
  };
  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void send(draft);
    }
  };

  const last = messages[messages.length - 1];
  const showAfterChips = !busy && last?.role === 'assistant' && last.kind === 'answer';

  return (
    <>
      {!open && (
        <motion.button
          type="button"
          onClick={() => setOpen(true)}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-path-600 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-path-700"
        >
          <GraduationCap size={18} aria-hidden="true" /> Ask the tutor
        </motion.button>
      )}

      <AnimatePresence>
        {open && (
          <motion.section
            role="dialog"
            aria-label={`Tutor for ${lessonTitle}`}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-4 right-4 z-40 flex h-[min(36rem,calc(100vh-6rem))] w-[min(26rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-2xl"
          >
            <header className="flex items-start justify-between gap-3 border-b border-ink-100 bg-path-50 px-4 py-3">
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-sm font-bold text-path-900">
                  <GraduationCap size={16} aria-hidden="true" /> Lesson tutor
                </p>
                <p className="truncate text-xs text-path-800/80">Helping with: {lessonTitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close tutor"
                className="rounded-lg p-1.5 text-ink-600 transition hover:bg-white"
              >
                <X size={18} />
              </button>
            </header>

            <div ref={listRef} aria-live="polite" className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-[15px] leading-6">
              {enabled === false && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  <p className="font-semibold">The tutor isn’t switched on yet.</p>
                  <p className="mt-1">
                    The person running this app needs to add <code>NVIDIA_API_KEY</code> or <code>GEMINI_API_KEY</code> to{' '}
                    <code>server/.env</code> and restart the API. Then this chat starts answering.
                  </p>
                </div>
              )}
              {enabled !== false && messages.length === 0 && (
                <div className="rounded-2xl bg-ink-50 p-4 text-ink-800">
                  <p className="font-semibold">Hi! Stuck on “{lessonTitle}”?</p>
                  <p className="mt-1 text-sm text-ink-600">
                    Ask me anything about this lesson and I’ll explain it until it clicks. For other topics I’ll point you to the right lesson.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {STARTERS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => void send(s)}
                        className="rounded-full border border-path-200 bg-white px-3 py-1.5 text-xs font-semibold text-path-800 transition hover:bg-path-50"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m) => (
                <div key={m.id} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <div
                    className={cn(
                      'max-w-[88%] rounded-2xl px-3.5 py-2.5',
                      m.role === 'user' ? 'rounded-br-md bg-path-600 text-white' : 'rounded-bl-md bg-ink-50 text-ink-900',
                      m.kind === 'other_module' && 'border border-amber-200 bg-amber-50',
                    )}
                  >
                    {m.role === 'user' ? <p className="whitespace-pre-wrap">{m.text}</p> : <RichText text={m.text} />}
                    {m.kind === 'other_module' && m.lesson && (
                      <Link
                        to={`/lessons/${m.lesson.id}`}
                        onClick={() => setOpen(false)}
                        className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-path-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-path-700"
                      >
                        Go to “{m.lesson.title}” <ArrowRight size={14} aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}

              {busy && (
                <div className="flex justify-start" role="status" aria-label="Tutor is typing">
                  <div className="flex gap-1 rounded-2xl rounded-bl-md bg-ink-50 px-4 py-3">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-ink-400" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}

              {showAfterChips && (
                <div className="flex flex-wrap gap-2">
                  {AFTER_ANSWER.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => void send(s === 'Explain it differently' ? 'I didn’t understand. Please explain it differently, in simpler steps.' : s)}
                      className="rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-800 transition hover:bg-ink-50"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {error && (
                <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                  {error}
                </p>
              )}
            </div>

            <form onSubmit={onSubmit} className="flex items-end gap-2 border-t border-ink-100 p-3">
              <label htmlFor="tutor-input" className="sr-only">
                Your question
              </label>
              <textarea
                id="tutor-input"
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKey}
                rows={1}
                maxLength={1000}
                placeholder="Ask about this lesson…"
                className="field max-h-28 min-h-[2.75rem] flex-1 resize-none"
              />
              <button
                type="submit"
                disabled={busy || enabled === false || !draft.trim()}
                aria-label="Send"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-path-600 text-white transition hover:bg-path-700 disabled:opacity-40"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
