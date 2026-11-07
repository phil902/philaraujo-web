import type { Lang } from "./check";

/** Inline markup: **bold**, [[highlighted blank]], _italic_ (whole-run only via Block.italic). */
export type Run = { text: string; bold?: boolean; blank?: boolean };
export type Block =
  | { k: "title"; runs: Run[] }
  | { k: "meta"; runs: Run[] }
  | { k: "h"; runs: Run[] }
  | { k: "p"; runs: Run[]; italic?: boolean }
  | { k: "ul"; items: Run[][] }
  | { k: "table"; head: string[]; rows: Run[][][] }
  | { k: "hr" };

export type PolicyInput = {
  lang: Lang;
  firm: string;
  team_size: string;
  sector: string;
  regulated: string;
  tools: string[];
  answers: number[]; // 12 values, 1..4
  today: string; // ISO date
};

export function parseRuns(s: string): Run[] {
  const out: Run[] = [];
  const re = /\*\*(.+?)\*\*|\[\[(.+?)\]\]/g;
  let last = 0, m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push({ text: s.slice(last, m.index) });
    if (m[1] !== undefined) {
      // bold may contain blanks
      for (const r of parseRuns(m[1])) out.push({ ...r, bold: true });
    } else out.push({ text: `[${m[2]}]`, blank: true });
    last = re.lastIndex;
  }
  if (last < s.length) out.push({ text: s.slice(last) });
  return out;
}

const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const addMonths = (d: Date, n: number) => { const x = new Date(d); x.setMonth(x.getMonth() + n); return x; };
export const fmtDate = (d: Date, lang: Lang) =>
  d.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", { day: "numeric", month: "long", year: "numeric" });

type T = { en: string; fr: string };
export const ACTIONS: { q: number; max: number; days: 7 | 30 | 90; text: T }[] = [
  { q: 1, max: 2, days: 7, text: { en: "List every AI tool that touches client data, and where each one stores it.", fr: "Listez chaque outil d'IA qui touche des données clients, et où chacun les stocke." } },
  { q: 4, max: 3, days: 7, text: { en: "Adopt this policy and share it with the team.", fr: "Adoptez cette charte et partagez-la avec l'équipe." } },
  { q: 5, max: 3, days: 7, text: { en: "Name the person who checks AI work before it reaches a client.", fr: "Désignez la personne qui vérifie le travail de l'IA avant qu'il arrive chez un client." } },
  { q: 2, max: 2, days: 30, text: { en: "Move everyone onto firm accounts and stop using personal AI accounts for firm work.", fr: "Passez tout le monde sur des comptes du cabinet et arrêtez les comptes d'IA personnels pour le travail du cabinet." } },
  { q: 3, max: 2, days: 30, text: { en: "Sign a data processing agreement with each provider and switch off training on your data.", fr: "Signez un accord de traitement des données avec chaque fournisseur et désactivez l'entraînement sur vos données." } },
  { q: 6, max: 2, days: 90, text: { en: "Add the wording in Appendix 3 to your client terms.", fr: "Ajoutez la formulation de l'annexe 3 à vos conditions clients." } },
  { q: 8, max: 2, days: 90, text: { en: "Train everyone on the approved tools, on their own work.", fr: "Formez chacun aux outils approuvés, sur son propre travail." } },
  { q: 9, max: 1, days: 90, text: { en: "Start writing client knowledge down in one place everyone can search.", fr: "Commencez à consigner le savoir client au même endroit, accessible à tous." } },
];
const NO_ACTIONS: T = {
  en: "No urgent actions from your answers. Review this policy in six months.",
  fr: "Aucune action urgente d'après vos réponses. Révisez cette charte dans six mois.",
};
const GROUP: T = { en: "Within {n} days (by {date})", fr: "Sous {n} jours (avant le {date})" };

export function actionPlan(answers: number[]) {
  return ACTIONS.filter((a) => { const v = answers[a.q - 1] ?? 0; return v >= 1 && v <= a.max; });
}

