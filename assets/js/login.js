// Récupération des éléments
const projetsLink = document.getElementById('projets');
const contactLink = document.getElementById('contact');

// Gestion des événements de clic
projetsLink.addEventListener('click', () => {
    window.location.href = 'index.html#portfolio';
});

contactLink.addEventListener('click', () => {
    window.location.href = 'index.html#contact';
});

// Validation email
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Soumission du formulaire et appel à l'API
document.getElementById('login-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorMessageElement = document.getElementById('error-message');

  // Réinitialiser le message d'erreur
  errorMessageElement.textContent = '';
  
  // Validation de l'email
  if (!validateEmail(email)) {
      errorMessageElement.textContent = "Veuillez entrer un email valide.";
      return;
  }

  // Appel API pour la connexion
  try {
      const response = await fetch('http://localhost:5678/api/users/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
          // Gestion des erreurs selon le code de réponse
          if (response.status === 401) {
              errorMessageElement.textContent = "Identifiants incorrects. Veuillez réessayer.";
          } else {
              errorMessageElement.textContent = "Une erreur est survenue. Veuillez réessayer.";
          }
          return;
      }

      const data = await response.json();
    
      // Stocker le token dans le localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('token', data.token);

      // Redirection vers la page d'accueil
      window.location.href = 'index.html';

  } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      errorMessageElement.textContent = "Erreur lors de la connexion. Veuillez réessayer.";
  }
});
