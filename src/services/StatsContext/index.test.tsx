import React, {useContext} from 'react';
import {fireEvent, render, cleanup} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import {Button} from 'semantic-ui-react';
import { Stats, StatsActionType, StatsState } from '../../types';


// instead of using 
// import * as localStorage from '../Save'
// able to mock using the below function
jest.mock('../Save', () => ({
  saveStats: jest.fn(),
  loadStats: () => ({})
}));

// instead of using 
// import {blankStats, initialState, reducer, StatsContext, StatsProvider} from './index';
// bring in all the functions/variables using require
const {
  blankStats,
  initialState,
  reducer,
  StatsContext,
  StatsProvider
} = require('./index');

afterEach(cleanup);

// reducer
describe('StatsContext reducer', () => {
// returns state
it('returns state', () => {
    const state = {};
    const action = {type: undefined};
    expect(reducer(state, action)).toEqual(state);
  });
});

// adds a new stats object when it receives a new question
it('adds a new stats object when it receives a new question', () => {
  const question = 'Example Question';

  // the action we will dispatch to the reducer
  const action = {
    type: StatsActionType.right,
    question
  };

  // the stats should be the blankStats object
  // with right === 1
  const rightStats = {
    ...blankStats,
    right: 1
  };

  // check to make sure the initialState doesn't already have a property [question]
  expect(initialState[question]).toBeUndefined();

  const result = reducer(initialState, action);

  // after getting a new question prompt in an action type 'right'
  // the question stats should be rightStats
  expect(result[question]).toEqual(rightStats);
}); 
// handles right action, returns correct stats
// handles skip action, returns correct stats
// handles wrong action, returns correct stats

// StatsContext provides an object with Stats for questions

describe('Test each case', () => {
  // action that takes a StatsActionType and returns a Stats object
  // may optionally take a stats object
  const getStats = (
    type: StatsActionType,
    stats?: Stats
  ) => stats
    ? ({...stats,
      [type]: stats[type] + 1})
    : ({...blankStats,
      [type]: 1});

  const exampleQuestion = 'Is this an example question?';

  // function that takes a StatsActionType and returns an action
  const getAction = (type: StatsActionType) => ({
    type,
    question: exampleQuestion
  });

  describe('Reducer adds a new stats object when it receives a new question prompt', () => {
    // uses Array.map to take each value of the enum StatsActionType
    // and return an array of arguments that it.each will run in tests
    const eachTest = Object.values(StatsActionType)
      .map((actionType) => {
        // an object of type StatAction
        const action = getAction(actionType);

        // an object of type Stats
        const result = getStats(actionType);

        // return an array of arguments that it.each will turn into a test
        return [
          actionType,
          action,
          initialState,
          exampleQuestion,
          result
        ];
      });

    // pass the array eachTest to it.each to run tests using arguments
    it.each(eachTest)
    // printing the title from it.each uses 'printf syntax'
    ('%#: %s adds new stats', 
    // name the arguments, the same order as in the array we generated
    (actionType, action, initialState, question, result) => {
      // assert that question isn't already in state
      expect(initialState[question]).toBeUndefined();

      // assert that the stats object at key: question matches result
      expect(reducer(initialState, action)[question]).toEqual(result);
    });
  });

  describe('Reducer returns correct stats', () => {
    // create a state with existing questions
    const existingState = {
      ...initialState,
      [exampleQuestion]: {
        right: 3,
        skip: 2,
        wrong: 0
      },
      'Would you like another example?': {
        right: 2,
        skip: 0,
        wrong: 7
      }
    };

    // Object.values and array.map to turn StatsActionType into array of arrays of test arguments
    const existingTests = Object.values(StatsActionType)
      .map((actionType) => {
        // get the action with the type and the example prompt
        const action = getAction(actionType);

        // get the stats for examplePrompt from existingState
        const stats = existingState[exampleQuestion];

        // getStats gives us our expected result
        const result = getStats(actionType, stats);

        // return the array
        return [
          actionType,
          action,
          existingState,
          result,
          exampleQuestion
        ];
      });

    it.each(existingTests)
      ('%#: %s returns correct stats',
        (actionType, action, initialState, result, question) => {
          // assert that question is already in state
          expect(initialState[question]).toEqual(existingState[exampleQuestion]);

          // assert that the stats object at key: question matches result
          expect(reducer(initialState, action)[question]).toEqual(result);
        });
  });
});

