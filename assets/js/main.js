// Fonction pour récupérer les travaux depuis l'API
async function fetchWorks() {
    try {
        // Appel à l'API pour récupérer les travaux
        const response = await fetch("http://localhost:5678/api/works");
        
        // Vérification que la requête s'est bien passée
        if (!response.ok) {
            throw new Error(`Erreur : ${response.status}`);
        }
        
        // Conversion de la réponse en JSON
        const works = await response.json();
        console.log(works)
        
        // Appeler la fonction pour afficher les travaux
        displayWorks(works);
    } catch (error) {
        console.error("Une erreur s'est produite:", error);
    }
}

// Fonction pour afficher les travaux dans la galerie
function displayWorks(works) {
    const worksContainer = document.getElementById("works-container");
    
    // Vider le conteneur avant d'ajouter les nouveaux éléments (précaution, même si au départ il est vide)
    worksContainer.innerHTML = '';
    
    works.forEach(work => {
        const figure = document.createElement("figure");
        
        const img = document.createElement("img");
        img.src = work.imageUrl;  // Assurez-vous que l'API renvoie l'URL de l'image dans 'imageUrl'
        img.alt = work.title;  // Assurez-vous que l'API renvoie le titre du projet dans 'title'
        
        const figcaption = document.createElement("figcaption");
        figcaption.textContent = work.title;
        
        figure.appendChild(img);
        figure.appendChild(figcaption);
        
        worksContainer.appendChild(figure);
    });
}

// Appel de la fonction pour récupérer et afficher les travaux
fetchWorks();
