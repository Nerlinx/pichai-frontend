import { useState, useEffect } from "react";

// ============ ICONS ============
const Icon = ({ path, size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d={path} />
  </svg>
);

const icons = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  claims: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  moderation: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  categories: "M4 6h16M4 10h16M4 14h16M4 18h16",
  analytics: "M18 20V10 M12 20V4 M6 20v-6",
  roles: "M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z M8 12h8 M12 8v8",
  logs: "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
  bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
  search: "M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0",
  plus: "M12 5v14M5 12h14",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18M6 6l12 12",
  edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  trash: "M3 6h18 M19 6l-1 14H6L5 6 M8 6V4h8v2",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  trending: "M23 6l-9.5 9.5-5-5L1 18",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  menu: "M3 12h18M3 6h18M3 18h18",
  chevron: "M9 18l6-6-6-6",
  flag: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7",
  activity: "M22 12h-4l-3 9L9 3l-3 9H2",
};

// ============ MOCK DATA ============
const mockStats = {
  users: { total: 12847, active: 9234, new_today: 47, growth: 12.5 },
  claims: { total: 324, pending: 18, verified: 198, controversial: 12 },
  predictions: { total: 1892, active: 234, resolved: 1450, accuracy: 74.3 },
  moderation: { pending: 23, flagged: 7, resolved_today: 15 },
  categories: { total: 8, active: 8 },
  evidence: { total: 4231, pending: 89, approved: 3892 },
};

const mockUsers = [
  { id: 1, username: "jean_pierre", email: "jp@example.ht", role: "user", trust_score: 0.87, is_active: true, is_verified: true, created_at: "2024-01-10", last_login_at: "2024-01-15" },
  { id: 2, username: "marie_claude", email: "mc@example.ht", role: "contributor", trust_score: 0.92, is_active: true, is_verified: true, created_at: "2024-01-08", last_login_at: "2024-01-15" },
  { id: 3, username: "robert_fils", email: "rf@example.ht", role: "moderator", trust_score: 0.95, is_active: true, is_verified: true, created_at: "2023-12-01", last_login_at: "2024-01-14" },
  { id: 4, username: "anon_user99", email: "au@example.ht", role: "user", trust_score: 0.23, is_active: false, is_verified: false, created_at: "2024-01-12", last_login_at: "2024-01-12" },
  { id: 5, username: "sophie_haiti", email: "sh@example.ht", role: "verified_user", trust_score: 0.78, is_active: true, is_verified: true, created_at: "2024-01-05", last_login_at: "2024-01-15" },
  { id: 6, username: "marc_duval", email: "md@example.ht", role: "editor", trust_score: 0.88, is_active: true, is_verified: true, created_at: "2023-11-15", last_login_at: "2024-01-13" },
];

const mockClaims = [
  { id: 1, title: "Réouverture de 15 écoles publiques dans la zone métropolitaine", category: "Éducation", status: "in_progress", ai_confidence_score: 0.62, crowd_confidence_score: 0.55, claimant: "Min. Éducation", created_at: "2024-01-10", requires_review: false },
  { id: 2, title: "Taux de chômage dépasse 40% au premier trimestre", category: "Économie", status: "verified", ai_confidence_score: 0.75, crowd_confidence_score: 0.65, claimant: "IHSI", created_at: "2024-01-08", requires_review: false },
  { id: 3, title: "Prix du gallon d'essence dépasse 900 HTG", category: "Économie", status: "completed", ai_confidence_score: 0.82, crowd_confidence_score: 0.78, claimant: "Min. Commerce", created_at: "2024-01-05", requires_review: false },
  { id: 4, title: "Départ du Conseil Présidentiel avant le 7 février", category: "Gouvernance", status: "pending", ai_confidence_score: 0.68, crowd_confidence_score: 0.42, claimant: "CPT", created_at: "2024-01-12", requires_review: true },
  { id: 5, title: "Pénurie d'eau potable s'aggrave à Port-au-Prince", category: "Infrastructure", status: "verified", ai_confidence_score: 0.91, crowd_confidence_score: 0.88, claimant: "CAMEP", created_at: "2024-01-02", requires_review: false },
];

