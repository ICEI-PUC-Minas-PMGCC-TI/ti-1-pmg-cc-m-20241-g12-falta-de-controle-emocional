// URLs
const URL_PSI = "http://localhost:3000/psicologos";
const URL_USER = "http://localhost:3000/usuarios";
const URL_ATD = "http://localhost:3000/atendimentos";

const msg = document.getElementById("msg");
const cards = document.getElementById("cards");
const form = document.getElementById("search");

// Funções de Utilidade
function message(message, type) {
    msg.classList.remove("none");
    msg.innerHTML = `<div class="${type}">${message}</div>`;
    setTimeout(() => {
        msg.classList.add("none");
    }, 6000);
}

function cards_html(data) {

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

        <div class="card__info">
            <ul class="card__info__lista">
                <li class="card__info__item">
                    <i class="fa-solid fa-location-dot"></i>
                    ${data.endereco}
                </li>
                <li class="card__info__item">
                    <i class="fa-solid fa-user-doctor"></i>
                    CEPP: ${data.cepp}
                </li>
                <li class="card__info__item">
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
            const htmlContent = await Promise.all(psicologos.map(async (psi) => {
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

                    return cards_html(data);
                } catch (error) {
                    console.error('Erro ao processar psicólogo:', error);
                    return ''; // Retorna uma string vazia para ignorar este psicólogo em caso de erro
                }
            }));

            cards.innerHTML = htmlContent.join('');
        } else {
            console.error("Erro ao buscar psicólogos:", response.statusText);
            message("Erro ao buscar psicólogos", "error");
        }
    } catch (error) {
        console.error("Erro ao buscar psicólogo:", error);
        message("Erro ao buscar psicólogo", "error");
    }
}

async function get_usuario(id) {
    try {
        const response = await fetch(URL_USER);
        const usuarios = await response.json();

        const usuario = usuarios.find((u) => u.id === id);

        if (usuario) {
            return usuario;
        }
    } catch (error) {
        return console.error("Erro ao buscar usuario:", error);
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

async function search_cards(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const query = Object.fromEntries(formData);

    try {
        const [response_user, response_psi, response_atd] = await Promise.all([
            fetch(URL_USER),
            fetch(URL_PSI),
            fetch(URL_ATD)
        ]);

        const [usuarios, psicologos, atendimentos] = await Promise.all([
            response_user.json(),
            response_psi.json(),
            response_atd.json()
        ]);

        let search = "";

        search = search_usuarios(usuarios, query, psicologos, atendimentos);

        if (search == "") {
            search = search_psicologos(psicologos, query, usuarios, atendimentos);

            if (search == "") {
                search = search_atendimentos(atendimentos, query, usuarios, psicologos);
            }
        }

        if (search == "") {
            message("Resultado não encontrado", "error")
        }

        search_html(search);


    } catch {
        console.error('Erro ao buscar dados:', error);
    }
}

function search_usuarios(usuarios, query, psicologos, atendimentos) {

    const attributes = ["nome", "email"];
    let search = query.search;
    const return_usuarios = new Set();

    usuarios.forEach(element => {
        attributes.forEach(attribute => {
            if (element[attribute].toLowerCase().includes(search.toLowerCase())) {
                psicologos.forEach(psi => {
                    if (psi.usuario == element.id) {
                        atendimentos.forEach(atd => {
                            if (atd.id == psi.atendimento) {

                                const data = {
                                    nome: element.nome,
                                    tipo: atd.tipo,
                                    id: atd.id,
                                    endereco: psi.endereco,
                                    cepp: psi.cepp,
                                    formacao: psi.formacao
                                };
                                return_usuarios.add(JSON.stringify(data));
                            }
                        });
                    }
                });
            }
        });
    });
    const new_data = Array.from(return_usuarios).map(item => JSON.parse(item));
    return new_data;
}


function search_psicologos(psicologos, query, usuarios, atendimentos) {

    const attributes = ["cepp", "endereco", "formacao"];
    let search = query.search;

    const return_psicologos = new Set();

    psicologos.forEach(element => {
        attributes.forEach(attribute => {
            if (element[attribute].toLowerCase().includes(search.toLowerCase())) {
                usuarios.forEach(user => {
                    if (user.id == element.usuario) {
                        atendimentos.forEach(atd => {
                            if (atd.id == element.atendimento) {

                                const data = {
                                    nome: user.nome,
                                    tipo: atd.tipo,
                                    id: atd.id,
                                    endereco: element.endereco,
                                    cepp: element.cepp,
                                    formacao: element.formacao
                                };
                                return_psicologos.add(JSON.stringify(data));
                            }
                        });
                    }
                });
            }
        });
    });
    const new_data = Array.from(return_psicologos).map(item => JSON.parse(item));
    return new_data;
}

function search_atendimentos(atendimentos, query, usuarios, psicologos) {

    const attributes = ["tipo"];
    let search = query.search;

    const return_atendimentos = new Set();

    atendimentos.forEach(element => {
        attributes.forEach(attribute => {
            if (element[attribute].toLowerCase().includes(search.toLowerCase())) {
                psicologos.forEach(psi => {
                    if (psi.atendimento == element.id) {
                        usuarios.forEach(user => {
                            if (user.id == psi.usuario) {

                                const data = {
                                    nome: user.nome,
                                    tipo: element.tipo,
                                    id: element.id,
                                    endereco: psi.endereco,
                                    cepp: psi.cepp,
                                    formacao: psi.formacao
                                };
                                return_atendimentos.add(JSON.stringify(data));

                            }
                        });
                    }
                });
            }
        });
    });
    const new_data = Array.from(return_atendimentos).map(item => JSON.parse(item));
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
get_psicologos();