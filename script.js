"use strict";

// Données des questions
const questions = [
  {
    number: 1,
    description: "Imaginez-vous avoir beaucoup de charges ?",
    type: "select",
    options: ["Oui", "Non"],
    placeholder: "",
    shortcut: "Beaucoup de charges",
    helper:
      "Les charges sont les dépenses liées à l'activité de l'entreprise : téléphone, internet, loyer, matières premières, déplacements, logiciels, formations...",
  },
  {
    number: 2,
    description: "Bénéficiez-vous du chômage ?",
    type: "select",
    options: ["Oui", "Non"],
    placeholder: "",
    shortcut: "Chômage",
    helper:
      "Désormais appelée allocation d'aide au retour à l'emploi (ARE), elle est versée par Pôle Emploi aux personnes ayant perdu leur emploi.",
  },
  {
    number: 3,
    description:
      "Si vous touchez le chômage, vous préférez :\n\n• Toucher le chômage et vous verser un dividence à la fin de l'année ?\n\n• Compléter votre salaire mensuellement sans vous verser un dividende ?\n",
    type: "select",
    options: [
      "Verser un dividence à la fin de l'année",
      "Compléter mon salaire mensuellement",
      "Je ne touche pas le chômage",
    ],
    placeholder: "",
    shortcut: "Mode de rémunération",
    helper:
      "Le dividende est la part des bénéfices distribuée aux associés ou actionnaires d'une entreprise.",
  },
  {
    number: 4,
    description: "Quelle activité exercez-vous ?",
    type: "select",
    options: ["Libérale", "Commerciale", "Artisanale"],
    placeholder: "",
    shortcut: "Activité exercée",
    helper:
      "L'activité libérale regroupe les professions intellectuelles (avocat, médecin, architecte, chef de projet, développeur...). L'activité commerciale concerne la vente de produits ou de services. L'activité artisanale est un métier manuel qui nécessite un savoir-faire particulier.",
  },
  {
    number: 5,
    description:
      "Quel chiffre d'affaires pensez-vous dégager la première année ? (en € HT)",
    type: "number",
    placeholder: "Entrez votre chiffre d'affaires estimé",
    shortcut: "chiffre d'affaires annuel",
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
    shortcut: "Protection du patrioine personnel",
    helper:
      "Préférez l'option 'les risques sont plutôt faibles' si votre activité ne vous amène pas à prendre des risques financiers importants.",
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
  loadQuestion(currentStep);
}

// Charger une question spécifique
function loadQuestion(step) {
  currentStep = step;
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

  // Pré-remplir la réponse si elle existe
  if (answers[`${question.number}`]) {
    document.getElementById("question-input").value =
      answers[`${question.number}`];
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
  nextBtn.disabled = false;
  console.log(currentStep);

  //updateResultList();
}

// Passer à une étape donnée
function saveAnswer() {
  // Sauvegarder la réponse actuelle si l'utilisateur ne revient pas en arrière
  const input = document.getElementById("question-input");
  if (input.value == '' && input.type == "number") {
    input.value = 0;
  }

  if (currentStep != questions.length) {
    answers[`${questions[currentStep].number}`] =
      input.value || input.selectedOptions?.[0]?.value;
  }
  updateResultList();
}

function updateResultList() {
  const resultList = document.getElementById("result-list-items");
  resultList.innerHTML = "";
  for (const key in answers) {
    const questionsIterator = key * 1 - 1;
    const item = document.createElement("li");
    item.textContent = `${questions[questionsIterator].shortcut} : ${answers[key]}`;
    resultList.appendChild(item);
  }
}

// Gestion des événements des boutons
prevBtn.addEventListener("click", () => {
  loadQuestion(currentStep - 1);
  document.getElementById("result-container").style.display = "none";
  document.getElementById("question-container").style.display = "block";
  document.getElementById("sidebar").style.display = "block";
});
nextBtn.addEventListener("click", () => {
  saveAnswer();
  if (currentStep < questions.length - 1) {
    loadQuestion(currentStep + 1);
    document.getElementById("result-container").style.display = "none";
    document.getElementById("question-container").style.display = "block";
  } else {
    nextBtn.disabled = true;
    breadcrumb.children[currentStep].classList.toggle("active", false);
    breadcrumb.children[currentStep].classList.toggle("completed", true);
    document.getElementById("sidebar").style.display = "none";
    currentStep = questions.length;
    console.log("Réponses :", answers);
    computeTotal();
    showResult();
    explainResult();
  }
});

function computeTotal() {
  const question1 = answers["1"];
  const question2 = answers["2"];
  const question3 = answers["3"];
  const question4 = answers["4"];
  const question5 = answers["5"];
  const question6 = answers["6"];

  let micro = 0,
    eurl = 0,
    sasu = 0;

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
  resultContainer.style.display = "block";
}
// A tester, éviter de charger le HTML à partir du JS et créer des classes spécifiques pour les résultats
//
//
function explainResult() {
  if (winner === "micro") {
    document.getElementById(
      "result-description-container"
    ).innerHTML = `<h2>Vous devriez opter pour une micro</h2>
    <p>Dans les faits, une "micro-entreprise" correspond à un statut fiscal et social, dans la majeure partie des cas, vous êtes ce qu'on appelle un "Entrepreneur Individuel" (EI).</p>
    <p>Le statut de la micro-entreprise permet de bénéficier d'une comptabilité allégée et de payer des cotisations sociales et des impôts sur le revenu en fonction du chiffre d'affaires réalisé.</p>
    <p>Ce choix est particulièrement adapté dans des cas où les charges sont faibles, le chiffre d'affaires est limité et les risques sont faibles.</p>
    `;
    document.getElementById("result-further-container").innerHTML = `
    <h2>Vous souhaitez en savoir plus ?</h2>
    <a href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F31228" target="_blank">
      <div class="favicon-box">
          <img src="http://www.google.com/s2/favicons?domain=www.service-public.fr" alt="Service Public Favicon">
      </div>
    </a>
    <a href="https://www.urssaf.fr/portail/home/independant/je-cree-ma-micro-entreprise.html" target="_blank">
      <div class="favicon-box">
          <img src="http://www.google.com/s2/favicons?domain=www.urssaf.fr" alt="Service Public Favicon">
      </div>
    </a>
    <a href="https://www.autoentrepreneur.urssaf.fr/portail/accueil.html" target="_blank">
      <div class="favicon-box">
          <img src="http://www.google.com/s2/favicons?domain=www.autoentrepeneur.urssaf.fr" alt="Service Public Favicon">
      </div>
    </a>
    `;
  } else if (winner === "eurl") {
    document.getElementById(
      "result-description-container"
    ).innerHTML = `<p>Vous devriez opter pour une EURL.</p>
    <p>Une EURL est une Entreprise Unipersonnelle à Responsabilité Limitée. C'est une société à responsabilité limitée (SARL) avec un seul associé.</p>
    <p>Le principal avantage de l'EURL est de protéger le patrimoine personnel de l'entrepreneur en cas de difficultés financières de l'entreprise.</p>
    <p>Le choix de l'EURL est particulièrement adapté pour les entrepreneurs individuels qui souhaitent protéger leur patrimoine personnel et bénéficier d'une fiscalité avantageuse.</p>
    `;
    document.getElementById("result-further-container").innerHTML = `
    <h2>Vous souhaitez en savoir plus ?</h2>
    <ul>
      <li><a href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F23262" target="_blank">Service Public - EURL</a></li>
      <li><a href="https://www.legalstart.fr/fiches-pratiques/creation-entreprise/creer-eurl/" target="_blank">Legalstart - Créer une EURL</a></li>
      <li><a href="https://www.legalstart.fr/fiches-pratiques/creation-entreprise/creer-eurl/" target="_blank">Legalstart - Créer une EURL</a></li>
    </ul>`;
  } else {
    let sasuAdvantages = [
      "✅ La SASU est souvent perçue comme une structure plus sérieuse et plus crédible qu'une micro-entreprise.",
      "✅ La SASU est souvent plébiscitée par les entrepreneurs souhaitant maintenir leurs droits au chômage (ARE) tout en se versant un dividende en fin d'année.",
      "✅ La SASU offre une grande souplesse dans l'organisation de l'entreprise.",
      "✅ Le dirigeant de la SASU est 'assimilé salarié', cela signifie qu'il bénéficie d'une protection sociale plus importante que le dirigeant de micro-entreprise ou d'EURL.",
    ];
    let sasuDisadvantages = [
      "❌ La SASU est plus complexe à mettre en place qu'une micro-entreprise.",
      "❌ Le dividende versé par la SASU est calculé après paiement de l'impôt sur les sociétés, 15% jusqu'à 42.500€ de bénéfice et 25% au-delà.",
      "❌ Si vous souhaitez vous verser un salaire, la SASU est moins avantageuse que l'EURL car vous devrez payer des cotisations sociales très importantes sur ce salaire.",
      "❌ La SASU nécessite de rédiger des statuts et de nommer un président, vous pouvez vous faire accompagner pour quelques centaires d'euros ou le faire vous-même.",
    ];
     let websites = [
      {
        url: "https://bpifrance-creation.fr/encyclopedie/structures-juridiques/entreprendre-seul/sasu-societe-actions-simplifiee-unipersonnelle",
        favicon: "http://www.google.com/s2/favicons?domain=www.bpifrance-creation.fr",
        title: "Bpifrance"
      },
      {
        url: "https://www.legalplace.fr/guides/sasu/",
        favicon: "http://www.google.com/s2/favicons?domain=www.legalplace.fr",
        title: "Legalplace"
      },
      {
        url: "https://entreprendre.service-public.fr/vosdroits/F37383",
        favicon: "http://www.google.com/s2/favicons?domain=www.service-public.fr",
        title: "Service Public"
      }
    ]
    const resultAdvantages = document.getElementById("result-advantages");
    resultAdvantages.innerHTML = "";
    for (const advantage of sasuAdvantages) {
      const li = document.createElement("li");
      li.textContent = advantage;
      resultAdvantages.appendChild(li);
    }
    const resultDisadvantages = document.getElementById("result-disadvantages");
    resultDisadvantages.innerHTML = "";
    for (const disadvantage of sasuDisadvantages) {
      const li = document.createElement("li");
      li.textContent = disadvantage;
      resultDisadvantages.appendChild(li);
    }
    document.getElementById("result-title").textContent = "Vous devriez opter pour une SASU";
    document.getElementById("result-description").textContent = "La SASU (Société par Actions Simplifiée Unipersonnelle) est une forme juridique qui permet à un entrepreneur individuel de créer une société. Dans les points ci-dessous, nous prenons l'exemple d'une SASU à l'impôt sur les sociétés (IS) et non à l'impôt sur les revenus (IR).";
    document.getElementById("result-further-description").textContent = "Voici quelques sites pour vous aider à mieux comprendre la SASU";
    createLinks(websites);
  }
}

function createLinks(linksArray) {
  const furtherLinks = document.getElementById("result-further-links");
  furtherLinks.innerHTML = "";

  linksArray.forEach(website => {
    const link = document.createElement("a");
    link.href = website.url;
    link.target = "_blank";

    const faviconBox = document.createElement("div");
    faviconBox.className = "favicon-box";

    const img = document.createElement("img");
    img.src = website.favicon;
    img.alt = `${website.title} + " favicon"`;

    const websiteTitle = document.createElement("p");
    websiteTitle.textContent = website.title;

    faviconBox.appendChild(img);
    link.appendChild(faviconBox);
    furtherLinks.appendChild(link);
    furtherLinks.appendChild(websiteTitle);
  })
};

// Démarrer l'application
initialize();
