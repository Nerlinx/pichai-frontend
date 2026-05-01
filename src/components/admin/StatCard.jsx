import React from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

const StatCard = ({ stat }) => {
  const { title, value, change, icon: Icon, color, description } = stat;
  const isPositive = change?.startsWith('+');

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg ${color} bg-opacity-20 flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white opacity-80" />
        </div>
        <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
          isPositive
            ? 'bg-emerald-500/15 text-emerald-400'
            : 'bg-red-500/15 text-red-400'
        }`}>
          {isPositive
            ? <ArrowTrendingUpIcon className="w-3 h-3" />
            : <ArrowTrendingDownIcon className="w-3 h-3" />
          }
          {change}
        </span>
      </div>

      <div className="text-3xl font-bold text-white mb-1">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className="text-sm font-medium text-slate-300 mb-1">{title}</div>
      <div className="text-xs text-slate-500">{description}</div>
    </div>
  );
};

export default StatCard;
