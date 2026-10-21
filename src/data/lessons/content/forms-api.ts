import { lesson } from './build';

export const controlledInputsContent = lesson({
  id: 'controlled-inputs',
  lead: 'A controlled input gets its value from state and reports every change back to state, so React always knows what is typed.',
  analogy: [
    'Think of a whiteboard with a note-taker',
    'Every time someone writes a letter, the note-taker updates the official copy. The board always matches the notes.',
  ],
  points: [
    'Create state: const [name, setName] = useState("").',
    'Give the input value={name} so it displays the state.',
    'Add onChange={e => setName(e.target.value)} so typing updates the state.',
    'Now you can validate, show a preview or clear the field at any time.',
  ],
  demo: 'events',
  caption: 'Click the controls and watch the event log. Typing fires events in the same way.',
  whatsHappening: 'Each keystroke is an event. The handler updates state, and React redraws the input with the new value.',
  practice: {
    prompt: 'Which prop connects an input to state?',
    instructions: 'Fill in the prop that makes the input show the state value.',
    codePrefix: '<input ',
    codeSuffix: '={name} onChange={e => setName(e.target.value)} />',
    placeholder: '...',
    accepted: ['value'],
    hint: 'It is the prop that sets what the input displays.',
    success: 'Yes! value={name} makes this a controlled input.',
    nearMiss: 'Close. The prop is called value.',
    result: 'Controlled input',
  },
  quizTitle: 'Controlled inputs check-in',
  questions: [
    {
      prompt: 'What makes an input “controlled”?',
      correct: 'Its value comes from state and changes go through onChange',
      wrong: [
        ['It is disabled', 'Disabled inputs cannot be typed in at all.'],
        ['It has a CSS class', 'Styling does not control the value.'],
        ['It is inside a form', 'Forms hold inputs, but control comes from state.'],
      ],
      explanation: 'React state is the single source of truth for what the input shows.',
    },
    {
      prompt: 'How do you read what was typed in an onChange handler?',
      correct: 'e.target.value',
      wrong: [
        ['e.value', 'The value lives on the target element.'],
        ['document.title', 'That is the page title.'],
        ['props.value', 'props are inputs to the component, not the event.'],
      ],
      explanation: 'The event object carries the input element in target, and its value is the text.',
    },
    {
      prompt: 'What happens if you set value but forget onChange?',
      correct: 'The input becomes read-only because state never changes',
      wrong: [
        ['It works normally', 'Typing is ignored because the value is pinned to state.'],
        ['React fixes it for you', 'React warns you but does not guess.'],
        ['The page reloads', 'Nothing reloads.'],
      ],
      explanation: 'The input always shows the state. Without an update, state stays the same.',
    },
  ],
});

