// React lets us create and display components to the user 
// We need to import it so that we can look at the components to test them 
import React, {useContext} from 'react';

// testing library gives us methods to test components 
// we use render to look at React components
// we use cleanup to clear out memory after tests 
import { render, cleanup, fireEvent} from '@testing-library/react';

// extend-expect gives us methods that let us say what 
// we think a component will look like when we test it
import '@testing-library/jest-dom/extend-expect';

// This is the Answering component that we are going to write
// we have to import it so that we can look at it to test it
import Answering from './index';
import { CardState, StatsState } from '../../types';
import {CardProvider, initialState} from '../../services/CardContext';
import {StatsContext, StatsProvider} from '../../services/StatsContext';


afterEach(cleanup);

const renderAnswering = (testState?: CardState) => {
  return render(
    <CardProvider testState={testState ? testState : initialState}>
      <Answering />
    </CardProvider>
  );
};

// we need
// a container,
it('has a Container', () => {
  const {getByTestId} = render(<Answering/>);
  const container = getByTestId('container');
  expect(container).toBeInTheDocument();
});

// test to see if the question prompt is in the document
it('has a question prompt', () => {
  // Use Object Destructuring to get the getByTestId from the result of the render
  const {getByTestId} = render(<Answering/>);

  // find question by searching for testId 'question'
  const question = getByTestId('question');

  // assert that question is in the document
  expect(question).toBeInTheDocument();
});

// test to see if the question prompt is from the current card
it('has the question prompt from the current card', () => {
  const {cards, current} = initialState;

  // get the question from the current card
  const currentQuestion = cards[current].question;

  // get getByTestId from the helper function
  const {getByTestId} = renderAnswering();

  const question = getByTestId('question');

  // question content should be the question from the current card
  expect(question).toHaveTextContent(currentQuestion);
});

// Back Button
describe('Back button', () => {
  afterEach(cleanup);

  // test to see if the Back button is in the document
  it('has a button to go to the previous card', () => {
    // Use Object Destructuring to get getByText from the result of the render
    const {getByText} = render(<Answering/>);

    // find Back button by search for string 'Go Back'
    const back = getByText('Go Back');

    // assert Back button is in the document
    expect(back).toBeInTheDocument();
  });

  it('Back button should be disabled when current === 0', () => {
    // create a new CardState with current === 0
    const zeroState = {
      ...initialState,
      current: 0
    };

    const {getByTestId, getByText} = renderAnswering(zeroState);

    // get backButton by text - users find buttons with text
    const backButton = getByText(/back/i);
    
    expect(backButton.closest('button')).toBeDisabled();
  });
});

// test to see if the Skip button is in the document
it('has a button to skip the card', () => {
  // Use Object Destructuring to get getByText from the result of the render
  const {getByText} = render(<Answering/>);

  // find Skip button by searching for string 'Skip'
  const skip = getByText('Next or Skip');

  // assert that Skip button is in the document
  expect(skip).toBeInTheDocument();
});

// a textarea to write the answer in
it('has a textArea to type the answer in', () => {
  const {getByTestId} = render(<Answering/>);
  const textArea = getByTestId('textarea');
  expect(textArea).toBeInTheDocument();
});

// test to see if the Submit button is in the document
it('has a button to submit the answer', () => {
  const {getByText} = render(<Answering/>);
  const submit = getByText('Submit');
  expect(submit).toBeInTheDocument();
});

// test that the skip button works
it('clicks the skip button and the next question appears', () => {
  // create a CardState with current set to 0
  const zeroState = {
    ...initialState,
    current: 0
  };

  // current starts at 0
  const {getByTestId, getByText} = renderAnswering(zeroState);

  const question = getByTestId('question');
  // current starts out at 0, so question should be cards[0]
  expect(question).toHaveTextContent(initialState.cards[0].question);

  const skip = getByText(/next or skip/i);
  // this should change current index from 0 to 1
  fireEvent.click(skip);

  expect(question).toHaveTextContent(initialState.cards[1].question);
});

