// ═══════════════════════════════════════════════════════════════
// EXPAND — AdminDashboard.jsx
// Design : neutre, minimal — style Perplexity / Claude / Grok
// Connecté aux vrais endpoints backend
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react';

const API = 'http://localhost:8000';
const tok = () => localStorage.getItem('access_token') || sessionStorage.getItem('access_token') || '';
const hdr = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${tok()}` });

async function apiFetch(path, opts = {}) {
  try {
    const r = await fetch(API + path, { headers: hdr(), ...opts });
    if (!r.ok) throw new Error(`${r.status}`);
    return await r.json();
  } catch (e) {
    console.warn('[Admin API]', path, e.message);
    return null;
  }
}

const T = {
  bg:'#FAFAFA', surface:'#FFFFFF', surfaceAlt:'#F4F4F5',
  border:'#E4E4E7', borderSub:'#F0F0F1',
  text:'#09090B', textSub:'#52525B', textMuted:'#A1A1AA',
  accent:'#18181B', accentSoft:'#F4F4F5',
  blue:'#2563EB', blueSoft:'#EFF6FF',
  green:'#16A34A', greenSoft:'#F0FDF4',
  red:'#DC2626', redSoft:'#FEF2F2',
  amber:'#D97706', amberSoft:'#FFFBEB',
  purple:'#7C3AED', purpleSoft:'#F5F3FF',
};

const FONT = "system-ui,-apple-system,'Segoe UI',sans-serif";

const Icon = ({ path, size=16, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {[].concat(path).map((d,i)=><path key={i} d={d}/>)}
  </svg>
);

const IC = {
  grid  :'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  file  :['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z','M14 2v6h6','M16 13H8'],
  shield:'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  tag   :['M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z','M7 7h.01'],
  chart :'M18 20V10M12 20V4M6 20v-6',
  cog   :['M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z','M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z'],
  logout:['M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4','M16 17l5-5-5-5','M21 12H9'],
  refresh:['M23 4v6h-6','M1 20v-6h6','M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15'],
  search:'M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0',
  plus  :'M12 5v14M5 12h14',
  check :'M20 6L9 17l-5-5',
  x     :'M18 6L6 18M6 6l12 12',
  edit  :['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7','M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'],
  eye   :['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z','M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
  menu  :'M3 12h18M3 6h18M3 18h18',
  zap   :'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  activity:'M22 12h-4l-3 9L9 3l-3 9H2',
};

const Chip = ({ children, color=T.textMuted, bg=T.surfaceAlt }) => (
  <span style={{ display:'inline-flex',alignItems:'center',padding:'2px 8px',borderRadius:99,fontSize:11,fontWeight:600,background:bg,color,whiteSpace:'nowrap',border:`1px solid ${color}22` }}>
    {children}
  </span>
);

const Bar = ({ value, max, color=T.blue }) => (
  <div style={{ height:4,borderRadius:99,background:T.borderSub,overflow:'hidden' }}>
    <div style={{ height:'100%',borderRadius:99,background:color,width:`${Math.min((value/Math.max(max,1))*100,100)}%`,transition:'width .5s' }} />
  </div>
);

const Spin = () => (
  <div style={{ width:16,height:16,border:`2px solid ${T.border}`,borderTopColor:T.blue,borderRadius:'50%',animation:'spin .7s linear infinite',flexShrink:0 }} />
);

const statusColor = s => ({ verified:T.green,pending:T.amber,in_progress:T.blue,completed:T.green,failed:T.red }[s]||T.textMuted);
const statusLabel = s => ({ verified:'Vérifié',pending:'Attente',in_progress:'En cours',completed:'Complété',failed:'Échoué',cancelled:'Annulé' }[s]||s||'—');

// PAGE OVERVIEW
const PageOverview = ({ data }) => {
  const { stats, claims, categories } = data;
  const cs = stats?.claims || {};
  const topCats = [...(categories||[])].slice(0,6);
  const maxC = Math.max(...topCats.map(c=>c.total_claims||0),1);

  return (
    <div style={{ display:'flex',flexDirection:'column',gap:18 }}>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(155px,1fr))',gap:12 }}>
        {[
          { l:'Claims',       v:cs.total??'—',   sub:'enregistrés',        c:T.text,   ic:IC.file     },
          { l:'En attente',   v:cs.pending??'—', sub:'à valider',           c:T.amber,  ic:IC.shield   },
          { l:'Vérifiés',     v:cs.verified??'—',sub:'approuvés',           c:T.green,  ic:IC.check    },
          { l:'Catégories',   v:(categories||[]).length, sub:'actives',     c:T.blue,   ic:IC.tag      },
          { l:'Prédictions',  v:stats?.predictions?.total??'—', sub:`${stats?.predictions?.accuracy??0}% précision`, c:T.purple, ic:IC.activity },
          { l:'Sessions IA',  v:stats?.ai_sessions?.today??'—', sub:'aujourd\'hui', c:T.text, ic:IC.zap },
        ].map(({l,v,sub,c,ic}) => (
          <div key={l} style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:'14px 16px' }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8 }}>
              <span style={{ fontSize:10,color:T.textMuted,fontWeight:500,textTransform:'uppercase',letterSpacing:'.06em' }}>{l}</span>
              <Icon path={ic} size={13} color={T.textMuted} />
            </div>
            <div style={{ fontSize:24,fontWeight:800,color:c,letterSpacing:'-0.02em',lineHeight:1 }}>{v}</div>
            <div style={{ fontSize:10,color:T.textMuted,marginTop:4 }}>{sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:16 }}>
        <div style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,overflow:'hidden' }}>
          <div style={{ padding:'13px 16px',borderBottom:`1px solid ${T.border}`,display:'flex',justifyContent:'space-between',alignItems:'center' }}>
            <span style={{ fontSize:13,fontWeight:700,color:T.text }}>Claims récents</span>
            <Chip>{(claims||[]).length}</Chip>
          </div>
          {(claims||[]).slice(0,7).map((c,i) => (
            <div key={c.id} style={{ padding:'10px 16px',borderBottom:i<6?`1px solid ${T.borderSub}`:'none',display:'flex',alignItems:'center',gap:10 }}>
              <div style={{ width:6,height:6,borderRadius:'50%',background:statusColor(c.status),flexShrink:0 }} />
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ fontSize:12,color:T.text,fontWeight:500,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{c.title}</div>
                <div style={{ fontSize:10,color:T.textMuted,marginTop:1 }}>{c.category||'—'}</div>
              </div>
              <Chip color={statusColor(c.status)} bg={statusColor(c.status)+'14'}>{statusLabel(c.status)}</Chip>
            </div>
          ))}
          {(!claims||claims.length===0) && <div style={{ padding:24,textAlign:'center',fontSize:12,color:T.textMuted }}>Aucun claim</div>}
        </div>

        <div style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,overflow:'hidden' }}>
          <div style={{ padding:'13px 16px',borderBottom:`1px solid ${T.border}` }}>
            <span style={{ fontSize:13,fontWeight:700,color:T.text }}>Catégories</span>
          </div>
          <div style={{ padding:'14px 16px',display:'flex',flexDirection:'column',gap:13 }}>
            {topCats.map(cat => (
              <div key={cat.id}>
                <div style={{ display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:5 }}>
                  <span style={{ color:T.textSub,fontWeight:500 }}>{cat.name}</span>
                  <span style={{ color:T.text,fontWeight:700 }}>{cat.total_claims||0}</span>
                </div>
                <Bar value={cat.total_claims||0} max={maxC} />
              </div>
            ))}
            {topCats.length===0 && <div style={{ fontSize:12,color:T.textMuted,textAlign:'center',padding:'12px 0' }}>Aucune catégorie</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

// PAGE CLAIMS
const PageClaims = ({ data, onRefresh }) => {
  const { claims } = data;
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = (claims||[]).filter(c =>
    (filter==='all'||c.status===filter) &&
    (!search||c.title?.toLowerCase().includes(search.toLowerCase()))
  );

  const approve = async id => {
    await apiFetch(`/api/v1/claims/${id}`, { method:'PATCH', body:JSON.stringify({ status:'verified' }) });
    onRefresh();
  };

  return (
    <div style={{ display:'flex',flexDirection:'column',gap:16 }}>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:10 }}>
        <div>
          <h2 style={{ fontSize:18,fontWeight:800,color:T.text,margin:0 }}>Claims & Engagements</h2>
          <div style={{ fontSize:12,color:T.textMuted,marginTop:2 }}>{(claims||[]).length} claims enregistrés</div>
        </div>
        <button onClick={onRefresh} style={{ display:'flex',alignItems:'center',gap:6,padding:'8px 14px',borderRadius:8,border:`1px solid ${T.border}`,background:T.surface,color:T.textSub,cursor:'pointer',fontSize:12,fontWeight:500 }}>
          <Icon path={IC.refresh} size={13}/>Actualiser
        </button>
      </div>

      <div style={{ display:'flex',gap:6,flexWrap:'wrap',alignItems:'center' }}>
        <div style={{ position:'relative' }}>
          <div style={{ position:'absolute',left:9,top:'50%',transform:'translateY(-50%)',color:T.textMuted,pointerEvents:'none' }}>
            <Icon path={IC.search} size={13}/>
          </div>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher…"
            style={{ paddingLeft:28,paddingRight:10,paddingTop:7,paddingBottom:7,border:`1px solid ${T.border}`,borderRadius:7,fontSize:12,color:T.text,background:T.surface,outline:'none',width:200 }}/>
        </div>
        {['all','pending','in_progress','verified','completed','failed'].map(s => (
          <button key={s} onClick={()=>setFilter(s)} style={{
            padding:'6px 12px',borderRadius:7,fontSize:11,fontWeight:600,cursor:'pointer',
            border:`1px solid ${filter===s?T.accent:T.border}`,
            background:filter===s?T.accent:T.surface,
            color:filter===s?'#fff':T.textSub,
          }}>{s==='all'?'Tous':statusLabel(s)}</button>
        ))}
      </div>

      <div style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,overflow:'hidden' }}>
        <table style={{ width:'100%',borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${T.border}` }}>
              {['Claim','Catégorie','Statut','Score IA','Crowd','Actions'].map(h=>(
                <th key={h} style={{ padding:'10px 14px',textAlign:'left',fontSize:10,fontWeight:700,color:T.textMuted,textTransform:'uppercase',letterSpacing:'.07em',whiteSpace:'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c,i) => (
              <tr key={c.id} style={{ borderBottom:i<filtered.length-1?`1px solid ${T.borderSub}`:'none' }}
                onMouseEnter={e=>e.currentTarget.style.background=T.surfaceAlt}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                <td style={{ padding:'11px 14px',maxWidth:280 }}>
                  <div style={{ fontSize:12,color:T.text,fontWeight:500,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{c.title}</div>
                  <div style={{ fontSize:10,color:T.textMuted,marginTop:1 }}>#{c.id} · {c.claimant||'—'}</div>
                </td>
                <td style={{ padding:'11px 14px' }}><Chip>{c.category||'—'}</Chip></td>
                <td style={{ padding:'11px 14px' }}>
                  <Chip color={statusColor(c.status)} bg={statusColor(c.status)+'14'}>{statusLabel(c.status)}</Chip>
                </td>
                <td style={{ padding:'11px 14px',fontSize:12,color:T.textSub,fontWeight:600 }}>
                  {c.ai_confidence_score!=null?`${Math.round(c.ai_confidence_score*100)}%`:'—'}
                </td>
                <td style={{ padding:'11px 14px',fontSize:12,color:T.textSub,fontWeight:600 }}>
                  {c.crowd_confidence_score!=null?`${Math.round(c.crowd_confidence_score*100)}%`:'—'}
                </td>
                <td style={{ padding:'11px 14px' }}>
                  <div style={{ display:'flex',gap:4 }}>
                    {c.status==='pending' && (
                      <button onClick={()=>approve(c.id)} title="Approuver"
                        style={{ padding:'5px 7px',borderRadius:6,border:`1px solid ${T.green}44`,background:T.greenSoft,color:T.green,cursor:'pointer' }}>
                        <Icon path={IC.check} size={12} color={T.green}/>
                      </button>
                    )}
                    <button title="Voir" style={{ padding:'5px 7px',borderRadius:6,border:`1px solid ${T.border}`,background:T.surface,color:T.textMuted,cursor:'pointer' }}>
                      <Icon path={IC.eye} size={12}/>
                    </button>
                    <button title="Éditer" style={{ padding:'5px 7px',borderRadius:6,border:`1px solid ${T.border}`,background:T.surface,color:T.textMuted,cursor:'pointer' }}>
                      <Icon path={IC.edit} size={12}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length===0 && (
              <tr><td colSpan={6} style={{ padding:32,textAlign:'center',fontSize:12,color:T.textMuted }}>Aucun claim trouvé</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// PAGE CATÉGORIES
const PageCategories = ({ data, onRefresh }) => {
  const { categories } = data;
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:'',slug:'',description:'' });
  const [saving, setSaving] = useState(false);
  const inp = { width:'100%',padding:'8px 10px',border:`1px solid ${T.border}`,borderRadius:7,fontSize:13,color:T.text,background:T.surface,outline:'none',boxSizing:'border-box' };

  const save = async () => {
    if (!form.name) return;
    setSaving(true);
    await apiFetch('/api/v1/categories/', { method:'POST', body:JSON.stringify(form) });
    setForm({ name:'',slug:'',description:'' });
    setShowForm(false);
    onRefresh();
    setSaving(false);
  };

  return (
    <div style={{ display:'flex',flexDirection:'column',gap:16 }}>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
        <div>
          <h2 style={{ fontSize:18,fontWeight:800,color:T.text,margin:0 }}>Catégories</h2>
          <div style={{ fontSize:12,color:T.textMuted,marginTop:2 }}>{(categories||[]).length} catégories actives</div>
        </div>
        <button onClick={()=>setShowForm(!showForm)}
          style={{ display:'flex',alignItems:'center',gap:6,padding:'8px 14px',borderRadius:8,border:'none',background:T.accent,color:'#fff',cursor:'pointer',fontSize:12,fontWeight:600 }}>
          <Icon path={IC.plus} size={13} color='#fff'/>Nouvelle catégorie
        </button>
      </div>

      {showForm && (
        <div style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:18 }}>
          <div style={{ fontSize:13,fontWeight:700,color:T.text,marginBottom:14 }}>Créer une catégorie</div>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
            {[['Nom *','name'],['Slug','slug'],['Description','description']].map(([l,k])=>(
              <div key={k} style={{ gridColumn:k==='description'?'1/-1':'auto' }}>
                <label style={{ display:'block',fontSize:10,fontWeight:600,color:T.textMuted,marginBottom:4,textTransform:'uppercase',letterSpacing:'.06em' }}>{l}</label>
                <input value={form[k]} onChange={e=>{
                  const v=e.target.value;
                  setForm(p=>({...p,[k]:v,...(k==='name'?{slug:v.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')}:{})}));
                }} placeholder={l.replace(' *','')} style={inp}/>
              </div>
            ))}
          </div>
          <div style={{ display:'flex',gap:8,marginTop:14 }}>
            <button onClick={()=>setShowForm(false)} style={{ padding:'8px 16px',borderRadius:7,border:`1px solid ${T.border}`,background:T.surface,color:T.textSub,cursor:'pointer',fontSize:12 }}>Annuler</button>
            <button onClick={save} disabled={saving}
              style={{ display:'flex',alignItems:'center',gap:6,padding:'8px 16px',borderRadius:7,border:'none',background:T.accent,color:'#fff',cursor:'pointer',fontSize:12,fontWeight:600 }}>
              {saving&&<Spin/>}Créer
            </button>
          </div>
        </div>
      )}

      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:12 }}>
        {(categories||[]).map(cat=>(
          <div key={cat.id} style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:16 }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12 }}>
              <div>
                <div style={{ fontSize:14,fontWeight:700,color:T.text }}>{cat.name}</div>
                <div style={{ fontSize:11,color:T.textMuted,marginTop:1 }}>/{cat.slug}</div>
              </div>
              <button style={{ padding:5,borderRadius:6,border:`1px solid ${T.border}`,background:T.surface,color:T.textMuted,cursor:'pointer' }}>
                <Icon path={IC.edit} size={12}/>
              </button>
            </div>
            <div style={{ display:'flex',justifyContent:'space-between',paddingTop:10,borderTop:`1px solid ${T.borderSub}` }}>
              <div>
                <div style={{ fontSize:10,color:T.textMuted,marginBottom:2 }}>Claims</div>
                <div style={{ fontSize:20,fontWeight:800,color:T.text }}>{cat.total_claims||0}</div>
              </div>
              {cat.avg_confidence && (
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:10,color:T.textMuted,marginBottom:2 }}>Confiance</div>
                  <div style={{ fontSize:14,fontWeight:700,color:T.blue }}>{Math.round(cat.avg_confidence*100)}%</div>
                </div>
              )}
            </div>
          </div>
        ))}
        {(!categories||categories.length===0)&&<div style={{ gridColumn:'1/-1',padding:32,textAlign:'center',fontSize:12,color:T.textMuted }}>Aucune catégorie</div>}
      </div>
    </div>
  );
};

// PAGE ANALYTICS
const PageAnalytics = ({ data }) => {
  const { stats, categories } = data;
  const maxC = Math.max(...(categories||[]).map(c=>c.total_claims||0),1);

  return (
    <div style={{ display:'flex',flexDirection:'column',gap:18 }}>
      <div>
        <h2 style={{ fontSize:18,fontWeight:800,color:T.text,margin:0 }}>Analytiques</h2>
        <div style={{ fontSize:12,color:T.textMuted,marginTop:2 }}>Performance globale de la plateforme EXPAND</div>
      </div>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:12 }}>
        {[
          { l:'Claims vérifiés',     v:stats?.claims?.verified??0,                                                                  c:T.green  },
          { l:'En attente',          v:stats?.claims?.pending??0,                                                                   c:T.amber  },
          { l:'Précision prédiction',v:`${stats?.predictions?.accuracy??0}%`,                                                       c:T.blue   },
          { l:'Sessions IA / jour',  v:stats?.ai_sessions?.today??0,                                                                c:T.purple },
          { l:'Taux vérification',   v:stats?.claims?.total?`${Math.round((stats.claims.verified/stats.claims.total)*100)}%`:'—',   c:T.green  },
          { l:'Total prédictions',   v:stats?.predictions?.total??0,                                                                c:T.text   },
        ].map(m=>(
          <div key={m.l} style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:'14px 16px' }}>
            <div style={{ fontSize:10,color:T.textMuted,marginBottom:6,textTransform:'uppercase',letterSpacing:'.06em' }}>{m.l}</div>
            <div style={{ fontSize:24,fontWeight:800,color:m.c,letterSpacing:'-0.02em' }}>{m.v}</div>
          </div>
        ))}
      </div>
      <div style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,overflow:'hidden' }}>
        <div style={{ padding:'13px 16px',borderBottom:`1px solid ${T.border}` }}>
          <span style={{ fontSize:13,fontWeight:700,color:T.text }}>Claims par catégorie</span>
        </div>
        <div style={{ padding:'16px',display:'flex',flexDirection:'column',gap:13 }}>
          {[...(categories||[])].sort((a,b)=>(b.total_claims||0)-(a.total_claims||0)).map(cat=>(
            <div key={cat.id}>
              <div style={{ display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:5 }}>
                <span style={{ color:T.textSub,fontWeight:500 }}>{cat.name}</span>
                <span style={{ color:T.text,fontWeight:700 }}>{cat.total_claims||0}</span>
              </div>
              <Bar value={cat.total_claims||0} max={maxC}/>
            </div>
          ))}
          {(!categories||categories.length===0)&&<div style={{ fontSize:12,color:T.textMuted,textAlign:'center',padding:'12px 0' }}>Aucune donnée</div>}
        </div>
      </div>
    </div>
  );
};