const TOOL_NAMES: Record<string, T> = {
  chatgpt: { en: "ChatGPT", fr: "ChatGPT" },
  copilot: { en: "Microsoft Copilot", fr: "Microsoft Copilot" },
  claude: { en: "Claude", fr: "Claude" },
  gemini: { en: "Gemini", fr: "Gemini" },
  notetaker: { en: "Meeting note taker", fr: "Outil de prise de notes en réunion" },
  other: { en: "Other", fr: "Autre" },
};

export function buildPolicy(x: PolicyInput): Block[] {
  const L = x.lang;
  const fr = L === "fr";
  const a = (q: number) => x.answers[q - 1] ?? 0;
  const today = new Date(x.today);
  const d = fmtDate(today, L);
  const review = fmtDate(addMonths(today, 6), L);
  const solo = x.team_size === "solo";
  const legal = x.sector === "legal";
  const annexSector = x.regulated === "no" ? null : ["legal", "financial", "accounting"].includes(x.sector) ? x.sector : null;
  const firm = x.firm.trim();

  const B: Block[] = [];
  const h = (s: string) => B.push({ k: "h", runs: parseRuns(s) });
  const p = (s: string, italic = false) => B.push({ k: "p", runs: parseRuns(s), italic });
  const ul = (...items: (string | false)[]) => B.push({ k: "ul", items: items.filter((i): i is string => !!i).map(parseRuns) });

  const firmRuns: Run[] = firm ? [{ text: firm, bold: true }] : [{ text: fr ? "[Nom du cabinet]" : "[Firm name]", bold: true, blank: true }];
  B.push({ k: "title", runs: [...firmRuns, { text: fr ? " : Charte d'utilisation de l'IA" : ": AI Policy", bold: true }] });

  const tools = x.tools.filter((t) => t !== "none" && TOOL_NAMES[t]);
  const tc = fr ? "[[à confirmer]]" : "[[to confirm]]";
  const toolRows: Run[][][] = (tools.length ? tools : [""]).map((t) => {
    const name = t ? TOOL_NAMES[t]![L] : "";
    return [name ? [{ text: name }] : parseRuns("[[ ]]"), parseRuns("[[ ]]"), parseRuns("[[ ]]"), parseRuns("[[ ]]"), parseRuns(t ? tc : "[[ ]]"), parseRuns(t ? tc : "[[ ]]"), parseRuns(t ? tc : "[[ ]]"), []];
  });

  const plan = actionPlan(x.answers);
  const planBlocks = () => {
    if (!plan.length) { p(NO_ACTIONS[L]); return; }
    for (const n of [7, 30, 90] as const) {
      const items = plan.filter((i) => i.days === n);
      if (!items.length) continue;
      p(`**${GROUP[L].replace("{n}", String(n)).replace("{date}", fmtDate(addDays(today, n), L))}**`);
      ul(...items.map((i) => i.text[L]));
    }
  };

  if (!fr) {
    B.push({ k: "meta", runs: parseRuns(`Version 0.1, draft · ${d} · Owner: [[name]] · Approved by: [[partner or director]] · Next review: ${review}`) });
    h("1. Purpose");
    p("We use AI tools to save time on our own work and to serve clients better. Our clients trust us with their information, and that trust comes before any time saving. This policy sets out which tools we use, what can go into them, who checks the results, and what we do when something goes wrong.");
    h("2. Who and what this covers");
    p("Everyone who works on firm business: partners, directors, employees, contractors and anyone else with access to client information.");
    p("Every AI tool, including AI features inside software we already use (for example Copilot in Microsoft 365, AI in our practice management system, meeting note takers, writing assistants and browser extensions), on any device used for firm work.");
    h("3. Our principles");
    ul("Client confidentiality comes first.", "A person is responsible for every piece of work that leaves the firm, whatever tool helped produce it.", "We only use tools we have approved, on firm accounts.", "We are open with clients about how we use AI.", "We keep a record of what we use and why.");
    h("4. Who does what");
    if (solo) p("The AI owner and the checker are the same person.");
    else ul(
      "**AI owner ([[name]]).** Keeps the tool register, approves new tools, checks providers, runs training, receives incident reports and reviews this policy.",
      "**Checkers ([[name or \"the person who sends the work\"]]).** Review anything AI helped produce before it goes to a client, a court, a regulator or any other third party.",
      "**Everyone.** Uses approved tools only, follows the data rules in section 6, checks their own work and reports problems the same day.",
    );
    h("5. Approved tools");
    p("We only use the tools in the register at Appendix 1, on firm accounts, for the uses listed there.");
    p("To add a tool, ask the AI owner. No tool is used with client information until it passes the checks in section 7. This includes free trials, plug-ins and AI features switched on inside existing software.");
    h("6. What can go into AI tools");
    p("We sort information into three levels.");
    ul(
      "**Green: any approved tool.** Public information, our own templates and know-how with client details removed, general research questions, drafts that contain no client or personal details.",
      "**Amber: only tools approved for client data in Appendix 1.** Client matter information and personal data about clients or their contacts. Use only what the task needs, and remove names and identifiers where you can.",
      `**Red: never, unless the AI owner approves a specific tool in writing.** Special category data (health, ethnicity, religion, sexual orientation, biometric data), criminal records, passwords, bank and card details, ID numbers, material under a court order or injunction, ${legal ? "anything a client has asked us not to share, and privileged material." : "and anything a client has asked us not to share."}`,
    );
    p("If you are not sure which level something is, treat it as red and ask.");
    h("7. What we require from AI providers");
    p("Before a tool is approved for amber information, the AI owner confirms and records:");
    ul(
      "a signed data processing agreement, or terms that meet UK GDPR;",
      "that the provider does not train its models on our data, by contract or by a setting we control and have switched on;",
      "where the data is stored and processed, and the safeguards in place if that is outside the UK;",
      "how long the provider keeps our data, and that we can delete it;",
      "its security: multi-factor sign-in, an independent certification such as ISO 27001 or a SOC 2 report, and a list of its sub-processors;",
      "admin controls that let us see and manage who uses it;",
      "how we get our data out, and have it deleted, if we stop using it.",
    );
    if (a(3) <= 2) p("**Open action: not yet done for all providers. See Appendix 4.**");
    h("8. Personal data and UK GDPR");
    ul(
      "Using AI does not change our data protection duties. We need a lawful basis for any personal data we put into an AI tool, and our privacy notice says that we use AI tools and how.",
      "Before any new use that is likely to be high risk, the AI owner completes a data protection impact assessment. Examples: recording client meetings, processing special category data, or using AI to assess people.",
      "We do not let an AI tool make decisions with legal or similarly significant effects on a person without meaningful human review.",
      "Requests from clients to see or delete their data include what is held in AI tools and their outputs.",
      "AI outputs about clients are kept and deleted under the same retention rules as the rest of the client file.",
    );
    h("9. Using what AI produces");
    ul(
      "A person checks anything AI helped produce before it leaves the firm. The person who sends it is responsible for it.",
      "Check facts, figures, names, dates and calculations against the source.",
      "Check every citation, case, statute, regulation or reference against the original. Never rely on a reference you have not seen yourself.",
      "AI output is a draft. It is never the final word on advice to a client.",
      "Where AI made a material contribution to client work, note it on the file.",
    );
    h("10. Meetings, calls and note takers");
    ul(
      "Only note takers in Appendix 1 may be used.",
      "Tell everyone in the meeting before recording, and get their agreement. A client can say no, and that is recorded.",
      "Transcripts and summaries are client records. They go into the client file and are deleted from the tool under our retention rules.",
      "Check AI meeting notes before relying on them or sending them.",
    );
    h("11. Telling clients");
    ul(
      "Our client terms say that we use AI tools and how we protect client information. Suggested wording is in Appendix 3.",
      "If a client asks how we use AI on their work, we tell them plainly.",
      "If a client asks us not to use AI on their work, we record that and follow it.",
    );
    h("12. Accounts and security");
    ul(
      "Firm accounts only. No personal or free AI accounts for firm work, on any device.",
      "Multi-factor sign-in on every AI tool. No shared logins.",
      "People leaving the firm lose access on their last day.",
      "Browser extensions and plug-ins that read our screens, emails or documents need the AI owner's approval.",
      a(2) <= 2 && "Everyone moves to firm accounts within 30 days of this policy, and personal accounts are no longer used for firm work from that date.",
    );
    h("13. Copyright and ownership");
    ul(
      "Do not upload material we have no right to use, such as paid reports or other firms' documents.",
      "Check that outputs do not reproduce someone else's text before using them.",
      "Templates, prompts and knowledge the firm builds with AI belong to the firm.",
    );
    h("14. Decisions about people");
    p("AI is not used to decide about people, for example in recruitment, staff performance or accepting clients, without a person making the decision and being able to explain it.");
    h("15. Training");
    ul(
      "Everyone is shown how to use the approved tools on their own work, and on this policy, before using AI on client work.",
      "New joiners are trained at induction. Everyone has a refresher once a year, and when a tool or this policy changes.",
      "The AI owner keeps a training record.",
    );
    h("16. Records we keep");
    p("The AI tool register (Appendix 1), the provider checks in section 7, data protection impact assessments, the training record and the incident log.");
    h("17. When something goes wrong");
    ul(
      "Examples: client information put into an unapproved tool, an AI error sent to a client, a provider reporting a breach, a tool behaving unexpectedly.",
      "Tell the AI owner the same day: what happened, which tool, which client, and what information.",
      "The AI owner assesses it. If it is a personal data breach likely to put people at risk, we report it to the ICO within 72 hours of becoming aware, and tell the people affected where the risk is high.",
      "We tell the client where we need to, and report to our regulator where our rules require it (see the annex for our sector).",
      "We record what we learned and change the policy or training if needed.",
    );
    p("Reporting a mistake quickly is the right thing to do. Nobody is penalised for reporting in good faith.");
    h("18. If this policy is not followed");
    p("Breaches are handled under our normal disciplinary process. Hiding a breach is treated more seriously than the breach itself.");
    h("19. Review");
    p("The AI owner reviews this policy every six months, and sooner when we add a tool, change how we work, or the rules change.");
    p(`Signed: [[name]], [[role]], ${d}`);
    B.push({ k: "hr" });
    h("Annex");
    if (annexSector === "legal") p("**Legal (SRA-regulated firms).** Client confidentiality applies to everything put into AI tools (Code of Conduct, paragraph 6.3). Privileged material is red unless the AI owner has approved a specific tool for it. Supervisors remain accountable for work their team produces with AI (paragraph 3.5). No citation, case or authority produced with AI goes into a document, and especially not to a court, until a person has checked it against the original. Our client care letter covers our use of AI. We report serious breaches to the SRA as our rules require.");
    if (annexSector === "financial") p("**Financial advice (FCA-regulated firms).** A named senior manager, [[name]], is accountable for our use of AI. Our use of AI is covered by our Consumer Duty assessment, including the effect on vulnerable customers. AI never gives a recommendation to a client without an adviser's review, and suitability reports drafted with AI are checked and signed off by the adviser. AI meeting notes are reviewed before they go on the client file and are kept under our record-keeping rules.");
    if (annexSector === "accounting") p("**Accounting (ICAEW or ACCA members).** We apply the same professional scepticism to AI output as to any other evidence. Client confidentiality under our professional code applies to AI tools. Calculations and figures produced with AI are checked before use, and anything submitted to HMRC is reviewed by a qualified person. Where AI is used on an engagement, it is noted on the engagement file.");
    p("**Clients in the EU.** If we serve clients in the EU, the EU AI Act may apply to us. Since February 2025 it has expected firms that use AI to make sure their staff have enough AI literacy (Article 4). Section 15 covers this.");
    B.push({ k: "hr" });
    h("Appendix 1: AI tool register");
    B.push({ k: "table", head: ["Tool", "Account type", "Approved for", "Highest level allowed", "Agreement signed", "Training off", "Data location", "Checked by and when"], rows: toolRows });
    if (!solo) {
      h("Appendix 2: One page for the team");
      p("**Do:** use firm accounts and the tools on the register · remove names where you can · check every fact and reference · tell people before recording · report mistakes the same day.");
      p("**Don't:** use personal or free AI accounts for firm work · put red information into any tool · send AI output you haven't checked · install AI plug-ins without approval · record a meeting without agreement.");
    }
    h("Appendix 3: Wording for client terms");
    p("\"We use carefully selected AI tools to help us work efficiently, for example to draft documents and take meeting notes. These tools are used under written agreements that protect your information, your data is not used to train them, and a qualified member of our team checks all work before it reaches you. If you would prefer us not to use AI tools on your work, tell us and we will follow your instruction.\"");
    h("Appendix 4: Your action plan, from your answers");
    planBlocks();
    p("This is a starting draft, not legal advice. Check it against your regulator's current guidance before you adopt it. Phil can go through it with you on the call.", true);
    return B;
  }

  B.push({ k: "meta", runs: parseRuns(`Version 0.1, projet · ${d} · Responsable : [[nom]] · Approuvée par : [[associé ou dirigeant]] · Prochaine révision : ${review}`) });
  h("1. Objet");
  p("Nous utilisons des outils d'IA pour gagner du temps sur notre propre travail et mieux servir nos clients. Nos clients nous confient leurs informations, et cette confiance passe avant tout gain de temps. Cette charte définit les outils que nous utilisons, ce qui peut y être saisi, qui vérifie les résultats, et ce que nous faisons quand quelque chose se passe mal.");
  h("2. Qui et quoi elle couvre");
  p("Toute personne qui travaille pour le cabinet : associés, dirigeants, salariés, prestataires et toute autre personne ayant accès à des informations clients.");
  p("Tout outil d'IA, y compris les fonctions d'IA intégrées aux logiciels que nous utilisons déjà (par exemple Copilot dans Microsoft 365, l'IA de notre logiciel métier, les outils de prise de notes en réunion, les assistants de rédaction et les extensions de navigateur), sur tout appareil utilisé pour le travail du cabinet.");
  h("3. Nos principes");
  ul("La confidentialité des clients passe en premier.", "Une personne est responsable de chaque travail qui sort du cabinet, quel que soit l'outil qui a aidé à le produire.", "Nous n'utilisons que des outils approuvés, sur des comptes du cabinet.", "Nous sommes transparents avec nos clients sur notre usage de l'IA.", "Nous gardons une trace de ce que nous utilisons et pourquoi.");
  h("4. Qui fait quoi");
  if (solo) p("Le responsable IA et le vérificateur sont la même personne.");
  else ul(
    "**Responsable IA ([[nom]]).** Tient le registre des outils, approuve les nouveaux outils, vérifie les fournisseurs, organise la formation, reçoit les signalements d'incident et révise cette charte.",
    "**Vérificateurs ([[nom ou « la personne qui envoie le travail »]]).** Relisent tout ce que l'IA a aidé à produire avant que cela parte chez un client, un tribunal, un régulateur ou tout autre tiers.",
    "**Tout le monde.** Utilise uniquement les outils approuvés, respecte les règles de la section 6, vérifie son propre travail et signale les problèmes le jour même.",
  );
  h("5. Outils approuvés");
  p("Nous n'utilisons que les outils inscrits au registre de l'annexe 1, sur des comptes du cabinet, pour les usages qui y sont indiqués.");
  p("Pour ajouter un outil, demandez au responsable IA. Aucun outil n'est utilisé avec des informations clients avant d'avoir passé les vérifications de la section 7. Cela vaut aussi pour les essais gratuits, les modules complémentaires et les fonctions d'IA activées dans des logiciels existants.");
  h("6. Ce qui peut aller dans les outils d'IA");
  p("Nous classons l'information en trois niveaux.");
  ul(
    "**Vert : tout outil approuvé.** Informations publiques, nos propres modèles et savoir-faire sans détails clients, questions de recherche générales, brouillons ne contenant aucune donnée client ou personnelle.",
    "**Orange : uniquement les outils approuvés pour les données clients à l'annexe 1.** Informations sur les dossiers clients et données personnelles des clients ou de leurs contacts. N'utilisez que ce dont la tâche a besoin, et retirez les noms et identifiants quand vous le pouvez.",
    `**Rouge : jamais, sauf accord écrit du responsable IA pour un outil précis.** Données sensibles (santé, origine, religion, orientation sexuelle, données biométriques), données relatives aux condamnations, mots de passe, coordonnées bancaires et de carte, numéros d'identité, éléments couverts par une décision de justice, ${legal ? "tout ce qu'un client nous a demandé de ne pas partager, et les éléments couverts par le secret professionnel." : "et tout ce qu'un client nous a demandé de ne pas partager."}`,
  );
  p("En cas de doute sur le niveau d'une information, traitez-la comme rouge et demandez.");
  h("7. Ce que nous exigeons des fournisseurs d'IA");
  p("Avant qu'un outil soit approuvé pour des informations de niveau orange, le responsable IA vérifie et consigne :");
  ul(
    "un accord de traitement des données signé, ou des conditions conformes au RGPD ;",
    "que le fournisseur n'entraîne pas ses modèles sur nos données, par contrat ou par un réglage que nous maîtrisons et avons activé ;",
    "où les données sont stockées et traitées, et les garanties en place si c'est hors de l'Union européenne ;",
    "combien de temps le fournisseur conserve nos données, et que nous pouvons les supprimer ;",
    "sa sécurité : connexion à double facteur, une certification indépendante comme ISO 27001 ou un rapport SOC 2, et la liste de ses sous-traitants ;",
    "des outils d'administration qui nous permettent de voir et gérer qui l'utilise ;",
    "comment récupérer nos données, et les faire supprimer, si nous arrêtons de l'utiliser.",
  );
  if (a(3) <= 2) p("**Action ouverte : pas encore fait pour tous les fournisseurs. Voir l'annexe 4.**");
  h("8. Données personnelles et RGPD");
  ul(
    "Utiliser l'IA ne change rien à nos obligations en matière de protection des données. Il nous faut une base légale pour toute donnée personnelle saisie dans un outil d'IA, et notre politique de confidentialité indique que nous utilisons des outils d'IA et comment.",
    "Avant tout nouvel usage susceptible de présenter un risque élevé, le responsable IA réalise une analyse d'impact relative à la protection des données. Exemples : enregistrer des rendez-vous clients, traiter des données sensibles, ou utiliser l'IA pour évaluer des personnes.",
    "Nous ne laissons pas un outil d'IA prendre seul des décisions produisant des effets juridiques ou similaires sur une personne, sans réelle intervention humaine.",
    "Les demandes d'accès ou de suppression de nos clients incluent ce qui est conservé dans les outils d'IA et leurs résultats.",
    "Les résultats de l'IA concernant des clients sont conservés et supprimés selon les mêmes règles que le reste du dossier client.",
  );
  h("9. Utiliser ce que produit l'IA");
  ul(
    "Une personne vérifie tout ce que l'IA a aidé à produire avant que cela sorte du cabinet. La personne qui l'envoie en est responsable.",
    "Vérifiez les faits, chiffres, noms, dates et calculs par rapport à la source.",
    "Vérifiez chaque citation, décision, texte de loi, règlement ou référence par rapport à l'original. Ne vous appuyez jamais sur une référence que vous n'avez pas vue vous-même.",
    "Ce que produit l'IA est un brouillon. Ce n'est jamais le dernier mot d'un conseil donné à un client.",
    "Quand l'IA a contribué de façon importante à un travail client, notez-le dans le dossier.",
  );
  h("10. Réunions, appels et prise de notes");
  ul(
    "Seuls les outils de prise de notes inscrits à l'annexe 1 peuvent être utilisés.",
    "Prévenez toutes les personnes présentes avant d'enregistrer, et obtenez leur accord. Un client peut refuser, et ce refus est consigné.",
    "Les transcriptions et résumés sont des documents clients. Ils vont dans le dossier client et sont supprimés de l'outil selon nos règles de conservation.",
    "Vérifiez les notes produites par l'IA avant de vous y fier ou de les envoyer.",
  );
  h("11. Informer les clients");
  ul(
    "Nos conditions clients indiquent que nous utilisons des outils d'IA et comment nous protégeons les informations des clients. Une proposition de formulation figure à l'annexe 3.",
    "Si un client demande comment nous utilisons l'IA sur son dossier, nous le lui disons clairement.",
    "Si un client nous demande de ne pas utiliser l'IA sur son dossier, nous le consignons et nous le respectons.",
  );
  h("12. Comptes et sécurité");
  ul(
    "Comptes du cabinet uniquement. Aucun compte d'IA personnel ou gratuit pour le travail du cabinet, sur aucun appareil.",
    "Connexion à double facteur sur chaque outil d'IA. Aucun identifiant partagé.",
    "Les personnes qui quittent le cabinet perdent leur accès le dernier jour.",
    "Les extensions et modules qui lisent nos écrans, mails ou documents nécessitent l'accord du responsable IA.",
    a(2) <= 2 && "Tout le monde passe sur des comptes du cabinet dans les 30 jours suivant l'adoption de cette charte, et les comptes personnels ne sont plus utilisés pour le travail du cabinet à partir de cette date.",
  );
  h("13. Droits d'auteur et propriété");
  ul(
    "Ne chargez pas de documents que nous n'avons pas le droit d'utiliser, comme des rapports payants ou des documents d'autres cabinets.",
    "Vérifiez que les résultats ne reproduisent pas le texte de quelqu'un d'autre avant de les utiliser.",
    "Les modèles, consignes et savoir-faire que le cabinet construit avec l'IA appartiennent au cabinet.",
  );
  h("14. Décisions concernant des personnes");
  p("L'IA n'est pas utilisée pour décider au sujet de personnes, par exemple pour un recrutement, l'évaluation d'un collaborateur ou l'acceptation d'un client, sans qu'une personne prenne la décision et puisse l'expliquer.");
  h("15. Formation");
  ul(
    "Chacun apprend à utiliser les outils approuvés sur son propre travail, ainsi que cette charte, avant d'utiliser l'IA sur des dossiers clients.",
    "Les nouveaux arrivants sont formés à leur intégration. Tout le monde suit une mise à jour une fois par an, et à chaque changement d'outil ou de charte.",
    "Le responsable IA tient un registre des formations.",
  );
  h("16. Ce que nous conservons");
  p("Le registre des outils d'IA (annexe 1), les vérifications de la section 7, les analyses d'impact, le registre des formations et le journal des incidents.");
  h("17. Quand quelque chose se passe mal");
  ul(
    "Exemples : des informations clients saisies dans un outil non approuvé, une erreur de l'IA envoyée à un client, un fournisseur qui signale une faille, un outil au comportement inattendu.",
    "Prévenez le responsable IA le jour même : ce qui s'est passé, quel outil, quel client, et quelles informations.",
    "Le responsable IA évalue la situation. S'il s'agit d'une violation de données personnelles susceptible d'engendrer un risque pour les personnes, nous la notifions à l'autorité de protection des données compétente (la CNIL en France) dans les 72 heures après en avoir pris connaissance, et nous informons les personnes concernées si le risque est élevé.",
    "Nous informons le client quand c'est nécessaire, et notre régulateur ou notre ordre professionnel quand nos règles l'exigent (voir l'annexe de notre secteur).",
    "Nous consignons ce que nous en avons appris et ajustons la charte ou la formation si besoin.",
  );
  p("Signaler rapidement une erreur est la bonne chose à faire. Personne n'est sanctionné pour un signalement fait de bonne foi.");
  h("18. Si cette charte n'est pas respectée");
  p("Les manquements sont traités selon nos procédures disciplinaires habituelles. Cacher un manquement est plus grave que le manquement lui-même.");
  h("19. Révision");
  p("Le responsable IA révise cette charte tous les six mois, et plus tôt si nous ajoutons un outil, changeons notre façon de travailler, ou si les règles évoluent.");
  p(`Signé : [[nom]], [[fonction]], ${d}`);
  B.push({ k: "hr" });
  h("Annexe");
  if (annexSector === "legal") p("**Avocats.** Le secret professionnel s'applique à tout ce qui est saisi dans un outil d'IA. Les éléments couverts par le secret professionnel sont de niveau rouge, sauf si le responsable IA a approuvé un outil précis pour cela. Les avocats qui supervisent restent responsables du travail que leur équipe produit avec l'IA. Aucune jurisprudence, citation ou référence produite avec l'IA n'entre dans un document, et encore moins devant une juridiction, avant qu'une personne l'ait vérifiée dans l'original. Notre convention d'honoraires mentionne notre usage de l'IA. Nous respectons les règles de notre ordre en matière de signalement.");
  if (annexSector === "financial") p("**Conseil financier et gestion de patrimoine.** Un dirigeant nommément désigné, [[nom]], est responsable de notre usage de l'IA. Notre usage de l'IA respecte notre devoir de conseil et tient compte des clients vulnérables. L'IA ne fait jamais de recommandation à un client sans la revue d'un conseiller, et les rapports d'adéquation rédigés avec l'IA sont vérifiés et validés par le conseiller. Les notes de réunion produites par l'IA sont relues avant d'aller au dossier client et sont conservées selon nos obligations d'archivage.");
  if (annexSector === "accounting") p("**Expertise comptable.** Nous appliquons aux résultats de l'IA le même esprit critique professionnel qu'à tout autre élément probant. Le secret professionnel s'applique aux outils d'IA. Les calculs et chiffres produits avec l'IA sont vérifiés avant usage, et toute déclaration fiscale est revue par une personne qualifiée. Quand l'IA est utilisée sur une mission, c'est noté dans le dossier de travail.");
  p("**Règlement européen sur l'IA.** Si notre cabinet est établi dans l'Union européenne ou sert des clients dans l'UE, le règlement européen sur l'IA peut s'appliquer à nous. Depuis février 2025, il demande aux entreprises qui utilisent l'IA de s'assurer que leurs équipes ont un niveau suffisant de maîtrise de l'IA (article 4). La section 15 couvre ce point.");
  B.push({ k: "hr" });
  h("Annexe 1 : Registre des outils d'IA");
  B.push({ k: "table", head: ["Outil", "Type de compte", "Approuvé pour", "Niveau maximal autorisé", "Accord signé", "Entraînement désactivé", "Lieu des données", "Vérifié par et quand"], rows: toolRows });
  if (!solo) {
    h("Annexe 2 : Une page pour l'équipe");
    p("**À faire :** utiliser les comptes du cabinet et les outils du registre · retirer les noms quand c'est possible · vérifier chaque fait et chaque référence · prévenir avant d'enregistrer · signaler les erreurs le jour même.");
    p("**À ne pas faire :** utiliser des comptes d'IA personnels ou gratuits pour le travail du cabinet · saisir des informations de niveau rouge dans un outil · envoyer un résultat de l'IA non vérifié · installer des modules d'IA sans accord · enregistrer une réunion sans accord.");
  }
  h("Annexe 3 : Formulation pour les conditions clients");
  p("« Nous utilisons des outils d'IA soigneusement sélectionnés pour travailler efficacement, par exemple pour rédiger des documents et prendre des notes en réunion. Ces outils sont utilisés dans le cadre d'accords écrits qui protègent vos informations, vos données ne servent pas à les entraîner, et un membre qualifié de notre équipe vérifie tout le travail avant qu'il vous parvienne. Si vous préférez que nous n'utilisions pas d'outils d'IA sur votre dossier, dites-le-nous et nous respecterons votre demande. »");
  h("Annexe 4 : Votre plan d'action, à partir de vos réponses");
  planBlocks();
  p("Ceci est un premier projet, pas un avis juridique. Vérifiez-le au regard des recommandations actuelles de votre régulateur ou de votre ordre avant de l'adopter. Phil peut le parcourir avec vous lors de l'appel.", true);
  return B;
}

export const POLICY_STORAGE_KEY = "policy-input";
