document.addEventListener('DOMContentLoaded', async function() {
    const worksContainer = document.getElementById('works-container'); // Conteneur pour les travaux
    const filterContainer = document.getElementById('filter-button');  // Conteneur pour les boutons de filtre

    try {
        // Récupérer les travaux depuis l'API
        const worksResponse = await fetch('http://localhost:5678/api/works');
        const works = await worksResponse.json();

        // Récupérer les catégories depuis l'API
        const categoriesResponse = await fetch('http://localhost:5678/api/categories');
        const categories = await categoriesResponse.json();

        // Afficher les travaux par défaut (tous les travaux)
        renderWorks(works);

        // Créer un bouton "Tous" pour afficher tous les travaux
        createButton('Tous', () => renderWorks(works), true);

        // Créer un bouton pour chaque catégorie
        categories.forEach(category => {
            createButton(category.name, () => {
                const filteredWorks = works.filter(work => work.categoryId === category.id);
                renderWorks(filteredWorks);
            });
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
    }

    // Fonction pour créer un bouton de filtre
    function createButton(label, onClick, isActive = false) {
        const button = document.createElement('button');
        button.textContent = label;
        button.classList.toggle('active', isActive); // Ajouter la classe 'active' si c'est le bouton par défaut

        // Ajouter l'événement de clic
        button.addEventListener('click', function() {
            // Retirer la classe 'active' de tous les boutons
            document.querySelectorAll('#filter-button button').forEach(btn => btn.classList.remove('active'));

            // Ajouter la classe 'active' au bouton cliqué
            button.classList.add('active');

            // Appeler la fonction associée au bouton (pour filtrer les travaux)
            onClick();
        });

        filterContainer.appendChild(button);
    }

    // Fonction pour afficher les travaux dans le conteneur
    function renderWorks(worksToRender) {
        worksContainer.innerHTML = ''; // Vider le conteneur avant d'ajouter de nouveaux éléments

        // Ajouter chaque travail au conteneur
        worksToRender.forEach(work => {
            const workElement = document.createElement('div');
            workElement.classList.add('work-item');
            workElement.innerHTML = `
                <img src="${work.imageUrl}" alt="${work.title}">
                <h3>${work.title}</h3>
            `;
            worksContainer.appendChild(workElement);
        });
    }
});