// PAGE SETTINGS
const PageSettings = ({ meUser }) => {
  const inp = { width:'100%',padding:'8px 10px',border:`1px solid ${T.border}`,borderRadius:7,fontSize:13,color:T.text,background:T.surface,outline:'none',boxSizing:'border-box' };

  return (
    <div style={{ display:'flex',flexDirection:'column',gap:16 }}>
      <div>
        <h2 style={{ fontSize:18,fontWeight:800,color:T.text,margin:0 }}>Configuration</h2>
        <div style={{ fontSize:12,color:T.textMuted,marginTop:2 }}>Paramètres globaux de la plateforme</div>
      </div>

      <div style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:18 }}>
        <div style={{ fontSize:13,fontWeight:700,color:T.text,marginBottom:14 }}>Compte administrateur</div>
        <div style={{ display:'flex',alignItems:'center',gap:14,padding:'12px 14px',background:T.surfaceAlt,borderRadius:8,border:`1px solid ${T.border}` }}>
          <div style={{ width:36,height:36,borderRadius:'50%',background:T.accent,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:800,color:'#fff' }}>
            {(meUser?.username||'A')[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize:13,fontWeight:700,color:T.text }}>{meUser?.username||'Admin'}</div>
            <div style={{ fontSize:11,color:T.textMuted }}>{meUser?.email||'admin@expand.ht'} · {meUser?.role||'admin'}</div>
          </div>
          <Chip color={T.green} bg={T.greenSoft}>Connecté</Chip>
        </div>
      </div>

      {[
        { t:'Plateforme', f:[{l:'Nom',v:'EXPAND'},{l:'Email contact',v:'admin@expand.ht'},{l:'URL publique',v:'http://localhost:3000'}] },
        { t:'IA',         f:[{l:'Provider par défaut',v:'claude-sonnet-4-6'},{l:'Seuil auto-approuver (%)',v:'90'},{l:'Timeout (s)',v:'15'}] },
        { t:'Modération', f:[{l:'Score confiance min.',v:'0.3'},{l:'Tentatives login max',v:'5'},{l:'Durée session (min)',v:'60'}] },
      ].map(sec=>(
        <div key={sec.t} style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:18 }}>
          <div style={{ fontSize:13,fontWeight:700,color:T.text,marginBottom:14 }}>{sec.t}</div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:12 }}>
            {sec.f.map(f=>(
              <div key={f.l}>
                <label style={{ display:'block',fontSize:10,fontWeight:600,color:T.textMuted,marginBottom:4,textTransform:'uppercase',letterSpacing:'.06em' }}>{f.l}</label>
                <input defaultValue={f.v} style={inp}/>
              </div>
            ))}
          </div>
          <button style={{ marginTop:14,padding:'8px 16px',borderRadius:7,border:'none',background:T.accent,color:'#fff',cursor:'pointer',fontSize:12,fontWeight:600 }}>Sauvegarder</button>
        </div>
      ))}
    </div>
  );
};

