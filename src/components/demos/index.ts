import type { ComponentType } from 'react';
import type { DemoKind } from '../../types';
import { ComponentInteractive, ComponentVisual } from './ComponentDemos';
import { EventsInteractive, EventsVisual } from './EventsDemos';
import { JsxInteractive, JsxVisual } from './JsxDemos';
import { PropsInteractive, PropsVisual } from './PropsDemos';
import { StateInteractive, StateVisual } from './StateDemos';

interface DemoPair {
  Visual: ComponentType;
  Interactive: ComponentType;
}

/**
 * Lesson data refers to demos by kind. To add a demo, build a Visual and an
 * Interactive component, add a kind to `DemoKind`, and register it here.
 */
export const demos: Record<DemoKind, DemoPair> = {
  jsx: { Visual: JsxVisual, Interactive: JsxInteractive },
  component: { Visual: ComponentVisual, Interactive: ComponentInteractive },
  props: { Visual: PropsVisual, Interactive: PropsInteractive },
  events: { Visual: EventsVisual, Interactive: EventsInteractive },
  state: { Visual: StateVisual, Interactive: StateInteractive },
};
