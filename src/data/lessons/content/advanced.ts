import { lesson } from './build';

export const contextContent = lesson({
  id: 'context',
  lead: 'Context lets a component share data with everything inside it, so you do not have to pass props through every level.',
  analogy: [
    'Think of a building’s Wi-Fi',
    'You do not run a cable to every room. Anyone inside the building can connect and use it.',
  ],
  points: [
    'createContext makes the context, and a Provider supplies a value.',
    'Any child, however deep, can read it with useContext.',
    'Use it for things many components need: theme, current user, language.',
    'It avoids “prop drilling” but is not a replacement for ordinary props.',
  ],
  demo: 'props',
  caption: 'Props pass data one level at a time. Context removes the middle steps.',
  whatsHappening: 'The provider holds the value. Components below read it directly.',
  practice: {
    prompt: 'Which hook reads a context value?',
    instructions: 'Complete the line so the component reads the theme.',
    codePrefix: 'const theme = ',
    codeSuffix: '(ThemeContext);',
    placeholder: '...',
    accepted: ['useContext'],
    hint: 'The hook is named after what it does: use + Context.',
    success: 'Yes! useContext(ThemeContext) returns the nearest provided value.',
    nearMiss: 'Close. The hook is called useContext.',
    result: 'theme = "dark"',
  },
  quizTitle: 'Context check-in',
  questions: [
    {
      prompt: 'What problem does context solve?',
      correct: 'Passing data through many levels of components',
      wrong: [
        ['Slow network requests', 'Context is about sharing data inside the app.'],
        ['Styling', 'It is not a styling tool.'],
        ['Routing', 'Routing is handled by a router.'],
      ],
      explanation: 'It avoids passing the same prop through components that do not use it.',
    },
    {
      prompt: 'Which component supplies the value to the tree?',
      correct: 'The Provider',
      wrong: [
        ['The Consumer hook', 'Consumers read the value; the provider sets it.'],
        ['The root HTML file', 'Context is a React feature.'],
        ['The browser', 'The browser knows nothing about it.'],
      ],
      explanation: 'Wrap part of your app in <Context.Provider value={...}> to make the value available.',
    },
    {
      prompt: 'When is context a good choice?',
      correct: 'For data many components need, like the current user or theme',
      wrong: [
        ['For every single prop', 'Plain props are clearer for local data.'],
        ['For tiny one-off values', 'A simple prop or state is enough.'],
        ['For CSS colours only', 'It is not limited to styling.'],
      ],
      explanation: 'Reach for context when many distant components need the same data.',
    },
  ],
});

export const customHooksContent = lesson({
  id: 'custom-hooks',
  lead: 'A custom hook is a function that starts with “use” and packages up logic you want to reuse across components.',
  analogy: [
    'Think of a kitchen gadget',
    'Instead of chopping, measuring and timing by hand every time, you build one gadget and use it in every recipe.',
  ],
  points: [
    'Name it useSomething so React and tools know it is a hook.',
    'Inside, you can use useState, useEffect and other hooks.',
    'Return whatever the component needs: a value, a function, or both.',
    'Each component that calls it gets its own separate state.',
  ],
  demo: 'state',
  caption: 'This counter logic could live in a hook like useCounter and be reused anywhere.',
  whatsHappening: 'The hook holds state and logic. The component just uses the result.',
  practice: {
    prompt: 'What must a custom hook’s name start with?',
    instructions: 'Fill in the prefix.',
    codePrefix: 'function ',
    codeSuffix: 'Counter() { /* ... */ }',
    placeholder: '...',
    accepted: ['use'],
    hint: 'It is a three-letter word.',
    success: 'Yes! Hooks start with use, like useCounter.',
    nearMiss: 'Close. The prefix is use.',
    result: 'useCounter',
  },
  quizTitle: 'Custom hooks check-in',
  questions: [
    {
      prompt: 'Why write a custom hook?',
      correct: 'To reuse stateful logic in several components',
      wrong: [
        ['To make React faster', 'Speed is not the goal.'],
        ['To avoid writing JSX', 'You still write JSX in components.'],
        ['To share state between all components automatically', 'Each call gets its own state.'],
      ],
      explanation: 'Hooks let you extract and reuse logic without duplicating code.',
    },
    {
      prompt: 'Do two components that call the same hook share state?',
      correct: 'No, each call has its own state',
      wrong: [
        ['Yes, always', 'Hooks share code, not state.'],
        ['Only if they are siblings', 'Siblings do not share it either.'],
        ['Only in production', 'It is the same everywhere.'],
      ],
      explanation: 'To share state between components, lift it up or use context.',
    },
    {
      prompt: 'Where can you call hooks?',
      correct: 'At the top level of components and other hooks',
      wrong: [
        ['Inside loops', 'Hooks must run in the same order each render.'],
        ['Inside if statements', 'Conditions can change the order.'],
        ['Anywhere you like', 'There are rules to keep hooks working.'],
      ],
      explanation: 'The rules of hooks keep React’s bookkeeping correct: top level only.',
    },
  ],
});

