// url
const url_vive = "http://localhost:3000/vivencias";
const url_user = "http://localhost:3000/usuarios";
const URL_PSI = "http://localhost:3000/psicologos";
const URL_USER = "http://localhost:3000/usuarios";
const URL_ATD = "http://localhost:3000/atendimentos";

// elements html
const cards = document.getElementById("cards");
const cards_psi = document.getElementById("cards_psi");

// vivencias
async function vivencias() {
    try {
        const response = await fetch(url_vive);
        const vivencias = await response.json();

        if (response.ok) {
            const limitedVivencias = vivencias.slice(0, 4);

            const htmlContent = await Promise.all(limitedVivencias.map(async (vive, index) => {
                try {
                    const user = await get_usuario(vive.usuario);

                    const data = {
                        nome: user.nome,
                        titulo: vive.titulo,
                        situacao: vive.situacao,
                        solucao: vive.solucao,
                    };

                    const activeClass = index === 0 ? 'active' : '';

                    return `<div class="carousel-item ${activeClass}">${cards_html_vive(data)}</div>`;
                } catch (error) {
                    console.error('Erro ao processar vivências:', error);
                    message("Erro ao processar as vivências", "error");
                    return '';
                }
            }));

            document.getElementById('carousel-inner').innerHTML = htmlContent.join('');
        } else {
            console.error("Erro ao buscar vivências:", response.statusText);
            message("Erro ao buscar vivências", "error");
        }
    } catch (error) {
        console.error("Erro ao buscar vivências:", error);
        message("Erro ao buscar vivências", "error");
    }
}


function cards_html_vive(data) {

    return `
         <div class="card__vive">
            <i class="card__quote fa-solid fa-quote-left"></i>
            <div class="card__title">
                <div class="card__image">
                    <div class="card__image__icon">
                        <i class="fa-solid fa-camera fa-2xl"></i>
                    </div>
                </div>

                <div class="card__title--info">
                    <h4 class="card__name">${data.titulo}</h4>
                    <p class="card__type">${data.nome}</p>
                </div>
            </div>

            <div class="card__info__vive">
                <ul class="card__info__lista__vive">
                    <li class="card__info__item__vive">
                        <h6><b>Situação:</b></h6>
                        <p>${data.situacao}</p>
                    </li>
                    <li class="card__info__item__vive">
                        <h6><b>Solução:</b></h6>
                        <p>${data.solucao}</p>
                    </li>
                </ul>
            </div>
        </div>
        `;
}

async function get_usuario(id) {
    try {
        const response = await fetch(url_user);
        const usuarios = await response.json();

        const usuario = usuarios.find((u) => u.id === id);

        if (usuario) {
            return usuario;
        }
    } catch (error) {
        return console.error("Erro ao buscar usuario:", error);
    }
}


// conteudos
document.addEventListener('DOMContentLoaded', () => {
    loadContent();
});

function loadContent() {
    fetch('http://localhost:3000/conteudos')
        .then(response => response.json())
        .then(data => displayContent(data))
        .catch(error => console.error('Error fetching data:', error));
}

async function displayContent(data) {
    try {
        const contentDisplay = document.getElementById('contentDisplay');
        contentDisplay.innerHTML = '';

        const data_slice = data.slice(0, 4);

        data_slice.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('content-card');
            card.innerHTML = `
                <h3>${item.titulo}</h3>
                <p>Categoria: ${item.categoria}</p>
                <i class="fa-solid fa-bookmark favorite-icon data-id="${item.id}"></i>
            `;
            contentDisplay.appendChild(card);

        });
    } catch (error) {
        console.log(error);
    }
}

// Psicologo
function cards_html_psi(data) {

    let class_tipo_atd;
    if (data.id == 1) {
        class_tipo_atd = "presencial";
    } else if (data.id == 2) {
        class_tipo_atd = "hibrido";
    } else if (data.id == 3) {
        class_tipo_atd = "remoto";
    }

    return `
        <div class="card__psic">
            <div class="card__title">
                <div class="card__image">
                    <div class="card__image__icon">
                        <i class="fa-solid fa-camera fa-2xl"></i>
                    </div>
                </div>

                <div class="card__title--info">
                    <h4 class="card__name">${data.nome}</h4>
                    <div class="card__type ${class_tipo_atd}">${data.tipo}</div>
                </div >
            </div >

        <div class="card__info__psi">
            <ul class="card__info__lista__psi">
                <li class="card__info__item__psi">
                    <i class="fa-solid fa-location-dot"></i>
                    ${data.endereco}
                </li>
                <li class="card__info__item__psi">
                    <i class="fa-solid fa-user-doctor"></i>
                    CEPP: ${data.cepp}
                </li>
                <li class="card__info__item__psi">
                    <i class="fa-solid fa-graduation-cap"></i>
                    Formação: ${data.formacao}
                </li>
            </ul>
        </div>
        </div >
        `;
}

async function get_psicologos() {
    try {
        const response = await fetch(URL_PSI);
        const psicologos = await response.json();

        if (response.ok) {
            const psicologos_slice = psicologos.slice(0, 3);

            const htmlContent = await Promise.all(psicologos_slice.map(async (psi) => {
                try {
                    const user = await get_usuario(psi.usuario);
                    const atd = await get_atendimentos(psi.atendimento);

                    const data = {
                        nome: user.nome,
                        tipo: atd.tipo,
                        id: atd.id,
                        endereco: psi.endereco,
                        cepp: psi.cepp,
                        formacao: psi.formacao
                    };

                    return cards_html_psi(data);
                } catch (error) {
                    console.error('Erro ao processar psicólogo:', error);
                    return ''; // Retorna uma string vazia para ignorar este psicólogo em caso de erro
                }
            }));

            cards_psi.innerHTML = htmlContent.join('');
        } else {
            console.error("Erro ao buscar psicólogos:", response.statusText);
            message("Erro ao buscar psicólogos", "error");
        }
    } catch (error) {
        console.error("Erro ao buscar psicólogo:", error);
        message("Erro ao buscar psicólogo", "error");
    }
}

async function get_atendimentos(id) {
    try {
        const response = await fetch(URL_ATD);
        const atendimentos = await response.json();

        const atendimento = atendimentos.find((atd) => atd.id === id);
        if (atendimento) {
            return atendimento;
        }
    } catch (error) {
        console.error("Erro ao buscar tipos de atendimentos:", error);
        message("Erro ao buscar atendimentos", "error");
    }
}


// chamadas
get_psicologos();
vivencias();
check();