
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DifferenceCard from './DifferenceCard';

describe('DifferenceCard', () => {
  it('renders label, value, and unit correctly', () => {
    render(
      <DifferenceCard 
        label="Total Days" 
        value={100} 
        unit="days" 
      />
    );

    expect(screen.getByText('Total Days')).toBeDefined();
    expect(screen.getByText('100')).toBeDefined();
    expect(screen.getByText('days')).toBeDefined();
  });

  it('renders with highlight styles when prop is true', () => {
    const { container } = render(
      <DifferenceCard 
        label="Highlight" 
        value={50} 
        unit="test" 
        highlight={true} 
      />
    );
    
    // Check for a class specific to highlighted state (e.g., text-white)
    const valueElement = screen.getByText('50');
    expect(valueElement.className).toContain('text-white');
  });

  it('renders with correct formatted number', () => {
    render(
      <DifferenceCard 
        label="Big Number" 
        value={10000} 
        unit="items" 
      />
    );
    expect(screen.getByText('10,000')).toBeDefined();
  });
});
