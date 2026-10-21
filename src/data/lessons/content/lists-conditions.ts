import { lesson } from './build';

export const renderingListsContent = lesson({
  id: 'rendering-lists',
  lead: 'To show many items, keep them in an array and use map to turn each item into a piece of JSX.',
  analogy: [
    'Think of a stamp',
    'You carve one stamp (the component) and press it once for every item on your list. Same shape, different ink.',
  ],
  points: [
    'array.map(item => <li>{item}</li>) returns a new array of elements.',
    'Put the result inside curly braces in your JSX: <ul>{items.map(...)}</ul>.',
    'Each item needs a key (covered in the next lesson).',
    'Change the array, and React redraws the list.',
  ],
  demo: 'component',
  caption: 'Add components to the page. A list works the same way: one definition, many copies.',
  whatsHappening: 'One piece of code produces many elements. The data decides how many appear.',
  practice: {
    prompt: 'Which array method turns each item into JSX?',
    instructions: 'Fill in the method name so every fruit becomes a list item.',
    codePrefix: 'const fruits = ["Apple", "Pear"];\nreturn <ul>{fruits.',
    codeSuffix: '(f => <li key={f}>{f}</li>)}</ul>;',
    placeholder: '...',
    accepted: ['map'],
    hint: 'It transforms every item and returns a new array.',
    success: 'Yes! map builds one <li> per fruit.',
    nearMiss: 'Close. The method that transforms each item is map.',
    result: '• Apple • Pear',
  },
  quizTitle: 'Lists check-in',
  questions: [
    {
      prompt: 'Which method is the usual way to render a list in React?',
      correct: 'map',
      wrong: [
        ['forEach', 'forEach returns nothing, so there would be no JSX to show.'],
        ['push', 'push adds an item to an array. It does not make JSX.'],
        ['join', 'join makes a string, not elements.'],
      ],
      explanation: 'map returns a new array, and React can display an array of elements.',
    },
    {
      prompt: 'What happens when you add an item to the array (using state)?',
      correct: 'React redraws the list with the new item',
      wrong: [
        ['Nothing until you refresh', 'React redraws when state changes.'],
        ['The old list stays and the new item is ignored', 'The list always reflects the latest data.'],
        ['You must edit the JSX by hand', 'The JSX describes any number of items already.'],
      ],
      explanation: 'The screen is a function of your data. New data produces a new list.',
    },
    {
      prompt: 'Where does the map call go in JSX?',
      correct: 'Inside curly braces within the parent element',
      wrong: [
        ['Before the return statement only', 'You can compute it earlier, but it is typically placed inline in braces.'],
        ['Inside quotes', 'Quotes make plain text, so map would not run.'],
        ['In the CSS file', 'CSS cannot run JavaScript.'],
      ],
      explanation: 'Braces let you use JavaScript in JSX, including a map that returns elements.',
    },
  ],
});

export const keysContent = lesson({
  id: 'keys',
  lead: 'A key is a stable ID you give each item in a list so React can tell which item is which when the list changes.',
  analogy: [
    'Think of name tags at a party',
    'If guests swap seats, name tags let you still know who is who. Without them you would guess by position and mix people up.',
  ],
  points: [
    'Add key={item.id} to the outermost element you return from map.',
    'Keys must be unique among siblings and should not change between renders.',
    'Use a real ID from your data. Avoid the array index if items can be reordered or removed.',
    'Without good keys, inputs can keep the wrong text and animations can jump.',
  ],
  demo: 'component',
  caption: 'Each card is its own item. Stable identity is what lets React track them.',
  whatsHappening: 'React matches old and new items by key, so it updates the right one instead of rebuilding everything.',
  practice: {
    prompt: 'Which attribute identifies an item in a list?',
    instructions: 'Complete the JSX so each todo has its id as the key.',
    codePrefix: 'todos.map(t => <li ',
    codeSuffix: '={t.id}>{t.text}</li>)',
    placeholder: '...',
    accepted: ['key'],
    hint: 'It is a special attribute named key.',
    success: 'Yes! key={t.id} gives each item a stable identity.',
    nearMiss: 'Close. The attribute is called key.',
    result: 'Each item has a key',
  },
  quizTitle: 'Keys check-in',
  questions: [
    {
      prompt: 'What makes a good key?',
      correct: 'A unique, stable ID from your data',
      wrong: [
        ['A random number made on every render', 'A new value each render defeats the purpose of tracking items.'],
        ['The same value for every item', 'Keys must be unique among siblings.'],
        ['The item’s position if items can move', 'Positions change when items move, so state can attach to the wrong item.'],
      ],
      explanation: 'A key should keep pointing at the same item for as long as that item exists.',
    },
    {
      prompt: 'Where do you put the key?',
      correct: 'On the outermost element returned by map',
      wrong: [
        ['On the <ul> parent', 'The key belongs on each item, not the container.'],
        ['Inside the item’s text', 'Key is an attribute, not content.'],
        ['In a CSS class', 'Keys are for React, not for styling.'],
      ],
      explanation: 'React reads the key from the element each iteration returns.',
    },
    {
      prompt: 'Why might using the array index as a key cause bugs?',
      correct: 'Indexes shift when items are inserted, removed or reordered',
      wrong: [
        ['Indexes are too long', 'Length is not the issue.'],
        ['Indexes are not allowed', 'They are allowed, but risky for changing lists.'],
        ['Indexes slow down the browser a lot', 'The issue is correctness, not raw speed.'],
      ],
      explanation: 'If item 2 becomes item 1, React thinks it is the same item and may keep the wrong state.',
    },
  ],
});

