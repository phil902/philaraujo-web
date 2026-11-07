import type { AreaKey, LevelKey, OfferKey } from "./check";

type T = { en: string; fr: string };
type Opt = { value: string } & T;

export const BRAND = {
  eyebrow: { en: "FOR FIRMS THAT HOLD CLIENT DATA", fr: "POUR LES CABINETS QUI DÉTIENNENT DES DONNÉES CLIENTS" },
  boldPhrase: { en: "your client data", fr: "vos données clients" },
  fixTag: { en: "FIX FIRST", fr: "À TRAITER" },
  ruleTag: { en: "RULE", fr: "RÈGLE" },
  ruleText: { en: "Your answers stay private to Phil Araujo.", fr: "Vos réponses restent privées, seul Phil Araujo les voit." },
  hoursLabel: { en: "hours back in 90 days", fr: "heures gagnées en 90 jours" },
};

export const NODE_LABELS: Record<AreaKey, T> = {
  data: { en: "CLIENT DATA", fr: "DONNÉES CLIENTS" },
  team: { en: "TEAM USE", fr: "ÉQUIPE" },
  rules: { en: "RULES", fr: "RÈGLES" },
  knowledge: { en: "KNOWLEDGE", fr: "SAVOIR" },
  time: { en: "TIME BACK", fr: "TEMPS" },
};

export const UI = {
  introTitle: { en: "Is your client data safe with AI?", fr: "Vos données clients sont-elles protégées face à l'IA ?" },
  subtitle: { en: "The 5-minute AI readiness check for firms that hold client data.", fr: "Le diagnostic IA en 5 minutes pour les cabinets qui détiennent des données clients." },
  introText: {
    en: "12 questions. For each one, pick the answer that sounds most like your firm this week. You get your level, the risks to fix first, how much time AI could give you back, and a full draft AI policy for your firm, written from your answers.",
    fr: "12 questions. Pour chacune, choisissez la réponse qui ressemble le plus à votre cabinet cette semaine. Vous obtenez votre niveau, les risques à traiter en premier, le temps que l'IA pourrait vous rendre, et un projet complet de charte IA pour votre cabinet, rédigé à partir de vos réponses.",
  },
  start: { en: "Start", fr: "Commencer" },
  next: { en: "Next", fr: "Suivant" },
  back: { en: "Back", fr: "Retour" },
  instruction: { en: "Pick the answer closest to how things are this week.", fr: "Choisissez la réponse la plus proche de la situation de cette semaine." },
  timeTitle: { en: "How much time could AI give you back?", fr: "Combien de temps l'IA pourrait-elle vous rendre ?" },
  timeText: { en: "Rough numbers are fine.", fr: "Des chiffres approximatifs suffisent." },
  timeLine: {
    en: "About {hours} hours back in 90 days. That's about {days} working days.",
    fr: "Environ {hours} heures gagnées en 90 jours, soit environ {days} jours de travail.",
  },
  timeNote: {
    en: "An estimate, not a promise. It assumes AI takes on a quarter of the time spent on these four tasks.",
    fr: "Une estimation, pas une promesse. Elle suppose que l'IA prend en charge un quart du temps passé sur ces quatre tâches.",
  },
  contactTitle: { en: "Where should we send your results?", fr: "Où envoyer vos résultats ?" },
  firstName: { en: "First name", fr: "Prénom" },
  email: { en: "Email", fr: "Email" },
  firm: { en: "Firm", fr: "Cabinet" },
  consent: {
    en: "Phil Araujo can email me my results and contact me about them. No newsletter unless I ask.",
    fr: "Phil Araujo peut m'envoyer mes résultats par email et me contacter à leur sujet. Pas de newsletter sauf si je le demande.",
  },
  privacy: {
    en: "Only Phil Araujo sees your answers. Ask to delete them any time at phil@prodheroes.com.",
    fr: "Seul Phil Araujo voit vos réponses. Demandez leur suppression à tout moment à phil@prodheroes.com.",
  },
  submit: { en: "See my results", fr: "Voir mes résultats" },
  hi: { en: "Hi {name}, here's your result", fr: "Bonjour {name}, voici votre résultat" },
  fixFirst: { en: "Fix these first", fr: "À traiter en premier" },
  noRisk: { en: "No urgent risks in your answers.", fr: "Aucun risque urgent dans vos réponses." },
  oneChange: { en: "The one change that would help most", fr: "Le changement qui aiderait le plus" },
  share: {
    en: "Share this page with whoever decides in your firm.",
    fr: "Partagez cette page avec la personne qui décide dans votre cabinet.",
  },
  callNoBooking: {
    en: "Your results and your draft policy are on their way to your inbox. Reply to that email to set up a free 30-minute call with Phil: one process in your firm, where AI fits, and whether it's worth doing. If it isn't, he'll say so.",
    fr: "Vos résultats et votre projet de charte arrivent dans votre boîte mail. Répondez à cet email pour caler un appel gratuit de 30 minutes avec Phil : un processus de votre cabinet, où l'IA a sa place, et si ça vaut le coup. Si ce n'est pas le cas, il vous le dira.",
  },
  callBooking: {
    en: "Book a free 30-minute call with Phil: one process in your firm, where AI fits, and whether it's worth doing. If it isn't, he'll say so.",
    fr: "Réservez un appel gratuit de 30 minutes avec Phil : un processus de votre cabinet, où l'IA a sa place, et si ça vaut le coup. Si ce n'est pas le cas, il vous le dira.",
  },
  bookButton: { en: "Book a free 30-minute call with Phil", fr: "Réservez un appel gratuit de 30 minutes avec Phil" },
  personalNext: { en: "Phil will email you when places open.", fr: "Phil vous écrira dès que les places ouvrent." },
  errRequired: { en: "Required", fr: "Obligatoire" },
  errEmail: { en: "Enter a valid email", fr: "Saisissez un email valide" },
  errSave: { en: "Something went wrong. Please try again.", fr: "Une erreur est survenue. Veuillez réessayer." },
} satisfies Record<string, T>;

