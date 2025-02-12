"use strict";

// Données des questions
const questions = [
  {
    number: 1,
    description: "Imaginez-vous avoir beaucoup de charges ?",
    type: "select",
    options: ["Oui", "Non"],
    placeholder: "",
    helper: "Les charges sont les dépenses liées à l'activité de l'entreprise : téléphone, internet, loyer, déplacements, logiciels, formations...",
  },
  {
    number: 2,
    description: "Bénéficiez-vous du chômage ?",
    type: "select",
    options: ["Oui", "Non"],
    placeholder: "",
    helper: "Désormais appelée allocation d'aide au retour à l'emploi (ARE), elle est versée par Pôle Emploi aux personnes ayant perdu leur emploi.",
  },
  {
    number: 3,
    description:
      "Si vous touchez le chômage, vous préférez :\n\n• Toucher le chômage et vous verser un dividence important à la fin de l'année ?\n\n• Compléter votre salaire mensuellement sans vous verser un dividende ?\n",
    type: "select",
    options: [
      "Verser un gros dividence à la fin de l'année",
      "Compléter mon salaire mensuellement",
      "Je ne touche pas le chômage",
    ],
    placeholder: "",
    helper: "Le dividende est la part des bénéfices distribuée aux associés ou actionnaires d'une entreprise.",
  },
  {
    number: 4,
    description: "Quelle activité exercez-vous ?",
    type: "select",
    options: ["Libérale", "Commerciale", "Artisanale"],
    placeholder: "",
    helper: "L'activité libérale regroupe les professions intellectuelles (avocat, médecin, architecte, chef de projet, développeur...). L'activité commerciale concerne la vente de produits ou de services. L'activité artisanalae est un métier manuel qui nécessite un savoir-faire particulier.",
  },
  {
    number: 5,
    description:
      "Quel chiffre d'affaires pensez-vous dégager la première année ? (en € HT)",
    type: "number",
    placeholder: "Entrez votre chiffre d'affaires estimé",
  },
  {
    number: 6,
    description:
      "Souhaitez-vous protéger votre patrimoine personnel ou estimez-vous que les risques sont plutôt faibles ?",
    type: "select",
    options: [
      "Je protège mon patrimoine personnel",
      "Les risques sont plutôt faibles",
    ],
    placeholder: "",
    helper: "Préférez l'option 'les risques sont plutôt faibles' si votre activité ne vous amène pas à prendre des risques financiers importants.",
  },
];

let currentStep = 0; // Étape actuelle
const answers = {}; // Stockage des réponses

// Sélection des éléments DOM
const breadcrumb = document.getElementById("breadcrumb");
const questionTitle = document.getElementById("question-title");
const questionDescription = document.getElementById("question-description");
const helper = document.getElementById("helper");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
let winner;

// Initialisation de l'application
function initialize() {
  // Créer le fil d'Ariane
  breadcrumb.innerHTML = "";
  questions.forEach((q, index) => {
    const step = document.createElement("div");
    step.textContent = q.number;
    if (index === 0) step.classList.add("active");
    breadcrumb.appendChild(step);
  });

  // Masquer la div des résultats
  document.getElementById("result-container").style.display = "none";

  // Charger la première question
  loadQuestion();
}

// Charger une question spécifique
function loadQuestion() {
  const question = questions[currentStep];
  questionTitle.textContent = `Question ${question.number}`;
  questionDescription.innerHTML = question.description.replace(/\n/g, "<br>");

  // AJOUTER ICI LE CODE POUR RECUPERER LA REPONSE ENREGISTREE DANS LE LOCAL STORAGE ⚠
  // if (answers...)
  //

  // Il pourrait être intéressant de passer d'un select à des radio buttons pour les questions à choix multiples
  // Configurer l'input dynamiquement
  if (question.type === "select") {
    const questionInput = document.getElementById("question-input");
    const select = document.createElement("select");
    question.options.forEach((opt) => {
      const option = document.createElement("option");
      option.value = opt;
      option.textContent = opt;
      select.appendChild(option);
    });

    questionInput.replaceWith(select);
    select.id = "question-input";
  } else {
    const questionInput = document.getElementById("question-input");
    const input = document.createElement("input");
    input.type = question.type;
    input.placeholder = question.placeholder;
    questionInput.replaceWith(input);
    input.id = "question-input";
  }

  // Faire apparaître l'aide si besoin
  if (question.helper) {
    helper.style.display = "block";
    helper.textContent = question.helper;
  } else {
    helper.style.display = "none";
  }

  // Mettre à jour le fil d'Ariane
  Array.from(breadcrumb.children).forEach((step, index) => {
    step.classList.toggle("active", index === currentStep);
    step.classList.toggle("completed", index < currentStep);
  });

  // Gérer les boutons de navigation
  prevBtn.disabled = currentStep === 0;
  nextBtn.textContent =
    currentStep === questions.length - 1 ? "Terminer" : "Suivant";
  console.log(currentStep);
}

