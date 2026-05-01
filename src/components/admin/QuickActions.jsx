import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

const QuickActions = ({ actions = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-2">
      {actions.map((action, i) => {
        const Icon = action.icon;
        return (
          <button
            key={i}
            onClick={() => navigate(action.action)}
            className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-slate-700/40 hover:bg-slate-700/70 border border-slate-700/50 hover:border-slate-600 transition-all text-left group"
          >
            {/* Icône */}
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${action.color}`}>
              <Icon className="w-4 h-4" />
            </div>

            {/* Texte */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                {action.title}
              </p>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                {action.description}
              </p>
            </div>

            {/* Flèche */}
            <ChevronRightIcon className="w-4 h-4 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>
        );
      })}
    </div>
  );
};

export default QuickActions;
