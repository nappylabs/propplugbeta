import React from 'react';

interface ProgressBarProps {
  percentage: number;
  status: 'getting_started' | 'in_progress' | 'nearly_complete' | 'complete';
}

const STATUS_COLORS = {
  getting_started: 'bg-slate-600',
  in_progress: 'bg-sky-500',
  nearly_complete: 'bg-indigo-500',
  complete: 'bg-emerald-500',
};

export const ProgressBar = ({ percentage, status }: ProgressBarProps) => {
  const colorClass = STATUS_COLORS[status] || 'bg-slate-600';

  return (
    <div className="w-full bg-slate-800 rounded-full h-2.5">
      <div
        className={`${colorClass} h-2.5 rounded-full transition-all duration-500`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};