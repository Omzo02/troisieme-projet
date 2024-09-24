function checkAuthToken() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
  }
}
const worksContainer = document.getElementById('works-container');
const filterButtons = document.querySelectorAll('#filter-container button');

// Fonction pour récupérer et afficher les travaux
async function loadWorks() {
  try {
    const worksResponse = await fetch('http://localhost:5678/api/works');
    const works = await worksResponse.json();
    renderWorks(works);

    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        applyFilter(button.textContent, works);
      });
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des travaux :', error);
  }
}

// Fonction pour appliquer le filtre
function applyFilter(category, works) {
  if (category === 'Tous') {
    renderWorks(works);
  } else {
    const filteredWorks = works.filter(work => work.category.name === category);
    renderWorks(filteredWorks);
  }
}

// Fonction pour afficher les travaux
function renderWorks(worksToRender) {
  worksContainer.innerHTML = ''; 
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

// Charger les travaux au chargement de la page
window.addEventListener('load', loadWorks);

// Sélection du bouton login/logout
const loginLogoutBtn = document.querySelector('nav ul li:nth-child(3)');

// Vérification du token dans localStorage
function checkLoginStatus() {
    const token = localStorage.getItem('token'); // Récupérer le token stocké
    console.log("Token détecté :", token);

  
    if (token) {
        // Si le token est présent, l'utilisateur est connecté
        loginLogoutBtn.textContent = 'logout'; // Afficher "logout"
        loginLogoutBtn.removeEventListener('click', handleLogin); // Enlever l'événement login
        loginLogoutBtn.addEventListener('click', handleLogout); // Ajouter l'événement logout
    } else {
        // Si pas de token, l'utilisateur n'est pas connecté
        loginLogoutBtn.textContent = 'login'; // Afficher "login"
        loginLogoutBtn.removeEventListener('click', handleLogout); // Enlever l'événement logout
        loginLogoutBtn.addEventListener('click', handleLogin); // Ajouter l'événement login
    }
}

function checkLoginStatus() {
    const token = localStorage.getItem('token'); // Récupérer le token stocké
    const modifyButton = document.getElementById('modify-button'); // Change cela en fonction de l'ID réel

    if (token) {
        // Si le token est présent, l'utilisateur est connecté
        loginLogoutBtn.textContent = 'logout'; // Afficher "logout"
        loginLogoutBtn.removeEventListener('click', handleLogin); // Enlever l'événement login
        loginLogoutBtn.addEventListener('click', handleLogout); // Ajouter l'événement logout
        
        // Masquer le bouton "modifier"
        if (modifyButton) {
            modifyButton.style.display = 'none';
        }
    } else {
        // Si pas de token, l'utilisateur n'est pas connecté
        loginLogoutBtn.textContent = 'login'; // Afficher "login"
        loginLogoutBtn.removeEventListener('click', handleLogout); // Enlever l'événement logout
        loginLogoutBtn.addEventListener('click', handleLogin); // Ajouter l'événement login
        
        // Afficher le bouton "modifier" si nécessaire
        if (modifyButton) {
            modifyButton.style.display = 'block'; // ou 'inline' selon le style voulu
        }
    }
}

// Gestion du clic sur "login"
function handleLogin() {
    window.location.href = 'login.html'; // Rediriger vers la page de connexion
}

// Gestion du clic sur "logout"
function handleLogout() {
    localStorage.removeItem('token'); // Supprimer le token
    window.location.reload(); // Recharger la page pour actualiser l'état de connexion
}

// Appel pour vérifier l'état de connexion dès que la page est chargée
window.addEventListener('load', checkLoginStatus);

// Sélectionne les éléments nécessaires
const modal = document.getElementById('modal');
const openModalBtn = document.getElementById('open-modal'); // Bouton pour ouvrir la modale
const closeModalBtn = document.querySelector('.close'); // Bouton "X" de fermeture
const openAddPhotoBtn = document.getElementById('add-photo-btn'); // Bouton pour passer à l'ajout photo
const backToGalleryBtn = document.getElementById('back-to-gallery'); // Bouton retour
const galleryView = document.getElementById('gallery-view'); // Vue de la galerie
const addPhotoView = document.getElementById('add-photo-view'); // Vue ajout de photo

// Ouvrir la modale (Vue Galerie)
openModalBtn.addEventListener('click', (event) => {
  event.preventDefault(); 
  modal.style.display = 'flex'; // Afficher la modale centrée grâce à flexbox
  galleryView.style.display = 'block'; // Affiche la vue Galerie
  addPhotoView.style.display = 'none'; // Cache la vue d'ajout au départ
});

// Fermer la modale
closeModalBtn.addEventListener('click', () => {
  modal.style.display = 'none'; // Cache la modale
});

// Fermer la modale si on clique en dehors du contenu
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none'; // Cache la modale si on clique en dehors
  }
});

// Aller à la vue "Ajout photo"
openAddPhotoBtn.addEventListener('click', () => {
  galleryView.style.display = 'none'; // Cache la vue Galerie
  addPhotoView.style.display = 'block'; // Affiche la vue Ajout photo
});

// Retourner à la vue "Galerie"
backToGalleryBtn.addEventListener('click', () => {
  addPhotoView.style.display = 'none'; // Cache la vue Ajout photo
  galleryView.style.display = 'block'; // Affiche la vue Galerie
});

