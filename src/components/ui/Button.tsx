import { Link } from 'react-router-dom';
import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import { cn } from '../../utils/cn';

type Variant = 'primary' | 'accent' | 'secondary' | 'soft' | 'ghost' | 'light';
type Size = 'sm' | 'md' | 'lg';

// Full class names are written out so Tailwind's scanner can find every one.
const variantClass: Record<Variant, string> = {
  primary: 'btn-primary',
  accent: 'btn-accent',
  secondary: 'btn-secondary',
  soft: 'btn-soft',
  ghost: 'btn-ghost',
  light: 'btn-light',
};

const sizeClass: Record<Size, string> = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** Renders a router link styled as a button. */
  to?: string;
  icon?: ReactNode;
  iconRight?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  to,
  icon,
  iconRight,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cn('btn', sizeClass[size], variantClass[variant], className);
  const content = (
    <>
      {icon}
      <span>{children}</span>
      {iconRight}
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className={classes}
        onClick={rest.onClick as unknown as MouseEventHandler<HTMLAnchorElement> | undefined}
      >
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      {content}
    </button>
  );
}
