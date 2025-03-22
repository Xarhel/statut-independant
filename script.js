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
      "Désormais appelée Allocation d'aide au Retour à l'Emploi (ARE), elle est versée par France Travail (anciennement Pôle Emploi) aux personnes ayant perdu leur emploi.",
  },
  {
    number: 3,
    description:
      "Si vous touchez le chômage, vous préférez :<br><br>👉 Percevoir le chômage et vous verser un dividence à la fin de l'année ?<br><br>👉 Compléter votre chômage mensuellement avec les revenus de votre activité ?",
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
      //"L'activité libérale regroupe les professions intellectuelles (avocat, médecin, architecte, chef de projet, développeur...). L'activité commerciale concerne la vente de produits ou de services. L'activité artisanale est un métier manuel qui nécessite un savoir-faire particulier.",
      `Activité libérale 💼 → Une activité où vous mettez à profit vos compétences intellectuelles, votre expertise (exemple : médecin, avocat, consultant). <br><br>
      Activité commerciale 🛒 → Une activité où vous achetez et revendez des biens ou services pour faire du profit (exemple : commerçant, restaurateur, e-commerce). <br><br>
      Activité artisanale 🛠️ → Une activité où vous frabriquez, réparez ou transformez des produits avec un savoir-faire manuel (exemple : boulanger, coiffeur, menuisier).`
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
      "vous préférez :<br><br>👉 Payer moins de charges sociales mais bénéficier d'une protection sociale plus faible ?<br><br>👉 Payer plus de charges sociales mais bénéficier d'une meilleure protection sociale (notamment retraite et chômage) ?",
    type: "select",
    options: [
      "Moins de charges sociales mais protection sociale plus faible",
      "Plus de de charges sociales mais meilleure protection sociale",
    ],
    placeholder: "",
    shortcut: "Protection sociale",
    helper:
      "La protection sociale correspond aux mécanismes de prévoyance collective (vieillesse, maladie, maladie professionnelle, invalidité, chômage...)",
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
    helper.innerHTML = question.helper;
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
  // console.log(currentStep);
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
    // console.log("Réponses :", answers);
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
    micro += 10;
  }

  if (question2 === "Oui") {
    micro += 1;
    eurl += 1;
    sasu += 1;
  }

  if (question3 === "Verser un dividence à la fin de l'année") {
    sasu += 1;
  } else if (question3 === "Compléter mon salaire mensuellement") {
    micro += 1;
    eurl += 1;
  } else {
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

  if (question6 === "Moins de charges sociales mais protection sociale plus faible") {
    micro += 1;
    eurl += 1;
  } else {
    sasu += 1;
  }

  if (micro >= eurl && micro >= sasu) {
    winner = "micro";
  } else if (eurl >= sasu) {
    winner = "eurl";
  } else {
    winner = "sasu";
  }
  // console.log("micro = " + micro, "\neurl = " + eurl, "\nsasu = " + sasu);
}

function showResult() {
  const questionContainer = document.getElementById("question-container");
  questionContainer.style.display = "none";
  const resultContainer = document.getElementById("result-container");
  resultContainer.style.display = "block";
}

