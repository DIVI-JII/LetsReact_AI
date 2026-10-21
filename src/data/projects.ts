import type { Project } from '../types';

export const projects: Project[] = [
  // ---------------------------------------------------------------- Profile App
  {
    id: 'profile-app',
    title: 'Profile App',
    summary: 'A profile page built from small, reusable components.',
    description:
      'Build a profile page with an avatar, name, role and skills. You will split it into components and feed each one with props.',
    difficulty: 'Beginner',
    estimatedTime: '2 hours',
    concepts: ['JSX', 'Components', 'Props'],
    icon: 'UserRound',
    lessonId: 'passing-props',
    requirements: [
      { id: 'header', label: 'Show an avatar, name and role', testIds: ['avatar', 'name-role'] },
      { id: 'skills', label: 'Render a list of skills', testIds: ['skills-map', 'skills-key'] },
      { id: 'props', label: 'Pass data through props', testIds: ['props-receive', 'props-pass'] },
      { id: 'reuse', label: 'Reuse one component several times', testIds: ['reuse'] },
    ],
    steps: [
      { title: 'Sketch the pieces', description: 'An Avatar, a ProfileHeader and a Skill. Each is a small function that returns JSX.' },
      { title: 'Give them props', description: 'Pass name, role, initials and each skill label in from the parent.' },
      { title: 'Render the skills', description: 'Keep skills in an array and map over it, with a key on each one.' },
    ],
    workspace: {
      filename: 'App.jsx',
      expected: [
        'A round avatar with initials, a name and a role.',
        'A bulleted list of skills underneath.',
        'The Skill component is reused once per skill.',
      ],
      hints: [
        'Make small components: function Avatar({ initials }) { ... }.',
        'Receive props by destructuring, then show them with {name} and {role}.',
        'Keep skills in an array: const skills = ["React", "CSS"].',
        'Use skills.map((s) => <Skill key={s} label={s} />).',
      ],
      starterCode: `// Build a profile page from small components.
export default function App() {
  return (
    <main>
      {/* 1. A profile header: avatar, name, role */}
      {/* 2. A list of skills */}
    </main>
  );
}
`,
      solution: `function Avatar({ initials }) {
  return <div className="avatar">{initials}</div>;
}

function Skill({ label }) {
  return <li>{label}</li>;
}

function ProfileHeader({ name, role, initials }) {
  return (
    <header>
      <Avatar initials={initials} />
      <h1>{name}</h1>
      <p>{role}</p>
    </header>
  );
}

export default function App() {
  const skills = ['React', 'JavaScript', 'CSS'];
  return (
    <main>
      <ProfileHeader name="Ada Lovelace" role="Engineer" initials="AL" />
      <ul>
        {skills.map((s) => (
          <Skill key={s} label={s} />
        ))}
      </ul>
    </main>
  );
}
`,
      tests: [
        { id: 'avatar', label: 'Shows an avatar', pattern: String.raw`[Aa]vatar|<img\b`, failHint: 'Add an Avatar component (or an <img>) to the header.' },
        { id: 'name-role', label: 'Shows a name and a role', pattern: String.raw`\{\s*(?:props\.)?name\s*\}[\s\S]*\{\s*(?:props\.)?role\s*\}`, failHint: 'Show {name} and {role} inside the header.' },
        { id: 'skills-map', label: 'Renders skills with map', pattern: String.raw`\.map\s*\(`, failHint: 'Use skills.map(...) to render one item per skill.' },
        { id: 'skills-key', label: 'Each skill has a key', pattern: String.raw`\.map\s*\([\s\S]*?\bkey\s*=\s*\{`, failHint: 'Add key={s} to the element you return from map.' },
        { id: 'props-receive', label: 'Components receive props', pattern: String.raw`function\s+[A-Z]\w*\s*\(\s*(?:\{[^)]*\}|props)\s*\)|const\s+[A-Z]\w*\s*=\s*\(\s*(?:\{[^)]*\}|props)\s*\)\s*=>`, failHint: 'Write components like function Avatar({ initials }) { ... }.' },
        { id: 'props-pass', label: 'Passes data in as props', pattern: String.raw`<[A-Z]\w*\s+[^>]*\b\w+\s*=\s*(?:"[^"]*"|\{[^}]*\})`, failHint: 'Pass data like <Avatar initials="AL" />.' },
        { id: 'reuse', label: 'Reuses a component more than once', pattern: String.raw`<([A-Z]\w*)\b[\s\S]*<\1\b|\.map\s*\([\s\S]*?<[A-Z]\w*`, failHint: 'Use one component several times, for example one <Skill /> per skill.' },
      ],
    },
  },

  // --------------------------------------------------------------- Task Manager
  {
    id: 'task-manager',
    title: 'Task Manager',
    summary: 'Add, complete, filter and remove tasks.',
    description:
      'A small task manager that keeps its list in React state. You will add tasks, tick them off, remove them and filter what you see, and design a friendly empty state for when the list is clear.',
    difficulty: 'Beginner',
    estimatedTime: '3 hours',
    concepts: ['State', 'Events', 'Lists'],
    icon: 'ListChecks',
    lessonId: 'understanding-state',
    requirements: [
      { id: 'add', label: 'Add tasks', testIds: ['add-input', 'add-list'] },
      { id: 'remove', label: 'Remove tasks', testIds: ['remove'] },
      { id: 'complete', label: 'Complete tasks', testIds: ['complete'] },
      { id: 'filter', label: 'Filter tasks', testIds: ['filter-state', 'filter-apply'] },
      { id: 'empty', label: 'Display an empty state', testIds: ['empty'] },
      { id: 'state', label: 'Use React state', testIds: ['state'] },
      { id: 'reusable', label: 'Use reusable components', testIds: ['reusable', 'reusable-use'] },
    ],
    steps: [
      { title: 'Model a task', description: 'Decide what a task is: an id, some text and a done flag.' },
      { title: 'Render the list', description: 'Keep tasks in state and map over them to render each one.' },
      { title: 'Add a form', description: 'Capture input with state and add a task on submit.' },
      { title: 'Complete and remove', description: 'Update one task by id, or filter it out of the array.' },
      { title: 'Filter and empty state', description: 'Derive the visible list from state and handle the empty case.' },
    ],
    workspace: {
      filename: 'TaskManager.jsx',
      expected: [
        'Type a task and press Add to put it on the list.',
        'Tick a task to mark it done; Remove deletes it.',
        'All / Active / Done buttons change which tasks are shown.',
        'With no tasks, a friendly message appears.',
      ],
      hints: [
        'Keep tasks in state: const [tasks, setTasks] = useState([]).',
        'Add with setTasks([...tasks, { id: Date.now(), text, done: false }]).',
        'Complete by mapping: tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)).',
        'Remove with tasks.filter((t) => t.id !== id).',
        'Keep a filter in state ("all", "active", "done") and derive the visible list from it.',
        'Move one task row into its own TaskItem component and pass props.',
      ],
      starterCode: `import { useState } from 'react';

export default function TaskManager() {
  // Your state goes here

  return (
    <main>
      {/* form, filter buttons and the task list */}
    </main>
  );
}
`,
      solution: `import { useState } from 'react';

function TaskItem({ task, onToggle, onRemove }) {
  return (
    <li>
      <label>
        <input type="checkbox" checked={task.done} onChange={() => onToggle(task.id)} />
        {task.text}
      </label>
      <button onClick={() => onRemove(task.id)}>Remove</button>
    </li>
  );
}

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('all');

  const addTask = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setTasks([...tasks, { id: Date.now(), text, done: false }]);
    setText('');
  };
  const toggleTask = (id) =>
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const removeTask = (id) => setTasks(tasks.filter((t) => t.id !== id));

  const visible = tasks.filter(
    (t) => filter === 'all' || (filter === 'done' ? t.done : !t.done),
  );

  return (
    <main>
      <form onSubmit={addTask}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="New task" />
        <button type="submit">Add</button>
      </form>
      <div>
        {['all', 'active', 'done'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>
      {visible.length === 0 ? (
        <p>No tasks yet. Add one above.</p>
      ) : (
        <ul>
          {visible.map((t) => (
            <TaskItem key={t.id} task={t} onToggle={toggleTask} onRemove={removeTask} />
          ))}
        </ul>
      )}
    </main>
  );
}
`,
      tests: [
        { id: 'state', label: 'Keeps the tasks in React state', pattern: String.raw`useState\s*\(\s*\[\s*\]\s*\)`, failHint: 'Create const [tasks, setTasks] = useState([]).' },
        { id: 'add-input', label: 'Has a controlled input for new tasks', pattern: String.raw`<input[\s\S]*?\bvalue\s*=\s*\{[\s\S]*?onChange\s*=|<input[\s\S]*?onChange\s*=[\s\S]*?\bvalue\s*=\s*\{`, failHint: 'Add an <input> with value and onChange connected to state.' },
        { id: 'add-list', label: 'Adds a task to the list', pattern: String.raw`set\w+\(\s*\[\s*\.\.\.\w+\s*,|set\w+\(\s*\(?\w+\)?\s*=>\s*\[\s*\.\.\.\w+\s*,`, failHint: 'Add with setTasks([...tasks, newTask]).' },
        { id: 'remove', label: 'Removes a task by id', pattern: String.raw`\.filter\s*\(\s*\(?\s*\w+\s*\)?\s*=>\s*\w+\.id\s*!==?\s*\w+\s*\)`, failHint: 'Remove with tasks.filter((t) => t.id !== id).' },
        { id: 'complete', label: 'Toggles a task as done', pattern: String.raw`(?:done|completed)\s*:\s*!\s*\w+\.(?:done|completed)`, failHint: 'Flip it with { ...t, done: !t.done } inside tasks.map(...).' },
        { id: 'filter-state', label: 'Keeps a filter in state', pattern: String.raw`useState\s*\(\s*['"][Aa]ll['"]\s*\)`, failHint: 'Add const [filter, setFilter] = useState("all").' },
        { id: 'filter-apply', label: 'Shows only tasks that match the filter', pattern: String.raw`\b\w*[fF]ilter\w*\s*===?\s*['"]`, failHint: 'Derive the visible list: compare filter with "all", "active" or "done".' },
        { id: 'empty', label: 'Displays an empty state', pattern: String.raw`\.length\s*===?\s*0|!\s*\w+\.length`, failHint: 'When visible.length === 0, show a friendly message.' },
        { id: 'reusable', label: 'Defines a reusable component', pattern: String.raw`function\s+(?!TaskManager\b)[A-Z]\w*\s*\(|const\s+(?!TaskManager\b)[A-Z]\w*\s*=\s*\(`, failHint: 'Pull one row out into a TaskItem component.' },
        { id: 'reusable-use', label: 'Uses that component in the list', pattern: String.raw`<(?!TaskManager)[A-Z]\w*[\s>/]`, failHint: 'Render <TaskItem ... /> for each task.' },
      ],
    },
  },

  // ------------------------------------------------------------ Expense Tracker
  {
    id: 'expense-tracker',
    title: 'Expense Tracker',
    summary: 'Log spending and see totals update as you go.',
    description:
      'Record expenses with a form, group them by category and watch the totals recalculate from state.',
    difficulty: 'Intermediate',
    estimatedTime: '5 hours',
    concepts: ['Forms', 'Derived state', 'Lists'],
    icon: 'Receipt',
    lessonId: 'form-submit',
    requirements: [
      { id: 'form', label: 'Add an expense with a form', testIds: ['form-submit', 'form-prevent', 'form-add'] },
      { id: 'total', label: 'Show a running total', testIds: ['total-calc', 'total-show'] },
      { id: 'group', label: 'Group by category', testIds: ['group'] },
      { id: 'delete', label: 'Delete an expense', testIds: ['delete'] },
    ],
    steps: [
      { title: 'Model an expense', description: 'An id, a title, an amount (a number) and a category.' },
      { title: 'Build the form', description: 'Controlled inputs for title and amount, a category select, and an onSubmit that adds to state.' },
      { title: 'Derive the totals', description: 'Compute the total and the per-category sums from the list. Do not store them in state.' },
      { title: 'Delete', description: 'Remove one expense by id with filter.' },
    ],
    workspace: {
      filename: 'ExpenseTracker.jsx',
      expected: [
        'Fill in a title, amount and category, then submit to add an expense.',
        'A running total updates immediately.',
        'Subtotals are shown for each category.',
        'Each expense has a Delete button.',
      ],
      hints: [
        'Keep expenses in state, and one state value per form field.',
        'In the submit handler call e.preventDefault(), then setExpenses([...expenses, newExpense]).',
        'Store the amount as a number: Number(amount).',
        'The total is derived: expenses.reduce((sum, x) => sum + x.amount, 0).',
        'Per category: expenses.filter((x) => x.category === c).reduce(...).',
      ],
      starterCode: `import { useState } from 'react';

const CATEGORIES = ['Food', 'Travel', 'Bills'];

export default function ExpenseTracker() {
  // State for the expenses and for the form fields

  return (
    <main>
      {/* form, total, category subtotals and the list */}
    </main>
  );
}
`,
      solution: `import { useState } from 'react';

const CATEGORIES = ['Food', 'Travel', 'Bills'];

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');

  const addExpense = (e) => {
    e.preventDefault();
    if (!title || Number(amount) <= 0) return;
    setExpenses([...expenses, { id: Date.now(), title, amount: Number(amount), category }]);
    setTitle('');
    setAmount('');
  };
  const removeExpense = (id) => setExpenses(expenses.filter((x) => x.id !== id));

  const total = expenses.reduce((sum, x) => sum + x.amount, 0);
  const byCategory = CATEGORIES.map((c) => ({
    name: c,
    sum: expenses.filter((x) => x.category === c).reduce((s, x) => s + x.amount, 0),
  }));

  return (
    <main>
      <form onSubmit={addExpense}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <button type="submit">Add</button>
      </form>
      <h2>Total: {total.toFixed(2)}</h2>
      <ul>
        {byCategory.map((c) => (
          <li key={c.name}>
            {c.name}: {c.sum.toFixed(2)}
          </li>
        ))}
      </ul>
      <ul>
        {expenses.map((x) => (
          <li key={x.id}>
            {x.title} ({x.category}) {x.amount}
            <button onClick={() => removeExpense(x.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
`,
      tests: [
        { id: 'form-submit', label: 'The form uses onSubmit', pattern: String.raw`<form[\s\S]*?onSubmit\s*=`, failHint: 'Put onSubmit={addExpense} on the <form>.' },
        { id: 'form-prevent', label: 'The handler calls preventDefault', pattern: String.raw`preventDefault\s*\(\s*\)`, failHint: 'Call e.preventDefault() first so the page does not reload.' },
        { id: 'form-add', label: 'Adds the expense to state', pattern: String.raw`set\w+\(\s*\[\s*\.\.\.\w+\s*,|set\w+\(\s*\(?\w+\)?\s*=>\s*\[\s*\.\.\.\w+\s*,`, failHint: 'Add with setExpenses([...expenses, newExpense]).' },
        { id: 'total-calc', label: 'Calculates the total from the list', pattern: String.raw`\.reduce\s*\([\s\S]*?\.amount`, failHint: 'Use expenses.reduce((sum, x) => sum + x.amount, 0).' },
        { id: 'total-show', label: 'Shows the total', pattern: String.raw`\{\s*\w*[tT]otal\w*(?:\.toFixed\s*\(\s*\d\s*\))?\s*\}`, failHint: 'Show the total with {total} in your JSX.' },
        { id: 'group', label: 'Groups expenses by category', pattern: String.raw`\.category\s*===?\s*\w+|\[\s*\w+\.category\s*\]`, failHint: 'Filter by category: expenses.filter((x) => x.category === c).' },
        { id: 'delete', label: 'Deletes an expense by id', pattern: String.raw`\.filter\s*\(\s*\(?\s*\w+\s*\)?\s*=>\s*\w+\.id\s*!==?\s*\w+\s*\)`, failHint: 'Delete with expenses.filter((x) => x.id !== id).' },
      ],
    },
  },

  // ---------------------------------------------------------------- Movie Search
  {
    id: 'movie-search',
    title: 'Movie Search',
    summary: 'Search a movie API and handle loading and errors.',
    description:
      'Type to search for movies. You will fetch results as you type, show a loading state, handle errors gracefully and open a movie’s details.',
    difficulty: 'Intermediate',
    estimatedTime: '6 hours',
    concepts: ['API requests', 'useEffect', 'Loading states'],
    icon: 'Clapperboard',
    lessonId: 'search-api',
    requirements: [
      { id: 'search', label: 'Search as you type', testIds: ['query-state', 'effect-query', 'fetch-encode'] },
      { id: 'loading', label: 'Show a loading state', testIds: ['loading'] },
      { id: 'error', label: 'Handle request errors', testIds: ['error-catch', 'error-show'] },
      { id: 'details', label: 'Open a movie’s details', testIds: ['details-state', 'details-click', 'details-show'] },
    ],
    steps: [
      { title: 'Keep the query in state', description: 'A controlled input stores what was typed.' },
      { title: 'Fetch when it changes', description: 'useEffect with the query as a dependency; encode it for the URL; wait a moment so you do not fetch on every key.' },
      { title: 'Handle loading and errors', description: 'Track loading and error in state and show each one.' },
      { title: 'Details', description: 'Click a result to store it in state and show more about it.' },
    ],
    workspace: {
      filename: 'MovieSearch.jsx',
      expected: [
        'Typing in the box searches after a short pause.',
        'A loading message shows while the request runs.',
        'A friendly error appears if the request fails.',
        'Clicking a result shows its details.',
      ],
      hints: [
        'Create state for query, movies, loading, error and selected.',
        'useEffect(() => { ... }, [query]) runs again whenever the query changes.',
        'Build the URL with encodeURIComponent(query).',
        'Check res.ok after fetch, and wrap the request in try/catch.',
        'Store the clicked movie with setSelected(movie) and show it when selected is not null.',
      ],
      starterCode: `import { useEffect, useState } from 'react';

const API = 'https://www.omdbapi.com/?apikey=YOUR_KEY&s=';

export default function MovieSearch() {
  // State: query, movies, loading, error, selected

  // Fetch when the query changes

  return (
    <main>
      {/* search box, loading, error, results, details */}
    </main>
  );
}
`,
      solution: `import { useEffect, useState } from 'react';

const API = 'https://www.omdbapi.com/?apikey=YOUR_KEY&s=';

export default function MovieSearch() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!query.trim()) {
      setMovies([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(API + encodeURIComponent(query));
        if (!res.ok) throw new Error('Request failed');
        const data = await res.json();
        setMovies(data.Search ?? []);
      } catch (err) {
        setError('Could not load movies. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <main>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search movies" />
      {loading && <p>Loading…</p>}
      {error && <p>{error}</p>}
      <ul>
        {movies.map((m) => (
          <li key={m.imdbID}>
            <button onClick={() => setSelected(m)}>{m.Title}</button>
          </li>
        ))}
      </ul>
      {selected && (
        <section>
          <h2>{selected.Title}</h2>
          <p>{selected.Year}</p>
        </section>
      )}
    </main>
  );
}
`,
      tests: [
        { id: 'query-state', label: 'Keeps the search text in state', pattern: String.raw`useState\s*\(\s*(?:''|""|\x60\x60)\s*\)`, failHint: 'Create const [query, setQuery] = useState("").' },
        { id: 'effect-query', label: 'Fetches again whenever the query changes', pattern: String.raw`const\s*\[\s*(\w+)\s*,\s*set\w+\s*\]\s*=\s*useState\s*\(\s*(?:''|""|\x60\x60)\s*\)[\s\S]*useEffect[\s\S]*\[\s*\1\s*\]\s*\)`, failHint: 'Use useEffect(() => { ... }, [query]) so it runs when query changes.' },
        { id: 'fetch-encode', label: 'Calls fetch with an encoded query', pattern: String.raw`fetch\s*\([\s\S]*?encodeURIComponent\s*\(|encodeURIComponent\s*\([\s\S]*?fetch\s*\(`, failHint: 'Build the URL with encodeURIComponent(query) and pass it to fetch.' },
        { id: 'loading', label: 'Shows a loading state', pattern: String.raw`set\w*[lL]oading\w*\s*\(\s*true\s*\)[\s\S]*set\w*[lL]oading\w*\s*\(\s*false\s*\)[\s\S]*\b\w*[lL]oading\w*\s*(?:&&|\?)|\b\w*[lL]oading\w*\s*(?:&&|\?)[\s\S]*set\w*[lL]oading\w*\s*\(\s*true\s*\)[\s\S]*set\w*[lL]oading\w*\s*\(\s*false\s*\)`, failHint: 'Set loading to true before the request, false after, and show a message while it is true.' },
        { id: 'error-catch', label: 'Handles failed requests', pattern: String.raw`\bcatch\b[\s\S]*set\w*[eE]rror\w*\s*\(|res\w*\.ok|response\.ok`, failHint: 'Wrap the request in try/catch and store an error message.' },
        { id: 'error-show', label: 'Shows the error message', pattern: String.raw`\b\w*[eE]rror\w*\s*&&|\{\s*\w*[eE]rror\w*\s*\}`, failHint: 'Show it with {error && <p>{error}</p>}.' },
        { id: 'details-state', label: 'Keeps the selected movie in state', pattern: String.raw`useState\s*\(\s*null\s*\)[\s\S]*useState\s*\(\s*null\s*\)|useState\s*\(\s*null\s*\)`, failHint: 'Create const [selected, setSelected] = useState(null).' },
        { id: 'details-click', label: 'Clicking a result selects it', pattern: String.raw`onClick\s*=\s*\{[^}]*set\w*[sS]elected\w*\s*\(\s*\w+\s*\)`, failHint: 'Give each result onClick={() => setSelected(movie)}.' },
        { id: 'details-show', label: 'Shows details when one is selected', pattern: String.raw`\b\w*[sS]elected\w*\s*(?:&&|\?)`, failHint: 'Show the details with {selected && (...)}.' },
      ],
    },
  },

  // ----------------------------------------------------------------- Recipe App
  {
    id: 'recipe-app',
    title: 'Recipe App',
    summary: 'Browse, search and favourite recipes.',
    description:
      'Create a recipe browser with a searchable list and a detail view, using state, lists and conditional rendering.',
    difficulty: 'Intermediate',
    estimatedTime: '5 hours',
    concepts: ['Lists', 'Conditional rendering', 'State'],
    icon: 'UtensilsCrossed',
    lessonId: 'rendering-lists',
    requirements: [
      { id: 'list', label: 'List recipes', testIds: ['list-map', 'list-key'] },
      { id: 'detail', label: 'Open a recipe’s detail view', testIds: ['detail-state', 'detail-click', 'detail-show'] },
      { id: 'favourite', label: 'Mark favourites', testIds: ['fav-state', 'fav-toggle'] },
      { id: 'empty', label: 'Handle no results', testIds: ['search-filter', 'empty'] },
    ],
    steps: [
      { title: 'List the recipes', description: 'Map over the array and give every item a key.' },
      { title: 'Open one', description: 'Store the chosen recipe in state and show a detail view when it is set.' },
      { title: 'Favourites', description: 'Keep a list of favourite ids in state and toggle one in or out.' },
      { title: 'Search and empty state', description: 'Filter by the search text and show a message when nothing matches.' },
    ],
    workspace: {
      filename: 'RecipeApp.jsx',
      expected: [
        'A list of recipes you can search by name.',
        'Clicking a recipe opens its details with a Back button.',
        'A heart/Favourite button toggles favourites.',
        'Searching for something unknown shows "No recipes found".',
      ],
      hints: [
        'Render the list with recipes.map and a key={r.id}.',
        'Keep const [selected, setSelected] = useState(null) and show details when it is set.',
        'Keep favourites as an array of ids and toggle with includes + filter/spread.',
        'Filter by name: recipes.filter((r) => r.name.toLowerCase().includes(search.toLowerCase())).',
        'Check filtered.length === 0 to show the empty message.',
      ],
      starterCode: `import { useState } from 'react';

const recipes = [
  { id: 1, name: 'Pancakes', steps: 'Mix, pour, flip.' },
  { id: 2, name: 'Tomato Soup', steps: 'Simmer, blend, serve.' },
  { id: 3, name: 'Fruit Salad', steps: 'Chop and toss.' },
];

export default function RecipeApp() {
  // State: search, selected, favourites

  return (
    <main>
      {/* search box, list, detail view */}
    </main>
  );
}
`,
      solution: `import { useState } from 'react';

const recipes = [
  { id: 1, name: 'Pancakes', steps: 'Mix, pour, flip.' },
  { id: 2, name: 'Tomato Soup', steps: 'Simmer, blend, serve.' },
  { id: 3, name: 'Fruit Salad', steps: 'Chop and toss.' },
];

export default function RecipeApp() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [favourites, setFavourites] = useState([]);

  const toggleFavourite = (id) =>
    setFavourites(favourites.includes(id) ? favourites.filter((f) => f !== id) : [...favourites, id]);

  const filtered = recipes.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

  if (selected) {
    return (
      <main>
        <button onClick={() => setSelected(null)}>Back</button>
        <h2>{selected.name}</h2>
        <p>{selected.steps}</p>
        <button onClick={() => toggleFavourite(selected.id)}>
          {favourites.includes(selected.id) ? 'Remove favourite' : 'Add favourite'}
        </button>
      </main>
    );
  }

  return (
    <main>
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search recipes" />
      {filtered.length === 0 ? (
        <p>No recipes found.</p>
      ) : (
        <ul>
          {filtered.map((r) => (
            <li key={r.id}>
              <button onClick={() => setSelected(r)}>{r.name}</button>
              {favourites.includes(r.id) && <span> ♥</span>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
`,
      tests: [
        { id: 'list-map', label: 'Lists the recipes with map', pattern: String.raw`\.map\s*\(`, failHint: 'Use recipes.map(...) (or filtered.map) to render each recipe.' },
        { id: 'list-key', label: 'Each recipe has a key', pattern: String.raw`\.map\s*\([\s\S]*?\bkey\s*=\s*\{`, failHint: 'Add key={r.id} to each list item.' },
        { id: 'detail-state', label: 'Keeps the opened recipe in state', pattern: String.raw`useState\s*\(\s*null\s*\)`, failHint: 'Create const [selected, setSelected] = useState(null).' },
        { id: 'detail-click', label: 'Clicking a recipe opens it', pattern: String.raw`onClick\s*=\s*\{[^}]*set\w*[sS]elected\w*\s*\(\s*\w+\s*\)`, failHint: 'Use onClick={() => setSelected(recipe)}.' },
        { id: 'detail-show', label: 'Shows a detail view when one is open', pattern: String.raw`if\s*\(\s*\w*[sS]elected\w*\s*\)|\b\w*[sS]elected\w*\s*(?:&&|\?)`, failHint: 'When selected is set, show the details instead of the list.' },
        { id: 'fav-state', label: 'Keeps favourites in state', pattern: String.raw`useState\s*\(\s*\[\s*\]\s*\)`, failHint: 'Create const [favourites, setFavourites] = useState([]).' },
        { id: 'fav-toggle', label: 'Toggles a favourite', pattern: String.raw`\w*[fF]av\w*\.includes\s*\(`, failHint: 'Check favourites.includes(id), then add or remove it.' },
        { id: 'search-filter', label: 'Filters by the search text', pattern: String.raw`\.filter\s*\([\s\S]*?\.includes\s*\(`, failHint: 'Filter with recipes.filter((r) => r.name.toLowerCase().includes(search.toLowerCase())).' },
        { id: 'empty', label: 'Shows a message when nothing matches', pattern: String.raw`\.length\s*===?\s*0|!\s*\w+\.length`, failHint: 'When filtered.length === 0 show "No recipes found".' },
      ],
    },
  },

  // ------------------------------------------------------------ Project Dashboard
  {
    id: 'project-dashboard',
    title: 'Project Dashboard',
    summary: 'A two-view dashboard with shared state.',
    description:
      'Combine what you have learned: Context for shared state, a custom hook for reusable logic, and a view switcher that reads the shared data.',
    difficulty: 'Advanced',
    estimatedTime: '8 hours',
    concepts: ['Context', 'Custom hooks', 'State'],
    icon: 'LayoutDashboard',
    lessonId: 'context',
    requirements: [
      { id: 'context', label: 'Share state with Context', testIds: ['ctx-create', 'ctx-provider', 'ctx-use'] },
      { id: 'hooks', label: 'Extract a custom hook', testIds: ['hook-define', 'hook-use'] },
      { id: 'views', label: 'Switch between two views', testIds: ['view-state', 'view-switch'] },
      { id: 'stats', label: 'Show a number worked out from shared state', testIds: ['stat'] },
    ],
    steps: [
      { title: 'Create the context', description: 'createContext, then a Provider component that holds the tasks in state.' },
      { title: 'Wrap a custom hook around it', description: 'useProjects() returns useContext(ProjectContext) so components stay tidy.' },
      { title: 'Two views', description: 'Keep the current view in state and render Overview or List from it.' },
      { title: 'Derive a statistic', description: 'Work out how many projects are done from the shared list.' },
    ],
    workspace: {
      filename: 'Dashboard.jsx',
      expected: [
        'Two tabs: Overview and List.',
        'Overview shows "X of Y projects done", worked out from shared state.',
        'List shows every project and lets you mark one done.',
        'Both views read the same data through Context.',
      ],
      hints: [
        'const ProjectContext = createContext(null) at the top level.',
        'Make a ProjectProvider that holds the projects in state and renders <ProjectContext.Provider value={...}>.',
        'Write function useProjects() { return useContext(ProjectContext); } and use it in the views.',
        'Keep const [view, setView] = useState("overview") and render a different component for each value.',
        'Derive the stat: projects.filter((p) => p.done).length.',
      ],
      starterCode: `import { createContext, useContext, useState } from 'react';

// 1. Create the context and a provider that holds the projects

// 2. Write a custom hook that reads the context

// 3. Write Overview and List views

export default function Dashboard() {
  // 4. Switch between the views with state
  return <main>{/* tabs and the current view */}</main>;
}
`,
      solution: `import { createContext, useContext, useState } from 'react';

const ProjectContext = createContext(null);

function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([
    { id: 1, name: 'Website', done: false },
    { id: 2, name: 'Mobile app', done: true },
    { id: 3, name: 'Docs', done: false },
  ]);
  const toggle = (id) => setProjects(projects.map((p) => (p.id === id ? { ...p, done: !p.done } : p)));
  return <ProjectContext.Provider value={{ projects, toggle }}>{children}</ProjectContext.Provider>;
}

function useProjects() {
  return useContext(ProjectContext);
}

function Overview() {
  const { projects } = useProjects();
  const doneCount = projects.filter((p) => p.done).length;
  return <p>{doneCount} of {projects.length} projects done</p>;
}

function List() {
  const { projects, toggle } = useProjects();
  return (
    <ul>
      {projects.map((p) => (
        <li key={p.id}>
          <button onClick={() => toggle(p.id)}>{p.done ? 'Undo' : 'Done'}</button> {p.name}
        </li>
      ))}
    </ul>
  );
}

export default function Dashboard() {
  const [view, setView] = useState('overview');
  return (
    <ProjectProvider>
      <main>
        <button onClick={() => setView('overview')}>Overview</button>
        <button onClick={() => setView('list')}>List</button>
        {view === 'overview' ? <Overview /> : <List />}
      </main>
    </ProjectProvider>
  );
}
`,
      tests: [
        { id: 'ctx-create', label: 'Creates a context', pattern: String.raw`createContext\s*\(`, failHint: 'Create it with const ProjectContext = createContext(null).' },
        { id: 'ctx-provider', label: 'Provides a value to the tree', pattern: String.raw`<\w+\.Provider\s+value\s*=\s*\{`, failHint: 'Wrap the views in <ProjectContext.Provider value={...}>.' },
        { id: 'ctx-use', label: 'Reads the context with useContext', pattern: String.raw`useContext\s*\(\s*\w+\s*\)`, failHint: 'Read it with useContext(ProjectContext).' },
        { id: 'hook-define', label: 'Defines a custom hook', pattern: String.raw`function\s+use[A-Z]\w*\s*\(|const\s+use[A-Z]\w*\s*=\s*\(`, failHint: 'Write function useProjects() { return useContext(ProjectContext); }.' },
        { id: 'hook-use', label: 'Components use the custom hook', pattern: String.raw`=\s*use(?!State\b|Context\b|Effect\b|Memo\b|Ref\b|Callback\b|Reducer\b)[A-Z]\w*\s*\(`, failHint: 'Call your hook in a view: const { projects } = useProjects().' },
        { id: 'view-state', label: 'Keeps the current view in state', pattern: String.raw`useState\s*\(\s*(?:'[^']*'|"[^"]*")\s*\)`, failHint: 'Create const [view, setView] = useState("overview").' },
        { id: 'view-switch', label: 'Renders a different view for each choice', pattern: String.raw`\b\w*[vV]iew\w*\s*===?\s*['"][\s\S]*\?|\b\w*[vV]iew\w*\s*===?\s*['"][\s\S]*&&`, failHint: 'Render {view === "overview" ? <Overview /> : <List />}.' },
        { id: 'stat', label: 'Shows a number worked out from the shared list', pattern: String.raw`\.filter\s*\([\s\S]*?\)\s*\.length|\.reduce\s*\(`, failHint: 'Work out a stat, for example projects.filter((p) => p.done).length.' },
      ],
    },
  },
];

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}
