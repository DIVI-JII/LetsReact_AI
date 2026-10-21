import {
  Award,
  Bookmark,
  Boxes,
  Braces,
  CheckCircle2,
  Clapperboard,
  Compass,
  Flag,
  Flame,
  GaugeCircle,
  LayoutDashboard,
  ListChecks,
  MousePointerClick,
  Receipt,
  Rocket,
  Sparkles,
  Target,
  Trophy,
  UserRound,
  UtensilsCrossed,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Course data stores icon names as plain strings so it stays serialisable.
const registry: Record<string, LucideIcon> = {
  Award,
  Bookmark,
  Boxes,
  Braces,
  CheckCircle2,
  Clapperboard,
  Compass,
  Flag,
  Flame,
  GaugeCircle,
  LayoutDashboard,
  ListChecks,
  MousePointerClick,
  Receipt,
  Rocket,
  Sparkles,
  Target,
  Trophy,
  UserRound,
  UtensilsCrossed,
  Zap,
};

export function getIcon(name: string): LucideIcon {
  return registry[name] ?? Sparkles;
}
