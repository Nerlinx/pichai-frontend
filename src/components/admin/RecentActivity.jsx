import React from 'react';

const eventConfig = {
  user_login:         { label: 'Connexion',        color: 'bg-blue-500' },
  claim_created:      { label: 'Claim créé',        color: 'bg-emerald-500' },
  claim_approved:     { label: 'Claim approuvé',    color: 'bg-green-500' },
  claim_rejected:     { label: 'Claim rejeté',      color: 'bg-red-500' },
  evidence_approved:  { label: 'Preuve approuvée',  color: 'bg-purple-500' },
  user_suspended:     { label: 'Suspension',        color: 'bg-red-600' },
  prediction_resolved:{ label: 'Prédiction résolue',color: 'bg-amber-500' },
  category_created:   { label: 'Catégorie créée',   color: 'bg-indigo-500' },
};

const defaultActivities = [
  { id: 1, event_type: 'claim_created',       username: 'marie_claude',  description: 'Nouveau claim soumis sur les prix du carburant',   created_at: '2024-01-15T14:32:00' },
  { id: 2, event_type: 'evidence_approved',   username: 'robert_fils',   description: 'Preuve approuvée pour le claim #42',               created_at: '2024-01-15T13:15:00' },
  { id: 3, event_type: 'user_suspended',      username: 'admin',         description: 'Compte anon_user99 suspendu pour violation',       created_at: '2024-01-15T12:44:00' },
  { id: 4, event_type: 'claim_approved',      username: 'robert_fils',   description: 'Claim #38 vérifié et approuvé',                   created_at: '2024-01-15T11:20:00' },
  { id: 5, event_type: 'prediction_resolved', username: 'système',       description: 'Prédiction #89 résolue automatiquement',          created_at: '2024-01-15T10:05:00' },
  { id: 6, event_type: 'category_created',    username: 'admin',         description: 'Nouvelle catégorie "Sécurité" créée',             created_at: '2024-01-15T09:00:00' },
];

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `il y a ${mins}min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `il y a ${hrs}h`;
  return `il y a ${Math.floor(hrs / 24)}j`;
};

const RecentActivity = ({ activities = [] }) => {
  const items = activities.length > 0 ? activities : defaultActivities;

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const config = eventConfig[item.event_type] || { label: item.event_type, color: 'bg-slate-500' };
        return (
          <div key={item.id} className="flex items-start gap-3 py-2.5 border-b border-slate-700/40 last:border-0">
            {/* Dot coloré */}
            <div className="mt-1.5 shrink-0">
              <div className={`w-2 h-2 rounded-full ${config.color}`} />
            </div>

            {/* Contenu */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-300 leading-snug">{item.description}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                <span className="text-slate-400">{item.username}</span>
                {' · '}
                {timeAgo(item.created_at)}
              </p>
            </div>

            {/* Badge type */}
            <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-400 border border-slate-700">
              {config.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default RecentActivity;
