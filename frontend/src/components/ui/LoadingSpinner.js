import React from "react";

function LoadingSpinner({ fullPage = false, text = "Loading..." }) {
  if (fullPage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600" />
        </div>
        <p className="text-sm text-gray-500 font-medium">{text}</p>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2">
      <div className="w-5 h-5 border-2 border-blue-200 rounded-full animate-spin border-t-blue-600" />
      <span className="text-sm text-gray-500">{text}</span>
    </div>
  );
}

export default LoadingSpinner;
