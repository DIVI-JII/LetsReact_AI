import type { Challenge } from '../types';

export const counterChallenge: Challenge = {
  id: 'build-a-counter',
  title: 'Build a Counter',
  summary: 'Put state and events to work: build a counter that goes up, down and back to zero.',
  difficulty: 'Beginner',
  concepts: ['State', 'Events'],
  lessonId: 'understanding-state',
  filename: 'Counter.jsx',
  requirementTests: [['display', 'state'], ['buttons', 'increase'], ['decrease'], ['reset']],
  expected: [
    'A number starts at 0.',
    'Increase adds 1, Decrease subtracts 1.',
    'Reset puts the number back to 0.',
  ],
  requirements: [
    'Display a number',
    'Add an increase button',
    'Add a decrease button',
    'Add a reset button',
  ],
  hints: [
    'Start with state: const [count, setCount] = useState(0).',
    'Show the number by placing {count} inside your JSX.',
    'Each button needs an onClick. Try onClick={() => setCount(count + 1)}.',
    'Reset can set the count straight back to zero: setCount(0).',
  ],
  starterCode: `import { useState } from 'react';

export default function Counter() {
  // 1. Create state called count that starts at 0

  return (
    <div>
      {/* 2. Show the count */}

      {/* 3. Add Increase, Decrease and Reset buttons */}
    </div>
  );
}
`,
  solution: `import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>{count}</h2>
      <button onClick={() => setCount(count + 1)}>Increase</button>
      <button onClick={() => setCount(count - 1)}>Decrease</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
`,
  tests: [
    {
      id: 'state',
      label: 'Creates state that starts at 0',
      pattern: String.raw`useState\s*\(\s*0\s*\)`,
      failHint: 'Create the count with useState(0).',
    },
    {
      id: 'display',
      label: 'Displays the count',
      pattern: String.raw`\{\s*count\s*\}`,
      failHint: 'Show the number by placing {count} inside your JSX.',
    },
    {
      id: 'buttons',
      label: 'Renders three buttons',
      pattern: String.raw`(?:<button[\s\S]*?){3}`,
      failHint: 'Add three <button> elements: Increase, Decrease and Reset.',
    },
    {
      id: 'increase',
      label: 'Increase adds 1',
      pattern: String.raw`set\w+\(\s*(?:count\s*\+\s*1|\(?\w+\)?\s*=>\s*\w+\s*\+\s*1)\s*\)`,
      failHint: 'Call setCount(count + 1) when Increase is clicked.',
    },
    {
      id: 'decrease',
      label: 'Decrease subtracts 1',
      pattern: String.raw`set\w+\(\s*(?:count\s*-\s*1|\(?\w+\)?\s*=>\s*\w+\s*-\s*1)\s*\)`,
      failHint: 'Call setCount(count - 1) when Decrease is clicked.',
    },
    {
      id: 'reset',
      label: 'Reset returns to 0',
      pattern: String.raw`set\w+\(\s*0\s*\)`,
      failHint: 'Call setCount(0) when Reset is clicked.',
    },
  ],
};