const mockCategories = [
  { id: 1, name: "Économie", slug: "economie", color_hex: "#3B82F6", total_claims: 89, avg_confidence: 0.72, is_active: true, is_system: true },
  { id: 2, name: "Éducation", slug: "education", color_hex: "#8B5CF6", total_claims: 45, avg_confidence: 0.64, is_active: true, is_system: true },
  { id: 3, name: "Santé", slug: "sante", color_hex: "#EF4444", total_claims: 38, avg_confidence: 0.68, is_active: true, is_system: true },
  { id: 4, name: "Infrastructure", slug: "infrastructure", color_hex: "#F59E0B", total_claims: 52, avg_confidence: 0.71, is_active: true, is_system: true },
  { id: 5, name: "Agriculture", slug: "agriculture", color_hex: "#10B981", total_claims: 29, avg_confidence: 0.59, is_active: true, is_system: true },
  { id: 6, name: "Technologie", slug: "technologie", color_hex: "#6366F1", total_claims: 18, avg_confidence: 0.65, is_active: true, is_system: true },
  { id: 7, name: "Environnement", slug: "environnement", color_hex: "#059669", total_claims: 22, avg_confidence: 0.61, is_active: true, is_system: true },
  { id: 8, name: "Gouvernance", slug: "gouvernance", color_hex: "#6B7280", total_claims: 31, avg_confidence: 0.58, is_active: true, is_system: true },
];

const mockLogs = [
  { id: 1, event_type: "user_login", user_id: 2, username: "marie_claude", description: "Connexion depuis Port-au-Prince", created_at: "2024-01-15T14:32:00", device_type: "mobile" },
  { id: 2, event_type: "claim_created", user_id: 3, username: "robert_fils", description: "Nouveau claim: Prix essence HTG", created_at: "2024-01-15T13:15:00", device_type: "desktop" },
  { id: 3, event_type: "evidence_approved", user_id: 3, username: "robert_fils", description: "Preuve approuvée pour claim #3", created_at: "2024-01-15T12:44:00", device_type: "desktop" },
  { id: 4, event_type: "user_suspended", user_id: 1, username: "jean_pierre", description: "Compte suspendu: violation des règles", created_at: "2024-01-15T11:20:00", device_type: "desktop" },
  { id: 5, event_type: "category_created", user_id: 1, username: "admin", description: "Nouvelle catégorie: Sécurité créée", created_at: "2024-01-15T10:05:00", device_type: "desktop" },
  { id: 6, event_type: "prediction_resolved", user_id: null, username: "système", description: "Prédiction #89 résolue automatiquement", created_at: "2024-01-15T09:00:00", device_type: null },
];

const mockModeration = [
  { id: 1, type: "claim", title: "Affirmation politique controversée sur les élections", reporter: "user_45", reason: "Contenu trompeur", severity: "high", created_at: "2024-01-15T12:00:00" },
  { id: 2, type: "evidence", title: "Lien vers source non fiable", reporter: "marie_claude", reason: "Source douteuse", severity: "medium", created_at: "2024-01-15T10:30:00" },
  { id: 3, type: "claim", title: "Données économiques sans source", reporter: "robert_fils", reason: "Manque de sources", severity: "low", created_at: "2024-01-14T16:45:00" },
  { id: 4, type: "user", title: "Comportement suspect: votes multiples", reporter: "système", reason: "Activité anormale", severity: "high", created_at: "2024-01-14T14:20:00" },
];