// Passer à une étape donnée
function goToStep(step) {
  // Sauvegarder la réponse actuelle si l'utilisateur ne revient pas en arrière
  const input = document.getElementById("question-input");
  if (currentStep != questions.length) {
  answers[`question${questions[currentStep].number}`] =
    input.value || input.selectedOptions?.[0]?.value;
  }
  // Mettre à jour l'étape
  currentStep = step;

  // Charger la nouvelle question
  loadQuestion();
}

// Gestion des événements des boutons
prevBtn.addEventListener("click", () => {
  goToStep(currentStep - 1)
  document.getElementById("result-container").style.display = "none";
  document.getElementById("question-container").style.display = "block";
});
nextBtn.addEventListener("click", () => {
  if (currentStep < questions.length - 1) {
    goToStep(currentStep + 1);
    document.getElementById("result-container").style.display = "none";
    document.getElementById("question-container").style.display = "block";
  } else {
    currentStep = questions.length;
    console.log("Réponses :", answers);
    computeTotal();
    showResult();
    explainResult();
  }
});

function computeTotal() {
  const question1 = answers["question1"];
  const question2 = answers["question2"];
  const question3 = answers["question3"];
  const question4 = answers["question4"];
  const question5 = answers["question5"];
  const question6 = answers["question6"];

  let micro = 0, eurl = 0, sasu = 0;

  if (question1 === "Oui") {
    eurl += 10;
    sasu += 10;
  } else {
    micro += 100;
  }

  if (question2 === "Oui") {
    micro += 1;
    eurl += 1;
    sasu += 1;
  }

  if (question3 === "Verser un gros dividence à la fin de l'année") {
    sasu += 1;
  } else if (question3 === "Compléter mon salaire mensuellement") {
    micro += 1;
    eurl += 1;
  }

  if (question4 === "Libérale" && question5 <= 77000) {
    micro += 1;
  } else if (question4 === "Libérale" && question5 > 77000) {
    eurl += 10;
    sasu += 10;
  }

  if (question4 === "Commerciale" && question5 <= 188700) {
    micro += 1;
  } else if (question4 === "Commerciale" && question5 > 188700) {
    eurl += 10;
    sasu += 10;
  }

  if (question4 === "Artisanale" && question5 <= 170000) {
    micro += 1;
  } else if (question4 === "Artisanale" && question5 > 170000) {
    eurl += 10;
    sasu += 10;
  }

  if (question6 === "Je protège mon patrimoine personnel") {
    eurl += 1;
    sasu += 1;
  } else {
    micro += 1;
  }

  if (micro > eurl && micro > sasu) {
    winner = "micro";
  } else if (eurl > micro && eurl > sasu) {
    winner = "eurl";
  } else {
    winner = "sasu";
  }
  console.log("micro = " + micro, "\neurl = " + eurl, "\nsasu = " + sasu);
}

function showResult() {
  const questionContainer = document.getElementById("question-container");
  questionContainer.style.display = "none";
  const resultContainer = document.getElementById("result-container");
  document.getElementById("result-title").textContent = "Résultat";
  resultContainer.style.display = "block";
}
// CONTINUER ICI AVEC LES AUTRES RESULTATS ⚠
//
//
function explainResult() {
  if (winner === "micro") {
    document.getElementById("result-description").innerHTML = `<p>Vous devriez opter pour une micro</p>
    <p>Dans les faits, une "micro-entreprise" correspond à un statut fiscal et social, dans la majeure partie des cas, vous êtes ce qu'on appelle un "Entrepreneur Individuel (EI).</p>
    <p>Le statut de la micro-entreprise permet de bénéficier d'une comptabilité allégée et de payer des cotisations sociales et des impôts sur le revenu en fonction du chiffre d'affaires réalisé.</p>
    <p>Ce choix est particulièrement adapté dans des cas où les charges sont faibles, le chiffre d'affaires est limité et les risques sont faibles.</p>
    <h2> Vous souhaitez aller plus loin ?</h2>
    <p>Voici quelques sites pour vous aider à y voir plus clair :</p>
    <ul>
      <li><a href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F31228" target="_blank">Service Public - Micro-entrepreneur</a></li>
      <li><a href="https://www.urssaf.fr/portail/home/independant/je-cree-ma-micro-entreprise.html" target="_blank">URSSAF - Créer ma micro-entreprise</a></li>
      <li><a href="https://www.autoentrepreneur.urssaf.fr/portail/accueil.html" target="_blank">Auto-Entrepreneur URSSAF</a></li>
    </ul>`;
  } 
  
    else if (winner === "eurl") {
    document.getElementById("result-description").textContent = `Vous devriez opter pour une EURL.`
  } 
  
    else {
    document.getElementById("result-description").textContent = `Vous devriez opter pour une SASU.`
  }
}

// Démarrer l'application
initialize();
