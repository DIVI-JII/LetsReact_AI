import type { LessonContent } from '../../../types';

export const eventsContent: LessonContent = {
  explanation: {
    lead: 'Events are the things users do: click, type, hover. React lets you answer each one with a function.',
    analogy: {
      title: 'Think of a doorbell',
      body: 'The button is the doorbell and your function is whoever answers. Pressing it (the event) calls the function.',
    },
    points: [
      'Events are written in camelCase: onClick, onChange, onSubmit.',
      "Pass a function, don't call it: onClick={handleClick}.",
      'A handler receives an event object, for example event.target.value.',
      'Handlers usually update state, which is what makes the screen change.',
    ],
  },
  visual: {
    kind: 'events',
    caption: 'Click the button and follow the path: event, handler, update.',
  },
  demo: {
    kind: 'events',
    whatsHappening:
      'Each event calls the function you passed in. React hands it an event object so you can see exactly what happened.',
  },
  practice: {
    prompt: 'Can you run handleClick when the button is clicked?',
    instructions: 'Add the right event prop so the button calls handleClick.',
    codePrefix: '<button ',
    codeSuffix: '>Save</button>',
    placeholder: 'onClick={handleClick}',
    accepted: ['onClick={handleClick}'],
    hint: 'The event is called onClick. Pass the function inside curly braces, without parentheses.',
    success: 'It works. Clicking Save now runs handleClick.',
    nearMiss:
      'Nearly there. Use camelCase onClick and pass the function itself: onClick={handleClick}, with no parentheses.',
    result: 'Saved ✓ handleClick ran',
  },
  quiz: {
    id: 'quiz-events',
    title: 'Events check-in',
    questions: [
      {
        id: 'ev-q1',
        prompt: 'Which prop handles a button click?',
        options: [
          {
            id: 'a',
            text: 'onclick',
            feedback: 'Close, but React uses camelCase: the C is capital.',
          },
          { id: 'b', text: 'onClick', feedback: 'Yes.' },
          {
            id: 'c',
            text: 'handleClick',
            feedback: 'handleClick is a common name for your function, not the prop itself.',
          },
          {
            id: 'd',
            text: 'clickEvent',
            feedback: 'React event props all start with “on”. Think of what happens when the click occurs.',
          },
        ],
        correctOptionId: 'b',
        explanation: 'React event props start with “on” and use camelCase: onClick, onChange, onSubmit.',
      },
      {
        id: 'ev-q2',
        prompt: 'What is the difference between onClick={save} and onClick={save()}?',
        options: [
          {
            id: 'a',
            text: 'There is no difference',
            feedback: 'There is, and it is a common trap. Look at the parentheses.',
          },
          {
            id: 'b',
            text: 'The first runs save on click; the second runs it immediately while rendering',
            feedback: 'Exactly.',
          },
          {
            id: 'c',
            text: 'The second one is faster',
            feedback: 'Speed is not the issue. The question is when the function runs.',
          },
          {
            id: 'd',
            text: 'The first only works on links',
            feedback: 'It works on any element that supports click events.',
          },
        ],
        correctOptionId: 'b',
        explanation:
          'Parentheses call a function right now. Without them you hand React the function to call later, when the click happens.',
      },
      {
        id: 'ev-q3',
        prompt: "How do you read what someone typed in an input's onChange handler?",
        options: [
          { id: 'a', text: 'event.target.value', feedback: 'That is it.' },
          {
            id: 'b',
            text: 'event.text',
            feedback: 'The event object has no text property. Look at the element that fired it.',
          },
          {
            id: 'c',
            text: 'input.state',
            feedback: 'Inputs do not carry React state. The value lives on the element.',
          },
          {
            id: 'd',
            text: 'document.title',
            feedback: 'That reads the page title, not the input.',
          },
        ],
        correctOptionId: 'a',
        explanation:
          'event.target is the element that fired the event, and its value is whatever the user typed.',
      },
    ],
  },
};
