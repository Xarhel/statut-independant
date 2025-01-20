"use strict";

const questions = [
    "Quel est ton chiffre d'affaires annuel ?",
    "Quel est ton secteur d'activité ?",
    "Combien d'associés avez-vous ?", // to change
    "Quel est votre régime fiscal actuel ?",
    "Prévoyez-vous de prendre des dividendes ?",
    "Avez-vous des charges élevées ?",
    "Souhaitez-vous une protection sociale renforcée ?",
    "Quel est votre objectif principal (optimisation, simplicité) ?",
    "Quelle est votre préférence pour le statut juridique ?",
    "Voici les résultats basés sur vos réponses."
];

let currentStep = 1;
let index = currentStep - 1;

const breadcrumbSteps = document.querySelectorAll(".breadcrumb-step");
const questionTitle = document.getElementById("questionTitle");
const nextButton = document.getElementById("nextButton");

nextButton.addEventListener("click", () => {
    if (currentStep < 10) {
    currentStep++;
    index = currentStep - 1;
    updateQuestion();
    updateBreadcrumb();
    } else {
    alert("Vous êtes arrivé à la fin du questionnaire !");
    }
});

const previousButton = document.getElementById("previousButton");

previousButton.addEventListener("click", () => {
    if (currentStep > 1) {
        currentStep--;
        index = currentStep - 1;
        updateQuestion();
        updateBreadcrumb();
    } else {
        alert("Vous êtes déjà à la première question !");
    }
});

function updateQuestion() {
    questionTitle.innerText = `Question ${currentStep} : ${questions[currentStep - 1]}`;
}

function updateBreadcrumb() {
    breadcrumbSteps.forEach((step, index) => {
        step.classList.remove("active");
        if (index == currentStep -1) {
            step.classList.add("active");
        }
    });
}
