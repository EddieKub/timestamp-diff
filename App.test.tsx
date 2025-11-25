import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the header title', () => {
    render(<App />);
    expect(screen.getByText('Timestamp Diff')).toBeDefined();
  });

  it('renders start and end time inputs', () => {
    render(<App />);
    expect(screen.getByText('START TIME')).toBeDefined();
    expect(screen.getByText('END TIME')).toBeDefined();
  });

  it('renders initial results', () => {
    render(<App />);
    // By default it calculates 1 hour difference
    expect(screen.getByText('Exact Duration')).toBeDefined();
    expect(screen.getByText('1')).toBeDefined(); // 1 hour
    expect(screen.getAllByText('h').length).toBeGreaterThan(0);
  });

  it('allows swapping dates', () => {
    render(<App />);
    const swapButton = screen.getByTitle('Swap Dates');
    expect(swapButton).toBeDefined();
    
    // Smoke test: clicking it shouldn't crash
    fireEvent.click(swapButton);
  });
});