const toggleChallenge: Challenge = {
  id: 'toggle-panel',
  title: 'Show and Hide a Panel',
  summary: 'Use a true/false state to reveal and hide content, and change the button label to match.',
  difficulty: 'Beginner',
  concepts: ['State', 'Conditional rendering'],
  lessonId: 'conditional-basics',
  filename: 'Panel.jsx',
  requirements: [
    'Start with the panel hidden',
    'A button flips the panel on and off',
    'Show the panel only when it is open',
    'The button says Show or Hide to match',
  ],
  requirementTests: [['state'], ['click', 'toggle'], ['conditional'], ['label']],
  expected: [
    'On first load only the button is visible.',
    'Clicking it reveals a message and the button now says "Hide".',
    'Clicking again hides the message and the button says "Show".',
  ],
  hints: [
    'Create a boolean: const [open, setOpen] = useState(false).',
    'Flip it with onClick={() => setOpen(!open)}.',
    'Render the panel only when open is true: {open && <p>...</p>}.',
    'Choose the label with a ternary: {open ? "Hide" : "Show"}.',
  ],
  starterCode: `import { useState } from 'react';

export default function Panel() {
  // 1. Create a true/false state called open (start hidden)

  return (
    <div>
      {/* 2. A button that flips open */}

      {/* 3. A message that shows only when open is true */}
    </div>
  );
}
`,
  solution: `import { useState } from 'react';

export default function Panel() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setOpen(!open)}>{open ? 'Hide' : 'Show'}</button>
      {open && <p>Here is the hidden panel.</p>}
    </div>
  );
}
`,
  tests: [
    { id: 'state', label: 'Creates a true/false state that starts as false', pattern: String.raw`useState\s*\(\s*false\s*\)`, failHint: 'Create the state with useState(false) so the panel starts hidden.' },
    { id: 'click', label: 'The button has a click handler', pattern: String.raw`<button[\s\S]*?onClick\s*=`, failHint: 'Give the <button> an onClick.' },
    { id: 'toggle', label: 'Clicking flips the value', pattern: String.raw`set\w+\(\s*(?:!\s*\w+|\(?\w+\)?\s*=>\s*!\s*\w+)\s*\)`, failHint: 'Flip the value with setOpen(!open).' },
    { id: 'conditional', label: 'The panel renders only when open', pattern: String.raw`\{\s*\w+\s*&&\s*[(<]|\{\s*\w+\s*\?\s*[(<]`, failHint: 'Use {open && <p>...</p>} so the panel appears only when open is true.' },
    { id: 'label', label: 'The label changes between Show and Hide', pattern: String.raw`\{\s*\w+\s*\?\s*(['"\x60])[^'"\x60]*\1\s*:\s*(['"\x60])[^'"\x60]*\2\s*\}`, failHint: 'Pick the text with a ternary: {open ? "Hide" : "Show"}.' },
  ],
};

const greetingChallenge: Challenge = {
  id: 'greeting-cards',
  title: 'Reusable Greeting Cards',
  summary: 'Build one component and use it twice with different props.',
  difficulty: 'Beginner',
  concepts: ['Components', 'Props'],
  lessonId: 'passing-props',
  filename: 'Greeting.jsx',
  requirements: [
    'Create a Greeting component',
    'It accepts name and message props',
    'It shows both values',
    'Use it at least twice with different props',
  ],
  requirementTests: [['component'], ['props'], ['shows'], ['reuse', 'passing']],
  expected: [
    'Two cards appear on the page.',
    'Each shows its own name and message, for example "Ada: Welcome back!" and "Grace: Keep going!".',
  ],
  hints: [
    'A component is a function whose name starts with a capital letter: function Greeting() {}.',
    'Receive props by destructuring: function Greeting({ name, message }).',
    'Show them with {name} and {message} inside the JSX.',
    'Use it like a tag: <Greeting name="Ada" message="Welcome back!" />.',
  ],
  starterCode: `export default function App() {
  // 1. Write a Greeting component above this function
  //    that receives name and message props

  return (
    <main>
      {/* 2. Use <Greeting /> twice with different props */}
    </main>
  );
}
`,
  solution: `function Greeting({ name, message }) {
  return (
    <section>
      <h2>{name}</h2>
      <p>{message}</p>
    </section>
  );
}

export default function App() {
  return (
    <main>
      <Greeting name="Ada" message="Welcome back!" />
      <Greeting name="Grace" message="Keep going!" />
    </main>
  );
}
`,
  tests: [
    { id: 'component', label: 'Defines a Greeting component', pattern: String.raw`function\s+Greeting\s*\(|const\s+Greeting\s*=`, failHint: 'Write function Greeting() { ... } with a capital G.' },
    { id: 'props', label: 'Greeting receives name and message', pattern: String.raw`(?:function\s+Greeting|const\s+Greeting\s*=)\s*\(?\s*(?:\{\s*(?:name\s*,\s*message|message\s*,\s*name)\s*\}|props)`, failHint: 'Receive the props with function Greeting({ name, message }).' },
    { id: 'shows', label: 'Shows the name and the message', pattern: String.raw`^(?=[\s\S]*\{\s*(?:props\.)?name\s*\})(?=[\s\S]*\{\s*(?:props\.)?message\s*\})`, failHint: 'Place {name} and {message} inside the JSX Greeting returns.' },
    { id: 'reuse', label: 'Uses <Greeting /> at least twice', pattern: String.raw`<Greeting\b[\s\S]*<Greeting\b`, failHint: 'Add a second <Greeting /> with different props.' },
    { id: 'passing', label: 'Passes name and message as props', pattern: String.raw`<Greeting\b[^>]*\bname\s*=[^>]*\bmessage\s*=|<Greeting\b[^>]*\bmessage\s*=[^>]*\bname\s*=`, failHint: 'Write <Greeting name="Ada" message="Welcome back!" />.' },
  ],
};

