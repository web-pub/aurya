/* ============================================================
   AURYA — assets/aurya-shared.js
   Config Firebase, données de référence, fonctions communes
   utilisées par toutes les pages (index, connexion, app, admin)
   ============================================================ */

/* À COMPLÉTER : config de ton projet Firebase
   (Console Firebase → Paramètres du projet → Tes applications → App Web) */
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAh-Lua5jDvzMWoEK4ZIn-tmd7pL00AP0k",
  authDomain: "aurya-hla.firebaseapp.com",
  projectId: "aurya-hla",
  storageBucket: "aurya-hla.firebasestorage.app",
  messagingSenderId: "1001874570820",
  appId: "1:1001874570820:web:b1b26d199cdee23665c611",
};
const FIREBASE_READY = FIREBASE_CONFIG.apiKey !== "REMPLACE_MOI";

/* Domaine interne utilisé pour transformer un "identifiant" en email
   technique pour Firebase Authentication (invisible pour l'utilisateur,
   qui ne voit et ne tape jamais que son identifiant). */
const AURYA_AUTH_DOMAIN = "membres.aurya-app.local";
function identifiantToEmail(identifiant){
  return slugifyId(identifiant) + "@" + AURYA_AUTH_DOMAIN;
}
function slugifyId(s){
  return (s||"").trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/[^a-z0-9.]+/g,"");
}

const LOGO_WORDMARK = "assets/logo-wordmark.png";
const LOGO_MARK = "assets/logo-mark.png";

/* À COMPLÉTER si besoin : lien de destination du logo HL (renvoie vers Hexelya par défaut) */
const HEXELYA_URL = "https://hexelya.web.app/index.html";

const HL_LOGO_DATA = "assets/hl-logo.png";

/* Logo personnel (initiales HL + fusée), fond transparent, mention "Made with AI" retirée,
   fondu dans le décor via une légère ombre douce plutôt qu'un cadre. Cliquable -> Hexelya. */
const LOGO_HL_BADGE = `
<a href="${HEXELYA_URL}" target="_blank" rel="noopener" title="Un site d'Hélène Laruelle — Hexelya" style="display:inline-block;line-height:0;">
  <img src="${HL_LOGO_DATA}" alt="HL" style="width:50px;height:50px;object-fit:contain;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.35));opacity:0.92;transition:opacity .2s, transform .2s;" onmouseover="this.style.opacity=1;this.style.transform='scale(1.06)';" onmouseout="this.style.opacity=0.92;this.style.transform='scale(1)';" />
</a>`;

/* Favicon Aurya, injecté automatiquement sur toutes les pages qui chargent ce fichier.
   Si la page a déjà son propre <link id="favicon-link">, on le réutilise plutôt que d'en créer un second. */
(function injectFavicon(){
  let link = document.getElementById("favicon-link");
  if(!link){
    link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    document.head.appendChild(link);
  }
  link.href = LOGO_MARK;
})();
/* Génère un identifiant et un mot de passe par défaut, selon la règle
   habituelle : identifiant = prenom.1erelettredunom, mot de passe =
   3 premières lettres du prénom + 3 premières lettres du nom + JJMM
   de la date de naissance. Modifiables ensuite par l'admin avant validation. */
/* Bandeau fixe commun à toutes les pages publiques (logo complet à gauche,
   titres de pages cliquables à droite), même principe que le site du club canin.
   Utilisation : document.getElementById("site-topbar-mount").innerHTML = renderSiteTopbar("histoire"); */
const SITE_NAV_PAGES = [
  {id:"index", href:"index.html", label:"Accueil"},
  {id:"histoire", href:"histoire.html", label:"Notre histoire"},
  {id:"conseils", href:"conseils.html", label:"Conseils"},
  {id:"reservation", href:"reservation.html", label:"Réserver un RDV"},
  {id:"contact", href:"contact.html", label:"Contact"},
  {id:"livre-or", href:"livre-or.html", label:"Livre d'or"},
];
/* Ligne de liens légaux du footer, commune à toutes les pages — chaque lien et son
   séparateur restent collés ensemble (white-space:nowrap) pour que le retour à la
   ligne ne coupe jamais un séparateur de son lien : l'espacement reste identique
   partout, quel que soit l'endroit où ça retombe à la ligne. */
