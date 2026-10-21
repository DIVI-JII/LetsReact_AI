import type { Lesson, LessonContent } from '../../types';
import { accessibilityContent, contextContent, customHooksContent, finalProjectContent, testingContent } from './content/advanced';
import { conditionalBasicsContent, emptyLoadingContent, filterSortContent, keysContent, renderingListsContent } from './content/lists-conditions';
import { controlledInputsContent, fetchDataContent, formSubmitContent, loadingErrorsContent, searchApiContent, validationContent } from './content/forms-api';
import { firstProjectContent, readingAppContent, whyReactContent, workspaceSetupContent } from './content/foundations';
import { componentsContent } from './content/components';
import { eventsContent } from './content/events';
import { jsxContent } from './content/jsx';
import { propsContent } from './content/props';
import { stateContent } from './content/state';

/**
 * To add a lesson: add an entry to `outline` (title, week, minutes), write its
 * content file in ./content, then register it in `contentById` below.
 * Lessons without content show up in the roadmap as "coming soon".
 */
const contentById: Record<string, LessonContent> = {
  'jsx-fundamentals': jsxContent,
  'building-components': componentsContent,
  'passing-props': propsContent,
  'handling-events': eventsContent,
  'understanding-state': stateContent,
  'why-react': whyReactContent,
  'workspace-setup': workspaceSetupContent,
  'first-project': firstProjectContent,
  'reading-a-react-app': readingAppContent,
  'rendering-lists': renderingListsContent,
  'keys': keysContent,
  'filter-sort': filterSortContent,
  'conditional-basics': conditionalBasicsContent,
  'empty-loading': emptyLoadingContent,
  'controlled-inputs': controlledInputsContent,
  'form-submit': formSubmitContent,
  'validation': validationContent,
  'fetch-data': fetchDataContent,
  'loading-errors': loadingErrorsContent,
  'search-api': searchApiContent,
  'context': contextContent,
  'custom-hooks': customHooksContent,
  'testing': testingContent,
  'accessibility-basics': accessibilityContent,
  'final-project': finalProjectContent,
};

type OutlineEntry = Omit<Lesson, 'number' | 'content'>;

const outline: OutlineEntry[] = [
  // Week 1 — React & Web Development
  { id: 'why-react', weekNumber: 1, title: 'Why React exists', summary: 'The problem React solves and how it thinks about the screen.', minutes: 10 },
  { id: 'workspace-setup', weekNumber: 1, title: 'Setting up your workspace', summary: 'Node, an editor and a first Vite project.', minutes: 12 },
  { id: 'first-project', weekNumber: 1, title: 'Your first project', summary: 'Tour the files in a fresh React app.', minutes: 10 },
  { id: 'reading-a-react-app', weekNumber: 1, title: 'Reading a React app', summary: 'Follow the data from main.tsx to the screen.', minutes: 12 },
  // Weeks 2–6
  { id: 'jsx-fundamentals', weekNumber: 2, title: 'JSX Fundamentals', summary: 'Describe the screen with tags and curly braces.', minutes: 12 },
  { id: 'building-components', weekNumber: 3, title: 'Building Components', summary: 'Turn pieces of the screen into reusable functions.', minutes: 14 },
  { id: 'passing-props', weekNumber: 4, title: 'Passing Data with Props', summary: 'Send information from a parent to its children.', minutes: 14 },
  { id: 'handling-events', weekNumber: 5, title: 'Handling Events', summary: 'Respond to clicks, typing and hovering.', minutes: 13 },
  { id: 'understanding-state', weekNumber: 6, title: 'Understanding React State', summary: 'Give a component a memory with useState.', minutes: 15 },
  // Week 7 — Lists
  { id: 'rendering-lists', weekNumber: 7, title: 'Rendering lists with map', summary: 'Turn an array into a list of components.', minutes: 14 },
  { id: 'keys', weekNumber: 7, title: 'Keys and why they matter', summary: 'Help React track each item in a list.', minutes: 10 },
  { id: 'filter-sort', weekNumber: 7, title: 'Filtering and sorting lists', summary: 'Show a different view of the same data.', minutes: 15 },
  // Week 8 — Conditional rendering
  { id: 'conditional-basics', weekNumber: 8, title: 'if, ternary and &&', summary: 'Show different UI for different situations.', minutes: 12 },
  { id: 'empty-loading', weekNumber: 8, title: 'Loading and empty states', summary: 'Design the in-between moments.', minutes: 12 },
  // Week 9 — Forms
  { id: 'controlled-inputs', weekNumber: 9, title: 'Controlled inputs', summary: 'Keep input values in state.', minutes: 14 },
  { id: 'form-submit', weekNumber: 9, title: 'Handling form submit', summary: 'Collect values and do something with them.', minutes: 13 },
  { id: 'validation', weekNumber: 9, title: 'Validation and error messages', summary: 'Guide people to a valid answer.', minutes: 15 },
  // Week 10 — API requests
  { id: 'fetch-data', weekNumber: 10, title: 'Fetching data with useEffect', summary: 'Load data when a component appears.', minutes: 16 },
  { id: 'loading-errors', weekNumber: 10, title: 'Loading and error handling', summary: 'Plan for slow and failing requests.', minutes: 14 },
  { id: 'search-api', weekNumber: 10, title: 'Search with an API', summary: 'Turn typing into requests.', minutes: 16 },
  // Week 11 — Context & custom hooks
  { id: 'context', weekNumber: 11, title: 'Sharing state with Context', summary: 'Pass data deep without prop drilling.', minutes: 15 },
  { id: 'custom-hooks', weekNumber: 11, title: 'Writing a custom hook', summary: 'Extract logic you use more than once.', minutes: 15 },
  // Week 12 — Testing & final project
  { id: 'testing', weekNumber: 12, title: 'Testing components', summary: 'Check behaviour the way a user sees it.', minutes: 16 },
  { id: 'accessibility-basics', weekNumber: 12, title: 'Accessibility basics', summary: 'Make what you build usable by everyone.', minutes: 12 },
  { id: 'final-project', weekNumber: 12, title: 'Final project and deployment', summary: 'Ship something real.', minutes: 20 },
];

export const lessons: Lesson[] = outline.map((entry, index) => ({
  ...entry,
  number: index + 1,
  content: contentById[entry.id],
}));

export function getLesson(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id);
}