// ============ COMPOSANTS UI ============
const Badge = ({ children, color = "gray" }) => {
  const colors = {
    green: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    red: "bg-red-500/15 text-red-400 border-red-500/30",
    yellow: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    blue: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    purple: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    gray: "bg-slate-500/15 text-slate-400 border-slate-500/30",
    orange: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colors[color]}`}>
      {children}
    </span>
  );
};

const statusConfig = {
  pending: { label: "En attente", color: "yellow" },
  verified: { label: "Vérifié", color: "green" },
  in_progress: { label: "En cours", color: "blue" },
  completed: { label: "Complété", color: "green" },
  partially_completed: { label: "Partiel", color: "orange" },
  failed: { label: "Échoué", color: "red" },
  cancelled: { label: "Annulé", color: "gray" },
};

const roleConfig = {
  user: { label: "Utilisateur", color: "gray" },
  verified_user: { label: "Vérifié", color: "blue" },
  contributor: { label: "Contributeur", color: "purple" },
  moderator: { label: "Modérateur", color: "orange" },
  editor: { label: "Éditeur", color: "yellow" },
  admin: { label: "Admin", color: "red" },
  super_admin: { label: "Super Admin", color: "red" },
};

const StatCard = ({ title, value, sub, color, icon }) => {
  const colors = {
    blue: "from-blue-600/20 to-blue-600/5 border-blue-500/20 text-blue-400",
    emerald: "from-emerald-600/20 to-emerald-600/5 border-emerald-500/20 text-emerald-400",
    amber: "from-amber-600/20 to-amber-600/5 border-amber-500/20 text-amber-400",
    red: "from-red-600/20 to-red-600/5 border-red-500/20 text-red-400",
    purple: "from-purple-600/20 to-purple-600/5 border-purple-500/20 text-purple-400",
    slate: "from-slate-600/20 to-slate-600/5 border-slate-500/20 text-slate-400",
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-5`}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">{title}</span>
        <Icon path={icon} size={16} className="opacity-60" />
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-slate-400">{sub}</div>
    </div>
  );
};

const TrustBar = ({ score }) => {
  const pct = Math.round(score * 100);
  const color = score >= 0.7 ? "#10b981" : score >= 0.4 ? "#f59e0b" : "#ef4444";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-slate-700 rounded-full h-1.5 overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs text-slate-400 w-8">{pct}%</span>
    </div>
  );
};

// ============ PAGES ============

