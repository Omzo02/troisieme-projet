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
