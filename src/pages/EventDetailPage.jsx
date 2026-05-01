// ═══════════════════════════════════════════════════════════════
// EXPAND — Page Détail Événement
// Fichier : src/pages/EventDetailPage.jsx
//
// Page complète avec : scores IA, vote, preuves, chat IA,
// recherche web, carte géographique Haiti.
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from "react";

const API_BASE = "http://10.188.140.100:8000";

// ── UTILITAIRES ───────────────────────────────────────────────────
const getToken  = () => localStorage.getItem("access_token");
const authHeader= () => ({ Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" });

const STATUS_LABELS = {
  pending            : { label: "En attente",    color: "#F59E0B", bg: "#FEF3C7" },
  verified           : { label: "Vérifié",        color: "#10B981", bg: "#D1FAE5" },
  in_progress        : { label: "En cours",       color: "#3B82F6", bg: "#DBEAFE" },
  completed          : { label: "Complété",       color: "#22C55E", bg: "#DCFCE7" },
  partially_completed: { label: "Partiel",        color: "#8B5CF6", bg: "#EDE9FE" },
  failed             : { label: "Échoué",         color: "#EF4444", bg: "#FEE2E2" },
  cancelled          : { label: "Annulé",         color: "#6B7280", bg: "#F3F4F6" },
};

const DEPT_COORDS = {
  "Artibonite"   : [19.46, -72.68],
  "Centre"       : [19.10, -72.00],
  "Grand'Anse"   : [18.44, -74.12],
  "Nippes"       : [18.40, -73.42],
  "Nord"         : [19.76, -72.20],
  "Nord-Est"     : [19.55, -71.85],
  "Nord-Ouest"   : [19.83, -73.38],
  "Ouest"        : [18.54, -72.34],
  "Sud"          : [18.20, -73.75],
  "Sud-Est"      : [18.20, -72.33],
};

// ── COMPOSANT SCORE GAUGE ─────────────────────────────────────────
function ScoreGauge({ label, value, color, icon }) {
  const pct   = Math.min(Math.max(value || 0, 0), 100);
  const angle = (pct / 100) * 180;
  const r     = 40;
  const cx    = 55;
  const cy    = 55;

  const polarToCartesian = (deg) => {
    const rad = ((deg - 180) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const start = polarToCartesian(0);
  const end   = polarToCartesian(angle);
  const large = angle > 180 ? 1 : 0;

  return (
    <div style={{
      display:"flex", flexDirection:"column", alignItems:"center", gap:6,
      background:"#0F172A", borderRadius:12, padding:"16px 12px",
      border:"1px solid #1E293B", minWidth:110,
    }}>
      <svg width={110} height={70} viewBox="0 0 110 70">
        {/* Track */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke="#1E293B" strokeWidth={8} strokeLinecap="round"
        />
        {/* Fill */}
        {pct > 0 && (
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`}
            fill="none" stroke={color} strokeWidth={8} strokeLinecap="round"
          />
        )}
        {/* Value */}
        <text x={cx} y={cy + 4} textAnchor="middle" fill="#F8FAFC"
          fontSize={16} fontWeight="700" fontFamily="monospace">
          {Math.round(pct)}
        </text>
      </svg>
      <div style={{ fontSize:11, color:"#94A3B8", textAlign:"center", lineHeight:1.3 }}>
        {icon} {label}
      </div>
    </div>
  );
}

// ── COMPOSANT CARTE HAITI ─────────────────────────────────────────
function HaitiMap({ department }) {
  const depts = Object.keys(DEPT_COORDS);

  return (
    <div style={{
      background:"#0F172A", borderRadius:12, padding:16,
      border:"1px solid #1E293B", position:"relative",
    }}>
      <div style={{ fontSize:12, color:"#64748B", marginBottom:8, fontWeight:600 }}>
        📍 LOCALISATION
      </div>
      <svg viewBox="0 0 200 120" width="100%" style={{ maxHeight:140 }}>
        {/* Fond Haiti simplifié */}
        <ellipse cx="100" cy="60" rx="90" ry="45" fill="#1E293B" stroke="#334155" strokeWidth="1" />

        {/* Points départements */}
        {depts.map((dept) => {
          const [lat, lng] = DEPT_COORDS[dept];
          const x = ((lng + 74.5) / 3.0) * 180 + 10;
          const y = ((19.95 - lat) / 2.0) * 90 + 10;
          const isActive = department && dept.toLowerCase().includes(department.toLowerCase().split(" ")[0]);

          return (
            <g key={dept}>
              <circle cx={x} cy={y} r={isActive ? 7 : 3}
                fill={isActive ? "#EF4444" : "#334155"}
                stroke={isActive ? "#FCA5A5" : "#475569"}
                strokeWidth={isActive ? 2 : 1}
              />
              {isActive && (
                <>
                  <circle cx={x} cy={y} r={12} fill="none" stroke="#EF4444" strokeWidth="1" opacity="0.4">
                    <animate attributeName="r" values="7;14;7" dur="2s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite"/>
                  </circle>
                  <text x={x} y={y - 12} textAnchor="middle" fill="#FCA5A5" fontSize="6" fontWeight="600">
                    {dept}
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* Label */}
        <text x="100" y="108" textAnchor="middle" fill="#475569" fontSize="7">HAÏTI</text>
      </svg>

      <div style={{ fontSize:11, color:"#94A3B8", textAlign:"center", marginTop:4 }}>
        {department || "National"} · {department ? "Départemental" : "Portée nationale"}
      </div>
    </div>
  );
}

// ── COMPOSANT VOTE ────────────────────────────────────────────────
function VoteSection({ prediction, userVote, claimId, onVoteSuccess }) {
  const [selected,    setSelected]   = useState(userVote?.selected_option || null);
  const [confidence,  setConfidence] = useState(userVote?.confidence_level || 0.7);
  const [reasoning,   setReasoning]  = useState(userVote?.reasoning || "");
  const [loading,     setLoading]    = useState(false);
  const [msg,         setMsg]        = useState("");

  if (!prediction) {
    return (
      <div style={{
        background:"#0F172A", borderRadius:12, padding:20,
        border:"1px solid #1E293B", textAlign:"center", color:"#64748B",
      }}>
        <div style={{ fontSize:24, marginBottom:8 }}>🗳️</div>
        Aucune prédiction active pour ce claim.
      </div>
    );
  }

  const OPTIONS = [
    { value:"oui",      label:"OUI",       emoji:"✅", color:"#22C55E" },
    { value:"non",      label:"NON",       emoji:"❌", color:"#EF4444" },
    { value:"incertain",label:"INCERTAIN", emoji:"❓", color:"#F59E0B" },
  ];

  const handleVote = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/claims/${claimId}/vote`, {
        method : "POST",
        headers: authHeader(),
        body   : JSON.stringify({
          prediction_id   : prediction.id,
          selected_option : selected,
          confidence_level: confidence,
          reasoning       : reasoning,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("✅ Vote enregistré !");
        onVoteSuccess && onVoteSuccess();
      } else {
        setMsg(`❌ ${data.detail || "Erreur"}`);
      }
    } catch (e) {
      setMsg("❌ Erreur réseau");
    }
    setLoading(false);
  };

  return (
    <div style={{ background:"#0F172A", borderRadius:12, padding:20, border:"1px solid #1E293B" }}>
      <div style={{ fontSize:12, color:"#64748B", fontWeight:600, marginBottom:12 }}>
        🗳️ PRÉDICTION — {prediction.total_votes} votes
      </div>
      <div style={{ color:"#CBD5E1", marginBottom:16, fontSize:14, lineHeight:1.5 }}>
        {prediction.question}
      </div>

      {/* Résultats actuels */}
      <div style={{ marginBottom:16 }}>
        {OPTIONS.map(opt => {
          const data = prediction.vote_breakdown?.[opt.value];
          const pct  = data?.percent || 0;
          return (
            <div key={opt.value} style={{ marginBottom:6 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#94A3B8", marginBottom:2 }}>
                <span>{opt.emoji} {opt.label}</span>
                <span>{pct}% ({data?.count || 0})</span>
              </div>
              <div style={{ height:6, background:"#1E293B", borderRadius:3, overflow:"hidden" }}>
                <div style={{ width:`${pct}%`, height:"100%", background:opt.color, borderRadius:3, transition:"width 0.8s ease" }}/>
              </div>
            </div>
          );
        })}
      </div>

      {/* Boutons vote */}
      <div style={{ display:"flex", gap:8, marginBottom:12 }}>
        {OPTIONS.map(opt => (
          <button key={opt.value} onClick={() => setSelected(opt.value)} style={{
            flex:1, padding:"10px 4px", borderRadius:8, border:"2px solid",
            borderColor: selected === opt.value ? opt.color : "#1E293B",
            background : selected === opt.value ? opt.color + "22" : "#1E293B",
            color      : selected === opt.value ? opt.color : "#64748B",
            cursor:"pointer", fontSize:11, fontWeight:700, transition:"all 0.2s",
          }}>
            {opt.emoji}<br/>{opt.label}
          </button>
        ))}
      </div>

      {/* Confiance */}
      <div style={{ marginBottom:12 }}>
        <div style={{ fontSize:11, color:"#64748B", marginBottom:4 }}>
          Niveau de confiance : <span style={{ color:"#F8FAFC" }}>{Math.round(confidence * 100)}%</span>
        </div>
        <input type="range" min="0" max="1" step="0.05" value={confidence}
          onChange={e => setConfidence(parseFloat(e.target.value))}
          style={{ width:"100%", accentColor:"#3B82F6" }}
        />
      </div>

      {/* Justification */}
      <textarea value={reasoning} onChange={e => setReasoning(e.target.value)}
        placeholder="Justification (optionnel)..."
        style={{
          width:"100%", background:"#1E293B", border:"1px solid #334155",
          color:"#CBD5E1", borderRadius:8, padding:"8px 10px", fontSize:12,
          resize:"vertical", minHeight:60, marginBottom:12, boxSizing:"border-box",
        }}
      />

      <button onClick={handleVote} disabled={!selected || loading} style={{
        width:"100%", padding:"12px", borderRadius:8, border:"none",
        background: selected ? "#3B82F6" : "#1E293B",
        color: selected ? "#fff" : "#64748B",
        cursor: selected ? "pointer" : "not-allowed",
        fontWeight:700, fontSize:13, transition:"all 0.2s",
      }}>
        {loading ? "Envoi..." : userVote ? "Mettre à jour mon vote" : "Soumettre mon vote"}
      </button>

      {msg && (
        <div style={{ marginTop:8, fontSize:12, color:"#94A3B8", textAlign:"center" }}>
          {msg}
        </div>
      )}
    </div>
  );
}

// ── COMPOSANT PREUVES ─────────────────────────────────────────────
function EvidenceSection({ evidence, claimId, onNewEvidence }) {
  const [showForm,    setShowForm]    = useState(false);
  const [formData,    setFormData]    = useState({ title:"", url:"", description:"", source_type:"article" });
  const [loading,     setLoading]     = useState(false);
  const [msg,         setMsg]         = useState("");

  const SOURCE_TYPES = ["article","video","document","official_statement","social_media","report"];

  const SOURCE_ICONS = {
    article           :"📰",
    video             :"🎥",
    document          :"📄",
    official_statement:"🏛️",
    social_media      :"📱",
    report            :"📊",
    data_source       :"📈",
  };

  const CREDIBILITY_COLOR = (score) => {
    if (!score) return "#64748B";
    if (score >= 0.7) return "#22C55E";
    if (score >= 0.4) return "#F59E0B";
    return "#EF4444";
  };

  const handleSubmit = async () => {
    if (!formData.title) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/claims/${claimId}/evidence`, {
        method:"POST", headers:authHeader(),
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("✅ Preuve soumise — en attente de modération");
        setFormData({ title:"", url:"", description:"", source_type:"article" });
        setShowForm(false);
        onNewEvidence && onNewEvidence();
      } else {
        setMsg(`❌ ${data.detail || "Erreur"}`);
      }
    } catch { setMsg("❌ Erreur réseau"); }
    setLoading(false);
  };

  return (
    <div style={{ background:"#0F172A", borderRadius:12, padding:20, border:"1px solid #1E293B" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <div style={{ fontSize:12, color:"#64748B", fontWeight:600 }}>
          🔍 PREUVES ({evidence.length})
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{
          padding:"6px 12px", borderRadius:6, border:"1px solid #3B82F6",
          background:"transparent", color:"#3B82F6", cursor:"pointer", fontSize:11, fontWeight:600,
        }}>
          + Ajouter
        </button>
      </div>

      {/* Formulaire ajout */}
      {showForm && (
        <div style={{
          background:"#1E293B", borderRadius:8, padding:12, marginBottom:16,
          border:"1px solid #334155",
        }}>
          <input placeholder="Titre de la preuve *"
            value={formData.title}
            onChange={e => setFormData({...formData, title:e.target.value})}
            style={{
              width:"100%", background:"#0F172A", border:"1px solid #334155",
              color:"#CBD5E1", borderRadius:6, padding:"8px 10px", fontSize:12,
              marginBottom:8, boxSizing:"border-box",
            }}
          />
          <input placeholder="URL (optionnel)"
            value={formData.url}
            onChange={e => setFormData({...formData, url:e.target.value})}
            style={{
              width:"100%", background:"#0F172A", border:"1px solid #334155",
              color:"#CBD5E1", borderRadius:6, padding:"8px 10px", fontSize:12,
              marginBottom:8, boxSizing:"border-box",
            }}
          />
          <select value={formData.source_type}
            onChange={e => setFormData({...formData, source_type:e.target.value})}
            style={{
              width:"100%", background:"#0F172A", border:"1px solid #334155",
              color:"#CBD5E1", borderRadius:6, padding:"8px 10px", fontSize:12,
              marginBottom:8, boxSizing:"border-box",
            }}
          >
            {SOURCE_TYPES.map(t => (
              <option key={t} value={t}>{SOURCE_ICONS[t]} {t.replace("_"," ")}</option>
            ))}
          </select>
          <textarea placeholder="Description..."
            value={formData.description}
            onChange={e => setFormData({...formData, description:e.target.value})}
            style={{
              width:"100%", background:"#0F172A", border:"1px solid #334155",
              color:"#CBD5E1", borderRadius:6, padding:"8px 10px", fontSize:12,
              resize:"vertical", minHeight:50, marginBottom:8, boxSizing:"border-box",
            }}
          />
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={handleSubmit} disabled={loading} style={{
              flex:1, padding:"8px", borderRadius:6, border:"none",
              background:"#3B82F6", color:"#fff", cursor:"pointer", fontWeight:700, fontSize:12,
            }}>
              {loading ? "Envoi..." : "Soumettre"}
            </button>
            <button onClick={() => setShowForm(false)} style={{
              padding:"8px 12px", borderRadius:6, border:"1px solid #334155",
              background:"transparent", color:"#64748B", cursor:"pointer", fontSize:12,
            }}>
              Annuler
            </button>
          </div>
          {msg && <div style={{ marginTop:8, fontSize:11, color:"#94A3B8" }}>{msg}</div>}
        </div>
      )}

      {/* Liste preuves */}
      {evidence.length === 0 ? (
        <div style={{ textAlign:"center", color:"#475569", fontSize:13, padding:20 }}>
          Aucune preuve soumise. Soyez le premier !
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {evidence.map(e => (
            <div key={e.id} style={{
              background:"#1E293B", borderRadius:8, padding:12,
              border:"1px solid #334155", transition:"border-color 0.2s",
            }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
                <div style={{ fontSize:12, color:"#CBD5E1", fontWeight:600, flex:1 }}>
                  {SOURCE_ICONS[e.source_type]} {e.title}
                </div>
                {e.credibility_score && (
                  <div style={{
                    fontSize:10, fontWeight:700, color:CREDIBILITY_COLOR(e.credibility_score),
                    background:CREDIBILITY_COLOR(e.credibility_score) + "22",
                    padding:"2px 6px", borderRadius:4, marginLeft:8, whiteSpace:"nowrap",
                  }}>
                    {Math.round(e.credibility_score * 100)}% fiable
                  </div>
                )}
              </div>
              {e.description && (
                <div style={{ fontSize:11, color:"#64748B", marginBottom:4, lineHeight:1.4 }}>
                  {e.description.substring(0, 100)}{e.description.length > 100 ? "..." : ""}
                </div>
              )}
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#475569" }}>
                <span>par {e.submitted_by}</span>
                {e.url && (
                  <a href={e.url} target="_blank" rel="noopener noreferrer"
                    style={{ color:"#3B82F6", textDecoration:"none" }}>
                    Voir la source ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── COMPOSANT CHAT IA ─────────────────────────────────────────────
function ChatSection({ claimId }) {
  const [messages, setMessages] = useState([
    { role:"assistant", content:"Bonjour ! Je suis l'assistant EXPAND. Posez-moi des questions sur cet événement — je peux analyser les preuves, chercher des infos récentes ou expliquer les scores." }
  ]);
  const [input,    setInput]   = useState("");
  const [loading,  setLoading] = useState(false);
  const bottomRef  = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role:"user", content:userMsg }]);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/v1/ai/chat`, {
        method:"POST", headers:authHeader(),
        body: JSON.stringify({ message:userMsg, claim_id:claimId }),
      });
      const data = await res.json();
      const reply = data.response || data.detail || "Je n'ai pas pu répondre.";
      const provider = data.provider ? ` [${data.provider}]` : "";
      setMessages(prev => [...prev, { role:"assistant", content:reply, provider }]);
    } catch {
      setMessages(prev => [...prev, { role:"assistant", content:"❌ Erreur de connexion." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{
      background:"#0F172A", borderRadius:12, border:"1px solid #1E293B",
      display:"flex", flexDirection:"column", height:380,
    }}>
      <div style={{ padding:"12px 16px", borderBottom:"1px solid #1E293B", fontSize:12, color:"#64748B", fontWeight:600 }}>
        🤖 ASSISTANT IA — Posez vos questions
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto", padding:12, display:"flex", flexDirection:"column", gap:8 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display:"flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
          }}>
            <div style={{
              maxWidth:"85%", padding:"8px 12px", borderRadius:10, fontSize:12, lineHeight:1.5,
              background  : msg.role === "user" ? "#3B82F6" : "#1E293B",
              color       : msg.role === "user" ? "#fff" : "#CBD5E1",
              borderRadius: msg.role === "user" ? "10px 10px 2px 10px" : "10px 10px 10px 2px",
            }}>
              <div style={{ whiteSpace:"pre-wrap" }}>{msg.content}</div>
              {msg.provider && (
                <div style={{ fontSize:9, color:"#64748B", marginTop:4 }}>{msg.provider}</div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display:"flex", justifyContent:"flex-start" }}>
            <div style={{ background:"#1E293B", padding:"8px 12px", borderRadius:10, color:"#64748B", fontSize:12 }}>
              ⏳ Analyse en cours...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding:12, borderTop:"1px solid #1E293B", display:"flex", gap:8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Posez une question..."
          style={{
            flex:1, background:"#1E293B", border:"1px solid #334155",
            color:"#CBD5E1", borderRadius:8, padding:"8px 12px", fontSize:12,
          }}
        />
        <button onClick={send} disabled={!input.trim() || loading} style={{
          padding:"8px 14px", borderRadius:8, border:"none",
          background: input.trim() ? "#3B82F6" : "#1E293B",
          color: input.trim() ? "#fff" : "#64748B",
          cursor: input.trim() ? "pointer" : "not-allowed",
          fontWeight:700, fontSize:12,
        }}>
          ↑
        </button>
      </div>
    </div>
  );
}

// ── COMPOSANT RECHERCHE WEB ───────────────────────────────────────
function WebSearchSection({ claimId }) {
  const [results,  setResults]  = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [searched, setSearched] = useState(false);

  const search = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/ai/claims/${claimId}/web-search`, {
        method:"POST", headers:authHeader(),
      });
      const data = await res.json();
      setResults(data.results);
      setArticles(data.articles || []);
      setSearched(true);
    } catch {
      setResults("❌ Erreur lors de la recherche.");
      setSearched(true);
    }
    setLoading(false);
  };

  return (
    <div style={{ background:"#0F172A", borderRadius:12, padding:20, border:"1px solid #1E293B" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <div style={{ fontSize:12, color:"#64748B", fontWeight:600 }}>
          🌐 ACTUALITÉS RÉCENTES
        </div>
        <button onClick={search} disabled={loading} style={{
          padding:"6px 14px", borderRadius:6, border:"none",
          background: loading ? "#1E293B" : "#0EA5E9",
          color: loading ? "#64748B" : "#fff",
          cursor: loading ? "not-allowed" : "pointer",
          fontSize:11, fontWeight:700,
        }}>
          {loading ? "Recherche..." : searched ? "🔄 Actualiser" : "🔍 Rechercher"}
        </button>
      </div>

      {!searched && !loading && (
        <div style={{ textAlign:"center", color:"#475569", fontSize:12, padding:20 }}>
          Cliquez pour chercher les dernières actualités liées à ce claim.
        </div>
      )}

      {loading && (
        <div style={{ textAlign:"center", color:"#64748B", fontSize:12, padding:20 }}>
          ⏳ Recherche dans les médias haïtiens...
        </div>
      )}

      {articles.length > 0 && (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {articles.map((a, i) => (
            <div key={i} style={{
              background:"#1E293B", borderRadius:8, padding:10,
              border:"1px solid #334155",
            }}>
              <div style={{ fontSize:12, color:"#CBD5E1", fontWeight:600, marginBottom:4, lineHeight:1.4 }}>
                {a.title}
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#64748B" }}>
                <span>📰 {a.source}</span>
                <div style={{ display:"flex", gap:8 }}>
                  <span>{a.pub_date ? new Date(a.pub_date).toLocaleDateString("fr-FR") : ""}</span>
                  {a.link && (
                    <a href={a.link} target="_blank" rel="noopener noreferrer"
                      style={{ color:"#0EA5E9", textDecoration:"none" }}>
                      Lire ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {searched && articles.length === 0 && !loading && (
        <div style={{ color:"#475569", fontSize:12, padding:10 }}>
          Aucun article trouvé. Réessayez plus tard.
        </div>
      )}
    </div>
  );
}

// ── PAGE PRINCIPALE ───────────────────────────────────────────────
export default function EventDetailPage({ claimId = 60 }) {
  const [data,      setData]      = useState(null);
  const [scores,    setScores]    = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [activeTab, setActiveTab] = useState("vote");

  const loadData = async () => {
    try {
      const [detailRes, scoresRes] = await Promise.all([
        fetch(`${API_BASE}/api/v1/claims/${claimId}/detail`, { headers:authHeader() }),
        fetch(`${API_BASE}/api/v1/claims/${claimId}/scores`),
      ]);
      if (!detailRes.ok) throw new Error("Claim introuvable");
      const detail = await detailRes.json();
      const score  = await scoresRes.json();
      setData(detail);
      setScores(score);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [claimId]);

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#020617", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ color:"#64748B", fontSize:14 }}>⏳ Chargement...</div>
    </div>
  );

  if (error) return (
    <div style={{ minHeight:"100vh", background:"#020617", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ color:"#EF4444", fontSize:14 }}>❌ {error}</div>
    </div>
  );

  const { claim, evidence, prediction, user_vote } = data;
  const statusInfo = STATUS_LABELS[claim.status] || STATUS_LABELS.pending;

  const TABS = [
    { id:"vote",    label:"🗳️ Vote" },
    { id:"preuves", label:"🔍 Preuves" },
    { id:"chat",    label:"🤖 Chat IA" },
    { id:"web",     label:"🌐 Actualités" },
  ];

  return (
    <div style={{
      minHeight:"100vh",
      background:"#020617",
      color:"#F8FAFC",
      fontFamily:"'DM Sans', 'Segoe UI', sans-serif",
    }}>
      {/* Header barre */}
      <div style={{
        background:"#0A0F1E",
        borderBottom:"1px solid #1E293B",
        padding:"12px 20px",
        display:"flex", alignItems:"center", gap:12,
      }}>
        <div style={{
          fontSize:13, fontWeight:800, letterSpacing:2,
          color:"#3B82F6",
        }}>
          EXPAND
        </div>
        <div style={{ color:"#334155", fontSize:12 }}>›</div>
        <div style={{ color:"#64748B", fontSize:12 }}>Claims</div>
        <div style={{ color:"#334155", fontSize:12 }}>›</div>
        <div style={{ color:"#94A3B8", fontSize:12 }}>#{claim.id}</div>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"20px 16px" }}>

        {/* ── HEADER CLAIM ── */}
        <div style={{
          background:"linear-gradient(135deg, #0F172A 0%, #0A1628 100%)",
          borderRadius:16, padding:24, marginBottom:20,
          border:"1px solid #1E293B",
          position:"relative", overflow:"hidden",
        }}>
          {/* Accent couleur catégorie */}
          <div style={{
            position:"absolute", top:0, left:0, right:0, height:3,
            background:`linear-gradient(90deg, ${claim.category_color || "#3B82F6"}, transparent)`,
          }}/>

          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
            <div style={{ flex:1, minWidth:250 }}>
              {/* Badges */}
              <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
                <span style={{
                  padding:"3px 10px", borderRadius:20, fontSize:10, fontWeight:700,
                  background: statusInfo.bg, color: statusInfo.color,
                }}>
                  {statusInfo.label}
                </span>
                {claim.category && (
                  <span style={{
                    padding:"3px 10px", borderRadius:20, fontSize:10, fontWeight:700,
                    background: (claim.category_color || "#3B82F6") + "22",
                    color: claim.category_color || "#3B82F6",
                  }}>
                    {claim.category}
                  </span>
                )}
                {claim.is_controversial && (
                  <span style={{
                    padding:"3px 10px", borderRadius:20, fontSize:10, fontWeight:700,
                    background:"#FEF3C7", color:"#D97706",
                  }}>
                    ⚡ Controversé
                  </span>
                )}
              </div>

              {/* Titre */}
              <h1 style={{
                fontSize:20, fontWeight:800, lineHeight:1.3,
                color:"#F8FAFC", margin:"0 0 12px 0",
              }}>
                {claim.title}
              </h1>

              {/* Claimant */}
              <div style={{ fontSize:12, color:"#64748B", marginBottom:8 }}>
                🏛️ <span style={{ color:"#94A3B8" }}>{claim.claimant}</span>
                {claim.claimant_type && <span style={{ color:"#475569" }}> · {claim.claimant_type}</span>}
              </div>

              {/* Description */}
              <p style={{
                fontSize:13, color:"#94A3B8", lineHeight:1.6,
                margin:"0 0 16px 0", maxWidth:600,
              }}>
                {claim.short_description || claim.description?.substring(0, 200)}
                {claim.description?.length > 200 && "..."}
              </p>

              {/* Méta */}
              <div style={{ display:"flex", gap:16, fontSize:11, color:"#475569", flexWrap:"wrap" }}>
                {claim.claim_date && (
                  <span>📅 {new Date(claim.claim_date).toLocaleDateString("fr-FR")}</span>
                )}
                {claim.target_date && (
                  <span>🎯 Échéance : {new Date(claim.target_date).toLocaleDateString("fr-FR")}</span>
                )}
                {claim.department && <span>📍 {claim.department}</span>}
                {claim.tags?.length > 0 && (
                  <span>🏷️ {claim.tags.slice(0,3).join(", ")}</span>
                )}
              </div>
            </div>

            {/* Scores */}
            {scores && (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
                {/* Score composite */}
                <div style={{
                  background:"#0A0F1E", borderRadius:12, padding:"16px 24px",
                  border:`2px solid ${scores.verdict_color}33`, textAlign:"center",
                }}>
                  <div style={{ fontSize:36, fontWeight:900, color:scores.verdict_color, lineHeight:1 }}>
                    {Math.round(scores.composite)}
                  </div>
                  <div style={{ fontSize:10, color:scores.verdict_color, fontWeight:700, marginTop:2 }}>
                    {scores.verdict}
                  </div>
                  <div style={{ fontSize:9, color:"#475569", marginTop:4 }}>SCORE COMPOSITE</div>
                </div>

                {/* Jauges */}
                <div style={{ display:"flex", gap:8 }}>
                  <ScoreGauge label="Score IA"       value={scores.ai_score}    color="#8B5CF6" icon="🤖" />
                  <ScoreGauge label="Communauté"     value={scores.crowd_score} color="#0EA5E9" icon="👥" />
                  <ScoreGauge label="Vérification"   value={scores.verif_score} color="#22C55E" icon="✅" />
                </div>

                {/* Barre progression */}
                {scores.progress > 0 && (
                  <div style={{ width:"100%", minWidth:200 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#64748B", marginBottom:4 }}>
                      <span>Progression</span>
                      <span style={{ color:"#22C55E", fontWeight:700 }}>{scores.progress}%</span>
                    </div>
                    <div style={{ height:6, background:"#1E293B", borderRadius:3 }}>
                      <div style={{
                        width:`${scores.progress}%`, height:"100%",
                        background:"linear-gradient(90deg, #22C55E, #86EFAC)",
                        borderRadius:3, transition:"width 1s ease",
                      }}/>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── LAYOUT 2 COLONNES ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:16, alignItems:"start" }}>

          {/* Colonne gauche — Tabs */}
          <div>
            {/* Onglets */}
            <div style={{
              display:"flex", gap:4, marginBottom:16,
              background:"#0F172A", borderRadius:10, padding:4,
              border:"1px solid #1E293B",
            }}>
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                  flex:1, padding:"8px 4px", borderRadius:7, border:"none",
                  background  : activeTab === tab.id ? "#1E293B" : "transparent",
                  color       : activeTab === tab.id ? "#F8FAFC" : "#64748B",
                  cursor:"pointer", fontSize:11, fontWeight: activeTab === tab.id ? 700 : 400,
                  transition:"all 0.2s",
                }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Contenu onglet */}
            {activeTab === "vote" && (
              <VoteSection
                prediction   = {prediction}
                userVote     = {user_vote}
                claimId      = {claimId}
                onVoteSuccess= {loadData}
              />
            )}
            {activeTab === "preuves" && (
              <EvidenceSection
                evidence     = {evidence}
                claimId      = {claimId}
                onNewEvidence= {loadData}
              />
            )}
            {activeTab === "chat" && <ChatSection claimId={claimId} />}
            {activeTab === "web"  && <WebSearchSection claimId={claimId} />}
          </div>

          {/* Colonne droite — Carte + infos */}
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>

            {/* Carte Haiti */}
            <HaitiMap department={claim.department} />

            {/* Infos quantitatives */}
            {(claim.target_value || claim.current_value) && (
              <div style={{
                background:"#0F172A", borderRadius:12, padding:16,
                border:"1px solid #1E293B",
              }}>
                <div style={{ fontSize:12, color:"#64748B", fontWeight:600, marginBottom:12 }}>
                  📊 DONNÉES CHIFFRÉES
                </div>
                {claim.target_value && (
                  <div style={{ marginBottom:8 }}>
                    <div style={{ fontSize:11, color:"#475569", marginBottom:2 }}>Objectif</div>
                    <div style={{ fontSize:18, fontWeight:800, color:"#F8FAFC" }}>
                      {claim.target_value.toLocaleString()} <span style={{ fontSize:12, color:"#64748B" }}>{claim.unit}</span>
                    </div>
                  </div>
                )}
                {claim.current_value && (
                  <div>
                    <div style={{ fontSize:11, color:"#475569", marginBottom:2 }}>Actuel</div>
                    <div style={{ fontSize:18, fontWeight:800, color:"#22C55E" }}>
                      {claim.current_value.toLocaleString()} <span style={{ fontSize:12, color:"#64748B" }}>{claim.unit}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Source */}
            {claim.source_url && (
              <div style={{
                background:"#0F172A", borderRadius:12, padding:16,
                border:"1px solid #1E293B",
              }}>
                <div style={{ fontSize:12, color:"#64748B", fontWeight:600, marginBottom:8 }}>
                  🔗 SOURCE OFFICIELLE
                </div>
                <a href={claim.source_url} target="_blank" rel="noopener noreferrer"
                  style={{
                    color:"#3B82F6", fontSize:12, textDecoration:"none",
                    wordBreak:"break-all", lineHeight:1.4,
                  }}>
                  {claim.source_url.substring(0, 60)}{claim.source_url.length > 60 ? "..." : ""} ↗
                </a>
              </div>
            )}

            {/* Stats globales */}
            <div style={{
              background:"#0F172A", borderRadius:12, padding:16,
              border:"1px solid #1E293B",
            }}>
              <div style={{ fontSize:12, color:"#64748B", fontWeight:600, marginBottom:12 }}>
                📈 STATISTIQUES
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {[
                  { label:"Preuves",      value: data.total_evidence,            color:"#8B5CF6" },
                  { label:"Votes",        value: prediction?.total_votes || 0,   color:"#0EA5E9" },
                  { label:"Scope",        value: claim.geographic_scope || "—",  color:"#22C55E" },
                  { label:"Version",      value: `v${claim.version || 1}`,        color:"#F59E0B" },
                ].map(stat => (
                  <div key={stat.label} style={{
                    background:"#1E293B", borderRadius:8, padding:"10px 8px", textAlign:"center",
                  }}>
                    <div style={{ fontSize:16, fontWeight:800, color:stat.color }}>{stat.value}</div>
                    <div style={{ fontSize:10, color:"#475569", marginTop:2 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}