const listChallenge: Challenge = {
  id: 'shopping-list',
  title: 'Render a Shopping List',
  summary: 'Turn an array into list items, with keys and a friendly empty state.',
  difficulty: 'Beginner',
  concepts: ['Lists', 'Keys', 'Conditional rendering'],
  lessonId: 'rendering-lists',
  filename: 'ShoppingList.jsx',
  requirements: [
    'Loop over the items with map',
    'Render each item as an <li>',
    'Give every <li> a key from its id',
    'Show each item’s name',
    'Show a message when the list is empty',
  ],
  requirementTests: [['map'], ['li'], ['key'], ['name'], ['empty']],
  expected: [
    'Each item in the array becomes one bullet showing its name.',
    'If the array is empty the page says there is nothing to buy yet.',
  ],
  hints: [
    'items.map((item) => ...) returns one element per item.',
    'Return <li key={item.id}>...</li> from inside map.',
    'Show the text with {item.name}.',
    'Check items.length === 0 and show a message instead of the list.',
  ],
  starterCode: `const items = [
  { id: 1, name: 'Apples' },
  { id: 2, name: 'Bread' },
  { id: 3, name: 'Milk' },
];

export default function ShoppingList() {
  // Render the items as a list. Show a message if there are none.
  return (
    <div>
      <h2>Shopping list</h2>
    </div>
  );
}
`,
  solution: `const items = [
  { id: 1, name: 'Apples' },
  { id: 2, name: 'Bread' },
  { id: 3, name: 'Milk' },
];

export default function ShoppingList() {
  return (
    <div>
      <h2>Shopping list</h2>
      {items.length === 0 ? (
        <p>Nothing to buy yet.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
`,
  tests: [
    { id: 'map', label: 'Loops over the items with map', pattern: String.raw`\bitems\s*\.map\s*\(|\.map\s*\(\s*\(?\s*\w+`, failHint: 'Use items.map((item) => ...) to turn each item into JSX.' },
    { id: 'li', label: 'Renders each item as an <li>', pattern: String.raw`<li[\s>]`, failHint: 'Return an <li> for every item.' },
    { id: 'key', label: 'Each <li> has a key from its id', pattern: String.raw`<li[^>]*\bkey\s*=\s*\{\s*\w+\.id\s*\}`, failHint: 'Add key={item.id} to the <li>.' },
    { id: 'name', label: 'Shows the item name', pattern: String.raw`\{\s*\w+\.name\s*\}`, failHint: 'Show the name with {item.name}.' },
    { id: 'empty', label: 'Shows a message when the list is empty', pattern: String.raw`\.length\s*===?\s*0|!\s*\w+\.length|\.length\s*\?`, failHint: 'Check items.length === 0 and show a friendly message.' },
  ],
};

