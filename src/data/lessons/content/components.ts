import type { LessonContent } from '../../../types';

export const componentsContent: LessonContent = {
  explanation: {
    lead: 'A component is a small, reusable piece of your screen. In React it is simply a function that returns JSX.',
    analogy: {
      title: 'Think of LEGO bricks',
      body: 'You design a brick once, then snap in as many copies as you like. Improve the brick and every copy improves with it.',
    },
    points: [
      'A component is a JavaScript function that returns JSX.',
      'Component names start with a capital letter.',
      'You use a component like an HTML tag: <ProfileCard />.',
      'Small components are easier to read, reuse and fix.',
    ],
  },
  visual: {
    kind: 'component',
    caption: 'One definition, many uses. Add another card; the code you wrote does not change.',
  },
  demo: {
    kind: 'component',
    whatsHappening:
      'Each tag calls a function. React runs it, takes the JSX it returns, and places the result on the page.',
  },
  practice: {
    prompt: 'Can you show the Badge component on the page?',
    instructions: 'Components are used like HTML tags. Fill in the blank to render Badge.',
    codePrefix: 'function App() {\n  return (\n    <div>\n      ',
    codeSuffix: '\n    </div>\n  );\n}',
    placeholder: '<Badge />',
    accepted: ['<Badge />', '<Badge/>', '<Badge></Badge>'],
    hint: "Use the component's name like a tag. It starts with a capital letter and needs a closing slash: <Name />.",
    success: 'Nice. Badge now appears on the page.',
    nearMiss: 'Almost. Component tags start with a capital letter and must close, like <Badge />.',
    result: 'Badge',
  },
  quiz: {
    id: 'quiz-components',
    title: 'Components check-in',
    questions: [
      {
        id: 'cmp-q1',
        prompt: 'What is a React component?',
        options: [
          {
            id: 'a',
            text: 'A CSS file that styles the page',
            feedback: 'CSS styles things, but a component is code that describes a piece of the UI.',
          },
          { id: 'b', text: 'A function that returns JSX', feedback: 'Exactly.' },
          {
            id: 'c',
            text: 'A database table',
            feedback: 'Databases store data. Components describe what the screen shows.',
          },
          {
            id: 'd',
            text: 'A browser extension',
            feedback: 'Extensions live in the browser. Components live inside your app.',
          },
        ],
        correctOptionId: 'b',
        explanation:
          'Every component is a function. Call it (by using its tag) and you get back a description of some UI.',
      },
      {
        id: 'cmp-q2',
        prompt: 'Why must component names start with a capital letter?',
        options: [
          {
            id: 'a',
            text: 'It makes the file load faster',
            feedback:
              "Speed isn't affected. The capital letter is a signal: <div> is plain HTML, <Div /> would be a component.",
          },
          {
            id: 'b',
            text: 'So React can tell components apart from HTML tags',
            feedback: 'Yes.',
          },
          {
            id: 'c',
            text: "It's only a style preference",
            feedback:
              'It is a real rule. Lowercase tags are treated as built-in HTML elements.',
          },
          {
            id: 'd',
            text: 'Capital letters run the component twice',
            feedback: 'Casing has no effect on how often a component runs.',
          },
        ],
        correctOptionId: 'b',
        explanation:
          'React looks at the first letter. Lowercase means “HTML element”, uppercase means “look for a component with this name”.',
      },
      {
        id: 'cmp-q3',
        prompt: "What's the biggest benefit of splitting a page into components?",
        options: [
          {
            id: 'a',
            text: 'Each part is written once and can be reused',
            feedback: 'That is the heart of it.',
          },
          {
            id: 'b',
            text: 'The page needs less CSS',
            feedback: 'Styling is a separate concern. Components help with structure and reuse.',
          },
          {
            id: 'c',
            text: 'JavaScript runs faster',
            feedback: 'Performance is not the main reason. Think about writing and maintaining code.',
          },
          {
            id: 'd',
            text: 'You never need to test',
            feedback: 'Components make testing easier, but you still test.',
          },
        ],
        correctOptionId: 'a',
        explanation:
          'Write a Button once, use it fifty times, fix a bug in one place. That is why React apps are built from components.',
      },
    ],
  },
};
