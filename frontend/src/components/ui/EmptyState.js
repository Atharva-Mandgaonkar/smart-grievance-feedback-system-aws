import React from "react";

function EmptyState({ title = "No data found", subtitle = "", actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 animate-fade-in">
      {/* Empty state illustration */}
      <svg
        className="w-32 h-32 text-gray-300 mb-6"
        fill="none"
        viewBox="0 0 128 128"
        stroke="currentColor"
        strokeWidth="1"
      >
        <rect x="20" y="30" width="88" height="68" rx="8" className="fill-gray-100 stroke-gray-300" />
        <line x1="36" y1="50" x2="92" y2="50" className="stroke-gray-300" strokeWidth="2" strokeLinecap="round" />
        <line x1="36" y1="62" x2="76" y2="62" className="stroke-gray-300" strokeWidth="2" strokeLinecap="round" />
        <line x1="36" y1="74" x2="84" y2="74" className="stroke-gray-300" strokeWidth="2" strokeLinecap="round" />
        <circle cx="96" cy="88" r="20" className="fill-white stroke-gray-300" strokeWidth="2" />
        <line x1="88" y1="88" x2="104" y2="88" className="stroke-gray-300" strokeWidth="2" strokeLinecap="round" />
      </svg>

      <h3 className="text-lg font-semibold text-gray-600 mb-2">{title}</h3>
      {subtitle && (
        <p className="text-sm text-gray-400 text-center max-w-sm mb-6">{subtitle}</p>
      )}
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary text-sm">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