const LEGAL_LINKS = [
  {href:"mentions-legales.html#securisation", label:"Sécurisation"},
  {href:"mentions-legales.html#confidentialite", label:"Déclaration de confidentialité"},
  {href:"mentions-legales.html#ethique", label:"Business Ethics & Governance"},
  {href:"mentions-legales.html#cookies", label:"Politique en matière de cookies"},
  {href:"mentions-legales.html#responsabilite", label:"Limitation de responsabilité"},
  {href:"mentions-legales.html#mentions", label:"Mentions légales / RGPD / CGV"},
];
function renderLegalLinks(){
  return LEGAL_LINKS.map((l, i) =>
    `<span class="legal-item"><a href="${l.href}">${l.label}</a>${i < LEGAL_LINKS.length-1 ? '<span class="sep">|</span>' : ''}</span>`
  ).join(" ");
}

function renderSiteTopbar(activeId){
  const links = SITE_NAV_PAGES.map(p =>
    `<a href="${p.href}"${p.id===activeId? ' class="active"':''}>${p.label}</a>`
  ).join("");
  return `
  <div class="site-topbar" id="site-topbar">
    <a href="index.html" class="topbar-logo">
      <img src="${LOGO_WORDMARK}" alt="Aurya" />
      <span class="topbar-slogan">Chaque euro trouve sa place.</span>
    </a>
    <button type="button" class="topbar-burger" onclick="toggleTopbarMenu()" aria-label="Menu">☰</button>
    <div class="topbar-menu">
      <nav>${links}</nav>
      <div class="topbar-auth">
        <a href="connexion.html" class="btn btn-primary">Se connecter</a>
        <a href="connexion.html#devenir-membre" class="btn btn-ghost">Devenir membre</a>
      </div>
    </div>
  </div>
  <div class="topbar-spacer"></div>`;
}
function toggleTopbarMenu(){
  const bar = document.getElementById("site-topbar");
  if(bar) bar.classList.toggle("menu-open");
}

function genererIdentifiant(prenom, nom){
  const p = slugifyId(prenom).replace(/\./g,"");
  const n = slugifyId(nom).replace(/\./g,"");
  return `${p}.${n.charAt(0)||"x"}`;
}
function genererMotDePasse(prenom, nom, naissance){
  const p3 = (prenom||"xxx").trim().toLowerCase().replace(/[^a-z]/g,"").padEnd(3,"x").slice(0,3);
  const n3 = (nom||"xxx").trim().toLowerCase().replace(/[^a-z]/g,"").padEnd(3,"x").slice(0,3);
  let jjmm = "0101";
  if(naissance){
    const d = new Date(naissance+"T00:00:00");
    if(!isNaN(d)) jjmm = String(d.getDate()).padStart(2,"0") + String(d.getMonth()+1).padStart(2,"0");
  }
  return p3+n3+jjmm;
}

/* Politique de mot de passe : renouvellement obligatoire tous les 3 mois */
const PWD_MAX_AGE_DAYS = 90;
function joursDepuisChangementMdp(profile){
  if(!profile || !profile.pwdChangedAt) return Infinity; // jamais changé/tracé = considéré comme expiré
  const then = new Date(profile.pwdChangedAt);
  if(isNaN(then)) return Infinity;
  return Math.floor((Date.now() - then.getTime()) / 86400000);
}
function motDePasseExpire(profile){
  return joursDepuisChangementMdp(profile) >= PWD_MAX_AGE_DAYS;
}
function joursAvantExpirationMdp(profile){
  return Math.max(0, PWD_MAX_AGE_DAYS - joursDepuisChangementMdp(profile));
}

