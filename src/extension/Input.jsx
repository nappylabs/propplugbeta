import React from 'react';

export const Input = ({ label, value, onChange, type = "number", prefix, suffix, placeholder, className = "" }) => (
  <div className={`flex flex-col ${className}`}>
    <label className="text-xs font-semibold text-gray-500 mb-1.5 ml-1">{label}</label>
    <div className="relative flex items-center group">
      {prefix && <span className="absolute left-3.5 text-gray-400 text-sm font-medium">{prefix}</span>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={(e) => e.target.select()} // Auto-select on focus for easier editing
        className={`w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-900 rounded-xl py-2.5 text-sm font-semibold focus:ring-2 focus:ring-prop-500 focus:border-prop-500 focus:bg-white outline-none transition-all
          ${prefix ? 'pl-8' : 'pl-4'} 
          ${suffix ? 'pr-9' : 'pr-4'}
        `}
      />
      {suffix && <span className="absolute right-3.5 text-gray-400 text-xs font-bold">{suffix}</span>}
    </div>
  </div>
);