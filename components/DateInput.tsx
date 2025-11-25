import React, { useState, useEffect } from 'react';
import { toIsoStringLocal, parseRawInput, formatDateLocal } from '../utils/timeUtils';

interface DateInputProps {
  label: string;
  date: Date;
  onChange: (date: Date) => void;
  className?: string;
}

const DateInput: React.FC<DateInputProps> = ({ label, date, onChange, className = '' }) => {
  // Local text state to allow typing without constant re-formatting interference
  const [textValue, setTextValue] = useState(date.toISOString());
  const [isValid, setIsValid] = useState(true);

  // Sync from props (external changes like "Set to Now" or "Swap")
  useEffect(() => {
    const currentParsed = parseRawInput(textValue);
    
    // Check if we need to sync:
    // Only update if the prop date differs significantly from what the current text resolves to.
    if (!currentParsed || Math.abs(currentParsed.getTime() - date.getTime()) > 0) {
       setTextValue(date.toISOString());
       setIsValid(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTextValue(val);
    
    const parsed = parseRawInput(val);
    if (parsed) {
      setIsValid(true);
      onChange(parsed);
    } else {
      setIsValid(false);
    }
  };

  const handlePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Even with 'required', some browsers might fire empty events if UI is cleared forcefully.
    // We ignore empty values to prevent invalid state.
    if (!val) return;
    
    const newDate = new Date(val);
    if (!isNaN(newDate.getTime())) {
      onChange(newDate);
    }
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {/* CSS Hack: Expand the Webkit picker indicator to fill the entire input, ensuring click triggers the picker. Also hide clear/spin buttons. */}
      <style>{`
        .custom-date-input::-webkit-calendar-picker-indicator {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          padding: 0;
          margin: 0;
          cursor: pointer;
          opacity: 0; 
        }
        /* Force hide the clear button in WebKit browsers */
        .custom-date-input::-webkit-clear-button {
          display: none !important;
          -webkit-appearance: none !important;
        }
        /* Force hide the inner spin button */
        .custom-date-input::-webkit-inner-spin-button {
          display: none !important;
          -webkit-appearance: none !important;
        }
        /* Force hide the clear button in Edge/IE */
        .custom-date-input::-ms-clear {
          display: none !important;
        }
      `}</style>

      <label className="text-sm font-medium text-slate-500 mb-1.5 ml-1 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative group">
        {/* Text Input for ISO/Epoch/Manual */}
        <input
          type="text"
          value={textValue}
          onChange={handleTextChange}
          placeholder="ISO 8601 or Epoch ms"
          className={`block w-full pl-4 pr-12 py-3 bg-white border rounded-xl text-slate-900 font-mono text-sm shadow-sm
          focus:ring-2 transition-all
          ${isValid 
            ? 'border-slate-200 focus:ring-primary-500 focus:border-primary-500' 
            : 'border-red-300 focus:ring-red-200 focus:border-red-400 bg-red-50 text-red-900'
          }
          `}
        />
        
        {/* Date Picker Trigger Area */}
        <div className="absolute inset-y-0 right-0 w-12 flex items-center justify-center">
            {/* Native date picker input - Overlay with Opacity 0 */}
            <input
              type="datetime-local"
              value={toIsoStringLocal(date)}
              onChange={handlePickerChange}
              step="0.001"
              required
              className="custom-date-input absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
              tabIndex={-1}
              aria-label="Open Calendar"
            />
            {/* Visual Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-400 group-hover:text-primary-500 transition-colors pointer-events-none">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 9v7.5" />
            </svg>
        </div>
      </div>
      
      {/* Feedback / Validation Message */}
      <div className="min-h-[1.25rem] mt-1 ml-1">
        {!isValid && <p className="text-xs text-red-500">Invalid format. Try ISO 8601 or Epoch ms.</p>}
        {isValid && textValue && (
            <p className="text-xs text-slate-400 truncate">
                Interpreted: <span className="text-slate-600 font-medium">{formatDateLocal(date)}</span>
            </p>
        )}
      </div>
    </div>
  );
};

export default DateInput;