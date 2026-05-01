// src/mock/eventDetailsMock.js

export const mockEventDetails = {
  id: '1',
  title: "Départ du Conseil Présidentiel avant le 7 février 2026",
  description:
    "Suivi de l'engagement sur le départ du Conseil Présidentiel de Transition avant le 7 février 2026, " +
    "conformément au calendrier constitutionnel. Cet événement agrège les prédictions de la communauté, " +
    "les sources officielles et les analyses médiatiques.",
  category: "politique",
  created_at_human: "1er janvier 2026",
  resolution_date_human: "7 février 2026",
  status: "actif", // ou "résolu", "archivé"
  current_consensus: 0.42,
  participant_count: 3150,
  view_count: 12000,
  trend_7d: "down",
  trend_7d_label: "Baisse légère cette semaine",
  last_update_human: "Il y a 4 heures",
  sources: [
    {
      id: 1,
      publisher: "Conseil Présidentiel",
      title: "Communiqué officiel sur la transition",
      url: "https://www.gouv.ht/communique-transition",
      reliability_score: 0.9,
      publication_date_human: "15 janvier 2026"
    },
    {
      id: 2,
      publisher: "Le Nouvelliste",
      title: "Analyse de la situation politique actuelle",
      url: "https://lenouvelliste.com/article/transition-politique",
      reliability_score: 0.75,
      publication_date_human: "20 janvier 2026"
    }
  ],
  timeline: [
    { date: "01/01/2026", label: "Création de l'événement sur EXPAND" },
    { date: "10/01/2026", label: "Ajout des premiers communiqués officiels" },
    { date: "20/01/2026", label: "Pic de participation après débats publics" }
  ],
  sample_predictions: [
    { label: "Probable (>= 60 %)", percentage: 38 },
    { label: "Incertain (40–60 %)", percentage: 44 },
    { label: "Peu probable (<= 40 %)", percentage: 18 }
  ]
};
