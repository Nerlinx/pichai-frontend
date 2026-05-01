// src/mock/aiAnalysisMock.js

export const mockEvents = [
  {
    id: '1',
    title: "Départ du Conseil Présidentiel avant le 7 février 2026",
    description: "Transition politique et respect du calendrier constitutionnel en Haïti.",
    category: "politique",
    current_consensus: 0.42, // 42 %
    participant_count: 3150,
    resolution_date_human: "7 février 2026",
    trend_7d: "down",
    trend_7d_label: "Baisse légère cette semaine",
    sources: [
      {
        id: 1,
        publisher: "Conseil Présidentiel",
        title: "Communiqué officiel sur la transition",
        url: "https://www.gouv.ht/communique-transition"
      },
      {
        id: 2,
        publisher: "Le Nouvelliste",
        title: "Analyse de la situation politique actuelle",
        url: "https://lenouvelliste.com/article/transition-politique"
      }
    ]
  },
  {
    id: '2',
    title: "Prix du gallon d'essence dépasse 900 HTG en février",
    description: "Évolution des prix des carburants et impact sur l'inflation.",
    category: "économie",
    current_consensus: 0.78,
    participant_count: 4280,
    resolution_date_human: "28 février 2026",
    trend_7d: "up",
    trend_7d_label: "Hausse marquée cette semaine",
    sources: [
      {
        id: 3,
        publisher: "BRH",
        title: "Rapport sur les prix des carburants",
        url: "https://brh.ht/rapport-carburants"
      }
    ]
  }
];

export const mockSummariesByEventId = {
  '1': {
    summary_fr:
      "La communauté d’EXPAND reste partagée sur la possibilité d’un départ du Conseil Présidentiel avant le 7 février 2026. " +
      "Le consensus actuel se situe autour de 42 %, ce qui reflète davantage une incertitude qu’une conviction forte. " +
      "Les participants s’appuient principalement sur les communiqués officiels et quelques analyses de presse, mais " +
      "les signaux politiques restent contradictoires.\n\n" +
      "Dans l’ensemble, les données suggèrent que le scénario d’un départ avant la date constitutionnelle est considéré comme possible, " +
      "mais loin d’être assuré.",
    summary_ht:
      "Komite itilizatè EXPAND la poko twò sèten sou si Konsèy Prezidansyèl la pral kite anvan 7 fevriye 2026. " +
      "Konsansis la anviwon 42 %, sa vle di gen plis dout pase konviksyon. " +
      "Gen plizyè sous ofisyèl ak atik laprès, men siy politik yo pa klè.\n\n" +
      "An jeneral, done yo montre senaryo depa avan dat la posib, men li pa konsidere kòm yon bagay ki prèske sèten.",
    confidence_score: 0.68,
    model_used: "mock-gpt-4",
    generated_at: new Date().toISOString()
  },
  '2': {
    summary_fr:
      "Les participants jugent très probable que le prix du gallon d’essence dépasse 900 HTG d’ici fin février. " +
      "Le consensus autour de 78 % traduit une anticipation forte de hausse, portée par les tendances récentes des prix " +
      "et les rapports officiels sur les tensions d’approvisionnement.\n\n" +
      "Cependant, une incertitude subsiste sur l’ampleur et le rythme exact de cette hausse, notamment en fonction des décisions " +
      "gouvernementales et des aides éventuelles.",
    summary_ht:
      "Pifò moun sou EXPAND kwè pri gaz la gen gwo chans depase 900 goud anvan fen fevriye. " +
      "Konsansis 78 % la montre anpil moun ap atann ogmantasyon, sitou lè yo gade dènye chif yo ak rapò ofisyèl yo.\n\n" +
      "Men, gen toujou enstabilite sou nivo ak vitès ogmantasyon an, paske li depann tou de desizyon Leta ak èd ki ka bay.",
    confidence_score: 0.82,
    model_used: "mock-gpt-4",
    generated_at: new Date().toISOString()
  }
};
