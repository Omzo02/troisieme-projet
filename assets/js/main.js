// Vérification du token d'authentification
function checkAuthToken() {
  const token = localStorage.getItem('token');
  return !!token; // Retourne true si un token existe, false sinon
}

// Sélection des éléments nécessaires pour le login/logout
const loginLogoutBtn = document.querySelector('nav ul li:nth-child(3)');
const headerLoginDiv = document.querySelector('.header-login'); // Div pour le login dans le header
const modifyButton = document.getElementById('open-modal'); // Bouton "modifier"

// Vérification du statut de connexion
function checkLoginStatus() {
  const token = localStorage.getItem('token'); // Récupérer le token

  if (token) {
    const filterContainer = document.getElementById('filter-container');
    filterContainer.style.display = 'none';
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
      button.addEventListener('click', function () {
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

// Fonction pour créer un travail dans le DOM
function createWorkInDom(work) {
  const worksContainer = document.getElementById('works-container');
  const workElement = document.createElement('figure');
  workElement.dataset.id = work.id;
  const imgElement = document.createElement('img');
  const captionElement = document.createElement('figcaption');

  imgElement.src = work.imageUrl;
  imgElement.alt = work.title;
  captionElement.textContent = work.title;

  workElement.appendChild(imgElement);
  workElement.appendChild(captionElement);
  worksContainer.appendChild(workElement);
}

// Fonction pour afficher les travaux
function renderWorks(worksToRender) {
  const worksContainer = document.getElementById('works-container');
  worksContainer.innerHTML = ''; // Vider le conteneur

  worksToRender.forEach(work => {
    createWorkInDom(work);
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

// Gestion modale
const modal = document.getElementById('modal');
const openModalBtn = document.getElementById('open-modal');
const closeModalBtn = document.querySelector('.close');
const openAddPhotoBtn = document.getElementById('add-photo-btn');
const backToGalleryBtn = document.getElementById('back-to-gallery');
const galleryView = document.getElementById('gallery-view');
const addPhotoView = document.getElementById('add-photo-view');
const modalWorksContainer = document.querySelector('.gallery-content');

// Ouvrir la modale (Vue Galerie)
openModalBtn.addEventListener('click', async (event) => {
  event.preventDefault();
  modal.style.display = 'flex';
  galleryView.style.display = 'block';
  addPhotoView.style.display = 'none';
  await loadModalWorks(); // Charger les travaux dans la modale
});

// Fermer la modale
closeModalBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Fermer la modale si on clique en dehors du contenu
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

// Aller à la vue "Ajout photo"
openAddPhotoBtn.addEventListener('click', () => {
  galleryView.style.display = 'none';
  addPhotoView.style.display = 'block';
});

// Retourner à la vue "Galerie"
backToGalleryBtn.addEventListener('click', () => {
  addPhotoView.style.display = 'none';
  galleryView.style.display = 'block';
});

// Fonction pour créer un travail dans la modale
function createWorkInModal(work) {
  const workElement = document.createElement('figure');
  const imgElement = document.createElement('img');
  const deleteIcon = document.createElement('i');

  imgElement.src = work.imageUrl;
  imgElement.alt = work.title;

  deleteIcon.className = 'fa-regular fa-trash-can delete-icon';
  deleteIcon.addEventListener('click', () => {
    workElement.remove();
    deleteWork(work.id);
  });

  workElement.appendChild(imgElement);
  workElement.appendChild(deleteIcon);
  modalWorksContainer.appendChild(workElement);
}

// Fonction pour charger les travaux dans la modale
function renderModalWorks(worksToRender) {
  modalWorksContainer.innerHTML = '';

  worksToRender.forEach(work => {
    createWorkInModal(work);
  });
}

// Gestion suppression d'images
async function deleteWork(id) {
  try {
    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce travail ?");
    if (!confirmation) return;

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

// Gestion du formulaire d'ajout de photos
const form = document.getElementById('add-photo-form');
const photoInput = document.getElementById('photo-upload');
const titleInput = document.getElementById('photo-title');
const categoryInput = document.getElementById('photo-category');
const submitBtn = form.querySelector('.btn');
const imageLabel = form.querySelector('.photo-label');


// Fonction pour vérifier la validité du formulaire
function checkFormValidity() {
  const isPhotoUploaded = photoInput.files.length > 0; // Vérifie si une photo est téléchargée
  const isTitleFilled = titleInput.value.trim() !== ''; // Vérifie si le titre est renseigné
  const isCategorySelected = categoryInput.value !== ''; // Vérifie si une catégorie est sélectionnée

  // Si tous les champs sont valides, le bouton est activé, sinon désactivé
  if (isPhotoUploaded && isTitleFilled && isCategorySelected) {
    submitBtn.disabled = false;
    submitBtn.style.backgroundColor = 'green';
  } else {
    submitBtn.disabled = true;
    submitBtn.style.backgroundColor = '';
  }
}

photoInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imageLabel.style.backgroundImage = `url(${e.target.result})`;
      imageLabel.style.backgroundSize = 'contain';
      imageLabel.style.backgroundRepeat = 'no-repeat';
      imageLabel.style.backgroundPosition = 'center';
    };
    reader.readAsDataURL(file);
  }
  checkFormValidity(); // Vérifie la validité après avoir téléchargé une photo
});


// Ajout des événements pour valider en temps réel
photoInput.addEventListener('change', checkFormValidity);
titleInput.addEventListener('input', checkFormValidity);
categoryInput.addEventListener('change', checkFormValidity);

// Gestion de la soumission du formulaire
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData();
  formData.append('image', photoInput.files[0]);
  formData.append('title', titleInput.value);
  formData.append('category', categoryInput.value);

  try {
    const response = await fetch('http://localhost:5678/api/works', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.ok) {
      alert('Votre projet a été ajouté avec succès.');
      form.reset();
      submitBtn.disabled = true;
      submitBtn.style.backgroundColor = '';
      imageLabel.style.backgroundImage = '';
      imageLabel.innerHTML = '<i class="fa-regular fa-image"></i><span class="upload-text">+ Ajouter photo</span>';
      const work = await response.json();
      createWorkInDom(work);
      createWorkInModal(work);
    } else {
      alert('Une erreur est survenue lors de l\'envoi.');
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi des données :', error);
    alert('Erreur de connexion. Veuillez réessayer plus tard.');
  }
});

// Initialisation de l'application
checkAuthToken();
checkLoginStatus();
loadWorks();