const inputChallenge: Challenge = {
  id: 'live-preview-input',
  title: 'Live Name Preview',
  summary: 'Build a controlled input that shows what you type, with a clear button.',
  difficulty: 'Intermediate',
  concepts: ['State', 'Forms', 'Events'],
  lessonId: 'controlled-inputs',
  filename: 'NamePreview.jsx',
  requirements: [
    'Keep the text in state',
    'The input shows the state (controlled)',
    'Typing updates the state',
    'Show the text below the input',
    'A Clear button empties it',
  ],
  requirementTests: [['state'], ['value'], ['onchange'], ['display'], ['clear']],
  expected: [
    'As you type, the text appears below the input straight away.',
    'Clear empties both the input and the preview.',
  ],
  hints: [
    'Start with const [name, setName] = useState("").',
    'Set value={name} on the <input>.',
    'Add onChange={(e) => setName(e.target.value)}.',
    'Show {name} in a paragraph, and add a button with onClick={() => setName("")}.',
  ],
  starterCode: `import { useState } from 'react';

export default function NamePreview() {
  // 1. Keep the typed text in state

  return (
    <div>
      {/* 2. A controlled input */}
      {/* 3. Show the text below it */}
      {/* 4. A Clear button */}
    </div>
  );
}
`,
  solution: `import { useState } from 'react';

export default function NamePreview() {
  const [name, setName] = useState('');

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
      <p>Hello, {name}!</p>
      <button onClick={() => setName('')}>Clear</button>
    </div>
  );
}
`,
  tests: [
    { id: 'state', label: 'Stores the text in state, starting empty', pattern: String.raw`useState\s*\(\s*(?:''|""|\x60\x60)\s*\)`, failHint: 'Create state with useState("").' },
    { id: 'value', label: 'The input shows the state value', pattern: String.raw`const\s*\[\s*(\w+)\s*,[\s\S]*?<input[\s\S]*?\bvalue\s*=\s*\{\s*\1\s*\}`, failHint: 'Give the <input> value={name} so it displays the state.' },
    { id: 'onchange', label: 'Typing updates the state', pattern: String.raw`onChange\s*=\s*\{[\s\S]*?set\w+\(\s*\w+\.target\.value\s*\)`, failHint: 'Add onChange={(e) => setName(e.target.value)}.' },
    { id: 'display', label: 'Shows the text below the input', pattern: String.raw`const\s*\[\s*(\w+)\s*,\s*set\w+\s*\]\s*=\s*useState[\s\S]*<p[^>]*>[^<]*\{\s*\1\s*\}`, failHint: 'Show {name} inside a <p> under the input.' },
    { id: 'clear', label: 'A Clear button empties the text', pattern: String.raw`onClick\s*=\s*\{[^}]*set\w+\(\s*(?:''|""|\x60\x60)\s*\)`, failHint: 'Add a button with onClick={() => setName("")}.' },
  ],
};

const fetchChallenge: Challenge = {
  id: 'load-users',
  title: 'Load Users from an API',
  summary: 'Fetch data when the component appears, with loading and error states.',
  difficulty: 'Intermediate',
  concepts: ['useEffect', 'API requests', 'Loading states'],
  lessonId: 'fetch-data',
  filename: 'Users.jsx',
  requirements: [
    'Keep the users in state',
    'Fetch once when the component appears',
    'Show a loading message',
    'Handle errors',
    'Render the users as a list',
  ],
  requirementTests: [['users-state'], ['effect', 'fetch'], ['loading'], ['error'], ['render']],
  expected: [
    'The page first says "Loading…".',
    'When the data arrives, the names appear as a list.',
    'If the request fails, a friendly error message appears instead.',
  ],
  hints: [
    'Create const [users, setUsers] = useState([]), plus loading and error state.',
    'Put the fetch inside useEffect(() => { ... }, []) so it runs once.',
    'Turn loading off in .finally(() => setLoading(false)) or after await.',
    'Use .catch(() => setError("...")) or try/catch around await.',
    'Render users.map((u) => <li key={u.id}>{u.name}</li>).',
  ],
  starterCode: `import { useEffect, useState } from 'react';

const URL = 'https://jsonplaceholder.typicode.com/users';

export default function Users() {
  // 1. State for users, loading and error

  // 2. Fetch the users once, when the component appears

  return (
    <div>
      <h2>Users</h2>
      {/* 3. Loading, error and the list */}
    </div>
  );
}
`,
  solution: `import { useEffect, useState } from 'react';

const URL = 'https://jsonplaceholder.typicode.com/users';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(URL)
      .then((res) => {
        if (!res.ok) throw new Error('Request failed');
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch(() => setError('Could not load users.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2>Users</h2>
      {loading && <p>Loading…</p>}
      {error && <p>{error}</p>}
      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
    </div>
  );
}
`,
  tests: [
    { id: 'users-state', label: 'Keeps the users in state (starts as an empty array)', pattern: String.raw`useState\s*\(\s*\[\s*\]\s*\)`, failHint: 'Create const [users, setUsers] = useState([]).' },
    { id: 'effect', label: 'Runs the fetch once with useEffect', pattern: String.raw`useEffect\s*\([\s\S]*\}\s*,\s*\[\s*\]\s*\)`, failHint: 'Wrap the fetch in useEffect(() => { ... }, []).' },
    { id: 'fetch', label: 'Calls fetch and stores the result', pattern: String.raw`fetch\s*\([\s\S]*set\w+\(`, failHint: 'Call fetch(URL), read the JSON, then call setUsers(data).' },
    { id: 'loading', label: 'Shows a loading state', pattern: String.raw`useState\s*\(\s*true\s*\)[\s\S]*(?:\b\w*[lL]oading\w*\s*(?:\?|&&)|if\s*\(\s*\w*[lL]oading\w*\s*\))`, failHint: 'Keep loading in state (start true) and show a message while it is true.' },
    { id: 'error', label: 'Handles a failed request', pattern: String.raw`\bcatch\b`, failHint: 'Add .catch(...) or try/catch and store an error message.' },
    { id: 'render', label: 'Renders the users as a list with keys', pattern: String.raw`\.map\s*\([\s\S]*?\bkey\s*=\s*\{`, failHint: 'Use users.map((u) => <li key={u.id}>{u.name}</li>).' },
  ],
};