export const formSubmitContent = lesson({
  id: 'form-submit',
  lead: 'Handle a form with onSubmit, stop the browser’s default reload with preventDefault, then use the values from state.',
  analogy: [
    'Think of posting a letter',
    'Filling in the form is writing the letter. Submitting is dropping it in the box. preventDefault stops the postman from taking you along with it.',
  ],
  points: [
    'Put onSubmit on the <form>, not on the button.',
    'Call e.preventDefault() first, otherwise the page reloads.',
    'Read the values from state and do something with them.',
    'Reset the state afterwards to clear the form.',
  ],
  demo: 'events',
  caption: 'Events flow from the user to a handler. Submitting a form is one more event.',
  whatsHappening: 'The submit event reaches your handler, which collects state and acts on it.',
  practice: {
    prompt: 'Which call stops the page from reloading?',
    instructions: 'Complete the handler.',
    codePrefix: 'function handleSubmit(e) {\n  e.',
    codeSuffix: '();\n  save(name);\n}',
    placeholder: '...',
    accepted: ['preventDefault'],
    hint: 'It prevents the default browser behaviour.',
    success: 'Yes! preventDefault() stops the reload.',
    nearMiss: 'Close. The method is preventDefault.',
    result: 'Form handled without a reload',
  },
  quizTitle: 'Form submit check-in',
  questions: [
    {
      prompt: 'Where do you attach the submit handler?',
      correct: 'On the <form> with onSubmit',
      wrong: [
        ['On the page body', 'The event belongs to the form.'],
        ['In the CSS', 'CSS cannot handle events.'],
        ['Only on the button’s onClick', 'Pressing Enter would skip it. onSubmit covers both.'],
      ],
      explanation: 'onSubmit fires for button clicks and the Enter key.',
    },
    {
      prompt: 'Why call e.preventDefault()?',
      correct: 'To stop the browser from reloading the page',
      wrong: [
        ['To validate the form', 'Validation is separate code you write.'],
        ['To clear the inputs', 'You clear state yourself.'],
        ['To make the form faster', 'It is about stopping the default behaviour.'],
      ],
      explanation: 'A native form submit reloads the page. In React you handle it yourself.',
    },
    {
      prompt: 'After a successful submit, how do you clear the form?',
      correct: 'Set the state values back to empty',
      wrong: [
        ['Reload the page', 'That would lose other state.'],
        ['Delete the input elements', 'The inputs stay and show state.'],
        ['Nothing, it clears itself', 'Controlled inputs show state, so reset the state.'],
      ],
      explanation: 'Since inputs show state, setting state to "" empties them.',
    },
  ],
});

export const validationContent = lesson({
  id: 'validation',
  lead: 'Validation checks the values before you accept them and shows clear messages that help people fix the problem.',
  analogy: [
    'Think of a helpful form at a clinic',
    'A good receptionist says exactly what is missing (“please add your date of birth”) instead of just handing the form back.',
  ],
  points: [
    'Write a function that returns an error message or an empty string.',
    'Store errors in state and show them next to the field.',
    'Validate on submit at least, and on blur or change for quicker feedback.',
    'Tell people how to fix it: “Use at least 8 characters” beats “Invalid”.',
  ],
  demo: 'state',
  caption: 'An error message is just more state. Change the state and the message follows.',
  whatsHappening: 'State holds the current error. When it changes, the message appears or disappears.',
  practice: {
    prompt: 'Complete the check for a short password.',
    instructions: 'Fill in the comparison so passwords under 8 characters get an error.',
    codePrefix: 'if (password.length ',
    codeSuffix: ' 8) setError("Use at least 8 characters.");',
    placeholder: '...',
    accepted: ['<'],
    hint: 'You want “less than 8”.',
    success: 'Yes! length < 8 catches short passwords.',
    nearMiss: 'Close. Use the “less than” symbol.',
    result: 'Use at least 8 characters.',
  },
  quizTitle: 'Validation check-in',
  questions: [
    {
      prompt: 'What makes a good error message?',
      correct: 'It says what is wrong and how to fix it',
      wrong: [
        ['It says only “Invalid”', 'That leaves people guessing.'],
        ['It blames the user', 'Messages should be helpful and calm.'],
        ['It appears in a popup at random', 'Place it next to the field it is about.'],
      ],
      explanation: 'Specific, polite messages help people recover quickly.',
    },
    {
      prompt: 'Where do you keep error messages in a React form?',
      correct: 'In state',
      wrong: [
        ['In the HTML file', 'Errors change at runtime, so they belong in state.'],
        ['In package.json', 'That is project configuration.'],
        ['In a CSS class name', 'CSS only styles.'],
      ],
      explanation: 'State changes redraw the screen, which is exactly what an error message needs.',
    },
    {
      prompt: 'Why should you still validate on the server?',
      correct: 'Anyone can bypass the browser checks',
      wrong: [
        ['Browsers cannot run JavaScript', 'They can, but users can skip or alter it.'],
        ['It is required by React', 'It is a security rule, not a React rule.'],
        ['The server is faster at it', 'Speed is not the reason.'],
      ],
      explanation: 'Browser validation is for convenience. The server must check everything again.',
    },
  ],
});

