// Landing copy under the hero, from one-pager C (plain words, 7 Nov 2026). EN then FR.
type T = { en: string; fr: string };

export const LANDING = {
  eyebrow: { en: "IF YOU'RE HOLDING BACK ON AI", fr: "SI VOUS HÉSITEZ AVEC L'IA" } as T,
  title: { en: "If you're holding back on AI, you're probably right to.", fr: "Si vous hésitez avec l'IA, vous avez sans doute raison." } as T,
  sub: {
    en: "You hold client data and you answer for it. Being careful isn't being behind.",
    fr: "Vous détenez des données clients et vous en répondez. Être prudent, ce n'est pas être en retard.",
  } as T,
  questions: [
    { en: "Do you know where your client data goes when someone on your team pastes it into ChatGPT or Gemini?", fr: "Savez-vous où vont vos données clients quand quelqu'un de votre équipe les colle dans ChatGPT ou Gemini ?" },
    { en: "Is someone on your team already using an AI tool you never approved?", fr: "Quelqu'un dans votre équipe utilise-t-il déjà un outil d'IA que vous n'avez jamais validé ?" },
    { en: "Are your AI policies up to scratch for how your team works today?", fr: "Vos règles sur l'IA sont-elles à la hauteur de la façon dont votre équipe travaille aujourd'hui ?" },
    { en: "When someone senior leaves, does what they know about your clients leave with them?", fr: "Quand un senior s'en va, ce qu'il sait de vos clients part-il avec lui ?" },
  ] as T[],
  pause: {
    en: "If any of these made you pause, that's the reason to talk. Not to slow down. To get on safely.",
    fr: "Si l'une de ces questions vous a fait hésiter, c'est la raison d'en parler. Pas pour ralentir. Pour avancer en sécurité.",
  } as T,
  whatLabel: { en: "WHAT I PUT IN PLACE", fr: "CE QUE JE METS EN PLACE" } as T,
  what: {
    en: "Everything your firm knows, in one place you own. Ask it what's outstanding on a client, what's changed since you last saw them, or what was decided six months ago, and it answers, showing where it found it. Then a day with your team, so they use it well, with clear rules on what can and can't go into AI.",
    fr: "Tout ce que sait votre cabinet, au même endroit, et qui vous appartient. Demandez-lui ce qui reste à faire pour un client, ce qui a changé depuis votre dernier rendez-vous, ou ce qui a été décidé il y a six mois, et il répond, en montrant où il l'a trouvé. Puis une journée avec votre équipe, pour qu'elle s'en serve bien, avec des règles claires sur ce qui peut aller dans l'IA et ce qui ne le peut pas.",
  } as T,
  safeLabel: { en: "HOW YOUR CLIENT DATA STAYS SAFE", fr: "COMMENT VOS DONNÉES CLIENTS RESTENT PROTÉGÉES" } as T,
  safe: [
    { title: { en: "Kept in the UK.", fr: "Gardées au Royaume-Uni." }, text: { en: "Your files stay in the UK, on a system that belongs to you.", fr: "Vos fichiers restent au Royaume-Uni, sur un système qui vous appartient." } },
    { title: { en: "No free AI on client files.", fr: "Pas d'IA gratuite sur les dossiers clients." }, text: { en: "Paid business accounts only, never free or personal ones.", fr: "Uniquement des comptes professionnels payants, jamais de comptes gratuits ou personnels." } },
    { title: { en: "Never used to train AI.", fr: "Jamais utilisées pour entraîner une IA." }, text: { en: "Nothing you put in is used to improve anyone's AI.", fr: "Rien de ce que vous y mettez ne sert à améliorer l'IA de qui que ce soit." } },
    { title: { en: "Each person sees their part.", fr: "Chacun voit sa partie." }, text: { en: "You decide who sees what.", fr: "Vous décidez qui voit quoi." } },
    { title: { en: "Yours to keep.", fr: "À vous, pour de bon." }, text: { en: "If we stop working together, everything stays with you.", fr: "Si nous arrêtons de travailler ensemble, tout reste chez vous." } },
    { title: { en: "In writing too.", fr: "Par écrit aussi." }, text: { en: "A data sharing agreement with your firm, signed.", fr: "Un accord de partage de données avec votre cabinet, signé." } },
  ],
  callLabel: { en: "FREE, TO START", fr: "GRATUIT, POUR COMMENCER" } as T,
  callTitle: { en: "A 30-minute call", fr: "Un appel de 30 minutes" } as T,
  callText: {
    en: "One process in your firm, where AI fits, and whether it's worth doing. If it isn't, I'll say so.",
    fr: "Un processus de votre cabinet, où l'IA a sa place, et si ça vaut le coup. Si ce n'est pas le cas, je vous le dirai.",
  } as T,
  callButton: { en: "Book a call", fr: "Réserver un appel" } as T,
  orCheck: { en: "Or see where you stand in five minutes", fr: "Ou voyez où vous en êtes en 5 minutes" } as T,
  aboutLine: { en: "I help regulated firms get onto AI safely, and keep what they know.", fr: "J'aide les cabinets réglementés à passer à l'IA en sécurité, et à garder ce qu'ils savent." } as T,
  stats: [
    { big: { en: "20 years", fr: "20 ans" }, small: { en: "in tech, from product manager to head of product", fr: "dans la tech, de chef de produit à directeur produit" } },
    { big: { en: "40 people", fr: "40 personnes" }, small: { en: "trained at the United Nations, in Togo and Benin", fr: "formées aux Nations unies, au Togo et au Bénin" } },
    { big: { en: "24-person", fr: "24 personnes" }, small: { en: "wealth practice in London getting its own company brain", fr: "un cabinet de gestion de patrimoine à Londres, qui se dote de son cerveau d'entreprise" } },
    { big: { en: "8x8 · Laerdal", fr: "8x8 · Laerdal" }, small: { en: "teams trained on their own work", fr: "des équipes formées sur leur propre travail" } },
  ],
  rule: { en: "Your client data never goes into a free or public AI tool.", fr: "Vos données clients ne vont jamais dans un outil d'IA gratuit ou public." } as T,
};
