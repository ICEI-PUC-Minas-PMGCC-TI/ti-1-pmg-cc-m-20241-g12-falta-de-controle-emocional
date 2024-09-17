// URLs
const URL_VIVE = "http://localhost:3000/vivencias";
const URL_VIVE__html = new URLSearchParams(location.search);
const id_vive = URL_VIVE__html.get("id");
const URL_VIVE_API = URL_VIVE + "/" + id_vive;

const form = document.getElementById("form_vive_edit");

// Variaveis e elementos do dom

// Funções de Utilidade
function message(message, type) {
    const msg = document.getElementById("msg");
    setTimeout(() => msg.classList.add("none"), 6000);
    msg.classList.remove("none");
    msg.innerHTML = `<div class="${type}">` + message + "</div>";
}

async function fetchData(url) {
    const response = await fetch(url);
    return response.json();
}

async function get_vivencias() {
    try {
        console.log(URL_VIVE_API);
        const response = await fetch(URL_VIVE_API);
        const vivencia = await response.json();

        input_formvive(form, vivencia);
    } catch (error) {
        console.error("Erro ao buscar vivência:", error);
        message("Erro ao buscar vivência", "error");
    }
}

async function edita_vivencia(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    console.log(data);

    const request = new Request(URL_VIVE_API, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
    });

    try {
        const response = await fetch(request);
        if (response.ok) {
            message("Vivência editada com sucesso", "success");
            window.location.replace("./modules/perfil/mostra_perfil.html");
        } else {
            console.error("Erro ao editar vivência:", response.statusText);
            message("Erro ao editar vivência", "error");
        }
    } catch (error) {
        console.error("Erro ao editar nova vivência:", error);
        message("Erro ao editar vivência", "error");
    }
}

// Funções de manipulação de formulários
function input_formvive(form, vivencia) {
    const form_data = new FormData(form);
    form_data.set("titulo", vivencia.titulo);
    form_data.set("situacao", vivencia.situacao);
    form_data.set("solucao", vivencia.solucao);
    for (const [key, value] of form_data.entries()) {
        const input = form.elements[key];
        if (input) {
            input.value = value;
        }
    }
}

form.addEventListener("submit", edita_vivencia);

// Inicializaçoes
get_vivencias();
check();
