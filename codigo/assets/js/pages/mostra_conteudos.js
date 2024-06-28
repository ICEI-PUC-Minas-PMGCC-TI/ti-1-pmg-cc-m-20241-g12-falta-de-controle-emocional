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

    updateThemes();
});

function message(message, type) {
    msg.classList.remove("none");
    msg.innerHTML = `<div class="${type}">${message}</div>`;
    setTimeout(() => {
        msg.classList.add("none");
    }, 6000);
}

// Faz a chamada da url | todos | pesquisa | filtro
function loadContent() {
    fetch('http://localhost:3000/conteudos')
        .then(response => response.json())
        .then(data => displayContent(data))
        .catch(error => console.error('Error fetching data:', error));
}

// Mostra os dados
async function displayContent(data) {
    try {
        const response_fav = await fetch("http://localhost:3000/favoritos");
        const favoritos = await response_fav.json();

        const contentDisplay = document.getElementById('contentDisplay');
        contentDisplay.innerHTML = '';

        data.forEach(item => {
            const favorito = favoritos.find((fav) => fav.id_favoritos === item.id);
            let isFavorited = false;
            if (favorito) {
                isFavorited = true;
            }
            const card = document.createElement('div');
            card.classList.add('content-card');
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
    } catch (error) {
        console.log(error);
    }
}

// Realiza a pesquisa
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


// Aplica os filtros
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


// Limpa os filtros
function clearFilters() {
    document.getElementById('categoryFilter').value = '';
    document.getElementById('themeFilter').value = '';
    document.getElementById('durationFilter').value = '';
    document.getElementById('searchText').value = '';
    loadContent();
    updateThemes();
}

// Nome dos filtros
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

// Pega os favoritos
async function getFavorites() {
    try {
        const response = await fetch("http://localhost:3000/favoritos");
        const response_json = await response.json();

        return response_json;

    } catch (error) {
        console.error("Não foi possível acessar seus favoritos");
    }
}

// Muda favoritos
function toggleFavorite(event) {
    const icon = event.target;
    const contentId = icon.getAttribute('data-id');

    getFavorites().then(favorites => {
        const favorito = favorites.find((fav) => fav.id_favoritos === contentId);

        if (favorito) {
            remove_fav(favorito.id);
        } else {
            saveFavorites(contentId)
        }
    });
}


// Salva favoritos
async function saveFavorites(id) {
    const data = {
        "id_favoritos": id
    }

    const request = new Request("http://localhost:3000/favoritos", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
    });


    try {
        const response = await fetch(request);
        if (response.ok) {
            console.log("Favorito cadastrado com sucesso:", data);
            message("Favorito cadastrado com sucesso", "success");
        } else {
            console.error("Erro ao cadastrar favorito:", response.statusText);
            message("Erro ao cadastrar favorito", "error");
        }
    } catch (error) {
        console.error("Erro ao cadastrar novo favorito:", error);
        message("Erro ao cadastrar favorito", "error");
    }
}


// Deleta favoritos
async function remove_fav(id) {
    const url = "http://localhost:3000/favoritos/" + id;

    const request = new Request(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });

    try {
        const response = await fetch(request);
        if (response.ok) {
            console.log("Favorito removido com sucesso:", data);
            message("Favorito removido com sucesso", "success");
        } else {
            console.error("Erro ao remover favorito:", response.statusText);
        }
    } catch (error) {
        console.error("Erro ao remover favorito:", error);
        message("Erro ao remover favorito", "error");
    }
}