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
  
  // Vider le conteneur des travaux
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
    const modifyButton = document.getElementById('open-modal'); // Change cela en fonction de l'ID réel

    if (token) {
        // Si le token est présent, l'utilisateur est connecté
        loginLogoutBtn.textContent = 'logout'; // Afficher "logout"
        loginLogoutBtn.removeEventListener('click', handleLogin); // Enlever l'événement login
        loginLogoutBtn.addEventListener('click', handleLogout); // Ajouter l'événement logout
        
        // Affiche le bouton "modifier"
        if (modifyButton) {
            modifyButton.style.display = 'block';
        }
    } else {
        // Si pas de token, l'utilisateur n'est pas connecté
        loginLogoutBtn.textContent = 'login'; // Afficher "login"
        loginLogoutBtn.removeEventListener('click', handleLogout); // Enlever l'événement logout
        loginLogoutBtn.addEventListener('click', handleLogin); // Ajouter l'événement login
        
        // Masque le bouton "modifier" si nécessaire
        if (modifyButton) {
            modifyButton.style.display = 'none'; 
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
const modalWorksContainer = document.querySelector('.gallery-content'); // Conteneur des travaux dans la modale


// Ouvrir la modale (Vue Galerie)
openModalBtn.addEventListener('click', async (event) => {
  event.preventDefault(); 
  modal.style.display = 'flex'; // Afficher la modale centrée grâce à flexbox
  galleryView.style.display = 'block'; // Affiche la vue Galerie
  addPhotoView.style.display = 'none'; // Cache la vue d'ajout au départ
  await loadModalWorks(); // Charger les travaux dans la modale
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

// Fonction pour charger les travaux dans la modale
async function loadModalWorks() {
  try {
    const worksResponse = await fetch('http://localhost:5678/api/works');
    const works = await worksResponse.json();
    renderModalWorks(works);
  } catch (error) {
    console.error('Erreur lors de la récupération des travaux pour la modale :', error);
  }
}

// Fonction pour afficher les travaux dans la modale
function renderModalWorks(worksToRender) {
  modalWorksContainer.innerHTML = ''; // Vider le conteneur des travaux de la modale

  worksToRender.forEach(work => {
    const workElement = document.createElement('figure');
    const imgElement = document.createElement('img');
    
    imgElement.src = work.imageUrl;
    imgElement.alt = work.title;

    // Ajoutez l'icône de la poubelle
    const deleteIcon = document.createElement('i');
    deleteIcon.className = 'fa-regular fa-trash-can delete-icon'; // Ajoutez la classe pour l'icône
    deleteIcon.setAttribute('data-id', work.id); // Associez l'ID du travail
    deleteIcon.addEventListener('click', () => {
      // Gérer la suppression de l'image
      deleteWork(work.id);
    });

    workElement.appendChild(imgElement);
    workElement.appendChild(deleteIcon); // Ajoutez l'icône à l'élément de travail
    modalWorksContainer.appendChild(workElement);
  });
}

async function deleteWork(id) {
  try {
    // Demander la confirmation de l'utilisateur avant de supprimer
    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce travail ?");
    if (!confirmation) {
      console.log("Suppression annulée.");
      return; // Si l'utilisateur annule, sortir de la fonction
    }
    // Récupérer le token d'authentification depuis le localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Erreur : Aucun token trouvé. Veuillez vous reconnecter.");
      window.location.href = "login.html"; // Rediriger vers la page de connexion si aucun token n'est présent
      return;
    }

    // Envoi de la requête de suppression avec le token d'authentification
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`, // Ajout du token dans l'en-tête
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      // Supprimer l'élément de la modale
      const modalWorkElement = document.querySelector(
        `.gallery-content figure[data-id="${id}"]`
      );
      if (modalWorkElement) {
        modalWorkElement.remove(); // Supprime l'élément du DOM de la modale
      }

      // Supprimer également l'élément dans la galerie principale
      const mainWorkElement = document.querySelector(
        `#works-container figure[data-id="${id}"]`
      );
      if (mainWorkElement) {
        mainWorkElement.remove(); // Supprime l'élément du DOM de la galerie principale
      }

      console.log("Travail supprimé avec succès");
    } else if (response.status === 401) {
      console.error("Erreur : Non autorisé. Veuillez vous reconnecter.");
      window.location.href = "login.html"; // Rediriger vers la page de connexion
    } else {
      console.error(
        "Erreur lors de la suppression du travail :",
        response.statusText
      );
    }
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
  }
}
// Fonction pour vérifier le token d'authentification
function checkAuthToken() {
  const token = localStorage.getItem('token');
  const headerLoginDiv = document.querySelector('.header-login');

  // Afficher ou masquer la div en fonction de la présence du token
  if (token) {
    headerLoginDiv.style.display = 'flex'; // Affiche la div si connecté
  } else {
    headerLoginDiv.style.display = 'none'; // Cache la div si déconnecté
  }
}

// Charger les travaux au chargement de la page
window.addEventListener('load', async () => {
  checkAuthToken(); // Vérifier l'état de connexion
  await loadWorks(); // Charger les travaux
});