export const filterSortContent = lesson({
  id: 'filter-sort',
  lead: 'Keep the full list in state, then compute a filtered or sorted copy while rendering. Never change the original.',
  analogy: [
    'Think of a photo album',
    'You keep every photo in the album, but you can show only the beach ones or sort them by date. The album itself stays the same.',
  ],
  points: [
    'filter(item => condition) returns only the items that match.',
    'sort changes the array it is called on, so copy first: [...items].sort(...).',
    'Store the search text or sort choice in state, not the filtered result.',
    'Derive the visible list each render from the data plus those choices.',
  ],
  demo: 'state',
  caption: 'State holds the value; the screen is derived from it. Filters work the same way.',
  whatsHappening: 'One piece of state decides what is shown. Change it and the view recalculates.',
  practice: {
    prompt: 'Which method keeps only matching items?',
    instructions: 'Fill in the method so only done tasks remain.',
    codePrefix: 'const doneTasks = tasks.',
    codeSuffix: '(t => t.done);',
    placeholder: '...',
    accepted: ['filter'],
    hint: 'It filters out items that fail the test.',
    success: 'Yes! filter returns a new array with only the done tasks.',
    nearMiss: 'Close. The method is called filter.',
    result: 'Only done tasks',
  },
  quizTitle: 'Filter and sort check-in',
  questions: [
    {
      prompt: 'What should you store in state for a search box?',
      correct: 'The text the user typed',
      wrong: [
        ['The filtered list', 'The filtered list can be computed from the data and the text, so it does not need its own state.'],
        ['A copy of the whole list for each letter', 'That duplicates data and goes out of date.'],
        ['The component’s JSX', 'JSX is the output, not state.'],
      ],
      explanation: 'Store the minimum. Derive everything else while rendering.',
    },
    {
      prompt: 'Why copy an array before calling sort?',
      correct: 'sort changes the original array, and state should not be mutated',
      wrong: [
        ['sort only works on copies', 'sort works on any array but changes it in place.'],
        ['Copies are faster', 'The reason is correctness.'],
        ['React forbids arrays', 'Arrays are fine. Mutating state is the problem.'],
      ],
      explanation: 'Mutating state can stop React from noticing a change. Use [...items].sort(...).',
    },
    {
      prompt: 'What does filter return?',
      correct: 'A new array with only the matching items',
      wrong: [
        ['The first matching item', 'That is find.'],
        ['true or false', 'The callback returns that. filter returns an array.'],
        ['The original array, changed', 'filter never changes the original.'],
      ],
      explanation: 'filter builds a new array, which is ideal for rendering a view of the data.',
    },
  ],
});

