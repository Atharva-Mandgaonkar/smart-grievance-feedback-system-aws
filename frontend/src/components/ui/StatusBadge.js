import React from "react";

function StatusBadge({ status }) {
  const getStyles = () => {
    switch (status) {
      case "Submitted":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Resolved":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDot = () => {
    switch (status) {
      case "Submitted":
        return "bg-yellow-500";
      case "In Progress":
        return "bg-blue-500";
      case "Resolved":
        return "bg-emerald-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStyles()}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${getDot()}`} />
      {status}
    </span>
  );
}

export default StatusBadge;
