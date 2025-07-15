import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders pathfinder visualizer', () => {
  render(<App />);
  const titleElement = screen.getByText(/Pathfinder AI/i);
  expect(titleElement).toBeInTheDocument();
});
