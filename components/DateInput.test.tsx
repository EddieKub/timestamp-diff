
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DateInput from './DateInput';

describe('DateInput', () => {
  const mockOnChange = vi.fn();
  const testDate = new Date('2024-01-01T12:00:00.000Z');

  it('renders label and initial date value', () => {
    render(
      <DateInput 
        label="Start Date" 
        date={testDate} 
        onChange={mockOnChange} 
      />
    );

    expect(screen.getByText('START DATE')).toBeDefined();
    // It usually renders ISO string in the text input
    expect(screen.getByDisplayValue(testDate.toISOString())).toBeDefined();
  });

  it('calls onChange when valid text is typed', () => {
    render(
      <DateInput 
        label="Test Input" 
        date={testDate} 
        onChange={mockOnChange} 
      />
    );

    const input = screen.getByRole('textbox');
    const newDateStr = '2025-01-01';
    
    fireEvent.change(input, { target: { value: newDateStr } });
    
    expect(mockOnChange).toHaveBeenCalled();
    // The first arg should be a date object parsing 2025-01-01
    const calledDate = mockOnChange.mock.calls[0][0];
    expect(calledDate.getFullYear()).toBe(2025);
  });

  it('shows error message on invalid input', () => {
    render(
      <DateInput 
        label="Test Input" 
        date={testDate} 
        onChange={mockOnChange} 
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'invalid-date-string' } });
    
    expect(screen.getByText(/Invalid format/i)).toBeDefined();
  });
});
