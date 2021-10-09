import React from 'react';
import {render, cleanup} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { CardProvider, initialState } from '../../../../services/CardContext';
import Answer from './index';
import { Card, CardState } from '../../../../types';


afterEach(cleanup);

// the ?: after visible tells typescript that it is optional
const renderAnswer = (visible?: boolean, testState?: CardState) => render(
  <CardProvider testState={testState}>
    <Answer visible={visible !== undefined ? visible : true}/>
  </CardProvider>
)

it('renders without crashing', () => {
  renderAnswer();
});

describe('when visible, it shows the answer', () => {
  // has the div that will show the answer
  it('has the answer div', () => {
    const {getByTestId} = renderAnswer();
    const answerDiv = getByTestId('answer');
    expect(answerDiv).toBeInTheDocument();
  });

  // has a header with 'Answer'
  it('has the answer header', () => {
    const {getByText} = renderAnswer();
    const header = getByText(/answer/i);
    expect(header).toBeInTheDocument();
  });

  // shows the right answer with line breaks
  it('displays the right answer with line breaks', () => {
    // testAnswer is a template literal with linebreaks
    const testAnswer = `This is Line 1. 
    This is Line 2 after a line break.
    This is Line 3 after a line break.`;

    // new array using initialState.cards
    const cards: Card[] = [...initialState.cards];
    // set answer of the card at index =0 to testAnswer
    cards[0].answer = testAnswer;

    // create a new CardState with cards, set current to 0
    const testState = {
      ...initialState,
      cards,
      current: 0
    };

    // call renderAnswer with visible=true, testState
    const {getByTestId} = renderAnswer(true, testState);

    // find the answer div
    const answerDiv = getByTestId('answer');

    // answer div should have 4 children
    // one child is the Header
    // plus three more child divs, one for each line in testAnswer
    expect(answerDiv.children).toHaveLength(4);

    // use string.split to split testAnswer to an array
    // regular expression /\n/g identifies all the linebreaks
    const testAnswerArr = testAnswer.split(/\n/g);

    expect(answerDiv.children[1].textContent).toEqual(testAnswerArr[0]);
    expect(answerDiv.children[2].textContent).toEqual(testAnswerArr[1]);
    expect(answerDiv.children[3].textContent).toEqual(testAnswerArr[2]);
  });
});

it('if not visible, it isnt visible', () => {
  const {queryByTestId} = renderAnswer(false);
  const answer = queryByTestId('answer');

  expect(answer).toBeNull();
});
