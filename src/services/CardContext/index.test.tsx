import React, {useContext} from 'react';
import {render, cleanup, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import {CardContext, CardProvider, initialState, reducer} from './index';
import { CardAction, CardActionTypes, CardState } from '../../types';
import { executionAsyncId } from 'async_hooks';
import { Button } from 'semantic-ui-react';


// A helper component to get cards out of CardContext
// and display them so we can test
const CardConsumer = () => {
  // get cards and the index of the current card
  const {cards, current, dispatch} = useContext(CardContext);

  // get the current card
  const card = cards[current];

  // get the question, answer, and subject from the current card
  const {question, answer, subject} = card;

  // display each property in a div
  return <div>
    <div data-testid='current'>{current}</div>
    <div data-testid='question'>{question}</div>
    <div data-testid='answer'>{answer}</div>
    <div data-testid='subject'>{subject}</div>
    <Button onClick={() => dispatch({type: CardActionTypes.next})}>Next</Button>
  </div>
};

// renders the CardConsumer inside of CardProvider
const renderProvider = (testState?: CardState) => render(
  <CardProvider testState={testState}>
    <CardConsumer/>
  </CardProvider>
);


afterEach(cleanup);

describe('CardContext reducer', () => {
  it('returns state', () => {
    const state = {};
    const action = {type: undefined};
    expect(reducer(initialState, action)).toEqual(initialState);
  });

  it('next increments current', () => {
    // declare CardAction with type of 'next'
    const nextAction: CardAction = {type: CardActionTypes.next};

    // create a new CardState with current === 0
    const zeroState = {
      ...initialState,
      current: 0
    };

    // pass initialState and nextAction to the reducer
    expect(reducer(initialState, nextAction).current).toEqual(1);
  });

  it('next action when current is lastIndex of cards returns current === 0', () => {
    const nextAction: CardAction = {type: CardActionTypes.next};

    // get last valid index of cards
    const lastIndex = initialState.cards.length - 1;

    // create a CardState object where current is the last valid index of cards
    const lastState = {
      ...initialState,
      current: lastIndex
    };

    // pass lastState and nextAction to render
    expect(reducer(lastState, nextAction).current).toEqual(0);
  });

  // save new card
  it('save action with new question saves new card', () => {
    const answer = 'Example Answer';
    const question = 'Example Question';
    const subject = 'Example Subject';

    // declare CardAction with type of 'save'
    const saveAction: CardAction = {
      type: CardActionTypes.save,
      question,
      answer,
      subject
    };

    // before the action is processed initialState should not have a card with that question
    expect(initialState.cards.findIndex(card => card.question === question)).toEqual(-1);

    // pass initialState and saveAction to the reducer
    const {cards} = reducer(initialState, saveAction);
    // after the save action is processed, should have once card with that question
    expect(cards.filter(card => card.question ===  question).length).toEqual(1);
    
    // array destructuring to get the card out of the filtered array
    const [card] = cards.filter(card => card.question === question);

    // the saved card should have the answer from the save action
    expect(card.answer).toEqual(answer);

    // the saved card should have the subject from the save action
    expect(card.subject).toEqual(subject);
  });

  // save changes to existing card
  it('save action with existing question saves changes to existing card', () => {
    const answer = 'Example Answer';
    const question = 'Example Question';
    const subject = 'Example Subject';

    const existingCard = {
      answer,
      question,
      subject
    };

    const existingState = {
      ...initialState,
      cards: [
        ...initialState.cards,
        existingCard
      ]
    };

    const newAnswer = 'New Answer';
    const newSubject = 'New Subject';

    // declare CardAction with type of 'save'
    const saveAction: CardAction = {
      type: CardActionTypes.save,
      question,
      answer: newAnswer,
      subject: newSubject
    };

    // the state should have one card with that question
    expect(existingState.cards.filter(card => card.question === question).length).toEqual(1);

    // pass initialState and saveAction to the reducer
    const {cards} = reducer(initialState, saveAction);

    // After processing the action, we should still only have one card with that question
    expect(cards.filter(card => card.question === question).length).toEqual(1);

    // array destructuring to get the card out of the filtered array
    const [card] = cards.filter(card => card.question === question);

    // asnwer should have changed
    expect(card.answer).toEqual(newAnswer);
    // subject should have changed
    expect(card.subject).toEqual(newSubject);
  });

  // new action returns current === -1
  it('new sets current to -1', () => {
    // declare CardAction with type of 'new'
    const newAction: CardAction = {type: CardActionTypes.new};

    // create a new CardState with current === 0
    const zeroState = {
      ...initialState,
      current: 0
    };

    // pass initialState and newAction to the reducer
    expect(reducer(zeroState, newAction).current).toEqual(-1);
  });

  // delete removes card with matching question
  it('delete removes the card with matching question', () => {
    const {question} = initialState.cards[initialState.current];

    const deleteAction: CardAction = {
      type: CardActionTypes.delete,
      question
    };

    const {cards} = reducer(initialState, deleteAction);

    // it's gone
    expect(cards.findIndex(card => card.question === question)).toEqual(-1);
  });
});

// testing the CardConsumer using CardContext inside CardProvider
describe('CardConsumer using CardContext', () => {
  // current is 0
  it('has a current value of 0', () => {
    const {getByTestId} = renderProvider();
    const current = getByTestId(/current/i);
    expect(current).toHaveTextContent('0');
  });

  // question is the same as initialState.cards[0].question
  it('question is the same as the current card', () => {
    // get cards, current from initialState
    const {cards, current} = initialState;

    // get the question from the current card
    const currentQuestion = cards[current].question;

    const {getByTestId} = renderProvider();

    // find the question div
    const question = getByTestId(/question/i);

    // question div should match the current question
    expect(question).toHaveTextContent(currentQuestion);
  });

  // subject is the same as initialState.cards[0].subject
  it('subject is the same as the current card', () => {
    // get cards, current from initialState
    const {cards, current} = initialState;

    // get the subject from the current card
    const currentSubject = cards[current].subject;

    const {getByTestId} = renderProvider();

    // find the subject div
    const subject = getByTestId(/subject/i);

    // subject div should match the current subject
    expect(subject).toHaveTextContent(currentSubject);
  });

  // answer is the same as initialState.cards[0].answer
  it('answer is the same as the current card', () => {
    // get cards, current from initialState
    const {cards, current} = initialState;

    // get the answer from the current card
    const currentAnswer = cards[current].answer;

    const {getByTestId} = renderProvider();

    // find the answer div
    const answer = getByTestId(/answer/i);

    // answer div should match the current answer
    expect(answer.textContent).toEqual(currentAnswer);
  });
});

describe('CardConsumer', () => {
  // dispatching next action from component increments value of current
  it('dispatching next action from component increments value of current', () => {
    // create a new CardState with current === 0
    const zeroState = {
      ...initialState,
      current: 0
    };

    const {getByTestId, getByText} = renderProvider(zeroState);

    // get currentDiv with testId
    const currentDiv = getByTestId(/current/i);
    //testContent should be 0
    expect(currentDiv).toHaveTextContent('0');

    // get nextButton by text - users find buttons with text
    const nextButton = getByText(/next/i);
    // click the next button
    fireEvent.click(nextButton);

    // expect(currentDiv).toHaveTextContent('1');
  });
});

describe('CardProvider', () => {
  it('renders without crashing', () => {
    render(<CardProvider children={[<div key='child'/>]}/>);
  });
});
