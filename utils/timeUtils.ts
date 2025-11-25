
import { TimeDifference } from '../types';

export const calculateDifference = (start: Date, end: Date): TimeDifference => {
  let diffMs = end.getTime() - start.getTime();
  const isNegative = diffMs < 0;
  
  if (isNegative) {
    diffMs = Math.abs(diffMs);
  }

  // Create copies to manipulate for calendar calculation
  const s = new Date(Math.min(start.getTime(), end.getTime()));
  const e = new Date(Math.max(start.getTime(), end.getTime()));

  let years = e.getFullYear() - s.getFullYear();
  let months = e.getMonth() - s.getMonth();
  let days = e.getDate() - s.getDate();
  
  // Adjust for negative days (borrow from previous month)
  if (days < 0) {
    months--;
    // Get days in previous month
    const copy = new Date(e.getTime());
    copy.setDate(0); // Go to last day of prev month
    days += copy.getDate();
  }

  // Adjust for negative months (borrow from year)
  if (months < 0) {
    years--;
    months += 12;
  }

  // Time calculation
  let hours = e.getHours() - s.getHours();
  let minutes = e.getMinutes() - s.getMinutes();
  let seconds = e.getSeconds() - s.getSeconds();
  let milliseconds = e.getMilliseconds() - s.getMilliseconds();

  if (milliseconds < 0) {
    seconds--;
    milliseconds += 1000;
  }
  if (seconds < 0) {
    minutes--;
    seconds += 60;
  }
  if (minutes < 0) {
    hours--;
    minutes += 60;
  }
  if (hours < 0) {
    days--; 
    hours += 24;
  }

  // Edge case: if adjusting hours caused days to go negative (e.g. same day but earlier time)
  if (days < 0) {
      months--;
      const copy = new Date(e.getTime());
      copy.setDate(0); 
      days += copy.getDate();
      if (months < 0) {
          years--;
          months += 12;
      }
  }

  return {
    totalMilliseconds: diffMs,
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
    isNegative
  };
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatDateLocal = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'medium'
  }).format(date) + `.${date.getMilliseconds().toString().padStart(3, '0')}`;
};

// Helper for datetime-local input value (YYYY-MM-DDTHH:mm:ss.sss)
export const toIsoStringLocal = (date: Date): string => {
  const offset = date.getTimezoneOffset() * 60000;
  return (new Date(date.getTime() - offset)).toISOString().slice(0, 23);
};

export const parseRawInput = (input: string): Date | null => {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // 1. Try ISO/Date parsing first (e.g. "2024", "2024-01-01")
  // We do this before numeric check so that "2024" is treated as the year 2024, not 2024ms.
  const date = new Date(trimmed);
  if (!isNaN(date.getTime())) {
    return date;
  }

  // 2. Check if it's strictly numeric (Epoch ms)
  // Only falls here if string parsing failed (e.g. "1704110400000" often fails Date constructor string parsing)
  if (/^-?\d+$/.test(trimmed)) {
    const epoch = parseInt(trimmed, 10);
    if (!isNaN(epoch)) {
      return new Date(epoch);
    }
  }
  
  return null;
};
