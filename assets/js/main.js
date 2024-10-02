// Vérification du token d'authentification
function checkAuthToken() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html'; // Redirige vers login si pas de token
  }
}

// Sélection des éléments nécessaires pour le login/logout
const loginLogoutBtn = document.querySelector('nav ul li:nth-child(3)');
const headerLoginDiv = document.querySelector('.header-login'); // Div pour le login dans le header
const modifyButton = document.getElementById('open-modal'); // Bouton "modifier"

// Vérification du statut de connexion
function checkLoginStatus() {
  const token = localStorage.getItem('token'); // Récupérer le token

  if (token) {
    loginLogoutBtn.textContent = 'logout';
    loginLogoutBtn.removeEventListener('click', handleLogin);
    loginLogoutBtn.addEventListener('click', handleLogout);
    if (modifyButton) modifyButton.style.display = 'block'; // Affiche "modifier"
    if (headerLoginDiv) headerLoginDiv.style.display = 'flex'; // Affiche la div header
  } else {
    loginLogoutBtn.textContent = 'login';
    loginLogoutBtn.removeEventListener('click', handleLogout);
    loginLogoutBtn.addEventListener('click', handleLogin);
    if (modifyButton) modifyButton.style.display = 'none'; // Cache "modifier"
    if (headerLoginDiv) headerLoginDiv.style.display = 'none'; // Cache la div header
  }
}

// Gestion du clic sur "login"
function handleLogin() {
  window.location.href = 'login.html'; // Redirige vers la page de connexion
}

// Gestion du clic sur "logout"
function handleLogout() {
  localStorage.removeItem('token'); // Supprimer le token
  window.location.reload(); // Recharger la page pour actualiser l'état
}

// Charger les travaux
async function loadWorks() {
  try {
    const worksResponse = await fetch('http://localhost:5678/api/works');
    const works = await worksResponse.json();
    renderWorks(works); // Appel à la fonction pour afficher les travaux

    // Gestion des filtres
    const filterButtons = document.querySelectorAll('#filter-container button');
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
  const worksContainer = document.getElementById('works-container');
  worksContainer.innerHTML = ''; // Vider le conteneur

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

// Gestion de la modale pour afficher et supprimer des travaux
async function loadModalWorks() {
  try {
    const worksResponse = await fetch('http://localhost:5678/api/works');
    const works = await worksResponse.json();
    renderModalWorks(works);
  } catch (error) {
    console.error('Erreur lors de la récupération des travaux pour la modale :', error);
  }
}

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
function renderModalWorks(worksToRender) {
  const modalWorksContainer = document.querySelector('.gallery-content');
  modalWorksContainer.innerHTML = ''; // Vider le conteneur de la modale

  worksToRender.forEach(work => {
    const workElement = document.createElement('figure');
    const imgElement = document.createElement('img');
    const deleteIcon = document.createElement('i');

    imgElement.src = work.imageUrl;
    imgElement.alt = work.title;

    deleteIcon.className = 'fa-regular fa-trash-can delete-icon'; // Icone pour supprimer
    deleteIcon.setAttribute('data-id', work.id); // Associe l'ID du travail
    deleteIcon.addEventListener('click', () => deleteWork(work.id));

    workElement.appendChild(imgElement);
    workElement.appendChild(deleteIcon);
    modalWorksContainer.appendChild(workElement);
  });
}

// Gestion suppressions images
async function deleteWork(id) {
  try {
    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce travail ?");
    if (!confirmation) return; // Si l'utilisateur annule

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Erreur : Aucun token trouvé.");
      window.location.href = "login.html";
      return;
    }

    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      document.querySelector(`.gallery-content figure[data-id="${id}"]`).remove();
      document.querySelector(`#works-container figure[data-id="${id}"]`).remove();
      console.log("Travail supprimé avec succès");
    } else if (response.status === 401) {
      window.location.href = "login.html";
    } else {
      console.error("Erreur lors de la suppression :", response.statusText);
    }
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
  }
}

