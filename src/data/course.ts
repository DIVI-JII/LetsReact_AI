import type { Course, Month, Week } from '../types';
import { lessons } from './lessons';

export const months: Month[] = [
  {
    id: 'month-1',
    label: 'Month 1',
    title: 'React Foundations',
    summary: 'Learn how React thinks: JSX, components, props, events and state.',
    weekNumbers: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 'month-2',
    label: 'Month 2',
    title: 'Interactive Applications',
    summary: 'Build screens that respond to people: lists, forms and live data.',
    weekNumbers: [7, 8, 9, 10],
  },
  {
    id: 'month-3',
    label: 'Month 3',
    title: 'Professional React',
    summary: 'Share logic, test your work and ship a final project.',
    weekNumbers: [11, 12],
  },
];

type WeekDef = Omit<Week, 'lessonIds'>;

const weekDefs: WeekDef[] = [
  { number: 1, monthId: 'month-1', title: 'React & Web Development', summary: 'What React is, why it exists and how to set up.', topics: ['Tooling', 'Project structure'] },
  { number: 2, monthId: 'month-1', title: 'JSX', summary: 'Describe your UI with JSX.', topics: ['Elements', 'Expressions', 'className'] },
  { number: 3, monthId: 'month-1', title: 'Components', summary: 'Split a screen into reusable pieces.', topics: ['Functions', 'Composition'] },
  { number: 4, monthId: 'month-1', title: 'Props', summary: 'Pass data from parent to child.', topics: ['Props', 'One-way data flow'] },
  { number: 5, monthId: 'month-1', title: 'Events', summary: 'React to clicks, typing and more.', topics: ['onClick', 'onChange', 'Handlers'] },
  { number: 6, monthId: 'month-1', title: 'State', summary: 'Give components a memory.', topics: ['useState', 'Re-rendering'] },
  { number: 7, monthId: 'month-2', title: 'Lists', summary: 'Render and transform collections.', topics: ['map', 'Keys', 'Filtering'] },
  { number: 8, monthId: 'month-2', title: 'Conditional Rendering', summary: 'Show the right UI at the right time.', topics: ['Ternaries', 'Empty states'] },
  { number: 9, monthId: 'month-2', title: 'Forms', summary: 'Collect and validate input.', topics: ['Controlled inputs', 'Validation'] },
  { number: 10, monthId: 'month-2', title: 'API Requests', summary: 'Load data from the network.', topics: ['fetch', 'useEffect', 'Errors'] },
  { number: 11, monthId: 'month-3', title: 'Context & Custom Hooks', summary: 'Share state and reuse logic.', topics: ['Context', 'Custom hooks'] },
  { number: 12, monthId: 'month-3', title: 'Testing & Final Project', summary: 'Test it, then ship it.', topics: ['Testing', 'Deployment'] },
];

export const weeks: Week[] = weekDefs.map((w) => ({
  ...w,
  lessonIds: lessons.filter((l) => l.weekNumber === w.number).map((l) => l.id),
}));

export const course: Course = {
  id: 'react-foundations',
  title: 'React Foundations',
  subtitle: 'A practical 12-week path from React beginner to confident developer.',
  months,
  weeks,
};

export function getWeek(number: number): Week | undefined {
  return weeks.find((w) => w.number === number);
}
