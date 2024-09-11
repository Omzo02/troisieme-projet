// Validation email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
//Soumission du formulaire et appel à l'API
document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Validation de l'email
    if (!validateEmail(email)) {
      alert("Veuillez entrer un email valide.");
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
  
      if (!response.ok) {
        // Gestion des erreurs
        if (response.status === 401) {
          alert("Identifiants incorrects. Veuillez réessayer.");
        } else {
          alert("Une erreur est survenue.");
        }
        return;
      }
  
      const data = await response.json();
      
      // Stockage du token
      localStorage.setItem('authToken', data.token);
  
      // Redirection vers la page d'accueil
      window.location.href = 'index.html';
  
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      alert("Erreur lors de la connexion. Veuillez réessayer.");
    }
  });
  