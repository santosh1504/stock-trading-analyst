import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DecisionBadge } from '../components/DecisionBadge';

describe('DecisionBadge', () => {
  it('renders BUY decision', () => {
    render(<DecisionBadge decision="BUY" confidence="High" />);
    expect(screen.getByText('BUY')).toBeInTheDocument();
  });

  it('renders SELL decision', () => {
    render(<DecisionBadge decision="SELL" confidence="Low" />);
    expect(screen.getByText('SELL')).toBeInTheDocument();
  });

  it('renders HOLD decision', () => {
    render(<DecisionBadge decision="HOLD" confidence="Medium" />);
    expect(screen.getByText('HOLD')).toBeInTheDocument();
  });

  it('renders High confidence', () => {
    render(<DecisionBadge decision="BUY" confidence="High" />);
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('renders Medium confidence', () => {
    render(<DecisionBadge decision="HOLD" confidence="Medium" />);
    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  it('renders Low confidence', () => {
    render(<DecisionBadge decision="SELL" confidence="Low" />);
    expect(screen.getByText('Low')).toBeInTheDocument();
  });

  it('has accessible role=status attribute', () => {
    render(<DecisionBadge decision="BUY" confidence="High" />);
    const el = screen.getByRole('status');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('aria-label');
  });
});