// Événements de chargement de la page
window.addEventListener('load', async () => {
  checkLoginStatus(); // Vérifier l'état de connexion
  await loadWorks(); // Charger les travaux
});
// Gestion ajout images
const form = document.getElementById('add-photo-form');
const photoInput = document.getElementById('photo-upload');
const titleInput = document.getElementById('photo-title');
const categoryInput = document.getElementById('photo-category');
const submitBtn = form.querySelector('.btn');
const imageLabel = form.querySelector('.photo-label');

// Prévisualisation de l'image
photoInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      imageLabel.style.backgroundImage = `url(${e.target.result})`;
      imageLabel.style.backgroundSize = 'contain';
      imageLabel.style.backgroundRepeat = 'no-repeat';
      imageLabel.style.backgroundPosition = 'center';
      submitBtn.style.backgroundColor = 'green'; // Change la couleur du bouton en vert
    }
    reader.readAsDataURL(file);
  }
});

// Validation du formulaire : active le bouton si tous les champs sont remplis
function checkFormValidity() {
  if (photoInput.files.length > 0 && titleInput.value.trim() && categoryInput.value.trim()) {
    submitBtn.disabled = false;
    submitBtn.style.backgroundColor = 'green'; // Change la couleur du bouton
  } else {
    submitBtn.disabled = true;
    submitBtn.style.backgroundColor = ''; // Couleur par défaut
  }
}

// Vérifie à chaque saisie si tous les champs sont remplis
photoInput.addEventListener("change", () => checkFormValidity(photoInput, categorySelect, titleInput));
titleInput.addEventListener('input', () => checkFormValidity(photoInput, categorySelect, titleInput));
categoryInput.addEventListener('change', () => checkFormValidity(photoInput, categorySelect, titleInput));

// Gestion de la soumission du formulaire
form.addEventListener('submit', async (event) => {
  event.preventDefault(); // Empêche le rechargement de la page

  // Vérification des champs avant d'envoyer
  if (photoInput.files.length=== 0) {
    alert("Veuillez télécharger une photo.");
    return; // Arrête l'exécution si le champ photo est vide
  }
  if (titleInput.value.trim() === '') {
    alert("Veuillez remplir le titre.");
    return; // Arrête l'exécution si le champ titre est vide
  }
  if (categoryInput.value.trim() === '') {
    alert("Veuillez sélectionner une catégorie.");
    return; // Arrête l'exécution si le champ catégorie est vide
  }

  // Créer un objet FormData pour l'envoi
  const formData = new FormData();
  formData.append('image', photoInput.files[0]);
  formData.append('title', titleInput.value);
  formData.append('category', categoryInput.value);

  try {
    // Envoi de la requête à l'API
    const response = await fetch('http://localhost:5678/api/works', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}` // Assure que le token est envoyé
      }
    });

    if (response.ok) {
      alert('Votre projet a été ajouté avec succès.');
      form.reset(); // Réinitialise le formulaire
      submitBtn.disabled = true; // Désactive le bouton après soumission
      submitBtn.style.backgroundColor = ''; // Réinitialise la couleur du bouton
      imageLabel.style.backgroundImage = ''; // Réinitialise l'image
      imageLabel.innerHTML = '<i class="fa-regular fa-image"></i><span class="upload-text">+ Ajouter photo</span>'; // Réinitialise le texte
      loadWorks(); // Recharge les travaux après ajout
    } else {
      alert('Une erreur est survenue lors de l\'envoi.');
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi des données :', error);
    alert('Erreur de connexion. Veuillez réessayer plus tard.');
  }
});

// Gestion de l'affichage des filtres en mode édition
const filterContainer = document.getElementById('filter-container');
const token = localStorage.getItem('token'); // Vérifie si le token est présent

if (token) {
  //Mode édition activé, cacher les boutons de filtre
  filterContainer.style.display = 'none';
}

