"use strict";

// Données des questions
const questions = [
  {
    number: 1,
    description: "<strong>Imaginez-vous avoir beaucoup de charges ?</strong>",
    type: "select",
    options: ["Oui", "Non"],
    placeholder: "",
  },
  {
    number: 2,
    description: "Bénéficiez-vous du chômage ?",
    type: "select",
    options: ["Oui", "Non"],
    placeholder: "",
  },
  {
    number: 3,
    description:
      "Si vous touchez le chômage, préférez-vous:\n• toucher le chômage et vous verser un dividence important à la fin de l'année\n• compléter votre salaire mensuellement sans vous verser un dividende?",
    type: "select",
    options: [
      "Verser un gros dividence à la fin de l'année",
      "Compléter mon salaire mensuellement",
      "Je ne touche pas le chômage",
    ],
    placeholder: "",
  },
  {
    number: 4,
    description: "Quelle activité exercez-vous ?",
    type: "select",
    options: ["Libérale", "Commerciale", "Artisanale"],
    placeholder: "",
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
  },
];

let currentStep = 0; // Étape actuelle
const answers = {}; // Stockage des réponses

// Sélection des éléments DOM
const breadcrumb = document.getElementById("breadcrumb");
const questionTitle = document.getElementById("question-title");
const questionDescription = document.getElementById("question-description");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

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

  // Charger la première question
  loadQuestion();
}

// Charger une question spécifique
function loadQuestion() {
  const question = questions[currentStep];
  questionTitle.textContent = `Question ${question.number}`;
  questionDescription.innerHTML = question.description.replace(/\n/g, "<br>");

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

  // /!\ Refacto le bloc supérieur pour utiliser des variables plus explicites

  // Mettre à jour le fil d'Ariane
  Array.from(breadcrumb.children).forEach((step, index) => {
    step.classList.toggle("active", index === currentStep);
    step.classList.toggle("completed", index < currentStep);
  });

  // Gérer les boutons de navigation
  prevBtn.disabled = currentStep === 0;
  nextBtn.textContent =
    currentStep === questions.length - 1 ? "Terminer" : "Suivant";
}

// Passer à une étape donnée
function goToStep(step) {
  // Sauvegarder la réponse actuelle
  const input = document.getElementById("question-input");
  answers[`question${questions[currentStep].number}`] =
    input.value || input.selectedOptions?.[0]?.value;

  // Mettre à jour l'étape
  currentStep = step;

  // Charger la nouvelle question
  loadQuestion();
}

// Gestion des événements des boutons
prevBtn.addEventListener("click", () => goToStep(currentStep - 1));
nextBtn.addEventListener("click", () => {
  if (currentStep < questions.length - 1) {
    goToStep(currentStep + 1);
  } else {
    console.log("Réponses :", answers);
    alert("Questionnaire terminé !");
    computeTotal();
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

  let winner;

  if (micro > eurl && micro > sasu) {
    winner = "micro";
  } else if (eurl > micro && eurl > sasu) {
    winner = "eurl";
  } else {
    winner = "sasu";
  }
  console.log("micro = " + micro, "\neurl = " + eurl, "\nsasu = " + sasu);
}

// Démarrer l'application
initialize();
