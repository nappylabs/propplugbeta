import React from 'react';

export const Result = ({ 
  label, 
  value, 
  subtext, 
  status = 'neutral', 
  isEmphasized = false, 
  onClick,
  icon 
}) => {
  
  // Dynamic Status Styling
  const getStyles = (s) => {
    switch (s) {
      case 'green': return 'bg-emerald-50/50 border-emerald-100 text-emerald-700';
      case 'amber': return 'bg-amber-50/50 border-amber-100 text-amber-700';
      case 'red': return 'bg-rose-50/50 border-rose-100 text-rose-700';
      case 'purple': return 'bg-prop-50 border-prop-100 text-prop-700';
      default: return 'bg-white border-gray-100 text-gray-600 shadow-sm';
    }
  };

  const baseClasses = `
    relative overflow-hidden p-4 rounded-xl border transition-all duration-200
    ${getStyles(status)}
    ${onClick ? 'cursor-pointer hover:shadow-md hover:scale-[1.01] active:scale-[0.99]' : ''}
    ${isEmphasized ? 'ring-1 ring-offset-1 ring-prop-100' : ''}
  `;

  return (
    <div onClick={onClick} className={baseClasses}>
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 mb-0.5">{label}</span>
          <span className={`leading-none ${isEmphasized ? 'text-2xl font-black' : 'text-lg font-bold'}`}>
            {value}
          </span>
        </div>
        {/* Edit Icon indicator if clickable */}
        {onClick && (
          <div className="bg-white/50 p-1.5 rounded-full text-current opacity-60 hover:opacity-100">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
              <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
              <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25-1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
            </svg>
          </div>
        )}
      </div>
      {subtext && <div className="text-xs mt-1.5 opacity-80 font-medium flex items-center gap-1">{subtext}</div>}
    </div>
  );
};