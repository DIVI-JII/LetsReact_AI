import { lesson } from './build';

export const whyReactContent = lesson({
  id: 'why-react',
  lead: 'React lets you describe what the screen should look like for the current data, and it keeps the page up to date for you when the data changes.',
  analogy: [
    'Think of a restaurant menu board',
    'Without React you walk to the board and rub out each price by hand. With React you change the price list and the board redraws itself.',
  ],
  points: [
    'Websites with lots of changing data (carts, feeds, dashboards) are hard to keep in sync by hand.',
    'React builds the screen out of small, reusable pieces called components.',
    'You describe the result you want; React works out the smallest set of changes to make.',
    'The same idea powers many large products, so the skill transfers.',
  ],
  demo: 'state',
  caption: 'Press Increase. You never touch the number on screen; you only change the data.',
  whatsHappening: 'The data changed, so React redrew the part of the page that depends on it. You did not edit the page yourself.',
  practice: {
    prompt: 'Which word describes the data a component remembers?',
    instructions: 'Complete the line so the preview shows the heading “State changes the screen”.',
    codePrefix: 'const idea = ',
    codeSuffix: ';\nreturn <h1>{idea}</h1>;',
    placeholder: "'State changes the screen'",
    accepted: ["'Statechangesthescreen'", '"Statechangesthescreen"', '`Statechangesthescreen`'],
    hint: 'Type the sentence inside quotes so JavaScript treats it as text.',
    success: 'Yes! The heading now reads “State changes the screen”.',
    nearMiss: 'Close. Put the exact sentence inside quotes.',
    result: 'State changes the screen',
  },
  quizTitle: 'Why React check-in',
  questions: [
    {
      prompt: 'What is the main job React does for you?',
      correct: 'Keeps the screen in sync with your data',
      wrong: [
        ['Hosts your website on a server', 'Hosting is a separate service. React runs in the browser and draws the interface.'],
        ['Stores your data in a database', 'React does not store data permanently. A backend or database does that.'],
        ['Replaces JavaScript', 'React is a JavaScript library. You still write JavaScript.'],
      ],
      explanation: 'You describe the screen for the current data. When the data changes, React updates the page.',
    },
    {
      prompt: 'What is a component?',
      correct: 'A reusable piece of the screen written as a function',
      wrong: [
        ['A CSS file', 'CSS styles things. A component is a piece of interface plus its behaviour.'],
        ['A browser extension', 'Components live inside your app, not in the browser.'],
        ['A database table', 'Tables hold data. Components describe what to show.'],
      ],
      explanation: 'Components let you build a screen from small, reusable parts, like blocks.',
    },
    {
      prompt: 'When data changes, what do you do in React?',
      correct: 'Update the data and let React redraw the screen',
      wrong: [
        ['Find the element and edit it by hand', 'That is the manual way React saves you from.'],
        ['Reload the whole page', 'A reload throws away what the user was doing. React updates only what changed.'],
        ['Rewrite the component file', 'The component stays the same. Only the data changes.'],
      ],
      explanation: 'Changing data is how you change the screen. React handles the update.',
    },
  ],
});

export const workspaceSetupContent = lesson({
  id: 'workspace-setup',
  lead: 'A React project needs three things: Node.js to run tools, an editor to write code, and a starter project made with Vite.',
  analogy: [
    'Think of setting up a kitchen',
    'Node.js is the stove, your editor is the counter, and Vite is a ready-made recipe kit that gets you cooking in a minute.',
  ],
  points: [
    'Install Node.js (the LTS version) from nodejs.org, then check it with node -v.',
    'Use an editor such as VS Code. Its built-in terminal is where you run commands.',
    'Create a project with npm create vite@latest and choose React with TypeScript.',
    'Run npm install once, then npm run dev to start the site at localhost.',
  ],
  demo: 'jsx',
  caption: 'Change the name and the page follows. This is what your first project will do.',
  whatsHappening: 'The dev server watches your files. When you save, the browser updates without a refresh.',
  practice: {
    prompt: 'Which command starts your project while you work on it?',
    instructions: 'Type the command that starts the Vite dev server (it begins with npm).',
    codePrefix: '$ ',
    codeSuffix: '',
    placeholder: 'npm run ...',
    accepted: ['npmrundev'],
    hint: 'The script name is dev.',
    success: 'Yes! npm run dev starts the local site.',
    nearMiss: 'Close. The full command is npm run followed by the script name, dev.',
    result: 'Local site running',
  },
  quizTitle: 'Workspace check-in',
  questions: [
    {
      prompt: 'What does Node.js do for a React project?',
      correct: 'Runs the tools that build and serve your project',
      wrong: [
        ['Draws the interface in the browser', 'The browser draws the interface. Node runs tooling on your computer.'],
        ['Stores your users', 'That is a database. Node here runs the build tools.'],
        ['Replaces your editor', 'You still need an editor to write code.'],
      ],
      explanation: 'Vite and npm are Node programs. They build your code and run the dev server.',
    },
    {
      prompt: 'Which command installs the project’s packages?',
      correct: 'npm install',
      wrong: [
        ['npm run dev', 'That starts the dev server. Install first, then run.'],
        ['node install', 'node runs files. Packages are installed with npm.'],
        ['vite build', 'That makes a production build.'],
      ],
      explanation: 'npm install reads package.json and downloads what the project needs into node_modules.',
    },
    {
      prompt: 'What does the dev server do when you save a file?',
      correct: 'Updates the page in the browser automatically',
      wrong: [
        ['Deploys your site to the internet', 'Deploying is a separate step. The dev server runs only on your computer.'],
        ['Deletes node_modules', 'It leaves node_modules alone.'],
        ['Nothing, you must restart it', 'It reloads changes for you, which is why development is fast.'],
      ],
      explanation: 'Hot reloading shows your change in the browser within a moment of saving.',
    },
  ],
});