export type ProfileKey = "team_size" | "sector" | "regulated" | "role";

export const PAGE = {
  title: { en: "Is your client data safe with AI? | Phil Araujo", fr: "Vos données clients sont-elles protégées face à l'IA ? | Phil Araujo" },
  description: {
    en: "A free 5-minute check for law firms, financial advisers, accountants and consultants. Find out where your client data goes, what to fix first, and get a draft AI policy for your firm.",
    fr: "Un diagnostic gratuit en 5 minutes pour les cabinets d'avocats, conseillers financiers, experts-comptables et consultants. Découvrez où vont vos données clients, quoi corriger en premier, et recevez un projet de charte IA pour votre cabinet.",
  },
};

export const TOOLS_Q: { q: T; options: Opt[] } = {
  q: { en: "Which AI tools does the firm use today? Tick all that apply.", fr: "Quels outils d'IA le cabinet utilise-t-il aujourd'hui ? Cochez tout ce qui s'applique." },
  options: [
    { value: "chatgpt", en: "ChatGPT", fr: "ChatGPT" },
    { value: "copilot", en: "Microsoft Copilot", fr: "Microsoft Copilot" },
    { value: "claude", en: "Claude", fr: "Claude" },
    { value: "gemini", en: "Gemini", fr: "Gemini" },
    { value: "notetaker", en: "A meeting note taker (Otter, Fireflies, Fathom, Saturn...)", fr: "Un outil de prise de notes en réunion (Otter, Fireflies, Fathom...)" },
    { value: "other", en: "Something else", fr: "Autre chose" },
    { value: "none", en: "None that I know of", fr: "Aucun, à ma connaissance" },
  ],
};

