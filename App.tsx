import React, { useState, useEffect } from 'react';
import DateInput from './components/DateInput';
import DifferenceCard from './components/DifferenceCard';
import { calculateDifference } from './utils/timeUtils';
import { TimeDifference } from './types';

const App: React.FC = () => {
  // State
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(d.getHours() + 1); // Default to 1 hour later
    return d;
  });
  
  const [diff, setDiff] = useState<TimeDifference | null>(null);
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);

  // Effects
  useEffect(() => {
    const difference = calculateDifference(startDate, endDate);
    setDiff(difference);
  }, [startDate, endDate]);

  const swapDates = () => {
    const temp = startDate;
    setStartDate(endDate);
    setEndDate(temp);
  };

  const setNow = (isStart: boolean) => {
    if (isStart) setStartDate(new Date());
    else setEndDate(new Date());
  };

  const handleCopy = async () => {
    if (!diff) return;

    const parts: string[] = [];
    if (diff.years > 0) parts.push(`${diff.years}yr`);
    if (diff.months > 0) parts.push(`${diff.months}mo`);
    if (diff.days > 0) parts.push(`${diff.days}d`);
    parts.push(`${diff.hours}h`);
    parts.push(`${diff.minutes}m`);
    parts.push(`${diff.seconds}s`);
    parts.push(`${diff.milliseconds}ms`);
    
    const text = parts.join(' ');

    try {
      await navigator.clipboard.writeText(text);
      setShowCopyFeedback(true);
      setTimeout(() => setShowCopyFeedback(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-primary-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 backdrop-blur-md bg-white/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
              Timestamp Diff
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Input Section */}
        <section className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center relative">
            
            {/* Start Date */}
            <div className="flex-1 w-full">
               <DateInput label="Start Time" date={startDate} onChange={setStartDate} />
               <div className="mt-2 flex justify-between items-center">
                 <button onClick={() => setNow(true)} className="text-xs font-medium text-primary-600 hover:text-primary-700 ml-auto">Set to Now</button>
               </div>
            </div>

            {/* Swap Button */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:relative md:left-auto md:top-auto md:transform-none z-10">
               <button 
                onClick={swapDates}
                className="p-2 rounded-full bg-slate-50 border border-slate-200 text-slate-500 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50 transition-all shadow-sm active:scale-95"
                title="Swap Dates"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 rotate-90 md:rotate-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                </svg>
               </button>
            </div>

            {/* End Date */}
            <div className="flex-1 w-full">
               <DateInput label="End Time" date={endDate} onChange={setEndDate} />
               <div className="mt-2 flex justify-between items-center">
                 <button onClick={() => setNow(false)} className="text-xs font-medium text-primary-600 hover:text-primary-700 ml-auto">Set to Now</button>
               </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        {diff && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Primary Result */}
            <div className="mb-8 text-center">
               <div className="flex items-center justify-center gap-2 mb-2">
                 <h2 className="text-slate-400 font-medium uppercase tracking-widest text-sm">Exact Duration</h2>
                 <button 
                   onClick={handleCopy}
                   className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                   title="Copy to clipboard"
                   aria-label="Copy duration to clipboard"
                 >
                   {showCopyFeedback ? (
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-500">
                       <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                     </svg>
                   ) : (
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5" />
                     </svg>
                   )}
                 </button>
               </div>
               <div className="inline-flex flex-wrap justify-center gap-x-3 gap-y-2 text-3xl sm:text-5xl font-bold text-slate-800 font-feature-settings-tnum">
                 {diff.years > 0 && <span>{diff.years}<span className="text-lg text-slate-400 ml-1 font-normal">yr</span></span>}
                 {diff.months > 0 && <span>{diff.months}<span className="text-lg text-slate-400 ml-1 font-normal">mo</span></span>}
                 {diff.days > 0 && <span>{diff.days}<span className="text-lg text-slate-400 ml-1 font-normal">d</span></span>}
                 <span>{diff.hours}<span className="text-lg text-slate-400 ml-1 font-normal">h</span></span>
                 <span>{diff.minutes}<span className="text-lg text-slate-400 ml-1 font-normal">m</span></span>
                 <span>{diff.seconds}<span className="text-lg text-slate-400 ml-1 font-normal">s</span></span>
                 <span>{diff.milliseconds}<span className="text-lg text-slate-400 ml-1 font-normal">ms</span></span>
               </div>
               {diff.isNegative && (
                 <div className="mt-2 inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                   Warning: End date is before Start date
                 </div>
               )}
            </div>

            {/* Grid of Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <DifferenceCard 
                label="Total Days" 
                value={Math.floor(diff.totalMilliseconds / (1000 * 60 * 60 * 24))} 
                unit="days" 
                highlight
                delay={100}
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 9v7.5" /></svg>}
              />
              <DifferenceCard 
                label="Total Hours" 
                value={Math.floor(diff.totalMilliseconds / (1000 * 60 * 60))} 
                unit="hrs" 
                delay={200}
              />
              <DifferenceCard 
                label="Total Minutes" 
                value={Math.floor(diff.totalMilliseconds / (1000 * 60))} 
                unit="mins" 
                delay={300}
              />
              <DifferenceCard 
                label="Total Seconds" 
                value={Math.floor(diff.totalMilliseconds / 1000)} 
                unit="secs" 
                delay={400}
              />
            </div>
            
            {/* Tutorial Section */}
            <div className="border-t border-slate-200 pt-8 pb-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-indigo-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
                Unified Input Guide
              </h3>
              <p className="text-slate-500 text-sm mb-6">
                The input fields support a wide variety of standard date formats. You can paste or type these directly.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 
                 {/* ISO 8601 */}
                 <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:border-indigo-200 transition-colors">
                   <div className="flex items-center gap-2 mb-3">
                     <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600 uppercase tracking-wider border border-indigo-100">Standard</span>
                     <h4 className="font-semibold text-slate-900 text-sm">ISO 8601</h4>
                   </div>
                   <div className="space-y-3">
                     <div>
                       <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">Full Date & Time</p>
                       <code className="block bg-slate-50 px-2 py-1.5 rounded text-xs font-mono text-slate-700 border border-slate-100 select-all">2024-12-25T14:30:00Z</code>
                     </div>
                     <div>
                       <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">Date Only</p>
                       <code className="block bg-slate-50 px-2 py-1.5 rounded text-xs font-mono text-slate-700 border border-slate-100 select-all">2024-12-25</code>
                     </div>
                   </div>
                 </div>

                 {/* Human Readable */}
                 <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:border-emerald-200 transition-colors">
                   <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 uppercase tracking-wider border border-emerald-100">Readable</span>
                     <h4 className="font-semibold text-slate-900 text-sm">Text & Short Dates</h4>
                   </div>
                   <div className="space-y-3">
                     <div>
                       <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">Long Format</p>
                       <code className="block bg-slate-50 px-2 py-1.5 rounded text-xs font-mono text-slate-700 border border-slate-100 select-all">Oct 5, 2023 10:00 PM</code>
                     </div>
                     <div>
                       <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">Short (Local)</p>
                       <code className="block bg-slate-50 px-2 py-1.5 rounded text-xs font-mono text-slate-700 border border-slate-100 select-all">10/05/2023</code>
                     </div>
                   </div>
                 </div>

                 {/* Epoch */}
                 <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:border-blue-200 transition-colors md:col-span-2 lg:col-span-1">
                   <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 uppercase tracking-wider border border-blue-100">Technical</span>
                     <h4 className="font-semibold text-slate-900 text-sm">Timestamps</h4>
                   </div>
                   <div className="space-y-3">
                     <div>
                       <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">Epoch Milliseconds</p>
                       <code className="block bg-slate-50 px-2 py-1.5 rounded text-xs font-mono text-slate-700 border border-slate-100 select-all">1704110400000</code>
                     </div>
                     <div>
                       <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">RFC 2822</p>
                       <code className="block bg-slate-50 px-2 py-1.5 rounded text-xs font-mono text-slate-700 border border-slate-100 select-all">Wed, 09 Aug 1995 00:00:00 GMT</code>
                     </div>
                   </div>
                 </div>

              </div>
            </div>

          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-5xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>Built with React & Tailwind</p>
        </div>
      </footer>
    </div>
  );
};

export default App;