export const fetchDataContent = lesson({
  id: 'fetch-data',
  lead: 'Use useEffect to load data when a component appears, and store the result in state so the screen can show it.',
  analogy: [
    'Think of ordering food',
    'You place the order when you sit down (the effect), and when it arrives the table is updated (state). The waiter does not stand there blocking everyone.',
  ],
  points: [
    'useEffect(() => { ... }, []) runs once after the first render.',
    'Inside, call fetch(url), read the JSON and call setData.',
    'The dependency array decides when the effect runs again.',
    'Effects run after rendering, so your component first shows a loading state.',
  ],
  demo: 'state',
  caption: 'Data in state drives the screen. Fetched data is stored the same way.',
  whatsHappening: 'When the fetch finishes, setState runs and React redraws with the data.',
  practice: {
    prompt: 'What goes in the dependency array to run an effect only once?',
    instructions: 'Complete the effect so it runs only after the first render.',
    codePrefix: 'useEffect(() => {\n  loadUsers();\n}, ',
    codeSuffix: ');',
    placeholder: '...',
    accepted: ['[]'],
    hint: 'An empty array has no dependencies that could change.',
    success: 'Yes! [] means the effect runs once after the first render.',
    nearMiss: 'Close. Use an empty array: [].',
    result: 'Runs once',
  },
  quizTitle: 'Fetching data check-in',
  questions: [
    {
      prompt: 'Where should you start a data fetch in a component?',
      correct: 'Inside useEffect',
      wrong: [
        ['Directly in the component body', 'It would run on every render and cause a loop.'],
        ['Inside the JSX', 'JSX only describes the screen.'],
        ['In the CSS', 'CSS cannot fetch data.'],
      ],
      explanation: 'Effects are the place for work that reaches outside React, like network requests.',
    },
    {
      prompt: 'What does an empty dependency array [] mean?',
      correct: 'Run the effect once after the first render',
      wrong: [
        ['Run on every render', 'That is when you pass no array at all.'],
        ['Never run', 'It runs once.'],
        ['Run on every click', 'It does not depend on clicks.'],
      ],
      explanation: 'With no dependencies to watch, React only runs the effect after the first render.',
    },
    {
      prompt: 'How does fetched data reach the screen?',
      correct: 'You save it in state, which makes React redraw',
      wrong: [
        ['fetch edits the page directly', 'fetch only returns data. You decide what to do with it.'],
        ['React reads the network itself', 'React does not fetch for you.'],
        ['The browser refreshes', 'No refresh is needed.'],
      ],
      explanation: 'setData updates state, so the component renders again with the data.',
    },
  ],
});

export const loadingErrorsContent = lesson({
  id: 'loading-errors',
  lead: 'Requests can be slow or fail. Track loading and error in state so people always know what is happening.',
  analogy: [
    'Think of a parcel tracker',
    'It says “on its way”, “delivered” or “problem with delivery”. You never wonder what happened to your parcel.',
  ],
  points: [
    'Keep three pieces of state: data, loading and error.',
    'Wrap the fetch in try/catch and set error if it fails.',
    'Check response.ok, because fetch only rejects on network failure.',
    'Use finally to turn loading off whether it worked or not.',
  ],
  demo: 'state',
  caption: 'More state values, more screens. Loading and error are just values too.',
  whatsHappening: 'State moves from loading to data or to error, and the screen follows.',
  practice: {
    prompt: 'Which block runs whether the request succeeded or failed?',
    instructions: 'Fill in the keyword so loading is always turned off.',
    codePrefix: 'try {\n  await load();\n} catch (e) {\n  setError(true);\n} ',
    codeSuffix: ' {\n  setLoading(false);\n}',
    placeholder: '...',
    accepted: ['finally'],
    hint: 'It “finally” runs at the end.',
    success: 'Yes! finally runs in both cases.',
    nearMiss: 'Close. The keyword is finally.',
    result: 'Loading is always cleared',
  },
  quizTitle: 'Loading and errors check-in',
  questions: [
    {
      prompt: 'Does fetch reject on a 404 or 500 response?',
      correct: 'No, you must check response.ok yourself',
      wrong: [
        ['Yes, always', 'fetch only rejects on network failures.'],
        ['Only on 404', 'Neither 404 nor 500 reject.'],
        ['Only in production', 'It behaves the same everywhere.'],
      ],
      explanation: 'A server error still gives you a response. Check response.ok and throw if it is false.',
    },
    {
      prompt: 'Which three values does a data-loading component usually track?',
      correct: 'data, loading and error',
      wrong: [
        ['url, port and host', 'Those describe where to fetch, not the state of the request.'],
        ['header, body and footer', 'Those are page areas.'],
        ['start, stop and pause', 'Those are for media players.'],
      ],
      explanation: 'Each combination of these maps to a different screen.',
    },
    {
      prompt: 'What should the user see when a request fails?',
      correct: 'A clear message and, ideally, a way to try again',
      wrong: [
        ['A blank page', 'That leaves people confused.'],
        ['A technical stack trace', 'Details belong in logs, not on screen.'],
        ['Nothing, it fixes itself', 'It does not.'],
      ],
      explanation: 'Friendly errors with a retry button keep people moving.',
    },
  ],
});

