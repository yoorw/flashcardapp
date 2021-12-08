import React, {useContext} from 'react';
import {render, cleanup, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import {CardContext, CardProvider, initialState} from '../../../../services/CardContext'
import Subject from './index';
import { Card, CardState } from '../../../../types';


afterEach(cleanup);

const renderSubject = (
  subject: string,
  testState?: CardState,
  child?: JSX.Element
) => render(
  <CardProvider testState={testState}>
    <Subject subject={subject}/>
    {child}
  </CardProvider>
);


// displays the subject as a menu item
it('shows the subject on the screen', () => {
  const subject = initialState.cards[0].subject;
  const {getByText} = renderSubject(subject);
  const subjectDisplay = getByText(subject);
  expect(subjectDisplay).toBeInTheDocument();
});

