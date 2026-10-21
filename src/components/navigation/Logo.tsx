import { Link } from 'react-router-dom';

export function Logo() {
  return (
    <Link to="/" className="inline-flex items-center gap-2.5" aria-label="LetsReact_AI home">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] bg-ink-950">
        <svg viewBox="0 0 32 32" width="20" height="20" aria-hidden="true">
          <circle cx="16" cy="16" r="2.6" fill="#5DD0E6" />
          {[0, 60, 120].map((deg) => (
            <ellipse
              key={deg}
              cx="16"
              cy="16"
              rx="11"
              ry="4.4"
              fill="none"
              stroke="#5DD0E6"
              strokeWidth="1.6"
              transform={`rotate(${deg} 16 16)`}
            />
          ))}
        </svg>
      </span>
      <span className="font-display text-xl font-extrabold tracking-tight text-ink-950">
        LetsReact_AI
      </span>
    </Link>
  );
}
