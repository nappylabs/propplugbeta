import React from 'react';

export const BottomSheet = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Slide-up Panel */}
      <div className="relative w-full bg-white rounded-t-2xl shadow-2xl animate-slide-up flex flex-col max-h-[85vh]">
        {/* Handle bar for visual cue */}
        <div className="w-full flex justify-center pt-3 pb-1" onClick={onClose}>
          <div className="w-12 h-1.5 bg-gray-300 rounded-full cursor-pointer hover:bg-gray-400 transition-colors" />
        </div>
        
        {/* Header */}
        <div className="px-6 pb-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-prop-900">{title}</h3>
          <button 
            onClick={onClose}
            className="text-xs font-semibold text-gray-400 hover:text-gray-600 bg-gray-100 px-2 py-1 rounded-md"
          >
            Done
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};