function explainResult() {
  if (winner === "micro") {
    let microAdvantages = [
      "✅ La Micro-entreprise peut être une solution temporaire pour tester votre activité avant de vous lancer dans une structure plus complexe comme l'EURL ou la SASU.",
      "✅ La Micro-entreprise est très facile à mettre en place, en quelques clics sur le site du guichet unique.",
      "✅ La Micro-entreprise est très simple à gérer au quotidien ; vous n'avez pas besoin de tenir une comptabilité complexe.",
      "✅ La Micro-entreprise bénéficie, depuis 2022, de la possibilité de limiter la responsabilité du dirigeant en cas de dette importante aux seuls biens utiles à l'activité professionnelle.",
      "✅ Si vous bénéficiez du chômage (ARE), vous pouvez compléter vos allocations avec les revenus de votre micro-entreprise.",
    ];
    let microDisadvantages = [
      "❌ La Micro-entreprise possède un plafond de chiffre d'affaires, en 2025, celui-ci est de 188.700€ pour les activités de vente de marchandises et de fourniture de logement et de 77.700€ pour les prestations de services.",
      "❌ En cas de dépassement du plafond, vous devrez changer de régime fiscal et social, ce qui entraînera des démarches administratives supplémentaires.",
      "❌ Au régime micro vous ne pouvez pas déduire vos charges de votre chiffre d'affaires, vous bénéficiez néanmoins d'un abattement forfaitaire qui vient réduire votre revenu imposable. Si vous avez beaucoup de charges, il est préférable de ne pas opter pour la micro-entreprise.",
      "❌ Il n'est pas possible de moduler son salaire en micro-entreprise, vous êtes donc imposé sur 100% des revenus de votre activité (après abattement).",
      "❌ Vous êtes considéré comme un Travailleur Non Salarié (TNS), vous payez donc des charges sociales moins importantes qu'un salarié mais bénéficiez de moins de couverture sociale.",
      "❌ Certaines activités ne sont pas compatibles avec le régime micro, renseignez-vous avant de vous lancer.",
    ];
     let websites = [
      {
        url: "https://bpifrance-creation.fr/moment-de-vie/quest-ce-quun-micro-entrepreneur",
        favicon: "http://www.google.com/s2/favicons?domain=www.bpifrance-creation.fr",
        title: "Bpifrance"
      },
      {
        url: "https://www.legalplace.fr/guides/regime-micro-entreprise/",
        favicon: "http://www.google.com/s2/favicons?domain=www.legalplace.fr",
        title: "Legalplace"
      },
      {
        url: "https://entreprendre.service-public.fr/vosdroits/F23961",
        favicon: "http://www.google.com/s2/favicons?domain=www.service-public.fr",
        title: "Service Public"
      }
    ]
    const resultAdvantages = document.getElementById("result-advantages");
    resultAdvantages.innerHTML = "";
    for (const advantage of microAdvantages) {
      const li = document.createElement("li");
      li.textContent = advantage;
      resultAdvantages.appendChild(li);
    }
    const resultDisadvantages = document.getElementById("result-disadvantages");
    resultDisadvantages.innerHTML = "";
    for (const disadvantage of microDisadvantages) {
      const li = document.createElement("li");
      li.textContent = disadvantage;
      resultDisadvantages.appendChild(li);
    }
    document.getElementById("result-title").textContent = "Vous devriez opter pour une Micro-entreprise";
    document.getElementById("result-description").innerHTML = "La micro-entreprise est une forme juridique très simple à mettre en place et à gérer. Elle est souvent choisie par les entrepreneurs individuels qui débutent leur activité et/ou qui ne pensent pas dépasser les plafonds de chiffre d'affaires.<br><br> Dans les points ci-dessous, nous prenons l'exemple d'une Entreprise Individuelle (EI) au régime micro-fiscal et micro-social.";
    document.getElementById("result-further-description").textContent = "Voici quelques sites pour vous aider à mieux comprendre la micro-entreprise";
    createLinks(websites);
  } else if (winner === "eurl") {
    let eurlAdvantages = [
      "✅ L'EURL est souvent perçue comme une structure plus sérieuse et plus crédible qu'une micro-entreprise.",
      "✅ L'EURL est souvent choisie par les entrepreneurs souhaitant se verser un salaire plutôt qu'un dividende en fin d'année.",
      "✅ Si vous bénéficiez du chômage, vous pouvez vous verser un salaire minimal et conserver vos droits au chômage qui complèteront votre rémunération.",
      "✅ Vous souhaitez faire évoluer votre structure ? L'EURL est plus facile à transformer en SARL ou en SASU qu'une micro-entreprise.",
      "✅ L'EURL permet de moduler le montant de votre salaire et de votre dividende, vous pouvez ainsi optimiser votre rémunération et votre fiscalité ; ce qui n'est pas le cas en micro-entreprise.",
      "✅ En tant que dirigeant associé unique d'une EURL, vous êtes considéré comme un Travailleur Non Salarié (TNS), vous payez beaucoup moins de charges sociales (du simple au double) qu'un président de SASU mais êtes moins couvert en cas de maladie ou de chômage.",
    ];
    let eurlDisadvantages = [
      "❌ L'EURL est plus complexe à mettre en place qu'une micro-entreprise, elle présente un coût de création et nécessite plusieurs démarches administratives pour lesquelles vous pouvez facilement vous faire accompagner.",
      "❌ Même si votre EURL ne dégage pas de bénéfices, vous devrez payer des cotisations sociales minimales, environ 1.000€ par an.",
      "❌ L'EURL est une structure plus rigide que la SASU, néanmoins, si vous êtes seul à la tête de l'entreprise, cela ne devrait pas poser de problème.",

    ];
     let websites = [
      {
        url: "https://bpifrance-creation.fr/encyclopedie/structures-juridiques/entreprendre-seul/eurl-ou-sarl-a-associe-unique",
        favicon: "http://www.google.com/s2/favicons?domain=www.bpifrance-creation.fr",
        title: "Bpifrance"
      },
      {
        url: "https://www.legalplace.fr/guides/eurl/",
        favicon: "http://www.google.com/s2/favicons?domain=www.legalplace.fr",
        title: "Legalplace"
      },
      {
        url: "https://entreprendre.service-public.fr/vosdroits/F37777",
        favicon: "http://www.google.com/s2/favicons?domain=www.service-public.fr",
        title: "Service Public"
      }
    ]
    const resultAdvantages = document.getElementById("result-advantages");
    resultAdvantages.innerHTML = "";
    for (const advantage of eurlAdvantages) {
      const li = document.createElement("li");
      li.textContent = advantage;
      resultAdvantages.appendChild(li);
    }
    const resultDisadvantages = document.getElementById("result-disadvantages");
    resultDisadvantages.innerHTML = "";
    for (const disadvantage of eurlDisadvantages) {
      const li = document.createElement("li");
      li.textContent = disadvantage;
      resultDisadvantages.appendChild(li);
    }
    document.getElementById("result-title").textContent = "Vous devriez opter pour une EURL";
    document.getElementById("result-description").innerHTML = "l'EURL (Entreprise Unipersonnelle à Responsabilité Limitée) est une forme juridique qui permet à un entrepreneur individuel de créer une société.<br><br> Dans les points ci-dessous, nous prenons l'exemple d'une EURL à l'impôt sur les sociétés (IS) et non à l'impôt sur les revenus (IR).";
    document.getElementById("result-further-description").textContent = "Voici quelques sites pour vous aider à mieux comprendre l'EURL";
    createLinks(websites);
  } else {
    let sasuAdvantages = [
      "✅ La SASU est souvent perçue comme une structure plus sérieuse et plus crédible qu'une micro-entreprise ou qu'une EURL.",
      "✅ La SASU est souvent choisie par les entrepreneurs souhaitant maintenir leurs droits au chômage (ARE) tout en se versant un dividende en fin d'année.",
      "✅ La SASU offre une grande souplesse dans l'organisation de l'entreprise, facilitant ainsi la croissance de l'entreprise et l'arrivée de nouveaux associés.",
      "✅ La SASU permet de moduler le montant de votre salaire et de votre dividende, vous pouvez ainsi optimiser votre rémunération et votre fiscalité ; ce qui n'est pas le cas en micro-entreprise.",
      "✅ Le dirigeant de la SASU est assimilé salarié, cela signifie qu'il bénéficie d'une protection sociale plus importante que le dirigeant de micro-entreprise ou d'EURL.",
    ];
    let sasuDisadvantages = [
      "❌ La SASU est plus complexe à mettre en place qu'une micro-entreprise.",
      "❌ Le dividende versé est calculé après paiement de l'impôt sur les sociétés, 15% jusqu'à 42.500€ de bénéfice et 25% au-delà.",
      "❌ Si vous souhaitez vous verser un salaire, la SASU est moins avantageuse que l'EURL car vous devez payer des cotisations sociales très importantes sur ce salaire.",
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
    // ⚠️ TODO: Refactor this code to avoid repetition
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
    document.getElementById("result-description").innerHTML = "La SASU (Société par Actions Simplifiée Unipersonnelle) est une forme juridique qui permet à un entrepreneur individuel de créer une société.<br><br> Dans les points ci-dessous, nous prenons l'exemple d'une SASU à l'impôt sur les sociétés (IS) et non à l'impôt sur les revenus (IR).";
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
