import {cleanup, render} from '@testing-library/react';
import TrueStats from './index';
import {CardProvider, initialState as cardState} from '../../../../services/CardContext';
import {StatsProvider} from '../../../../services/StatsContext';
import {StatsState} from '../../../../types';


describe('TrueStats', () => {
  // a StatsState to pass to StatsProvider
  // using the question from cards index 0
  // mark 1st card as Wrong and 2nd card as Right
  const statsState = {
    [cardState.cards[0].question] : {right: 0, wrong: 1, skip: 0},
    [cardState.cards[1].question] : {right: 1, wrong: 0, skip: 0}
  } as StatsState;

  // a CardState with current set to 0
  const testState = {
    ...cardState,
    current: 0
  };

  // helper function to render stats inside CardProvider, StatsProvider
  const renderTrueStats = () => render(
    <CardProvider testState={testState}>
      <StatsProvider testState={statsState}>
        <TrueStats/>
      </StatsProvider>
    </CardProvider>
  );

  afterEach(cleanup);

  it('should show Total Questions: 2', () => {
    const {getByText} = renderTrueStats();

    const total = getByText(/Total Questions/i);
    expect(total).toBeInTheDocument();
    expect(total).toHaveTextContent('Total Questions: 2');
  });

  it('should show Right Questions: 1', () => {
    const {getByText} = renderTrueStats();

    const right = getByText(/Questions Right/i);
    expect(right).toBeInTheDocument();
    expect(right).toHaveTextContent('Questions Right: 1');
  });
});
