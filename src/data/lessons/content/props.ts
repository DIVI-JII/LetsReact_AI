import type { LessonContent } from '../../../types';

export const propsContent: LessonContent = {
  explanation: {
    lead: 'Props are how you pass information into a component, like handing a function its arguments.',
    analogy: {
      title: 'Think of filling in a form',
      body: 'The component is the form layout. Props are what you write in the blanks: name, role, photo. Same layout, different person each time.',
    },
    points: [
      'Props are written like HTML attributes: <ProfileCard name="Ada" />.',
      'Inside the component you read them from the props object.',
      'Props flow one way: from parent to child.',
      'A component should never change its own props.',
    ],
  },
  visual: {
    kind: 'props',
    caption: 'Same component, different props. Press the button to pass in a new person.',
  },
  demo: {
    kind: 'props',
    whatsHappening:
      'The parent hands new props to ProfileCard. Because the props changed, React renders the card again with the new values.',
  },
  practice: {
    prompt: "Can you pass the name 'Grace' to ProfileCard?",
    instructions:
      'Props look like HTML attributes. Fill in the blank so ProfileCard receives name set to Grace.',
    codePrefix: '<ProfileCard ',
    codeSuffix: ' role="Engineer" />',
    placeholder: 'name="Grace"',
    accepted: ['name="Grace"', "name='Grace'", 'name={"Grace"}', "name={'Grace'}"],
    hint: 'Write the prop name, an equals sign, then the value in quotes.',
    success: 'Yes. ProfileCard now receives name="Grace".',
    nearMiss:
      'Close. The prop is called name, and its text value goes in quotes, like name="Grace".',
    result: 'Grace · Engineer',
  },
  quiz: {
    id: 'quiz-props',
    title: 'Props check-in',
    questions: [
      {
        id: 'props-q1',
        prompt: 'How do you give data to a component?',
        options: [
          { id: 'a', text: 'With props, written like attributes', feedback: 'Correct.' },
          {
            id: 'b',
            text: "By editing its function body from outside",
            feedback: 'A component cannot be edited from outside. Data goes in through its props.',
          },
          {
            id: 'c',
            text: 'With a CSS class',
            feedback: 'Classes style things. They do not carry data into a component.',
          },
          {
            id: 'd',
            text: 'By renaming the file',
            feedback: 'File names have no effect on the data a component receives.',
          },
        ],
        correctOptionId: 'a',
        explanation:
          'Props are the inputs of a component. Whatever the parent writes in the tag arrives inside the function.',
      },
      {
        id: 'props-q2',
        prompt: 'In which direction do props flow?',
        options: [
          {
            id: 'a',
            text: 'From child to parent',
            feedback:
              "You're close. It's the opposite way round. A parent decides what its children receive.",
          },
          { id: 'b', text: 'From parent to child', feedback: 'Yes.' },
          {
            id: 'c',
            text: 'Both ways at once',
            feedback: 'Data only flows one way here. That keeps apps predictable.',
          },
          {
            id: 'd',
            text: 'Between siblings directly',
            feedback: 'Siblings do not share props. Data goes down from a common parent.',
          },
        ],
        correctOptionId: 'b',
        explanation:
          'One-way flow means you can always trace where a value came from: look at the parent.',
      },
      {
        id: 'props-q3',
        prompt: 'Inside ProfileCard you want a different name. What is the right move?',
        options: [
          {
            id: 'a',
            text: "Assign a new value: props.name = 'Bob'",
            feedback: 'Props are read-only. Changing them would make the screen unpredictable.',
          },
          {
            id: 'b',
            text: 'Leave props alone and ask the parent to pass something different',
            feedback: 'Exactly.',
          },
          {
            id: 'c',
            text: 'Delete the prop',
            feedback: 'Removing it would just leave the card without a name.',
          },
          {
            id: 'd',
            text: 'Use a global variable',
            feedback: 'Globals work against React. Pass data in through props instead.',
          },
        ],
        correctOptionId: 'b',
        explanation:
          'The parent owns the data. If it needs to change, the parent changes it and React passes the new props down.',
      },
    ],
  },
};