const hookChallenge: Challenge = {
  id: 'use-toggle-hook',
  title: 'Write a useToggle Hook',
  summary: 'Extract repeated on/off logic into your own custom hook and use it.',
  difficulty: 'Advanced',
  concepts: ['Custom hooks', 'State'],
  lessonId: 'custom-hooks',
  filename: 'useToggle.jsx',
  requirements: [
    'Define a hook named useToggle',
    'It keeps a true/false state',
    'It returns the value and a toggle function',
    'The toggle flips the value',
    'A component uses the hook',
  ],
  requirementTests: [['name'], ['state'], ['returns'], ['flip'], ['use']],
  expected: [
    'The component shows "Off" at first.',
    'Pressing the button switches it to "On" and back, using your hook.',
  ],
  hints: [
    'Hooks are functions whose names start with use: function useToggle() { ... }.',
    'Inside, keep const [on, setOn] = useState(false).',
    'Make a toggle function: const toggle = () => setOn(!on).',
    'Return both so the component can use them: return [on, toggle].',
    'In the component: const [on, toggle] = useToggle().',
  ],
  starterCode: `import { useState } from 'react';

// 1. Write the useToggle hook here

export default function Switch() {
  // 2. Use your hook here

  return (
    <div>
      {/* 3. Show On or Off and a button that toggles it */}
    </div>
  );
}
`,
  solution: `import { useState } from 'react';

function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = () => setOn(!on);
  return [on, toggle];
}

export default function Switch() {
  const [on, toggle] = useToggle();

  return (
    <div>
      <p>{on ? 'On' : 'Off'}</p>
      <button onClick={toggle}>Switch</button>
    </div>
  );
}
`,
  tests: [
    { id: 'name', label: 'Defines a hook called useToggle', pattern: String.raw`function\s+useToggle\s*\(|const\s+useToggle\s*=`, failHint: 'Write function useToggle() { ... }. Hook names start with "use".' },
    { id: 'state', label: 'The hook keeps a true/false state', pattern: String.raw`useToggle[\s\S]*?useState\s*\(`, failHint: 'Inside useToggle, create state with useState(false).' },
    { id: 'returns', label: 'Returns the value and the toggle function', pattern: String.raw`return\s*\[\s*\w+\s*,\s*\w+\s*\]|return\s*\{\s*\w+\s*,\s*\w+\s*\}`, failHint: 'Return both: return [on, toggle].' },
    { id: 'flip', label: 'The toggle flips the value', pattern: String.raw`set\w+\(\s*(?:!\s*\w+|\(?\w+\)?\s*=>\s*!\s*\w+)\s*\)`, failHint: 'Flip it with setOn(!on).' },
    { id: 'use', label: 'A component calls useToggle()', pattern: String.raw`=\s*useToggle\s*\(`, failHint: 'In the component write const [on, toggle] = useToggle().' },
  ],
};

export const challenges: Challenge[] = [
  counterChallenge,
  toggleChallenge,
  greetingChallenge,
  listChallenge,
  inputChallenge,
  fetchChallenge,
  hookChallenge,
];

export function getChallenge(id: string): Challenge | undefined {
  return challenges.find((c) => c.id === id);
}