export const PROFILE: { key: ProfileKey; q: T; options: Opt[] }[] = [
  {
    key: "team_size",
    q: { en: "How many people work in the firm, you included?", fr: "Combien de personnes travaillent dans le cabinet, vous compris ?" },
    options: [
      { value: "solo", en: "Just me", fr: "Seul(e)" },
      { value: "2-5", en: "2 to 5", fr: "2 à 5" },
      { value: "6-9", en: "6 to 9", fr: "6 à 9" },
      { value: "10-50", en: "10 to 50", fr: "10 à 50" },
      { value: "50plus", en: "More than 50", fr: "Plus de 50" },
    ],
  },
  {
    key: "sector",
    q: { en: "What does the firm do?", fr: "Que fait le cabinet ?" },
    options: [
      { value: "legal", en: "Legal", fr: "Juridique" },
      { value: "financial", en: "Financial advice or wealth management", fr: "Conseil financier ou gestion de patrimoine" },
      { value: "accounting", en: "Accounting", fr: "Expertise comptable" },
      { value: "insurance", en: "Insurance", fr: "Assurance" },
      { value: "consulting", en: "Consulting", fr: "Conseil" },
      { value: "recruitment", en: "Recruitment", fr: "Recrutement" },
      { value: "property", en: "Property", fr: "Immobilier" },
      { value: "other", en: "Something else", fr: "Autre" },
    ],
  },
  {
    key: "regulated",
    q: {
      en: "Is the firm regulated (for example by the FCA, SRA or ICAEW)?",
      fr: "Le cabinet est-il réglementé (par exemple par l'AMF, l'ACPR, un ordre professionnel, la FCA ou la SRA) ?",
    },
    options: [
      { value: "yes", en: "Yes", fr: "Oui" },
      { value: "no", en: "No", fr: "Non" },
      { value: "unsure", en: "Not sure", fr: "Je ne sais pas" },
    ],
  },
  {
    key: "role",
    q: { en: "What's your role?", fr: "Quel est votre rôle ?" },
    options: [
      { value: "owner", en: "Owner, partner or director", fr: "Dirigeant, associé ou directeur" },
      { value: "manager", en: "Manager", fr: "Manager" },
      { value: "member", en: "Team member", fr: "Membre de l'équipe" },
    ],
  },
];

export const AREA_NAMES: Record<AreaKey, T> = {
  data: { en: "Client data", fr: "Données clients" },
  team: { en: "Team use", fr: "Usage par l'équipe" },
  rules: { en: "Rules and policy", fr: "Règles et politique" },
  knowledge: { en: "Knowledge", fr: "Savoir" },
  time: { en: "Time back", fr: "Temps gagné" },
};