const NAV = [
  { id:'overview',   label:"Vue d'ensemble", icon:IC.grid   },
  { id:'claims',     label:'Claims',         icon:IC.file   },
  { id:'categories', label:'Catégories',     icon:IC.tag    },
  { id:'analytics',  label:'Analytiques',    icon:IC.chart  },
  { id:'settings',   label:'Configuration',  icon:IC.cog    },
];

export default function AdminDashboard() {
  const [page,      setPage]     = useState('overview');
  const [collapsed, setCollapsed]= useState(false);
  const [loading,   setLoading]  = useState(true);
  const [lastSync,  setLastSync] = useState(null);
  const [data, setData] = useState({ stats:null, claims:[], categories:[], meUser:null });

  const load = useCallback(async () => {
    setLoading(true);
    const [stats, claims, categories, me] = await Promise.all([
      apiFetch('/api/v1/analytics/stats'),
      apiFetch('/api/v1/claims/'),
      apiFetch('/api/v1/categories/'),
      apiFetch('/api/v1/auth/me'),
    ]);
    setData({
      stats,
      claims    : Array.isArray(claims)?claims:claims?.claims||[],
      categories: Array.isArray(categories)?categories:categories?.categories||[],
      meUser    : me?.user||me,
    });
    setLastSync(new Date());
    setLoading(false);
  }, []);

  useEffect(()=>{ load(); },[load]);

  const pages = {
    overview  : <PageOverview   data={data}/>,
    claims    : <PageClaims     data={data} onRefresh={load}/>,
    categories: <PageCategories data={data} onRefresh={load}/>,
    analytics : <PageAnalytics  data={data}/>,
    settings  : <PageSettings   meUser={data.meUser}/>,
  };

  const active = NAV.find(n=>n.id===page);

  return (
    <div style={{ display:'flex',flexDirection:'column',position:'fixed',inset:0,background:T.bg,color:T.text,fontFamily:FONT,overflow:'hidden' }}>

      {/* HEADER */}
      <header style={{ height:50,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 16px',background:T.surface,borderBottom:`1px solid ${T.border}`,zIndex:200 }}>
        <div style={{ display:'flex',alignItems:'center',gap:10 }}>
          <button onClick={()=>setCollapsed(!collapsed)} style={{ padding:6,borderRadius:6,border:'none',background:'transparent',color:T.textMuted,cursor:'pointer' }}>
            <Icon path={IC.menu} size={16}/>
          </button>
          <div style={{ display:'flex',alignItems:'center',gap:8 }}>
            <div style={{ width:24,height:24,borderRadius:6,background:T.accent,display:'flex',alignItems:'center',justifyContent:'center' }}>
              <Icon path={IC.shield} size={13} color='#fff'/>
            </div>
            <span style={{ fontSize:13,fontWeight:800,color:T.text,letterSpacing:'0.04em' }}>EXPAND</span>
            <span style={{ fontSize:11,color:T.borderSub }}>·</span>
            <span style={{ fontSize:12,color:T.textMuted }}>Admin</span>
          </div>
        </div>
        <div style={{ display:'flex',alignItems:'center',gap:8 }}>
          {loading&&<Spin/>}
          {lastSync&&!loading&&<span style={{ fontSize:10,color:T.textMuted }}>{lastSync.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}</span>}
          <button onClick={load} style={{ padding:6,borderRadius:6,border:`1px solid ${T.border}`,background:T.surface,color:T.textMuted,cursor:'pointer' }}>
            <Icon path={IC.refresh} size={14}/>
          </button>
          <div style={{ display:'flex',alignItems:'center',gap:8,padding:'5px 10px',borderRadius:7,border:`1px solid ${T.border}`,background:T.surface }}>
            <div style={{ width:22,height:22,borderRadius:'50%',background:T.accent,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800,color:'#fff' }}>
              {(data.meUser?.username||'A')[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize:11,fontWeight:700,color:T.text,lineHeight:1.2 }}>{data.meUser?.username||'Admin'}</div>
              <div style={{ fontSize:9,color:T.textMuted }}>{data.meUser?.role||'admin'}</div>
            </div>
          </div>
        </div>
      </header>

      <div style={{ display:'flex',flex:1,overflow:'hidden' }}>

        {/* SIDEBAR */}
        <aside style={{ width:collapsed?48:192,flexShrink:0,display:'flex',flexDirection:'column',background:T.surface,borderRight:`1px solid ${T.border}`,transition:'width .18s ease',overflow:'hidden' }}>
          <nav style={{ flex:1,padding:'8px 6px',overflowY:'auto',overflowX:'hidden' }}>
            {NAV.map(item=>{
              const isActive=page===item.id;
              return (
                <button key={item.id} onClick={()=>setPage(item.id)} title={collapsed?item.label:undefined}
                  style={{ width:'100%',display:'flex',alignItems:'center',gap:collapsed?0:9,padding:collapsed?'9px 0':'8px 10px',justifyContent:collapsed?'center':'flex-start',borderRadius:7,border:'none',cursor:'pointer',marginBottom:1,background:isActive?T.accentSoft:'transparent',color:isActive?T.text:T.textMuted,fontWeight:isActive?700:500,fontSize:12.5,transition:'all .1s',fontFamily:FONT }}
                  onMouseEnter={e=>{if(!isActive)e.currentTarget.style.background=T.surfaceAlt;}}
                  onMouseLeave={e=>{if(!isActive)e.currentTarget.style.background='transparent';}}>
                  <Icon path={item.icon} size={15} color={isActive?T.text:T.textMuted}/>
                  {!collapsed&&<span style={{ whiteSpace:'nowrap',overflow:'hidden' }}>{item.label}</span>}
                </button>
              );
            })}
          </nav>
          <div style={{ padding:'8px 6px',borderTop:`1px solid ${T.borderSub}` }}>
            <button style={{ width:'100%',display:'flex',alignItems:'center',gap:collapsed?0:9,padding:collapsed?'9px 0':'8px 10px',justifyContent:collapsed?'center':'flex-start',borderRadius:7,border:'none',background:'transparent',color:T.textMuted,cursor:'pointer',fontSize:12,fontFamily:FONT,transition:'all .1s' }}
              onMouseEnter={e=>{e.currentTarget.style.color=T.red;e.currentTarget.style.background=T.redSoft;}}
              onMouseLeave={e=>{e.currentTarget.style.color=T.textMuted;e.currentTarget.style.background='transparent';}}>
              <Icon path={IC.logout} size={15}/>
              {!collapsed&&<span>Déconnexion</span>}
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main style={{ flex:1,overflowY:'auto',padding:'22px 26px',background:T.bg }}>
          <div style={{ display:'flex',alignItems:'center',gap:6,marginBottom:20 }}>
            <span style={{ fontSize:11,color:T.textMuted }}>Admin</span>
            <span style={{ fontSize:11,color:T.borderSub }}>›</span>
            <span style={{ fontSize:11,color:T.text,fontWeight:600 }}>{active?.label}</span>
          </div>
          {loading&&page==='overview'
            ? <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:300,gap:10,color:T.textMuted,fontSize:13 }}><Spin/><span>Chargement…</span></div>
            : pages[page]}
        </main>
      </div>

      {/* FOOTER */}
      <footer style={{ height:34,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 16px',background:T.surface,borderTop:`1px solid ${T.border}`,fontSize:10,color:T.textMuted }}>
        <span>EXPAND Admin v1.0 · <span style={{ color:T.green }}>●</span> {API}</span>
        <span>{lastSync?`Sync ${lastSync.toLocaleTimeString('fr-FR')}`:'En attente...'}</span>
      </footer>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}*{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:${T.border};border-radius:99px}input::placeholder{color:${T.textMuted}}button{font-family:inherit}`}</style>
    </div>
  );
}