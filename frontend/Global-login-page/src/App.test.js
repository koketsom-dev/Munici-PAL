import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Munici title', () => {
  render(<App />);
  const title = screen.getByText(/welcome to/i);
  expect(title).toBeInTheDocument();
});