export const QUESTION_TEXT: { q: T; options: [T, T, T, T] }[] = [
  { q: { en: "When someone in the firm uses AI, where does client data go?", fr: "Quand quelqu'un du cabinet utilise l'IA, où vont les données clients ?" }, options: [
    { en: "I don't know.", fr: "Je ne sais pas." },
    { en: "I think I know, but I've never checked.", fr: "Je crois savoir, mais je n'ai jamais vérifié." },
    { en: "I know which tools, but not where each one stores the data.", fr: "Je connais les outils, mais pas où chacun stocke les données." },
    { en: "I have a list of every tool that touches client data and where it stores it.", fr: "J'ai la liste de chaque outil qui touche des données clients et de l'endroit où il les stocke." },
  ] },
  { q: { en: "Personal and free AI accounts", fr: "Comptes d'IA personnels et gratuits" }, options: [
    { en: "People use whatever they like, personal accounts included.", fr: "Chacun utilise ce qu'il veut, comptes personnels compris." },
    { en: "We've asked people not to, but I couldn't tell if they do.", fr: "Nous avons demandé de ne pas le faire, mais je ne saurais pas dire si c'est respecté." },
    { en: "Everyone has a company account, but nothing stops a personal one.", fr: "Tout le monde a un compte entreprise, mais rien n'empêche un compte personnel." },
    { en: "Company accounts only, and we'd notice a personal one.", fr: "Uniquement des comptes entreprise, et un compte personnel se remarquerait." },
  ] },
  { q: { en: "Your agreements with AI providers", fr: "Vos accords avec les fournisseurs d'IA" }, options: [
    { en: "We've never looked at their terms.", fr: "Nous n'avons jamais regardé leurs conditions." },
    { en: "We've read the terms. Nothing signed.", fr: "Nous avons lu les conditions. Rien de signé." },
    { en: "We have a data processing agreement with some of them.", fr: "Nous avons un accord de traitement des données avec certains." },
    { en: "Every provider has a signed agreement, training on our data is off, and we know where the data sits.", fr: "Chaque fournisseur a un accord signé, l'entraînement sur nos données est désactivé, et nous savons où sont les données." },
  ] },
  { q: { en: "Rules on what can go into AI", fr: "Les règles sur ce qui peut aller dans l'IA" }, options: [
    { en: "There are none.", fr: "Il n'y en a pas." },
    { en: "They exist, but only in people's heads.", fr: "Elles existent, mais seulement dans la tête des gens." },
    { en: "They're written down, but they don't match how people really work.", fr: "Elles sont écrites, mais ne correspondent pas à la façon dont les gens travaillent." },
    { en: "They're written, they fit on a page, and they match how the team works.", fr: "Elles sont écrites, tiennent sur une page, et correspondent au travail réel de l'équipe." },
  ] },
  { q: { en: "Checking what AI produces", fr: "Vérifier ce que produit l'IA" }, options: [
    { en: "What AI writes can go to a client as it is.", fr: "Ce que l'IA écrit peut partir chez un client tel quel." },
    { en: "People check when they think of it.", fr: "Chacun vérifie quand il y pense." },
    { en: "Checking is expected, but nobody is named.", fr: "La vérification est attendue, mais personne n'est désigné." },
    { en: "A named person checks anything AI helped with before it goes to a client, a court or a regulator.", fr: "Une personne désignée vérifie tout ce que l'IA a aidé à produire avant que ça parte chez un client, un tribunal ou un régulateur." },
  ] },
  { q: { en: "If a client or a regulator asked how you use AI tomorrow", fr: "Si un client ou un régulateur vous demandait demain comment vous utilisez l'IA" }, options: [
    { en: "We couldn't answer.", fr: "Nous ne pourrions pas répondre." },
    { en: "We could explain it out loud.", fr: "Nous pourrions l'expliquer à l'oral." },
    { en: "We could show something in writing, but it's incomplete.", fr: "Nous pourrions montrer quelque chose d'écrit, mais d'incomplet." },
    { en: "We could show it in writing today, and our client terms already mention it.", fr: "Nous pourrions le montrer par écrit aujourd'hui, et nos conditions clients le mentionnent déjà." },
  ] },
  { q: { en: "How the team uses AI", fr: "Comment l'équipe utilise l'IA" }, options: [
    { en: "Nobody does, as far as I know.", fr: "Personne, à ma connaissance." },
    { en: "A few people try it on their own.", fr: "Quelques personnes essaient de leur côté." },
    { en: "Most people use it, each in their own way.", fr: "La plupart l'utilisent, chacun à sa façon." },
    { en: "The team uses the same tools on real work every week, in ways we've agreed.", fr: "L'équipe utilise les mêmes outils sur du vrai travail chaque semaine, de la façon dont nous l'avons convenu." },
  ] },
  { q: { en: "How the team learned", fr: "Comment l'équipe a appris" }, options: [
    { en: "Nobody has been shown anything.", fr: "On n'a rien montré à personne." },
    { en: "People were told to try it.", fr: "On a dit aux gens d'essayer." },
    { en: "Some were shown, on generic examples.", fr: "Certains ont été formés, sur des exemples génériques." },
    { en: "Everyone was shown how to use it on their own work.", fr: "Tout le monde a appris à l'utiliser sur son propre travail." },
  ] },
  { q: { en: "If someone senior left tomorrow", fr: "Si un senior partait demain" }, options: [
    { en: "Most of what they know about our clients would leave with them.", fr: "L'essentiel de ce qu'il sait de nos clients partirait avec lui." },
    { en: "Some is in files. The rest is in their head.", fr: "Une partie est dans des dossiers. Le reste est dans sa tête." },
    { en: "Most is written down, but spread across inboxes and folders.", fr: "L'essentiel est écrit, mais éparpillé entre les boîtes mail et les dossiers." },
    { en: "It's written down in one place anyone in the firm can search.", fr: "C'est écrit au même endroit, et tout le cabinet peut y chercher." },
  ] },
  { q: { en: "Finding what you decided for a client six months ago", fr: "Retrouver ce que vous avez décidé pour un client il y a six mois" }, options: [
    { en: "I'd have to ask around.", fr: "Je devrais demander autour de moi." },
    { en: "I could find it in my emails, eventually.", fr: "Je le retrouverais dans mes mails, à force de chercher." },
    { en: "It's in our system, if you know where to look.", fr: "C'est dans notre système, si on sait où chercher." },
    { en: "I can find it in a few minutes, and so can my colleagues.", fr: "Je le retrouve en quelques minutes, et mes collègues aussi." },
  ] },
  { q: { en: "The repeated work in your week", fr: "Le travail répétitif de votre semaine" }, options: [
    { en: "I haven't looked at where the time goes.", fr: "Je n'ai pas regardé où part le temps." },
    { en: "I know the repeated tasks, but nothing has changed.", fr: "Je connais les tâches répétitives, mais rien n'a changé." },
    { en: "We've tried AI on some of them.", fr: "Nous avons essayé l'IA sur certaines." },
    { en: "At least one repeated task now runs with AI, and we've kept using it.", fr: "Au moins une tâche répétitive tourne maintenant avec l'IA, et nous l'utilisons toujours." },
  ] },
  { q: { en: "Your standard documents (letters, reports, proposals)", fr: "Vos documents types (courriers, rapports, propositions)" }, options: [
    { en: "Each one starts from a blank page.", fr: "Chacun part d'une page blanche." },
    { en: "We copy the last similar one.", fr: "Nous copions le dernier document similaire." },
    { en: "We have templates.", fr: "Nous avons des modèles." },
    { en: "AI fills our templates from our own notes, and someone checks the result.", fr: "L'IA remplit nos modèles à partir de nos propres notes, et quelqu'un vérifie le résultat." },
  ] },
];

