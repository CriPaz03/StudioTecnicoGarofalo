import additionalProjects from "./additional-projects.json";

export const siteConfig = {
  name: "Studio Tecnico Garofalo",
  title:
    "Geometra a Bitonto | Studio Tecnico Garofalo",
  description:
    "Studio tecnico e geometra a Bitonto: progettazione di interni, pratiche edilizie CILA e SCIA, accatastamenti, certificazioni energetiche APE e render fotorealistici.",
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "garofalogeom@liberp.it",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+39 3331266694",
  vatId: "06579860724",
  address: {
    streetAddress: "Via G. Verdi, 64",
    postalCode: "70032",
    addressLocality: "Bitonto",
    addressRegion: "BA",
    addressCountry: "IT",
  },
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Via G. Verdi 64, 70032 Bitonto BA, Italia")}`,
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "+39 3331266694",
  areaServed: process.env.NEXT_PUBLIC_AREA_SERVED || "",
  privacyUrl: process.env.NEXT_PUBLIC_PRIVACY_URL || "/privacy",
  privacyUpdatedAt: "2026-10-01",
};
export const navigation = [
  ["Servizi", "#servizi"],
  ["Progetti", "#progetti"],
  ["Metodo", "#metodo"],
  ["Contatti", "#contatti"],
] as const;
export { services } from "./services";
export const projects = [
  {
    image: "living",
    title: "Luce, materia, quotidianità",
    category: "Living",
    alt: "Render di soggiorno con divano angolare, tavolino rotondo e illuminazione perimetrale",
  },
  {
    image: "kitchen",
    title: "Il cuore della casa",
    category: "Cucine",
    alt: "Cucina contemporanea con rivestimento in legno, penisola e illuminazione integrata",
  },
  {
    image: "bedroom",
    title: "Uno spazio per rallentare",
    category: "Camere",
    alt: "Camera matrimoniale con toni neutri, letto imbottito e luce naturale",
  },
  {
    image: "bathroom",
    title: "Equilibrio nei dettagli",
    category: "Bagni",
    alt: "Bagno con specchio circolare retroilluminato, mobile in legno e rivestimento in marmo",
  },
  {
    image: "facade",
    title: "Abitare il contesto",
    category: "Residenziale",
    alt: "Prospetto di edificio residenziale contemporaneo inserito nel contesto urbano",
  },
  {
    image: "living-day",
    title: "Spazi in relazione",
    category: "Interni",
    alt: "Soggiorno e zona pranzo con arredi contemporanei e ampie finestre",
  },
  {
    image: "section",
    title: "Leggere il progetto",
    category: "Modellazione 3D",
    alt: "Spaccato tridimensionale di un appartamento con distribuzione degli ambienti e degli arredi",
  },
  {
    image: "bedroom-single",
    title: "L’essenziale, ben progettato",
    category: "Camere",
    alt: "Camera singola luminosa con scrivania, armadiatura e letto",
  },
  {
    image: "residential",
    title: "Architettura al crepuscolo",
    category: "Esterni",
    alt: "Render serale di complesso residenziale con illuminazione delle facciate",
  },
  {
    image: "living-alt",
    title: "Prospettive dell’abitare",
    category: "Living",
    alt: "Vista del soggiorno verso la parete TV con camino e rivestimenti materici",
  },
  {
    image: "exterior",
    title: "Contrasti materici",
    category: "Bagni",
    alt: "Bagno con rivestimento scuro, specchio luminoso e lavabo d’appoggio",
  },
  {
    image: "kitchen-detail",
    title: "Funzione e semplicità",
    category: "Cucine",
    alt: "Cucina lineare bianca e in legno con tavolo da pranzo e luce naturale",
  },
  ...additionalProjects,
] as const;
export const projectGroups = [
  { id: "interni", label: "Interni", categories: ["Living", "Cucine", "Camere", "Bagni", "Interni"] },
  { id: "esterni", label: "Esterni", categories: ["Esterni", "Residenziale"] },
  { id: "modelli", label: "Modelli e spaccati", categories: ["Modellazione 3D"] },
];

export const stages = [
  {
    name: "Progettazione",
    title: "Ogni spazio nasce da un’idea.",
    text: "Studiamo distribuzione, proporzioni e funzionalità prima ancora di trasformarle in volume.",
  },
  {
    name: "Modellazione",
    title: "Diamo forma al progetto.",
    text: "Dal disegno 2D al modello tridimensionale, per comprendere ogni ambiente prima della realizzazione.",
  },
  {
    name: "Materiali",
    title: "Definiamo ogni superficie.",
    text: "Materiali, finiture e dettagli costruiscono un linguaggio coerente.",
  },
  {
    name: "Visualizzazione",
    title: "Lo spazio prende vita.",
    text: "Arredi, luce e atmosfera trasformano il modello in un ambiente concreto e leggibile.",
  },
  {
    name: "Render",
    title: "Dall’idea alla realtà.",
    text: "Render fotorealistici per vedere il risultato prima ancora di realizzarlo.",
  },
] as const;
export const processSteps = [
  [
    "Ascolto e analisi",
    "Partiamo dalle esigenze, dagli spazi e dalla documentazione disponibile.",
  ],
  [
    "Progettazione",
    "Definiamo la distribuzione e sviluppiamo le soluzioni progettuali.",
  ],
  [
    "Modellazione e visualizzazione",
    "Esploriamo volumi, materiali e luce attraverso modelli 3D e render.",
  ],
  [
    "Documentazione tecnica",
    "Prepariamo gli elaborati e le pratiche previsti dall’incarico.",
  ],
  [
    "Consegna",
    "Condividiamo il progetto e la documentazione, con una lettura chiara delle scelte.",
  ],
] as const;
export const faqs = [
  [
    "Posso partire da un’idea, senza un progetto già definito?",
    "Sì. Il confronto iniziale serve proprio a chiarire esigenze e obiettivi. Planimetrie, fotografie e documentazione dell’immobile, se disponibili, aiutano a inquadrare il lavoro.",
  ],
  [
    "A cosa serve un render fotorealistico?",
    "Permette di valutare spazi, materiali, arredi e illuminazione prima della realizzazione. È uno strumento per confrontare le scelte progettuali; il risultato rappresentato dipende dalle soluzioni e dai materiali definiti nel progetto.",
  ],
  [
    "Qual è la differenza tra disegno 2D e modello 3D?",
    "Il disegno 2D descrive piante, sezioni e prospetti. Il modello 3D rende leggibili i volumi e le relazioni tra gli ambienti. I due strumenti si completano durante la progettazione.",
  ],
  [
    "Seguite anche pratiche edilizie e catastali?",
    "Lo studio si occupa di pratiche edilizie, incluse CILA e SCIA, accatastamenti e certificazioni energetiche. La prestazione necessaria viene definita dopo l’analisi dell’immobile e dell’intervento.",
  ],
  [
    "Cosa devo indicare nella richiesta di consulenza?",
    "Descrivi il tipo di immobile, l’intervento che hai in mente e il servizio di cui hai bisogno. Se il progetto è ancora da definire, raccontaci semplicemente il tuo punto di partenza.",
  ],
] as const;
