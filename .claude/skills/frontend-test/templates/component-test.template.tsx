import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ComponentName from '../index';

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />);

    expect(screen.getByRole('button', { name: /按钮/ })).toBeInTheDocument();
  });

  it('should call onClick when button clicked', () => {
    const onClick = vi.fn();
    render(<ComponentName onClick={onClick} />);

    fireEvent.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