export const testingContent = lesson({
  id: 'testing',
  lead: 'Test your components the way a user uses them: render, interact, and check what appears on screen.',
  analogy: [
    'Think of a quality check on a toy',
    'You do not open the factory to see how it was made. You press the button and see if it lights up.',
  ],
  points: [
    'Vitest and React Testing Library are a common, friendly pair.',
    'render(<Counter />) draws the component in a test environment.',
    'Find things by what users see, like getByRole("button", { name: "Increase" }).',
    'Simulate clicks, then assert that the screen changed as expected.',
  ],
  demo: 'events',
  caption: 'A test performs the same clicks you do and checks the result.',
  whatsHappening: 'The test triggers an event and then looks at what the screen shows.',
  practice: {
    prompt: 'Which Testing Library function draws a component for a test?',
    instructions: 'Fill in the function name.',
    codePrefix: '',
    codeSuffix: '(<Counter />);',
    placeholder: '...',
    accepted: ['render'],
    hint: 'It renders the component.',
    success: 'Yes! render(<Counter />) draws it so you can query the output.',
    nearMiss: 'Close. The function is render.',
    result: 'Component rendered',
  },
  quizTitle: 'Testing check-in',
  questions: [
    {
      prompt: 'What should tests focus on?',
      correct: 'What the user sees and does',
      wrong: [
        ['Internal variable names', 'Those can change without affecting users.'],
        ['The number of lines of code', 'That says nothing about behaviour.'],
        ['The file structure', 'Structure is not behaviour.'],
      ],
      explanation: 'Testing behaviour keeps tests useful even when you refactor.',
    },
    {
      prompt: 'Which query best matches how users find a button?',
      correct: 'getByRole("button", { name: "Save" })',
      wrong: [
        ['A CSS class selector', 'Users do not see class names.'],
        ['An internal state variable', 'Tests should not reach into internals.'],
        ['The component’s file name', 'Users never see file names.'],
      ],
      explanation: 'Role-based queries also encourage accessible markup.',
    },
    {
      prompt: 'After clicking a button in a test, what should you do?',
      correct: 'Check the screen for the expected change',
      wrong: [
        ['Nothing, the click is enough', 'A test needs an assertion.'],
        ['Reload the page', 'Tests run in memory.'],
        ['Delete the test', 'Please do not.'],
      ],
      explanation: 'An assertion such as expect(...).toBeInTheDocument() proves the behaviour.',
    },
  ],
});