export const FIX_TEXT: Record<number, T> = {
  1: { en: "You don't know where client data goes when someone uses AI.", fr: "Vous ne savez pas où vont les données clients quand quelqu'un utilise l'IA." },
  2: { en: "Client details may be going into personal AI accounts.", fr: "Des données clients vont peut-être dans des comptes d'IA personnels." },
  3: { en: "No signed agreement with your AI providers, so you can't be sure your data isn't used for training.", fr: "Pas d'accord signé avec vos fournisseurs d'IA : impossible d'être sûr que vos données ne servent pas à l'entraînement." },
  4: { en: "No written rules on what can go into AI.", fr: "Pas de règles écrites sur ce qui peut aller dans l'IA." },
  5: { en: "Nobody is named to check AI work before it reaches a client.", fr: "Personne n'est désigné pour vérifier le travail de l'IA avant qu'il arrive chez un client." },
  6: { en: "You couldn't show a client or regulator how you use AI.", fr: "Vous ne pourriez pas montrer à un client ou un régulateur comment vous utilisez l'IA." },
  9: { en: "Client knowledge leaves with the people who hold it.", fr: "Le savoir client part avec les personnes qui le détiennent." },
};

export const POLICY_UI = {
  heading: { en: "Your draft AI policy", fr: "Votre projet de charte IA" },
  text: {
    en: "A full AI policy for {firm}, written from your answers: the tools you use, what can and can't go into them, who checks the work, what to tell clients, and an action plan with dates. About six pages. Edit it, then adopt it.",
    fr: "Une charte IA complète pour {firm}, rédigée à partir de vos réponses : les outils que vous utilisez, ce qui peut y aller ou non, qui vérifie le travail, quoi dire aux clients, et un plan d'action daté. Environ six pages. Modifiez-la, puis adoptez-la.",
  },
  word: { en: "Download as Word", fr: "Télécharger en Word" },
  print: { en: "Print or save as PDF", fr: "Imprimer ou enregistrer en PDF" },
  note: { en: "A starting draft, not legal advice.", fr: "Un premier projet, pas un avis juridique." },
};

export const TIME_FIELDS: { key: "people" | "email" | "notes" | "search" | "docs"; label: T; max: number }[] = [
  { key: "people", label: { en: "People who would use it", fr: "Personnes qui l'utiliseraient" }, max: 200 },
  { key: "email", label: { en: "Hours a week each on emails and follow-ups", fr: "Heures par semaine et par personne sur les mails et relances" }, max: 20 },
  { key: "notes", label: { en: "Hours a week each on meeting notes and prep", fr: "Heures par semaine et par personne sur les notes et la préparation des rendez-vous" }, max: 20 },
  { key: "search", label: { en: "Hours a week each looking for information", fr: "Heures par semaine et par personne à chercher de l'information" }, max: 20 },
  { key: "docs", label: { en: "Hours a week each writing repeat documents (reports, proposals)", fr: "Heures par semaine et par personne à rédiger des documents récurrents (rapports, propositions)" }, max: 20 },
];

