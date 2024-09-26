// Fonction pour vérifier la présence et la validité du token
function checkAuthToken() {
    const token = localStorage.getItem('token');
    if (!token) {
      // Rediriger vers la page de connexion si pas de token
      window.location.href = 'login.html';
    }
  }
  
  export { checkAuthToken };
  