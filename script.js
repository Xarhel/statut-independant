"use strict";

// Données des questions
const questions = [
    {
      number: 1,
      description: "Imaginez-vous avoir beaucoup de charges ?",
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
      description: "Préférez-vous, toucher le chômage et vous verser un dividence important à la fin de l'année ou compléter votre salaire mensuellement sans vous verser un dididende?",
      type: "select",
      options: ["Verser un gros dividence à la fin de l'année", "Compléter mon salaire mensuellement"],
      placeholder: "",
    },
    {
      number: 4,
      description: "Quel chiffre d'affaires pensez-vous dégager la première année ?",
      type: "number",
      placeholder: "Entrez votre chiffre d'affaires estimé",
    },
    {
      number: 5,
      description: "Souhaitez-vous protéger votre patrimoine personnel ou estimez-vous que les risques sont plutôt faibles ?",
      type: "select",
      options: ["Je protège mon patrimonie personnel", "Ce n'est pas le plus important"],
      placeholder: "",
    },
    {
      number: 6,
      description: "Quelle est votre localisation géographique ?",
      type: "text",
      placeholder: "Ville ou région",
    },
    {
      number: 7,
      description: "Quel est votre domaine d'activité ?",
      type: "text",
      placeholder: "Entrez votre domaine",
    },
    {
      number: 8,
      description: "Depuis combien de temps êtes-vous indépendant ?",
      type: "number",
      placeholder: "Années d'expérience",
    },
    {
      number: 9,
      description: "Souhaitez-vous bénéficier d'une assistance juridique ?",
      type: "select",
      options: ["Oui", "Non"],
      placeholder: "",
    },
    {
      number: 10,
      description: "Quel type de contrat préférez-vous ?",
      type: "select",
      options: ["Micro-entreprise", "SASU", "EURL", "Autre"],
      placeholder: "",
    },
  ];
  
  let currentStep = 0; // Étape actuelle
  const answers = {}; // Stockage des réponses
  
  // Sélection des éléments DOM
  const breadcrumb = document.getElementById("breadcrumb");
  const questionTitle = document.getElementById("question-title");
  const questionDescription = document.getElementById("question-description");
  // const questionInput = document.getElementById("question-input");
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
    questionDescription.textContent = question.description;
  
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
      const prevInput = document.getElementById("question-input");
      const input = document.createElement("input");
      input.type = question.type;
      input.placeholder = question.placeholder;
      prevInput.replaceWith(input);
      input.id = "question-input";
      input.name = "tryout"
    }

    // /!\ Refacto le bloc supérieur pour utiliser des variables plus explicites
  
    // Mettre à jour le fil d'Ariane
    Array.from(breadcrumb.children).forEach((step, index) => {
      step.classList.toggle("active", index === currentStep);
      step.classList.toggle("completed", index < currentStep);
    });
  
    // Gérer les boutons de navigation
    prevBtn.disabled = currentStep === 0;
    nextBtn.textContent = currentStep === questions.length - 1 ? "Terminer" : "Suivant";
  }
  
  // Passer à une étape donnée
  function goToStep(step) {
    // Sauvegarder la réponse actuelle
    const input = document.getElementById("question-input");
    answers[`question${questions[currentStep].number}`] = input.value || input.selectedOptions?.[0]?.value;
  
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
    }
  });
  
  // Démarrer l'application
  initialize();