export const BANDS: Record<LevelKey, { name: T; text: T }> = {
  exposed: {
    name: { en: "Exposed", fr: "Exposé" },
    text: {
      en: "AI is probably already in your firm, without the rules or the controls. That's the risk to fix first.",
      fr: "L'IA est probablement déjà dans votre cabinet, sans les règles ni les contrôles. C'est le risque à traiter en premier.",
    },
  },
  careful: {
    name: { en: "Careful, but stuck", fr: "Prudent, mais bloqué" },
    text: {
      en: "You're protecting client data, but the team isn't getting the time back. There's a safe way through.",
      fr: "Vous protégez les données clients, mais l'équipe ne gagne pas de temps. Il existe un chemin sûr.",
    },
  },
  covered: {
    name: { en: "Covered", fr: "Couvert" },
    text: {
      en: "The basics are in place. Now make them hold, and start getting real time back.",
      fr: "Les bases sont en place. Il faut maintenant les faire tenir, et commencer à gagner du vrai temps.",
    },
  },
  ready: {
    name: { en: "Ready to build", fr: "Prêt à construire" },
    text: {
      en: "Your foundations are in place. The next step is making what your firm knows work for you.",
      fr: "Vos fondations sont en place. L'étape suivante : faire travailler pour vous ce que sait votre cabinet.",
    },
  },
};

export const TIPS: Record<AreaKey, T> = {
  data: { en: "Write down which AI tools touch client data and where each one stores it. That list is your starting point.", fr: "Notez quels outils d'IA touchent les données clients et où chacun les stocke. Cette liste est votre point de départ." },
  team: { en: "Pick one approved tool on company accounts, and move everyone onto it.", fr: "Choisissez un outil approuvé, sur des comptes de l'entreprise, et faites-y passer toute l'équipe." },
  rules: { en: "Write one page on what can and cannot go into AI, and check it against how the team really works.", fr: "Rédigez une page sur ce qui peut aller ou non dans l'IA, et vérifiez-la face à la façon dont l'équipe travaille vraiment." },
  knowledge: { en: "Start writing down what you learn in each client meeting, in one place, every time.", fr: "Commencez à noter ce que vous apprenez à chaque rendez-vous client, au même endroit, à chaque fois." },
  time: { en: "Choose the one document you write every week and turn it into a template AI can fill.", fr: "Choisissez le document que vous écrivez chaque semaine et transformez-le en modèle que l'IA peut remplir." },
};

export const OFFERS: Record<OfferKey, { title: T; text: T }> = {
  personal: {
    title: { en: "Your own AI system, that you own", fr: "Votre propre système IA, qui vous appartient" },
    text: {
      en: "The system Phil runs his own business on, installed for you, with your business in it. Places open soon, and you're on the list.",
      fr: "Le système sur lequel Phil fait tourner sa propre entreprise, installé pour vous, avec votre activité dedans. Les places ouvrent bientôt, et vous êtes sur la liste.",
    },
  },
  brain: {
    title: { en: "A company brain, on infrastructure you control", fr: "Un cerveau d'entreprise, sur une infrastructure que vous maîtrisez" },
    text: {
      en: "Everything your firm knows, in one place you own and can ask. Kept in the UK, on a system that belongs to you, and your client data never goes into a free or public AI tool.",
      fr: "Tout ce que sait votre cabinet, au même endroit, qui vous appartient et que vous pouvez interroger. Gardé au Royaume-Uni, sur un système qui vous appartient, et vos données clients ne vont jamais dans un outil d'IA gratuit ou public.",
    },
  },
  training: {
    title: { en: "A day with your team, on their own work", fr: "Une journée avec votre équipe, sur son vrai travail" },
    text: {
      en: "Prompting, memory, skills and clear rules on what goes where, done on the work your team repeats every week.",
      fr: "Prompting, mémoire, skills et des règles claires sur ce qui va où, sur le travail que votre équipe répète chaque semaine.",
    },
  },
};
