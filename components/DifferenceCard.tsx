import React from 'react';
import { formatNumber } from '../utils/timeUtils';

interface DifferenceCardProps {
  label: string;
  value: number;
  unit: string;
  icon?: React.ReactNode;
  highlight?: boolean;
  delay?: number;
}

const DifferenceCard: React.FC<DifferenceCardProps> = ({ label, value, unit, icon, highlight = false, delay = 0 }) => {
  return (
    <div 
      className={`
        relative overflow-hidden rounded-2xl p-6 transition-all duration-500 transform hover:-translate-y-1 hover:shadow-lg
        ${highlight 
          ? 'bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-primary-200/50 shadow-xl' 
          : 'bg-white border border-slate-100 text-slate-800 shadow-sm'}
      `}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className={`text-sm font-medium uppercase tracking-wider ${highlight ? 'text-primary-100' : 'text-slate-400'}`}>
          {label}
        </h3>
        {icon && <div className={`${highlight ? 'text-primary-200' : 'text-slate-300'}`}>{icon}</div>}
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className={`text-3xl sm:text-4xl font-bold tracking-tight ${highlight ? 'text-white' : 'text-slate-900'}`}>
          {formatNumber(value)}
        </span>
        <span className={`text-sm font-medium ${highlight ? 'text-primary-200' : 'text-slate-500'}`}>
          {unit}
        </span>
      </div>
    </div>
  );
};

export default DifferenceCard;
