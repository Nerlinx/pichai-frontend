// ═══════════════════════════════════════════════════════════════
// EXPAND — voteService.js
// Gestion des votes anonymes → associés au login
// ═══════════════════════════════════════════════════════════════

const STORAGE_KEY = 'expand_anonymous_votes';
const API_BASE    = 'http://localhost:8000';

// ── Sauvegarder un vote anonyme ───────────────────────────────
export const saveAnonymousVote = (claimId, predictionId, selectedOption, confidenceLevel = 0.7) => {
  const votes = getAnonymousVotes();

  // Remplacer si déjà voté sur cette prédiction
  const filtered = votes.filter(v => v.prediction_id !== predictionId);
  filtered.push({
    claim_id        : claimId,
    prediction_id   : predictionId,
    selected_option : selectedOption,
    confidence_level: confidenceLevel,
    voted_at        : new Date().toISOString(),
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return filtered.length;
};

// ── Récupérer tous les votes anonymes ─────────────────────────
export const getAnonymousVotes = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

// ── Vérifier si déjà voté (anonyme) ──────────────────────────
export const getAnonymousVote = (predictionId) => {
  const votes = getAnonymousVotes();
  return votes.find(v => v.prediction_id === predictionId) || null;
};

// ── Vider après association ───────────────────────────────────
export const clearAnonymousVotes = () => {
  localStorage.removeItem(STORAGE_KEY);
};

// ── Envoyer les votes anonymes au backend après login ─────────
export const claimAnonymousVotes = async () => {
  const votes = getAnonymousVotes();
  if (votes.length === 0) return { claimed: 0, skipped: 0 };

  const token = localStorage.getItem('access_token');
  if (!token) return { claimed: 0, skipped: 0 };

  try {
    const res = await fetch(`${API_BASE}/api/v1/votes/claim-anonymous`, {
      method : 'POST',
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ votes }),
    });

    if (res.ok) {
      const data = await res.json();
      clearAnonymousVotes(); // Vider le localStorage
      console.log(`[Votes] ${data.claimed} vote(s) associé(s)`);
      return data;
    }
  } catch (e) {
    console.warn('[Votes] Impossible d\'associer les votes anonymes:', e);
  }

  return { claimed: 0, skipped: 0 };
};