// VUE D'ENSEMBLE
const OverviewPage = () => {
  const activityData = [40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88, 50, 72];
  const maxVal = Math.max(...activityData);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Vue d'ensemble</h2>
        <p className="text-sm text-slate-400">Statistiques en temps réel de la plateforme EXPAND</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Utilisateurs" value={mockStats.users.total.toLocaleString()} sub={`+${mockStats.users.new_today} aujourd'hui`} color="blue" icon={icons.users} />
        <StatCard title="Claims" value={mockStats.claims.total} sub={`${mockStats.claims.pending} en attente`} color="purple" icon={icons.claims} />
        <StatCard title="Prédictions" value={mockStats.predictions.total.toLocaleString()} sub={`${mockStats.predictions.accuracy}% précision`} color="emerald" icon={icons.trending} />
        <StatCard title="Modération" value={mockStats.moderation.pending} sub={`${mockStats.moderation.flagged} signalés urgents`} color="amber" icon={icons.flag} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Graphique activité */}
        <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Activité des 14 derniers jours</h3>
              <p className="text-xs text-slate-400 mt-0.5">Nouveaux utilisateurs + prédictions</p>
            </div>
            <Badge color="green">+12.5% ce mois</Badge>
          </div>
          <div className="flex items-end gap-1.5 h-24">
            {activityData.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-gradient-to-t from-blue-600 to-blue-400 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                  style={{ height: `${(v / maxVal) * 100}%` }}
                  title={`Jour ${i + 1}: ${v}`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-slate-500">1 Jan</span>
            <span className="text-xs text-slate-500">14 Jan</span>
          </div>
        </div>

        {/* Répartition claims */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Claims par statut</h3>
          <div className="space-y-3">
            {[
              { label: "Vérifiés", val: mockStats.claims.verified, total: mockStats.claims.total, color: "#10b981" },
              { label: "En cours", val: 58, total: mockStats.claims.total, color: "#3b82f6" },
              { label: "En attente", val: mockStats.claims.pending, total: mockStats.claims.total, color: "#f59e0b" },
              { label: "Controversés", val: mockStats.claims.controversial, total: mockStats.claims.total, color: "#ef4444" },
            ].map(({ label, val, total, color }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">{label}</span>
                  <span className="text-white font-medium">{val}</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(val / total) * 100}%`, backgroundColor: color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activité récente */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Activité récente</h3>
        <div className="space-y-3">
          {mockLogs.slice(0, 5).map(log => (
            <div key={log.id} className="flex items-center gap-3 py-2 border-b border-slate-700/40 last:border-0">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                <Icon path={icons.activity} size={14} className="text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-300 truncate">{log.description}</p>
                <p className="text-xs text-slate-500">{log.username} · {new Date(log.created_at).toLocaleString('fr-FR')}</p>
              </div>
              <Badge color={log.event_type.includes("suspended") ? "red" : log.event_type.includes("approved") ? "green" : "gray"}>
                {log.event_type.replace(/_/g, " ")}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// GESTION UTILISATEURS
const UsersPage = () => {
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "", role: "user" });

  const filtered = mockUsers.filter(u =>
    (selectedRole === "all" || u.role === selectedRole) &&
    (u.username.includes(search) || u.email.includes(search))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">Gestion des utilisateurs</h2>
          <p className="text-sm text-slate-400">{mockStats.users.total.toLocaleString()} utilisateurs inscrits</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Icon path={icons.plus} size={16} />
          Nouvel utilisateur
        </button>
      </div>

      {/* Filtres */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Icon path={icons.search} size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <select
          value={selectedRole}
          onChange={e => setSelectedRole(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500"
        >
          <option value="all">Tous les rôles</option>
          <option value="user">Utilisateur</option>
          <option value="verified_user">Vérifié</option>
          <option value="contributor">Contributeur</option>
          <option value="moderator">Modérateur</option>
          <option value="editor">Éditeur</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-5 py-3">Utilisateur</th>
              <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-5 py-3">Rôle</th>
              <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Score confiance</th>
              <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Dernière connexion</th>
              <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-5 py-3">Statut</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {filtered.map(user => (
              <tr key={user.id} className="hover:bg-slate-700/20 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                      {user.username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{user.username}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <Badge color={roleConfig[user.role]?.color || "gray"}>
                    {roleConfig[user.role]?.label || user.role}
                  </Badge>
                </td>
                <td className="px-5 py-3.5 hidden md:table-cell">
                  <div className="w-32">
                    <TrustBar score={user.trust_score} />
                  </div>
                </td>
                <td className="px-5 py-3.5 hidden lg:table-cell">
                  <span className="text-xs text-slate-400">
                    {new Date(user.last_login_at).toLocaleDateString('fr-FR')}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <Badge color={user.is_active ? "green" : "red"}>
                    {user.is_active ? "Actif" : "Suspendu"}
                  </Badge>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-blue-400 transition-colors">
                      <Icon path={icons.edit} size={14} />
                    </button>
                    <button className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-red-400 transition-colors">
                      <Icon path={user.is_active ? icons.x : icons.check} size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal création */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-white">Créer un utilisateur</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <Icon path={icons.x} size={18} />
              </button>
            </div>
            <div className="space-y-4">
              {[
                { label: "Nom d'utilisateur", key: "username", type: "text", placeholder: "jean_dupont" },
                { label: "Email", key: "email", type: "email", placeholder: "user@expand.ht" },
                { label: "Mot de passe", key: "password", type: "password", placeholder: "••••••••" },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={newUser[key]}
                    onChange={e => setNewUser(p => ({ ...p, [key]: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Rôle</label>
                <select
                  value={newUser.role}
                  onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-blue-500"
                >
                  <option value="user">Utilisateur</option>
                  <option value="moderator">Modérateur</option>
                  <option value="editor">Éditeur</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm transition-colors">
                Annuler
              </button>
              <button className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors">
                Créer le compte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// GESTION CLAIMS
const ClaimsPage = () => {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? mockClaims : mockClaims.filter(c => c.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">Gestion des claims</h2>
          <p className="text-sm text-slate-400">{mockStats.claims.total} claims au total</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Icon path={icons.plus} size={16} />
          Nouveau claim
        </button>
      </div>

      {/* Filtres statuts */}
      <div className="flex gap-2 flex-wrap">
        {["all", "pending", "in_progress", "verified", "completed", "cancelled"].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === s ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
            }`}
          >
            {s === "all" ? "Tous" : statusConfig[s]?.label || s}
          </button>
        ))}
      </div>

      {/* Liste claims */}
      <div className="space-y-3">
        {filtered.map(claim => (
          <div key={claim.id} className={`bg-slate-800/50 border rounded-xl p-5 hover:border-slate-600 transition-colors ${
            claim.requires_review ? "border-amber-500/40" : "border-slate-700/50"
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge color={statusConfig[claim.status]?.color || "gray"}>
                    {statusConfig[claim.status]?.label}
                  </Badge>
                  <Badge color="blue">{claim.category}</Badge>
                  {claim.requires_review && <Badge color="amber">⚠ Révision requise</Badge>}
                </div>
                <h3 className="text-sm font-medium text-white mb-1">{claim.title}</h3>
                <p className="text-xs text-slate-400">Par {claim.claimant} · {new Date(claim.created_at).toLocaleDateString('fr-FR')}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-slate-500 mb-1">Confiance IA</p>
                  <p className="text-sm font-semibold text-white">{Math.round(claim.ai_confidence_score * 100)}%</p>
                </div>
                <div className="flex gap-1.5">
                  <button className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-blue-400 transition-colors">
                    <Icon path={icons.eye} size={15} />
                  </button>
                  <button className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-green-400 transition-colors">
                    <Icon path={icons.check} size={15} />
                  </button>
                  <button className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-red-400 transition-colors">
                    <Icon path={icons.trash} size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Barres de confiance */}
            <div className="mt-3 grid grid-cols-2 gap-4 pt-3 border-t border-slate-700/40">
              <div>
                <p className="text-xs text-slate-500 mb-1">Confiance IA</p>
                <TrustBar score={claim.ai_confidence_score} />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Consensus collectif</p>
                <TrustBar score={claim.crowd_confidence_score} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// MODÉRATION
const ModerationPage = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-semibold text-white mb-1">Modération des contenus</h2>
      <p className="text-sm text-slate-400">{mockStats.moderation.pending} éléments en attente · {mockStats.moderation.flagged} urgents</p>
    </div>

    <div className="grid grid-cols-3 gap-4">
      <StatCard title="En attente" value={mockStats.moderation.pending} sub="À traiter" color="amber" icon={icons.flag} />
      <StatCard title="Urgents" value={mockStats.moderation.flagged} sub="Priorité haute" color="red" icon={icons.shield} />
      <StatCard title="Résolus aujourd'hui" value={mockStats.moderation.resolved_today} sub="Ce jour" color="emerald" icon={icons.check} />
    </div>

    <div className="space-y-3">
      {mockModeration.map(item => (
        <div key={item.id} className={`bg-slate-800/50 border rounded-xl p-5 ${
          item.severity === "high" ? "border-red-500/30" :
          item.severity === "medium" ? "border-amber-500/30" : "border-slate-700/50"
        }`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge color={item.severity === "high" ? "red" : item.severity === "medium" ? "yellow" : "gray"}>
                  {item.severity === "high" ? "🔴 Urgent" : item.severity === "medium" ? "🟡 Moyen" : "🟢 Faible"}
                </Badge>
                <Badge color="blue">{item.type}</Badge>
              </div>
              <p className="text-sm text-white font-medium mb-1">{item.title}</p>
              <p className="text-xs text-slate-400">
                Signalé par <span className="text-slate-300">{item.reporter}</span> · {item.reason} · {new Date(item.created_at).toLocaleString('fr-FR')}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-medium transition-colors">
                <Icon path={icons.check} size={12} />
                Approuver
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 text-red-400 rounded-lg text-xs font-medium transition-colors">
                <Icon path={icons.x} size={12} />
                Rejeter
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// CATÉGORIES
const CategoriesPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [newCat, setNewCat] = useState({ name: "", slug: "", description: "", color_hex: "#3B82F6" });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">Gestion des catégories</h2>
          <p className="text-sm text-slate-400">{mockCategories.length} catégories actives</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Icon path={icons.plus} size={16} />
          Nouvelle catégorie
        </button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="bg-slate-800/50 border border-blue-500/30 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Créer une catégorie</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Nom", key: "name", placeholder: "Sécurité" },
              { label: "Slug", key: "slug", placeholder: "securite" },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="block text-xs text-slate-400 mb-1.5">{label}</label>
                <input
                  placeholder={placeholder}
                  value={newCat[key]}
                  onChange={e => setNewCat(p => ({ ...p, [key]: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            ))}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Description</label>
              <input
                placeholder="Description courte"
                value={newCat.description}
                onChange={e => setNewCat(p => ({ ...p, description: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Couleur</label>
              <div className="flex gap-2">
                <input type="color" value={newCat.color_hex} onChange={e => setNewCat(p => ({ ...p, color_hex: e.target.value }))} className="w-10 h-9 rounded bg-slate-700 border border-slate-600 cursor-pointer" />
                <input value={newCat.color_hex} onChange={e => setNewCat(p => ({ ...p, color_hex: e.target.value }))} className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500" />
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm transition-colors">Annuler</button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors">Créer</button>
          </div>
        </div>
      )}

      {/* Grille catégories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockCategories.map(cat => (
          <div key={cat.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:border-slate-600 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color_hex }} />
                <div>
                  <h3 className="text-sm font-semibold text-white">{cat.name}</h3>
                  <p className="text-xs text-slate-500">/{cat.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {cat.is_system && <Badge color="blue">Système</Badge>}
                <button className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-blue-400 transition-colors">
                  <Icon path={icons.edit} size={14} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-700/40">
              <div>
                <p className="text-xs text-slate-500">Total claims</p>
                <p className="text-lg font-bold text-white">{cat.total_claims}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Confiance moy.</p>
                <TrustBar score={cat.avg_confidence} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ANALYTICS
const AnalyticsPage = () => {
  const byCategory = mockCategories.map(c => ({ name: c.name, value: c.total_claims, color: c.color_hex }));
  const maxClaims = Math.max(...byCategory.map(c => c.value));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Analytiques</h2>
        <p className="text-sm text-slate-400">Performance globale de la plateforme</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Utilisateurs actifs" value={mockStats.users.active.toLocaleString()} sub="Sur 30 jours" color="blue" icon={icons.users} />
        <StatCard title="Prédictions actives" value={mockStats.predictions.active} sub="En cours" color="purple" icon={icons.activity} />
        <StatCard title="Précision globale" value={`${mockStats.predictions.accuracy}%`} sub="Moyenne plateforme" color="emerald" icon={icons.trending} />
        <StatCard title="Sessions IA" value="2,847" sub="Ce mois" color="amber" icon={icons.activity} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Claims par catégorie */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-5">Claims par catégorie</h3>
          <div className="space-y-3">
            {byCategory.sort((a, b) => b.value - a.value).map(({ name, value, color }) => (
              <div key={name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">{name}</span>
                  <span className="text-slate-400">{value}</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${(value / maxClaims) * 100}%`, backgroundColor: color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Métriques utilisateurs */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-5">Métriques utilisateurs</h3>
          <div className="space-y-4">
            {[
              { label: "Taux d'activation", value: 71.9, color: "#3b82f6" },
              { label: "Taux de vérification", value: 58.3, color: "#8b5cf6" },
              { label: "Engagement préd.", value: 43.2, color: "#10b981" },
              { label: "Rétention 30j", value: 67.8, color: "#f59e0b" },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300">{label}</span>
                  <span className="text-white font-semibold">{value}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// RÔLES
const RolesPage = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-semibold text-white mb-1">Gestion des rôles</h2>
      <p className="text-sm text-slate-400">Permissions et hiérarchie des accès</p>
    </div>

    <div className="space-y-3">
      {Object.entries(roleConfig).map(([role, { label, color }]) => {
        const perms = {
          user: ["Lire", "Voter", "Commenter"],
          verified_user: ["Lire", "Voter", "Commenter", "Soumettre claims"],
          contributor: ["Lire", "Voter", "Commenter", "Soumettre claims", "Soumettre preuves"],
          moderator: ["Lire", "Voter", "Commenter", "Soumettre claims", "Modérer contenus", "Éditer métadonnées"],
          editor: ["Lire", "Voter", "Modérer contenus", "Gérer catégories"],
          admin: ["Accès complet", "Gérer utilisateurs", "Paramètres système"],
          super_admin: ["Accès total", "Gestion admins", "Configuration avancée"],
        };
        const count = mockUsers.filter(u => u.role === role).length;
        return (
          <div key={role} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:border-slate-600 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Badge color={color}>{label}</Badge>
                <span className="text-xs text-slate-500">{count} utilisateur{count > 1 ? "s" : ""}</span>
              </div>
              <button className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-blue-400 transition-colors">
                <Icon path={icons.edit} size={14} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {(perms[role] || []).map(p => (
                <span key={p} className="text-xs px-2 py-1 bg-slate-700/60 text-slate-300 rounded-md">{p}</span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// LOGS
const LogsPage = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-semibold text-white mb-1">Logs système</h2>
      <p className="text-sm text-slate-400">Historique complet des activités</p>
    </div>

    <div className="relative">
      <Icon path={icons.search} size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
      <input placeholder="Filtrer les logs..." className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
    </div>

    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
      <div className="divide-y divide-slate-700/30">
        {mockLogs.map(log => (
          <div key={log.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-700/20 transition-colors">
            <div className="w-2 h-2 rounded-full shrink-0" style={{
              backgroundColor: log.event_type.includes("suspended") ? "#ef4444" :
                log.event_type.includes("approved") ? "#10b981" :
                log.event_type.includes("created") ? "#3b82f6" : "#6b7280"
            }} />
            <div className="w-36 shrink-0">
              <span className="text-xs font-mono text-slate-500">
                {new Date(log.created_at).toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-300 truncate">{log.description}</p>
            </div>
            <span className="text-xs text-slate-500 shrink-0">{log.username}</span>
            <Badge color="gray">{log.event_type.replace(/_/g, " ")}</Badge>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// PARAMÈTRES
const SettingsPage = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-semibold text-white mb-1">Configuration</h2>
      <p className="text-sm text-slate-400">Paramètres globaux de la plateforme</p>
    </div>

    {[
      {
        title: "Général",
        fields: [
          { label: "Nom de la plateforme", value: "EXPAND", type: "text" },
          { label: "Email de contact", value: "admin@expand.ht", type: "email" },
          { label: "Langue par défaut", value: "fr", type: "select", options: ["fr", "ht", "en"] },
        ]
      },
      {
        title: "Sécurité",
        fields: [
          { label: "Score de confiance minimum (vote)", value: "0.3", type: "number" },
          { label: "Tentatives login max", value: "5", type: "number" },
          { label: "Durée session (minutes)", value: "60", type: "number" },
        ]
      },
      {
        title: "IA & Modération",
        fields: [
          { label: "Seuil confiance IA (auto-approuver)", value: "0.9", type: "number" },
          { label: "Modèle IA par défaut", value: "claude-3-sonnet", type: "text" },
        ]
      }
    ].map(section => (
      <div key={section.title} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">{section.title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {section.fields.map(f => (
            <div key={f.label}>
              <label className="block text-xs text-slate-400 mb-1.5">{f.label}</label>
              {f.type === "select" ? (
                <select defaultValue={f.value} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-blue-500">
                  {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input type={f.type} defaultValue={f.value} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500" />
              )}
            </div>
          ))}
        </div>
        <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors">
          Sauvegarder
        </button>
      </div>
    ))}
  </div>
);

// ============ LAYOUT PRINCIPAL ============
const navItems = [
  { id: "overview", label: "Vue d'ensemble", icon: icons.dashboard },
  { id: "users", label: "Utilisateurs", icon: icons.users, badge: mockStats.users.new_today },
  { id: "claims", label: "Claims", icon: icons.claims, badge: mockStats.claims.pending },
  { id: "moderation", label: "Modération", icon: icons.moderation, badge: mockStats.moderation.pending, urgent: true },
  { id: "categories", label: "Catégories", icon: icons.categories },
  { id: "analytics", label: "Analytiques", icon: icons.analytics },
  { id: "roles", label: "Rôles", icon: icons.roles },
  { id: "logs", label: "Logs système", icon: icons.logs },
  { id: "settings", label: "Configuration", icon: icons.settings },
];

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const pageComponents = {
    overview: <OverviewPage />,
    users: <UsersPage />,
    claims: <ClaimsPage />,
    moderation: <ModerationPage />,
    categories: <CategoriesPage />,
    analytics: <AnalyticsPage />,
    roles: <RolesPage />,
    logs: <LogsPage />,
    settings: <SettingsPage />,
  };

  const activeLabel = navItems.find(n => n.id === activePage)?.label;

  return (
    <div className="flex h-screen bg-slate-900 font-sans overflow-hidden" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      
      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? "w-60" : "w-16"} shrink-0 flex flex-col bg-slate-950 border-r border-slate-800 transition-all duration-200 overflow-hidden`}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0">
            <Icon path={icons.shield} size={16} className="text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <p className="text-sm font-bold text-white tracking-wide">EXPAND</p>
              <p className="text-xs text-slate-500">Administration</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                activePage === item.id
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
              title={!sidebarOpen ? item.label : undefined}
            >
              <Icon path={item.icon} size={18} className="shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                      item.urgent ? "bg-red-500/20 text-red-400" : "bg-slate-700 text-slate-400"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* Profil admin en bas */}
        <div className="border-t border-slate-800 p-3">
          <div className={`flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-800/60 cursor-pointer transition-colors`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 text-xs font-bold text-white">
              A
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Super Admin</p>
                <p className="text-xs text-slate-500 truncate">admin@expand.ht</p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button className="w-full mt-1 flex items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800/60 transition-colors">
              <Icon path={icons.logout} size={14} />
              Déconnexion
            </button>
          )}
        </div>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="shrink-0 flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <Icon path={icons.menu} size={18} />
            </button>
            <h1 className="text-sm font-semibold text-white">{activeLabel}</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Recherche globale */}
            <div className="relative hidden md:block">
              <Icon path={icons.search} size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                placeholder="Recherche globale..."
                className="pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-56"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
              <Icon path={icons.bell} size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white cursor-pointer">
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {pageComponents[activePage]}
        </main>
      </div>
    </div>
  );
}