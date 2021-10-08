import React from 'react';
import { render, cleanup, getByTestId } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';

afterEach(cleanup);

// shows the Answering scene
it('shows the Answering component', () => {
  const {getByText} = render(<App/>);
  const skip = getByText(/skip/i);
  expect(skip).toBeInTheDocument();
});

// snapshot
it('Matches Snapshot', () => {
  const {asFragment} = render(<App/>);
  expect(asFragment()).toMatchSnapshot();
});
