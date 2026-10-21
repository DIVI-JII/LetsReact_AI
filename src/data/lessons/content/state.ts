import type { LessonContent } from '../../../types';

export const stateContent: LessonContent = {
  explanation: {
    lead: 'State is information that a component remembers and updates when the user interacts with it.',
    analogy: {
      title: 'Think of a scoreboard',
      body: 'The scoreboard remembers the score between plays. When the score changes, the display updates. Nobody redraws it by hand.',
    },
    points: [
      'The useState hook gives a component a memory.',
      'useState returns two things: the current value and a function to change it.',
      'Change state with its setter, like setCount. Never edit the variable directly.',
      'When state changes, React renders the component again with the new value.',
    ],
  },
  visual: {
    kind: 'state',
    caption: 'Press Increase and watch the number: 0, 1, 2, 3.',
  },
  demo: {
    kind: 'state',
    whatsHappening: 'The state value changed, so React rendered the component again.',
  },
  practice: {
    prompt: 'Can you make the counter increase by 2?',
    instructions:
      'Change the number inside setCount so each click adds 2. Then press Try to see it run.',
    codePrefix: '<button onClick={() => setCount(count + ',
    codeSuffix: ')}>Add</button>',
    placeholder: '1',
    initialValue: '1',
    accepted: ['2'],
    hint: 'setCount(count + 1) adds one on every click. What number would add two?',
    success: 'That is it. Each click now adds 2.',
    nearMiss: 'Not yet. Check the number inside setCount.',
    result: 'Counter +2',
    counterStep: true,
  },
  quiz: {
    id: 'quiz-state',
    title: 'State check-in',
    questions: [
      {
        id: 'st-q1',
        prompt: 'Which hook is commonly used to store component state?',
        options: [
          {
            id: 'a',
            text: 'useEffect',
            feedback:
              "You're close. useEffect is used for side effects. Review the state section and try again.",
          },
          { id: 'b', text: 'useState', feedback: 'Yes.' },
          {
            id: 'c',
            text: 'useContext',
            feedback:
              'Good thought. useContext reads shared data. For a component’s own memory, look for the hook that returns a value and a setter.',
          },
          {
            id: 'd',
            text: 'useMemo',
            feedback:
              "useMemo caches a calculation. It doesn't hold values that change with user actions.",
          },
        ],
        correctOptionId: 'b',
        explanation:
          'useState returns the current value and a setter. Call the setter and React renders again with the new value.',
      },
      {
        id: 'st-q2',
        prompt: 'What happens after you call setCount(count + 1)?',
        options: [
          {
            id: 'a',
            text: 'Nothing until you refresh the page',
            feedback: 'React updates the screen on its own. No refresh is needed.',
          },
          {
            id: 'b',
            text: 'React renders the component again with the new value',
            feedback: 'Exactly.',
          },
          {
            id: 'c',
            text: 'count changes immediately inside the same function',
            feedback:
              'Careful. The new value shows up on the next render, not instantly inside the same function.',
          },
          {
            id: 'd',
            text: 'The whole page reloads',
            feedback: 'React only re-renders what changed. The page never reloads.',
          },
        ],
        correctOptionId: 'b',
        explanation:
          'Setting state schedules a new render. On that render, count holds the new value.',
      },
      {
        id: 'st-q3',
        prompt: 'Which line updates state correctly?',
        options: [
          {
            id: 'a',
            text: 'count = count + 1',
            feedback:
              "Changing the variable directly doesn't tell React anything changed, so the screen stays the same.",
          },
          { id: 'b', text: 'setCount(count + 1)', feedback: 'Yes.' },
          {
            id: 'c',
            text: 'useState(count + 1)',
            feedback:
              'useState sets up state once. To change it later you use the setter it gave you.',
          },
          {
            id: 'd',
            text: 'count++',
            feedback: 'That edits the variable in place. React only reacts to the setter function.',
          },
        ],
        correctOptionId: 'b',
        explanation:
          'Only the setter tells React that something changed. Everything else just edits a local variable.',
      },
    ],
  },
};