export const firstProjectContent = lesson({
  id: 'first-project',
  lead: 'A fresh React project has a small set of files, and each one has a clear job.',
  analogy: [
    'Think of a house plan',
    'index.html is the front door, main.tsx is the hallway that starts everything, and App.tsx is the first room you decorate.',
  ],
  points: [
    'index.html holds one empty <div id="root"> where React draws the app.',
    'src/main.tsx finds that div and renders the App component into it.',
    'src/App.tsx is your first component. Edit it and watch the page change.',
    'package.json lists your dependencies and the scripts you can run.',
  ],
  demo: 'component',
  caption: 'Add components to the page. Each one is a small function, just like App.',
  whatsHappening: 'App is a component made of other components. Adding one is just writing another tag.',
  practice: {
    prompt: 'Which file starts your React app?',
    instructions: 'Complete the line. The file that renders App into the page is main.',
    codePrefix: 'src/',
    codeSuffix: '.tsx',
    placeholder: '...',
    accepted: ['main'],
    hint: 'It is the entry file, named main.',
    success: 'Yes! main.tsx renders <App /> into the root div.',
    nearMiss: 'Close. The entry file is called main.',
    result: 'src/main.tsx',
  },
  quizTitle: 'First project check-in',
  questions: [
    {
      prompt: 'Where does React draw your app in the page?',
      correct: 'Inside the div with id="root"',
      wrong: [
        ['Inside the <head> tag', 'The head holds metadata. The app is drawn in a div in the body.'],
        ['In package.json', 'package.json is configuration, not part of the page.'],
        ['In node_modules', 'node_modules holds installed packages.'],
      ],
      explanation: 'index.html has an empty root div. main.tsx tells React to render the app inside it.',
    },
    {
      prompt: 'Which file would you edit first to change what appears on screen?',
      correct: 'src/App.tsx',
      wrong: [
        ['package.json', 'That lists dependencies, not what the page shows.'],
        ['vite.config.ts', 'That configures the build tool.'],
        ['node_modules/react', 'Never edit installed packages.'],
      ],
      explanation: 'App.tsx is the top component. Change its JSX and the page updates.',
    },
    {
      prompt: 'What is package.json for?',
      correct: 'Listing dependencies and scripts',
      wrong: [
        ['Holding your styles', 'Styles live in CSS files.'],
        ['Storing user data', 'It is project configuration, not data storage.'],
        ['Rendering components', 'Components are in .tsx files.'],
      ],
      explanation: 'npm reads package.json to know what to install and which scripts, such as dev, you can run.',
    },
  ],
});

export const readingAppContent = lesson({
  id: 'reading-a-react-app',
  lead: 'To read any React app, start at main.tsx and follow the components down. Data flows from parents to children.',
  analogy: [
    'Think of an org chart',
    'The top component hands tasks and information down to the teams below it. To understand the company, start at the top and walk down.',
  ],
  points: [
    'Start at main.tsx, then open App and see which components it uses.',
    'Each component is a function that returns JSX.',
    'Props are the information a parent passes to a child, like function arguments.',
    'State is data a component remembers and can change over time.',
  ],
  demo: 'props',
  caption: 'Same component, different props. Press the button to pass in a new person.',
  whatsHappening: 'The parent decides the data. The child only displays what it is given.',
  practice: {
    prompt: 'Which direction does data flow?',
    instructions: 'Complete the sentence: data flows from the parent down to the ...',
    codePrefix: '// Data flows from the parent to the ',
    codeSuffix: '',
    placeholder: '...',
    accepted: ['child', 'children'],
    hint: 'The opposite of parent.',
    success: 'Yes! Parents pass props down to their children.',
    nearMiss: 'Close. The opposite of a parent is a child.',
    result: 'Parent → child',
  },
  quizTitle: 'Reading a React app check-in',
  questions: [
    {
      prompt: 'Where should you start when reading an unfamiliar React app?',
      correct: 'main.tsx, then the App component',
      wrong: [
        ['The deepest component', 'Start from the top so you see how the pieces fit.'],
        ['node_modules', 'That is installed code, not the app.'],
        ['The CSS file', 'Styles help later, but structure comes from the components.'],
      ],
      explanation: 'The entry file leads to App, and App shows which components make up the screen.',
    },
    {
      prompt: 'What are props?',
      correct: 'Information a parent passes to a child component',
      wrong: [
        ['Data a component keeps for itself', 'That is state. Props come from outside.'],
        ['CSS properties', 'CSS has properties, but props are inputs to components.'],
        ['Files in the public folder', 'Those are static assets.'],
      ],
      explanation: 'Props work like function arguments. They make one component reusable with different data.',
    },
    {
      prompt: 'How do you spot a component in JSX?',
      correct: 'Its name starts with a capital letter, like <Card />',
      wrong: [
        ['It is always inside a <div>', 'Components can appear anywhere JSX is allowed.'],
        ['It has no attributes', 'Components often take attributes, which are props.'],
        ['It ends in .css', 'That is a stylesheet.'],
      ],
      explanation: 'Lowercase tags like <div> are HTML elements. Capitalised tags are your components.',
    },
  ],
});
