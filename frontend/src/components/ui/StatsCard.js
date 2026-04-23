import React from "react";

function StatsCard({ title, value, icon, color = "blue", subtitle }) {
  const colorMap = {
    blue: "from-blue-500 to-blue-600",
    green: "from-emerald-500 to-emerald-600",
    yellow: "from-amber-500 to-amber-600",
    purple: "from-purple-500 to-purple-600",
    red: "from-red-500 to-red-600",
    indigo: "from-indigo-500 to-indigo-600",
  };

  const bgLightMap = {
    blue: "bg-blue-50",
    green: "bg-emerald-50",
    yellow: "bg-amber-50",
    purple: "bg-purple-50",
    red: "bg-red-50",
    indigo: "bg-indigo-50",
  };

  const iconColorMap = {
    blue: "text-blue-600",
    green: "text-emerald-600",
    yellow: "text-amber-600",
    purple: "text-purple-600",
    red: "text-red-600",
    indigo: "text-indigo-600",
  };

  return (
    <div className="card-hover group cursor-default">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-xl ${bgLightMap[color]} flex items-center justify-center 
                      group-hover:scale-110 transition-transform duration-300`}
        >
          <span className={`text-xl ${iconColorMap[color]}`}>{icon}</span>
        </div>
      </div>
      <div className={`mt-4 h-1 rounded-full bg-gradient-to-r ${colorMap[color]} opacity-60`} />
    </div>
  );
}

export default StatsCard;