it('clears the answer when card changes', () => {
  const {getByText, getByTestId} = renderAnswering();
  const textarea = getByTestId('textarea');

  const placeholder = 'placeholder text';
  // put the placeholder text into the textarea
  fireEvent.change(textarea, {target: {value: placeholder}});

  // make sure the placeholder text is there
  expect(textarea).toHaveTextContent(placeholder);

  // get the skip button
  const skip = getByText(/next or skip/i);
  // click skip, this dispatches a 'next' action to cardcontext
  // which should change the value of current
  // and trigger useEffect hook to clear the textarea
  fireEvent.click(skip);

  // textarea should be empty
  expect(textarea).toHaveTextContent('');
});

it('has the stats icon', () => {
  const {getByTestId} = renderAnswering();
  const stats = getByTestId('icon');
  expect(stats).toBeInTheDocument();
});

// when the user clicks the skip button, the skip is recorded in the stats
it('clicking skip records stats', () => {
  // create a CardState with current set to 0
  const cardState = {
    ...initialState,
    current: 0
  };

  // a blank stats object
  const blankStats = {
    right: 0,
    wrong: 0,
    skip: 0
  };

  // get the question from cards index 0
  const {question} = cardState.cards[0];

  // create statsState with stats for the question
  const statsState: StatsState = {
    [question]: blankStats
  };

  // helper component displays the value of skip for the question
  const SkipDisplay = () => {
    const stats = useContext(StatsContext);
    const {skip} = stats[question];
    return <div data-testid='skipDisplay'>{skip}</div>;
  };

  // render Answering and SkipDisplay inside the providers
  // pass the providers the cardState and StatsState values that we defined
  const {getByTestId, getByText} = render(
    <CardProvider testState={cardState}>
      <StatsProvider testState={statsState}>
        <Answering />
        <SkipDisplay />
        </StatsProvider>
    </CardProvider>
  );

  // find the skip button
  const skipButton = getByText(/next or skip/i);

  // find the skip display
  const skipDisplay = getByTestId('skipDisplay');

  // skip display should start at 0
  expect(skipDisplay).toHaveTextContent('0');

  // click the skip button
  fireEvent.click(skipButton);

  expect(skipDisplay).toHaveTextContent('1');
});

// and the snapshot 
it('Matches Snapshot', () => {
  // get the asFragment method so we can look at the component as a DocumentFragment
  const {asFragment} = render(<Answering/>);

  // expect the result of asFragment() to match the snapshot of this component
  expect(asFragment()).toMatchSnapshot();
});

describe('submit button controls display of the answer', () => {
  // the answer to the current question
  const initialAnswer = initialState.cards[initialState.current].answer;
  const withoutLineBreaks = initialAnswer.replace(/\s{2,}/g, " ");
  const compareToInitialAnswer = (
    content: string,
    {textContent}: HTMLElement
  ) => !!textContent &&
    textContent
    .replace(/\s{2,}/g, " ")
    .slice(6, textContent.length) === withoutLineBreaks;

  // answer does not show up
  it('the answer does not show up before the submit button is clicked', () => {
    const {queryByText} = renderAnswering();

    // use the custom function to search for the initial answer
    const answer = queryByText(compareToInitialAnswer);

    expect(answer).toBeNull();
  });

  // clicking submit button skips to the next question 
  it('clicks the skip button and the next question appears', () => {
    // create a CardState with current set to 0
    const zeroState = {
      ...initialState,
      current: 0
    };

    // current starts at 0
    const {getByTestId, getByText} = renderAnswering(zeroState);

    const question = getByTestId('question');
    // current starts out at 0, so question should be cards[0]
    expect(question).toHaveTextContent(initialState.cards[0].question);

    const submit = getByText(/submit/i);
    // this should change current index from 0 to 1
    fireEvent.click(submit);

    expect(question).toHaveTextContent(initialState.cards[1].question);
  });
});