// StatsContext provides an object with Stats for questions
describe('StatsProvider', () => {
  // Helper component to get Stats out of StatsContext 
  // and display them so we can test
  const StatsConsumer = () => {
    const stats = useContext(StatsContext);

    // stats is the whole StatsState
    // one of its keys is the dispatch key
    // so if there's only 1 key there's no stats
    if(Object.keys(stats).length < 2) return <div>No Stats</div>;

    // use the filter method to grab the first question
    const question = Object.keys(stats).filter(key => key !== 'dispatch')[0];
    const {right, skip, wrong} = stats[question];

    // display each property in a div
    return <div>
      <div data-testid='question'>{question}</div>
      <div data-testid='right'>{right}</div>
      <div data-testid='skip'>{skip}</div>
      <div data-testid='wrong'>{wrong}</div>
    </div>
  };

  const exampleQuestion = 'Is this an example question?';

  // create a state with existing questions
  const testState: StatsState = {
    ...initialState,
    [exampleQuestion]: {
      right: 3,
      skip: 2,
      wrong: 0
    },
    'Would you like another example?': {
      right: 2,
      skip: 0,
      wrong: 7
    }
  };

  it('renders without crashing', () => {
    render(<StatsProvider children={[<div key='child'/>]}/>)
  });

  // StatsContext returns a stats object
  describe('StatsContext provides stats object', () => {
    const renderConsumer = () => render(
      <StatsProvider testState={testState}>
        <StatsConsumer/>
      </StatsProvider>);

    it('StatsConsumer sees correct question', () => {
      const {getByTestId} = renderConsumer();
      const question = getByTestId('question');
      expect(question).toHaveTextContent(exampleQuestion);
    });

    // // unit tests for right, skip, and wrong 
    // it('StatsConsumer sees correct value of right', () => {
    //   const {getByTestId} = renderConsumer();
    //   const right = getByTestId('right');
    //   expect(right).toHaveTextContent(testState[exampleQuestion].right.toString());
    // });

    // it('StatsConsumer sees correct value of skip', () => {
    //   const {getByTestId} = renderConsumer();
    //   const skip = getByTestId('skip');
    //   expect(skip).toHaveTextContent(testState[exampleQuestion].skip.toString());
    // });

    // it('StatsConsumer sees correct value of wrong', () => {
    //   const {getByTestId} = renderConsumer();
    //   const wrong = getByTestId('wrong');
    //   expect(wrong).toHaveTextContent(testState[exampleQuestion].wrong.toString());
    // });

    // unit tests for right, skip, and wrong using it.each
    test.each`
    type        | expected
    ${'right'}  | ${testState[exampleQuestion].right.toString()}
    ${'skip'}   | ${testState[exampleQuestion].skip.toString()}
    ${'wrong'}  | ${testState[exampleQuestion].wrong.toString()}
    `('StatsConsumer sees correct value of $type, returns $expected',
      ({type, expected}) => {
        const {getByTestId} = renderConsumer();
        const result = getByTestId(type);
        expect(result).toHaveTextContent(expected);
      });
  });
});

describe('saving to localStorage and loading from localStorage', () => {
  // saves stats when stats changes
  describe('saves stats when stats changes', () => {
    const question = 'Is this an example question?';

    const UpdateButtons = () => {
      const {dispatch} = useContext(StatsContext);
      const dispatchStat = (type: StatsActionType) => dispatch({type, question});

      return <div>
        <Button content='right' onClick={() => dispatchStat(StatsActionType.right)}/>
        <Button content='wrong' onClick={() => dispatchStat(StatsActionType.wrong)}/>
        <Button content='skip' onClick={() => dispatchStat(StatsActionType.skip)}/>
      </div>
    };

    const eachTest = Object.values(StatsActionType)
      .map(actionType => {
        // an object of type StatsState
        const result = {
          [question]: {
            ...blankStats,
            [actionType]: 1
        }};

        // return an array of arguments that it.each will turn into a test
        return [
          actionType,
          result
        ];
      });

      // pass the array eachTest to it.each to run tests using arguments
      test.each(eachTest)
      // printing the title from it.each uses 'printf syntax'
      ('%#: %s saves new stats',
      // name the arguments, same order as in the array we generated
      (
        actionType,
        result
      ) => {
        // test starts here
        const localStorage = require('../Save');
        const saveStats = jest.spyOn(localStorage, 'saveStats');
        saveStats.mockClear();

        const {getByText} = render(
          <StatsProvider testState={{} as StatsState}>
            <UpdateButtons/>
          </StatsProvider>
        );

        expect(saveStats).toHaveBeenCalledTimes(1);
        expect(saveStats).toHaveBeenCalledWith({});

        const regex = new RegExp(actionType as StatsActionType);
        const button = getByText(regex);
        fireEvent.click(button);

        expect(saveStats).toHaveBeenCalledTimes(2);
        expect(saveStats).toHaveBeenCalledWith(result);
      });
  });

  describe('load', () => {
    // stats is empty object when it does not get stats from localStorage
    it('gets default initialState when no stats in localStorage', () => {
      expect(initialState).toHaveProperty('dispatch');
      expect(Object.keys(initialState).length).toEqual(1);
    });

    // initialState contains saved stats when saved stats are returned from localStorage
    it('loads stats from localStorage when there are stats in localStorage', () => {
      const localStorage = require('../Save');
      const loadStats = jest.spyOn(localStorage, 'loadStats');

      loadStats.mockImplementation(() => ({
        'Example Question': {
          right: 1,
          wrong: 2,
          skip: 3
        }
      }));

      const {getInitialState} = require('./index');
      const initialState = getInitialState();

      expect(initialState).toHaveProperty('dispatch');
      expect(initialState).toHaveProperty('Example Question');
      expect(Object.keys(initialState).length).toEqual(2);
    });
  });
});