export const accessibilityContent = lesson({
  id: 'accessibility-basics',
  lead: 'Accessibility means everyone can use what you build, including people who use keyboards, screen readers or zoom.',
  analogy: [
    'Think of a building with a ramp',
    'A ramp helps wheelchair users, but also parents with prams and people with heavy bags. Good accessibility helps nearly everyone.',
  ],
  points: [
    'Use the right element: <button> for actions, <a> for links, <label> for inputs.',
    'Give images an alt description, or alt="" if they are decorative.',
    'Make sure everything works with the keyboard and shows a visible focus.',
    'Keep colour contrast strong, and do not use colour alone to show meaning.',
  ],
  demo: 'jsx',
  caption: 'JSX is HTML-like. Choosing the right tags is the first step to an accessible page.',
  whatsHappening: 'Semantic elements give browsers and screen readers the meaning for free.',
  practice: {
    prompt: 'Which attribute describes an image for screen readers?',
    instructions: 'Complete the image tag.',
    codePrefix: '<img src="cat.png" ',
    codeSuffix: '="A grey cat sleeping" />',
    placeholder: '...',
    accepted: ['alt'],
    hint: 'It is short for “alternative text”.',
    success: 'Yes! alt gives the image a text description.',
    nearMiss: 'Close. The attribute is alt.',
    result: 'Image described',
  },
  quizTitle: 'Accessibility check-in',
  questions: [
    {
      prompt: 'Which element should you use for something that performs an action?',
      correct: '<button>',
      wrong: [
        ['<div onClick>', 'A div is not focusable or announced as a button.'],
        ['<span>', 'A span has no built-in meaning or keyboard support.'],
        ['<p>', 'Paragraphs are for text.'],
      ],
      explanation: 'A real button works with the keyboard, is announced correctly and needs no extra code.',
    },
    {
      prompt: 'Why connect a <label> to an input?',
      correct: 'Screen readers announce it, and clicking it focuses the input',
      wrong: [
        ['It makes the input blue', 'Labels are not about colour.'],
        ['It stops the form from submitting', 'Labels do not do that.'],
        ['It is only for decoration', 'Labels carry important meaning.'],
      ],
      explanation: 'Use htmlFor on the label and a matching id on the input in React.',
    },
    {
      prompt: 'How can you quickly check keyboard access?',
      correct: 'Put the mouse aside and use Tab, Enter and Space',
      wrong: [
        ['Zoom out the browser', 'That tests something else.'],
        ['Run npm install', 'Unrelated.'],
        ['Check the file size', 'Unrelated.'],
      ],
      explanation: 'If you cannot reach and use everything with the keyboard, fix it.',
    },
  ],
});

export const finalProjectContent = lesson({
  id: 'final-project',
  lead: 'Ship something real: choose a small idea, build it with what you know, then deploy it so others can use it.',
  analogy: [
    'Think of opening a small shop',
    'You do not need a huge store. Open the door with a few good things on the shelf, then improve it from customer feedback.',
  ],
  points: [
    'Pick a small project such as a task manager, habit tracker or recipe list.',
    'Plan the components, the data and the states before coding.',
    'Build the smallest working version first, then add features one at a time.',
    'Run npm run build, then deploy the dist folder to a host like Netlify, Vercel or your own server.',
  ],
  demo: 'component',
  caption: 'Real apps are many small components put together, just like this.',
  whatsHappening: 'You combine components, props, state, lists and forms into one working product.',
  practice: {
    prompt: 'Which command creates the production build?',
    instructions: 'Complete the command so Vite builds your app for deployment.',
    codePrefix: '$ npm run ',
    codeSuffix: '',
    placeholder: '...',
    accepted: ['build'],
    hint: 'It builds the optimised version.',
    success: 'Yes! npm run build creates the dist folder you deploy.',
    nearMiss: 'Close. The script is called build.',
    result: 'dist/ ready to deploy',
  },
  quizTitle: 'Final project check-in',
  questions: [
    {
      prompt: 'What is the best way to start a project?',
      correct: 'Build the smallest working version first',
      wrong: [
        ['Build every feature at once', 'That makes problems harder to find.'],
        ['Design every pixel before coding', 'Plan, but do not stall.'],
        ['Wait until you know everything', 'You learn by building.'],
      ],
      explanation: 'A small version that works gives you a base to grow from.',
    },
    {
      prompt: 'What do you deploy to a static host?',
      correct: 'The dist folder created by the build',
      wrong: [
        ['node_modules', 'It is huge and not needed.'],
        ['Your .env file', 'Never publish secrets.'],
        ['The src folder', 'The browser needs the built files.'],
      ],
      explanation: 'The build output is optimised for browsers.',
    },
    {
      prompt: 'What should you keep out of your public repository?',
      correct: 'Passwords, API keys and .env files',
      wrong: [
        ['README files', 'READMEs help others.'],
        ['Component files', 'These are your project.'],
        ['package.json', 'It is needed to install and run the project.'],
      ],
      explanation: 'Secrets in public code are quickly found and abused.',
    },
  ],
});
