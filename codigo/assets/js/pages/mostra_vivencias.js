const url_vive = "http://localhost:3000/vivencias";
const url_user = "http://localhost:3000/usuarios";

const msg = document.getElementById("msg");
const cards = document.getElementById("cards");
const form = document.getElementById("search");

function message(message, type) {
    msg.classList.remove("none");
    msg.innerHTML = `<div class="${type}">${message}</div>`;
    setTimeout(() => {
        msg.classList.add("none");
    }, 6000);
}

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
            const htmlContent = await Promise.all(vivencias.map(async (vive) => {
                try {
                    const user = await get_usuario(vive.usuario);

                    const data = {
                        nome: user.nome,
                        titulo: vive.titulo,
                        situacao: vive.situacao,
                        solucao: vive.solucao,
                    };

                    return cards_html(data);
                } catch (error) {
                    console.error('Erro ao processar vivências:', error);
                    message("Erro ao processar as vivências", "error")
                    return '';
                }
            }));

            cards.innerHTML = htmlContent.join('');
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
            <div class="card__title">
                <div class="card__image">
                    <div class="card__image__icon">
                        <i class="fa-solid fa-camera fa-2xl"></i>
                    </div>
                </div>

                <div class="card__title--info">
                    <h4 class="card__name">${data.titulo}</h4>
                    <p>${data.nome}</p>
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

async function search_cards(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const query = Object.fromEntries(formData);

    try {

        const response = await fetch(url_vive);
        const vivencias = await response.json();

        const response_user = await fetch(url_user);
        const usuarios = await response_user.json();

        let search = "";
        search = search_vivencias(vivencias, query, usuarios);
        if (search == "") {
            message("Resultado não encontrado", "error")
        }

        search_html(search);
    } catch {
        console.error('Erro ao buscar dados:', error);
    }
}

function search_vivencias(vivencias, query, usuarios) {

    const attributes = ["titulo", "situacao", "solucao"];
    let search = query.search;

    const return_vivencias = new Set();
    vivencias.forEach(vive => {
        attributes.forEach(attribute => {
            if (vive[attribute].toLowerCase().includes(search.toLowerCase())) {
                usuarios.forEach(user => {
                    if (user.id == vive.usuario) {
                        const data = {
                            nome: user.nome,
                            titulo: vive.titulo,
                            situacao: vive.situacao,
                            solucao: vive.solucao,
                        };

                        return_vivencias.add(JSON.stringify(data));
                    }
                });
            }
        });
    });
    const new_data = Array.from(return_vivencias).map(item => JSON.parse(item));
    return new_data;
}

function search_html(search_results) {
    let html = '';
    search_results.forEach(result => {
        html += cards_html(result);
    });

    cards.innerHTML = html;
}

form.addEventListener("submit", search_cards);
vivencias();
check();