export const conditionalBasicsContent = lesson({
  id: 'conditional-basics',
  lead: 'Show different UI by using normal JavaScript: if statements, the ternary ? :, and && for “show this only when true”.',
  analogy: [
    'Think of a traffic light',
    'The same light shows red, amber or green depending on the situation. Your component shows different UI depending on the data.',
  ],
  points: [
    'Ternary: {isLoggedIn ? <Dashboard /> : <Login />} picks one of two options.',
    'And: {hasItems && <List />} shows the list only when hasItems is true.',
    'Use if statements before return when the logic is longer.',
    'Returning null shows nothing.',
  ],
  demo: 'state',
  caption: 'The number is state. Anything shown conditionally follows from state like this.',
  whatsHappening: 'State changes, the component runs again, and the condition picks what to show.',
  practice: {
    prompt: 'Complete the ternary so a logged-in user sees “Welcome”.',
    instructions: 'Fill the blank with the operator that separates the two choices.',
    codePrefix: 'return <p>{loggedIn ? "Welcome" ',
    codeSuffix: ' "Please sign in"}</p>;',
    placeholder: '...',
    accepted: [':'],
    hint: 'condition ? yes : no',
    success: 'Yes! condition ? a : b picks between two values.',
    nearMiss: 'Close. A ternary uses ? and :.',
    result: 'Welcome',
  },
  quizTitle: 'Conditional rendering check-in',
  questions: [
    {
      prompt: 'What does {isOpen && <Menu />} do?',
      correct: 'Shows Menu only when isOpen is true',
      wrong: [
        ['Always shows Menu', 'It shows Menu only if the left side is true.'],
        ['Shows Menu when isOpen is false', 'It is the opposite.'],
        ['Throws an error', 'It is a common, valid pattern.'],
      ],
      explanation: 'If the left side is true, JavaScript returns the right side. If false, nothing is drawn.',
    },
    {
      prompt: 'Which is best for choosing between two pieces of UI inside JSX?',
      correct: 'A ternary: condition ? <A /> : <B />',
      wrong: [
        ['A for loop', 'Loops do not return a value you can place inside JSX.'],
        ['A comment', 'Comments do nothing at runtime.'],
        ['A CSS file', 'CSS can hide things but does not choose components.'],
      ],
      explanation: 'A ternary is an expression, so it fits inside braces in JSX.',
    },
    {
      prompt: 'What does a component show if it returns null?',
      correct: 'Nothing',
      wrong: [
        ['An error', 'null is allowed and means render nothing.'],
        ['The word null', 'It draws no content.'],
        ['The previous screen', 'It simply draws nothing for that component.'],
      ],
      explanation: 'Returning null is a clean way to hide a component entirely.',
    },
  ],
});

export const emptyLoadingContent = lesson({
  id: 'empty-loading',
  lead: 'Good interfaces plan for the in-between moments: loading, empty and error states, not just the happy path.',
  analogy: [
    'Think of a waiter',
    'A good waiter says “your food is coming” instead of staring silently. Your screen should tell people what is going on too.',
  ],
  points: [
    'Loading: show a spinner or skeleton while data is on its way.',
    'Empty: when there is nothing yet, explain why and suggest what to do.',
    'Check the states in order: loading, error, empty, then the list.',
    'These states are just conditional rendering based on state.',
  ],
  demo: 'state',
  caption: 'Every screen is a function of state. Loading and empty are simply more values of it.',
  whatsHappening: 'Different state values lead to different screens. Plan for each one.',
  practice: {
    prompt: 'What should a list show when it has no items?',
    instructions: 'Complete the condition: show the message when the array length is 0.',
    codePrefix: 'if (items.length === ',
    codeSuffix: ') return <p>Nothing here yet.</p>;',
    placeholder: '...',
    accepted: ['0'],
    hint: 'An empty array has length zero.',
    success: 'Yes! length === 0 means the list is empty.',
    nearMiss: 'Close. An empty array has a length of 0.',
    result: 'Nothing here yet.',
  },
  quizTitle: 'States check-in',
  questions: [
    {
      prompt: 'Why design an empty state?',
      correct: 'A blank screen leaves people unsure what to do',
      wrong: [
        ['Because React needs it', 'React does not require it. It is good design.'],
        ['To make the app slower', 'It does not affect speed much.'],
        ['It is only for developers', 'It helps real users the most.'],
      ],
      explanation: 'A friendly message and a next step make empty screens useful instead of confusing.',
    },
    {
      prompt: 'What is a sensible order for checking states?',
      correct: 'Loading, then error, then empty, then the data',
      wrong: [
        ['The data first', 'Data may not exist yet while loading.'],
        ['Empty first', 'You cannot know it is empty until loading finishes.'],
        ['Any order works', 'Order matters because later checks depend on earlier ones.'],
      ],
      explanation: 'Work from the least ready state to the most ready one.',
    },
    {
      prompt: 'How do you show a loading indicator in React?',
      correct: 'Use conditional rendering based on a loading state',
      wrong: [
        ['Install a special loading package', 'A package can help, but the logic is just state.'],
        ['Reload the page', 'Reloading breaks the flow.'],
        ['Hide the whole app', 'Users would see nothing at all.'],
      ],
      explanation: 'Keep an isLoading value in state and render a spinner when it is true.',
    },
  ],
});
