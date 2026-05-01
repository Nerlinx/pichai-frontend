import React, { useState } from 'react';

// Données mock si aucune donnée fournie
const defaultData = [
  { date: '09 Jan', users: 420, claims: 18 },
  { date: '10 Jan', users: 380, claims: 24 },
  { date: '11 Jan', users: 510, claims: 31 },
  { date: '12 Jan', users: 470, claims: 22 },
  { date: '13 Jan', users: 620, claims: 40 },
  { date: '14 Jan', users: 580, claims: 35 },
  { date: '15 Jan', users: 710, claims: 48 },
];

const ActivityChart = ({ data = [] }) => {
  const [hovered, setHovered] = useState(null);
  const chartData = data.length > 0 ? data : defaultData;

  const maxUsers = Math.max(...chartData.map(d => d.users));
  const maxClaims = Math.max(...chartData.map(d => d.claims));

  return (
    <div className="relative">
      {/* Tooltip */}
      {hovered !== null && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-xs z-10 pointer-events-none">
          <p className="text-slate-300 font-medium mb-1">{chartData[hovered]?.date}</p>
          <p className="text-blue-400">Utilisateurs: <span className="text-white font-semibold">{chartData[hovered]?.users}</span></p>
          <p className="text-emerald-400">Claims: <span className="text-white font-semibold">{chartData[hovered]?.claims}</span></p>
        </div>
      )}

      {/* Barres */}
      <div className="flex items-end gap-2 h-40 mt-8">
        {chartData.map((d, i) => (
          <div
            key={i}
            className="flex-1 flex flex-col items-center gap-1 cursor-pointer group"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Barre utilisateurs */}
            <div className="w-full flex gap-0.5 items-end" style={{ height: '100%' }}>
              <div
                className="flex-1 rounded-t bg-gradient-to-t from-blue-700 to-blue-400 group-hover:from-blue-600 group-hover:to-blue-300 transition-all"
                style={{ height: `${(d.users / maxUsers) * 100}%`, minHeight: 4 }}
              />
              <div
                className="flex-1 rounded-t bg-gradient-to-t from-emerald-700 to-emerald-400 group-hover:from-emerald-600 group-hover:to-emerald-300 transition-all"
                style={{ height: `${(d.claims / maxClaims) * 80}%`, minHeight: 4 }}
              />
            </div>
            <span className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors whitespace-nowrap">
              {d.date}
            </span>
          </div>
        ))}
      </div>

      {/* Légende */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-700/50">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-blue-500" />
          <span className="text-xs text-slate-400">Utilisateurs actifs</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-emerald-500" />
          <span className="text-xs text-slate-400">Nouveaux claims</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityChart;