export const searchApiContent = lesson({
  id: 'search-api',
  lead: 'To search as people type, store the query in state and fetch whenever it changes, waiting briefly so you do not send a request per keystroke.',
  analogy: [
    'Think of a librarian',
    'You do not want them to run to the shelf after every letter you say. They wait until you pause, then fetch.',
  ],
  points: [
    'Keep the query in state and put it in the useEffect dependency array.',
    'Debounce: wait ~300ms after the last keystroke before fetching.',
    'Clean up the effect so old requests do not overwrite newer ones.',
    'Encode the query with encodeURIComponent before putting it in a URL.',
  ],
  demo: 'events',
  caption: 'Each keystroke is an event. Search turns those events into requests.',
  whatsHappening: 'Events update state, and the effect reacts to the state change by fetching.',
  practice: {
    prompt: 'Which function makes the query safe to put in a URL?',
    instructions: 'Complete the line so spaces and symbols are encoded.',
    codePrefix: 'const url = `/api/search?q=${',
    codeSuffix: '(query)}`;',
    placeholder: '...',
    accepted: ['encodeURIComponent'],
    hint: 'It encodes a URI component.',
    success: 'Yes! encodeURIComponent keeps special characters from breaking the URL.',
    nearMiss: 'Close. The function is encodeURIComponent.',
    result: '/api/search?q=react%20hooks',
  },
  quizTitle: 'Search check-in',
  questions: [
    {
      prompt: 'Why debounce a search box?',
      correct: 'To avoid sending a request on every keystroke',
      wrong: [
        ['To make the text bold', 'Debouncing is about timing.'],
        ['To sort the results', 'Sorting is a different step.'],
        ['To cache the page', 'It does not cache anything.'],
      ],
      explanation: 'Waiting until typing pauses cuts needless requests and flicker.',
    },
    {
      prompt: 'How do you make an effect run again when the query changes?',
      correct: 'Add query to the dependency array',
      wrong: [
        ['Leave the array empty', 'It would run once only.'],
        ['Call the effect in the JSX', 'Effects are not called directly.'],
        ['Reload the page', 'Not needed.'],
      ],
      explanation: 'React reruns an effect whenever one of its dependencies changes.',
    },
    {
      prompt: 'What problem does effect cleanup solve in search?',
      correct: 'An old, slower request overwriting a newer result',
      wrong: [
        ['Slow typing', 'Typing speed is not the issue.'],
        ['Large images', 'Images are unrelated.'],
        ['Missing keys', 'Keys are for lists.'],
      ],
      explanation: 'Cancelling or ignoring stale requests keeps the screen showing the latest search.',
    },
  ],
});