function initFirebaseApp(){
  if(!FIREBASE_READY) return false;
  try{
    if(!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
    return true;
  }catch(e){ console.error("Erreur init Firebase", e); return false; }
}
/* Instance secondaire, utilisée par l'admin pour créer un compte membre
   sans perdre sa propre session de connexion (limite connue du SDK Auth). */
function getSecondaryFirebaseApp(){
  const name = "secondary";
  const existing = firebase.apps.find(a=>a.name===name);
  if(existing) return existing;
  return firebase.initializeApp(FIREBASE_CONFIG, name);
}

function translateAuthError(code){
  const map = {
    "auth/email-already-in-use": "Cet identifiant a déjà un compte.",
    "auth/invalid-email": "Identifiant invalide.",
    "auth/weak-password": "Le mot de passe doit faire au moins 6 caractères.",
    "auth/wrong-password": "Mot de passe incorrect.",
    "auth/user-not-found": "Aucun compte ne correspond à cet identifiant.",
    "auth/invalid-credential": "Identifiant ou mot de passe incorrect.",
    "auth/too-many-requests": "Trop de tentatives, réessaie dans quelques minutes.",
    "auth/missing-password": "Indique un mot de passe.",
  };
  return map[code] || "Une erreur est survenue, réessaie.";
}

/* Liste éditable des enfants (date de naissance + niveau d'étude), réutilisée à
   l'onboarding et dans l'onglet Profil. `prefix` distingue les deux contextes. */
function renderEnfantsRows(enfants, prefix){
  if(!enfants.length) return `<p class="muted-dark" style="font-size:13px;margin:6px 0;">Aucun enfant ajouté pour l'instant.</p>`;
  return enfants.map((e, idx) => `
    <div class="card-narrow" style="background:var(--bg-deep);border:1px solid var(--card-lighter);border-radius:14px;padding:12px;margin-bottom:10px;max-width:none;">
      <div class="field" style="margin-bottom:8px;"><span>Prénom</span><input id="${prefix}-enfant-prenom-${idx}" value="${esc(e.prenom||'')}" placeholder="Ex : Léo" /></div>
      <div class="row" style="gap:8px;flex-wrap:wrap;align-items:flex-end;">
        <div class="field" style="flex:1;min-width:140px;"><span>Date de naissance</span><input type="date" id="${prefix}-enfant-naissance-${idx}" value="${esc(e.naissance||'')}" /></div>
        <div class="field" style="flex:1;min-width:160px;"><span>Niveau d'étude</span>
          <select id="${prefix}-enfant-niveau-${idx}">
            ${NIVEAUX_ETUDE.map(n=>`<option value="${n}" ${e.niveauEtude===n?'selected':''}>${n}</option>`).join("")}
          </select>
        </div>
        <button type="button" class="icon-btn" data-remove-enfant="${idx}" data-prefix="${prefix}" title="Retirer">${ICONS.trash}</button>
      </div>
    </div>`).join("");
}
function readEnfantsRows(count, prefix){
  const enfants = [];
  for(let i=0; i<count; i++){
    const prenom = document.getElementById(`${prefix}-enfant-prenom-${i}`);
    const naissance = document.getElementById(`${prefix}-enfant-naissance-${i}`);
    const niveau = document.getElementById(`${prefix}-enfant-niveau-${i}`);
    if(naissance && niveau) enfants.push({ prenom: prenom? prenom.value : "", naissance: naissance.value, niveauEtude: niveau.value });
  }
  return enfants;
}

const MONTHS_FR = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const NIVEAUX_ETUDE = ["Crèche","Maternelle","Primaire","Secondaire","Supérieur / Université","Terminé / Autre"];
const MONTHS_SHORT = ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Déc"];
const CATEGORIES_REVENU = ["Salaire","Freelance / Indépendant","Allocations","Pension / Retraite","Revenus locatifs","Pension alimentaire reçue","Primes / 13e mois","Bourses / aides","Revenus d'investissement","Autre revenu"];
const CATEGORIES_DEPENSE = ["Logement","Crédits","Banque & dettes","Transport","Assurances","Alimentation","Énergie & eau","Santé","Enfants","Animaux","Habillement","Loisirs","Abonnements & télécom","Entretien & maison","Épargne","Impôts & taxes","Dons & solidarité","Autre dépense"];

/* Postes courants suggérés, pour ajouter rapidement un poste classique */
const SUGGESTIONS_REVENUS = [
  {nom:"Salaire", categorie:"Salaire", frequence:"mensuel"},
  {nom:"Revenus freelance", categorie:"Freelance / Indépendant", frequence:"mensuel"},
  {nom:"Allocations familiales", categorie:"Allocations", frequence:"mensuel"},
  {nom:"Allocations de chômage", categorie:"Allocations", frequence:"mensuel"},
  {nom:"Pension / Retraite", categorie:"Pension / Retraite", frequence:"mensuel"},
  {nom:"Loyers perçus", categorie:"Revenus locatifs", frequence:"mensuel"},
  {nom:"Pension alimentaire reçue", categorie:"Pension alimentaire reçue", frequence:"mensuel"},
  {nom:"13e mois / Prime", categorie:"Primes / 13e mois", frequence:"annuel"},
  {nom:"Double pécule de vacances", categorie:"Primes / 13e mois", frequence:"annuel"},
  {nom:"Chèques-repas", categorie:"Salaire", frequence:"mensuel"},
  {nom:"Bourse / aide aux études", categorie:"Bourses / aides", frequence:"mensuel"},
  {nom:"Revenus d'investissement (dividendes, intérêts)", categorie:"Revenus d'investissement", frequence:"annuel"},
  {nom:"Revenus divers", categorie:"Autre revenu", frequence:"mensuel"},
];
const SUGGESTIONS_DEPENSES = [
  {nom:"Loyer", categorie:"Logement", frequence:"mensuel"},
  {nom:"Charges de copropriété", categorie:"Logement", frequence:"mensuel"},
  {nom:"Crédit maison", categorie:"Crédits", frequence:"mensuel"},
  {nom:"Crédit voiture", categorie:"Crédits", frequence:"mensuel"},
  {nom:"Autre crédit / prêt", categorie:"Crédits", frequence:"mensuel"},
  {nom:"Frais bancaires", categorie:"Banque & dettes", frequence:"mensuel"},
  {nom:"Remboursement dette (carte de crédit, prêt...)", categorie:"Banque & dettes", frequence:"mensuel"},
  {nom:"Carburant", categorie:"Transport", frequence:"mensuel"},
  {nom:"Transport en commun", categorie:"Transport", frequence:"mensuel"},
  {nom:"Entretien véhicule", categorie:"Transport", frequence:"annuel"},
  {nom:"Contrôle technique", categorie:"Transport", frequence:"annuel"},
  {nom:"Parking", categorie:"Transport", frequence:"mensuel"},
  {nom:"Assurance voiture", categorie:"Assurances", frequence:"annuel"},
  {nom:"Assurance maison", categorie:"Assurances", frequence:"annuel"},
  {nom:"Assurance familiale (RC)", categorie:"Assurances", frequence:"annuel"},
  {nom:"Assurance vie", categorie:"Assurances", frequence:"annuel"},
  {nom:"Assurance hospitalisation", categorie:"Assurances", frequence:"annuel"},
  {nom:"Assurance protection juridique", categorie:"Assurances", frequence:"annuel"},
  {nom:"Nourriture / courses", categorie:"Alimentation", frequence:"mensuel"},
  {nom:"Repas au travail / cantine", categorie:"Alimentation", frequence:"mensuel"},
  {nom:"Eau", categorie:"Énergie & eau", frequence:"mensuel"},
  {nom:"Électricité", categorie:"Énergie & eau", frequence:"mensuel"},
  {nom:"Gaz / chauffage", categorie:"Énergie & eau", frequence:"mensuel"},
  {nom:"Mazout", categorie:"Énergie & eau", frequence:"annuel"},
  {nom:"Pellets", categorie:"Énergie & eau", frequence:"annuel"},
  {nom:"Mutuelle", categorie:"Santé", frequence:"mensuel"},
  {nom:"Médecin", categorie:"Santé", frequence:"mensuel"},
  {nom:"Soins de santé", categorie:"Santé", frequence:"mensuel"},
  {nom:"Pharmacie", categorie:"Santé", frequence:"mensuel"},
  {nom:"Dentiste", categorie:"Santé", frequence:"annuel"},
  {nom:"Opticien / contrôle de la vue", categorie:"Santé", frequence:"annuel"},
  {nom:"Lunettes à remplacer", categorie:"Santé", frequence:"annuel"},
  {nom:"Produits hygiène perso", categorie:"Santé", frequence:"mensuel"},
  {nom:"Psychologue / thérapeute", categorie:"Santé", frequence:"mensuel"},
  {nom:"Crèche / garde d'enfants", categorie:"Enfants", frequence:"mensuel"},
  {nom:"Frais scolaires", categorie:"Enfants", frequence:"annuel"},
  {nom:"Voyages scolaires", categorie:"Enfants", frequence:"annuel"},
  {nom:"Fournitures scolaires", categorie:"Enfants", frequence:"annuel"},
  {nom:"Activités extrascolaires", categorie:"Enfants", frequence:"mensuel"},
  {nom:"Scouts / mouvement de jeunesse", categorie:"Enfants", frequence:"annuel"},
  {nom:"Camps / stages vacances", categorie:"Enfants", frequence:"annuel"},
  {nom:"Argent de poche enfants", categorie:"Enfants", frequence:"mensuel"},
  {nom:"Baby-sitting", categorie:"Enfants", frequence:"mensuel"},
  {nom:"Nourriture animaux", categorie:"Animaux", frequence:"mensuel"},
  {nom:"Vétérinaire", categorie:"Animaux", frequence:"annuel"},
  {nom:"Assurance animaux", categorie:"Animaux", frequence:"annuel"},
  {nom:"Toilettage / pension animaux", categorie:"Animaux", frequence:"annuel"},
  {nom:"Vêtements", categorie:"Habillement", frequence:"mensuel"},
  {nom:"Chaussures", categorie:"Habillement", frequence:"annuel"},
  {nom:"Loisirs", categorie:"Loisirs", frequence:"mensuel"},
  {nom:"Sorties", categorie:"Loisirs", frequence:"mensuel"},
  {nom:"Restaurant", categorie:"Loisirs", frequence:"mensuel"},
  {nom:"Soirée entre amis", categorie:"Loisirs", frequence:"mensuel"},
  {nom:"Vie sociale (amis, verre entre amis...)", categorie:"Loisirs", frequence:"mensuel"},
  {nom:"Petits plaisirs (croissants, café...)", categorie:"Loisirs", frequence:"mensuel"},
  {nom:"Abonnement sport", categorie:"Loisirs", frequence:"mensuel"},
  {nom:"Coiffeur / esthétique", categorie:"Loisirs", frequence:"mensuel"},
  {nom:"Vacances", categorie:"Loisirs", frequence:"annuel"},
  {nom:"Cadeaux", categorie:"Loisirs", frequence:"annuel"},
  {nom:"Hobbies (livres, ...)", categorie:"Loisirs", frequence:"mensuel"},
  {nom:"Téléphone / Internet", categorie:"Abonnements & télécom", frequence:"mensuel"},
  {nom:"Netflix", categorie:"Abonnements & télécom", frequence:"mensuel"},
  {nom:"Spotify", categorie:"Abonnements & télécom", frequence:"mensuel"},
  {nom:"Abonnements streaming (autres)", categorie:"Abonnements & télécom", frequence:"mensuel"},
  {nom:"Abonnement magazines", categorie:"Abonnements & télécom", frequence:"mensuel"},
  {nom:"Femme / homme de ménage", categorie:"Entretien & maison", frequence:"mensuel"},
  {nom:"Produits ménagers", categorie:"Entretien & maison", frequence:"mensuel"},
  {nom:"Entretien chaudière", categorie:"Entretien & maison", frequence:"annuel"},
  {nom:"Entretien poêle à pellet", categorie:"Entretien & maison", frequence:"annuel"},
  {nom:"Travaux entretien logement", categorie:"Entretien & maison", frequence:"annuel"},
  {nom:"Jardinage", categorie:"Entretien & maison", frequence:"annuel"},
  {nom:"Réparations / bricolage", categorie:"Entretien & maison", frequence:"annuel"},
  {nom:"Mobilier / électroménager", categorie:"Entretien & maison", frequence:"annuel"},
  {nom:"Précompte immobilier / taxe habitation", categorie:"Impôts & taxes", frequence:"annuel"},
  {nom:"Impôts sur le revenu", categorie:"Impôts & taxes", frequence:"annuel"},
  {nom:"Taxe de circulation", categorie:"Impôts & taxes", frequence:"annuel"},
  {nom:"Taxe poubelle", categorie:"Impôts & taxes", frequence:"annuel"},
  {nom:"Dons / associations", categorie:"Dons & solidarité", frequence:"mensuel"},
  {nom:"Pension alimentaire versée", categorie:"Dons & solidarité", frequence:"mensuel"},
  {nom:"Épargne / virement automatique", categorie:"Épargne", frequence:"mensuel"},
  {nom:"Épargne électroménager", categorie:"Épargne", frequence:"mensuel"},
  {nom:"Épargne remplacement smartphone", categorie:"Épargne", frequence:"mensuel"},
  {nom:"Création fonds d'urgence (3 mois de salaire net)", categorie:"Épargne", frequence:"mensuel"},
  {nom:"Imprévus / divers", categorie:"Autre dépense", frequence:"mensuel"},
];
const ENCOURAGEMENTS = [
  "Chaque euro trouve sa place, petit à petit",
  "Tu avances avec clarté, ton toi du futur te dit merci",
  "Une lumière à la fois, un budget qui s'éclaire",
  "Mettre de côté, c'est t'offrir un peu de sérénité",
  "Bravo d'avoir pris ce moment de clarté aujourd'hui",
];
const ICONS = {
  home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9.5 12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
  list:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/></svg>',
  target:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>',
  chart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20V10M12 20V4M20 20v-7"/></svg>',
  user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>',
  trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg>',
  edit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>',
  smallplus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M12 5v14M5 12h14"/></svg>',
  shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"/></svg>',
  chat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
  logout:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>',
  eye:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>',
};

function uid(){ return Math.random().toString(36).slice(2,10); }
function fmt(n){ const v=Number(n)||0; return v.toLocaleString("fr-BE",{minimumFractionDigits:0,maximumFractionDigits:0})+" €"; }
function fmtPrecise(n){ const v=Number(n)||0; return v.toLocaleString("fr-BE",{minimumFractionDigits:2,maximumFractionDigits:2})+" €"; }
function fmtNumberOnly(n){ const v=Number(n)||0; return v.toLocaleString("fr-BE",{minimumFractionDigits:2,maximumFractionDigits:2}); }
function monthKey(y,m){ return `${y}-${String(m+1).padStart(2,"0")}`; }
function monthlyEquivalent(item){ const m=Number(item.montant)||0; return item.frequence==="annuel"? m/12 : m; }
/* Un poste avec une date de fin (ex: fin de crédit) ne compte plus dans les totaux
   une fois cette date dépassée — utile pour les crédits, abonnements à durée limitée... */
function itemEstActif(item){
  if(!item.dateFin) return true;
  const today = new Date(); today.setHours(0,0,0,0);
  const fin = new Date(item.dateFin+"T00:00:00");
  return fin >= today;
}
function esc(s){ return (s||"").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

function getGreeting(prenom){
  const h = new Date().getHours();
  if(h<5) return `Encore debout, ${esc(prenom)} ?`;
  if(h<12) return `Bonjour ${esc(prenom)}`;
  if(h<18) return `Bon après-midi ${esc(prenom)}`;
  return `Bonsoir ${esc(prenom)}`;
}
function birthdayInfo(naissance){
  if(!naissance) return null;
  const today = new Date();
  const b = new Date(naissance+"T00:00:00");
  const isToday = today.getMonth()===b.getMonth() && today.getDate()===b.getDate();
  let next = new Date(today.getFullYear(), b.getMonth(), b.getDate());
  if(next < new Date(today.getFullYear(), today.getMonth(), today.getDate())){
    next = new Date(today.getFullYear()+1, b.getMonth(), b.getDate());
  }
  const daysUntil = Math.round((next - new Date(today.getFullYear(), today.getMonth(), today.getDate()))/86400000);
  const age = today.getFullYear()-b.getFullYear() - ((today.getMonth()<b.getMonth()||(today.getMonth()===b.getMonth()&&today.getDate()<b.getDate()))?1:0);
  return {isToday, daysUntil, age, nextAge:isToday?age:age+1};
}
