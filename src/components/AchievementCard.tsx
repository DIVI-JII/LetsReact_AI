import { Lock } from 'lucide-react';
import type { Achievement } from '../types';
import { cn } from '../utils/cn';
import { getIcon } from '../utils/icons';
import { Card } from './ui/Card';

interface AchievementCardProps {
  achievement: Achievement;
  earned: boolean;
}

export function AchievementCard({ achievement, earned }: AchievementCardProps) {
  const Icon = getIcon(achievement.icon);
  return (
    <Card
      interactive={earned}
      className={cn('flex flex-col items-center p-5 text-center', !earned && 'bg-white/60')}
    >
      <span
        className={cn(
          'relative mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl',
          earned
            ? 'bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700'
            : 'bg-ink-100 text-ink-400',
        )}
      >
        <Icon size={26} aria-hidden="true" />
        {!earned && (
          <span className="absolute -bottom-1 -right-1 rounded-full bg-white p-1 text-ink-500 shadow-sm">
            <Lock size={11} aria-hidden="true" />
          </span>
        )}
      </span>
      <h3 className={cn('text-[15px] font-bold', earned ? 'text-ink-950' : 'text-ink-600')}>
        {achievement.title}
      </h3>
      <p className="mt-1 text-xs leading-5 text-ink-600">{achievement.description}</p>
      <span className="sr-only">{earned ? 'Earned' : 'Not earned yet'}</span>
    </Card>
  );
}
