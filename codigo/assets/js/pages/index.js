const url_vive = "http://localhost:3000/vivencias";
const url_user = "http://localhost:3000/usuarios";

const cards = document.getElementById("cards");

let user;

function get_status() {
    const user = localStorage.getItem("status");
    return user ? JSON.parse(user) : null;
}

function check() {
    user = get_status();
}

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

                    return `<div class="carousel-item ${activeClass}">${cards_html(data)}</div>`;
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


function cards_html(data) {

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

            <div class="card__info">
                <ul class="card__info__lista">
                    <li class="card__info__item">
                        <h6><b>Situação:</b></h6>
                        <p>${data.situacao}</p>
                    </li>
                    <li class="card__info__item">
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

vivencias();
check();