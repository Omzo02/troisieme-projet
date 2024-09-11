import { checkAuthToken } from './auth.js';

// Vérification de l'authentification au chargement de la page
window.onload = function() {
  checkAuthToken();
};

// Sélectionner les éléments du DOM
const worksContainer = document.getElementById('works-container'); // Conteneur pour les travaux
const filterButtons = document.querySelectorAll('#filter-container button'); // Sélectionne les boutons de filtre

// Fonction pour récupérer et afficher les travaux
async function loadWorks() {
  try {
    // Récupérer les travaux depuis l'API
    const worksResponse = await fetch('http://localhost:5678/api/works');
    const works = await worksResponse.json();

    // Afficher tous les travaux par défaut
    renderWorks(works);

    // Ajouter des événements de clic aux boutons de filtre
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Désactiver tous les boutons actifs
        filterButtons.forEach(btn => btn.classList.remove('active'));

        // Activer le bouton cliqué
        button.classList.add('active');

        // Appliquer le filtre correspondant
        applyFilter(button.textContent, works);
      });
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des travaux :', error);
  }
}

// Fonction pour appliquer le filtre en fonction du texte du bouton
function applyFilter(category, works) {
  if (category === 'Tous') {
    renderWorks(works); // Afficher tous les travaux
  } else {
    // Filtrer les travaux en fonction de la catégorie
    const filteredWorks = works.filter(work => work.category.name === category);
    renderWorks(filteredWorks);
  }
}

// Fonction pour afficher les travaux
function renderWorks(worksToRender) {
  worksContainer.innerHTML = ''; // Vider le conteneur avant d'ajouter de nouveaux éléments

  worksToRender.forEach(work => {
    const workElement = document.createElement('figure');
    const imgElement = document.createElement('img');
    const captionElement = document.createElement('figcaption');

    imgElement.src = work.imageUrl;
    imgElement.alt = work.title;
    captionElement.textContent = work.title;

    workElement.appendChild(imgElement);
    workElement.appendChild(captionElement);

    worksContainer.appendChild(workElement);
  });
}

// Charger les travaux et les catégories au chargement de la page
window.addEventListener('load', loadWorks);

