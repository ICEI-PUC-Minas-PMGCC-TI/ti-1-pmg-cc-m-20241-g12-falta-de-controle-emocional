document.addEventListener('DOMContentLoaded', () => {
    loadContent();

    document.getElementById('searchText').addEventListener('input', performSearch);
    document.getElementById('categoryFilter').addEventListener('change', () => {
        updateThemes();
        applyFilters();
    });
    document.getElementById('themeFilter').addEventListener('change', applyFilters);
    document.getElementById('durationFilter').addEventListener('change', applyFilters);
    document.getElementById('clearFiltersButton').addEventListener('click', clearFilters);
    document.getElementById('favoritesButton').addEventListener('click', openFavoritesModal);
    document.querySelector('.modal .close').addEventListener('click', closeFavoritesModal);
    window.addEventListener('click', (event) => {
        if (event.target === document.getElementById('favoritesModal')) {
            closeFavoritesModal();
        }
    });

    updateThemes();
});

function loadContent() {
    fetch('http://localhost:3000/conteudos')
        .then(response => response.json())
        .then(data => displayContent(data))
        .catch(error => console.error('Error fetching data:', error));
}

function displayContent(data) {
    const contentDisplay = document.getElementById('contentDisplay');
    contentDisplay.innerHTML = '';
    const favorites = getFavorites();
    data.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('content-card');
        const isFavorited = favorites.includes(item.id);
        card.innerHTML = `
            <h3>${item.titulo}</h3>
            <p>Categoria: ${item.categoria}</p>
            <p>Tema: ${item.tema}</p>
            <p>Duração: ${item.duracao} min</p>
            <i class="fa-solid fa-bookmark favorite-icon ${isFavorited ? 'favorited' : ''}" data-id="${item.id}"></i>
        `;
        contentDisplay.appendChild(card);

        card.querySelector('.favorite-icon').addEventListener('click', toggleFavorite);
    });
}

function performSearch() {
    const searchText = document.getElementById('searchText').value.toLowerCase();
    fetch('http://localhost:3000/conteudos')
        .then(response => response.json())
        .then(data => {
            const filteredData = data.filter(item =>
                item.titulo.toLowerCase().includes(searchText)
            );
            displayContent(filteredData);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function applyFilters() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const themeFilter = document.getElementById('themeFilter').value;
    const durationFilter = document.getElementById('durationFilter').value;

    fetch('http://localhost:3000/conteudos')
        .then(response => response.json())
        .then(data => {
            let filteredData = data;

            if (categoryFilter) {
                filteredData = filteredData.filter(item => item.categoria === categoryFilter);
            }
            if (themeFilter) {
                filteredData = filteredData.filter(item => item.tema === themeFilter);
            }
            if (durationFilter) {
                filteredData = filteredData.filter(item => {
                    const duration = item.duracao;
                    if (durationFilter === '0-5') return duration <= 5;
                    if (durationFilter === '5-10') return duration > 5 && duration <= 10;
                    if (durationFilter === '10-20') return duration > 10 && duration <= 20;
                    if (durationFilter === '20+') return duration > 20;
                });
            }

            displayContent(filteredData);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function clearFilters() {
    document.getElementById('categoryFilter').value = '';
    document.getElementById('themeFilter').value = '';
    document.getElementById('durationFilter').value = '';
    document.getElementById('searchText').value = '';
    loadContent();
    updateThemes();
}

function updateThemes() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const themeFilter = document.getElementById('themeFilter');
    const meditationThemes = [
        { value: 'Respiração', text: 'Respiração' },
        { value: 'Autocompaixão', text: 'Autocompaixão' },
        { value: 'Gratidão', text: 'Gratidão' },
        { value: 'Ansiedade', text: 'Ansiedade' },
        { value: 'Inadequação', text: 'Inadequação' }
    ];
    const musicThemes = [
        { value: 'Ondas', text: 'Ondas' },
        { value: 'Chuva', text: 'Chuva' },
        { value: 'Floresta', text: 'Floresta' },
        { value: 'Fogueira', text: 'Fogueira' },
        { value: 'Piano', text: 'Piano' }
    ];

    themeFilter.innerHTML = '<option value="">Tema</option>';

    let themes = [];
    if (categoryFilter === 'Meditação') {
        themes = meditationThemes;
    } else if (categoryFilter === 'Música') {
        themes = musicThemes;
    } else {
        themes = [...meditationThemes, ...musicThemes];
    }

    themes.forEach(theme => {
        const option = document.createElement('option');
        option.value = theme.value;
        option.text = theme.text;
        themeFilter.appendChild(option);
    });
}

function getFavorites() {
    const favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
}

function saveFavorites(favorites) {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function toggleFavorite(event) {
    const icon = event.target;
    const contentId = icon.getAttribute('data-id');
    let favorites = getFavorites();

    if (favorites.includes(contentId)) {
        favorites = favorites.filter(id => id !== contentId);
        icon.classList.remove('favorited');
    } else {
        favorites.push(contentId);
        icon.classList.add('favorited');
    }

    saveFavorites(favorites);

    updateFavoritesModal();

    const contentDisplayIcons = document.querySelectorAll('#contentDisplay .favorite-icon');
    contentDisplayIcons.forEach(icon => {
        const contentId = icon.getAttribute('data-id');
        if (favorites.includes(contentId)) {
            icon.classList.add('favorited');
        } else {
            icon.classList.remove('favorited');
        }
    });
}

function openFavoritesModal() {
    updateFavoritesModal();
    const modal = document.getElementById('favoritesModal');
    modal.style.display = 'block';
}

function closeFavoritesModal() {
    const modal = document.getElementById('favoritesModal');
    modal.style.display = 'none';
}

function updateFavoritesModal() {
    const favoritesDisplay = document.getElementById('favoritesDisplay');
    const favorites = getFavorites();

    fetch('http://localhost:3000/conteudos')
        .then(response => response.json())
        .then(data => {
            const favoriteItems = data.filter(item => favorites.includes(item.id));
            favoritesDisplay.innerHTML = '';

            favoriteItems.forEach(item => {
                const card = document.createElement('div');
                card.classList.add('content-card');
                card.innerHTML = `
                    <h3>${item.titulo}</h3>
                    <p>Categoria: ${item.categoria}</p>
                    <p>Tema: ${item.tema}</p>
                    <p>Duração: ${item.duracao} min</p>
                    <i class="fa-solid fa-bookmark favorite-icon favorited" data-id="${item.id}"></i>
                `;
                favoritesDisplay.appendChild(card);

                card.querySelector('.favorite-icon').addEventListener('click', toggleFavorite);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}
