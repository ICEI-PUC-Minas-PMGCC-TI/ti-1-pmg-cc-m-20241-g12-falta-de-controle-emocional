const URL_USER = "http://localhost:3000/usuarios";

let user;
const form = document.getElementById("form_usu");

function message(message, type) {
    const msg = document.getElementById("msg");
    setTimeout(() => msg.classList.add("none"), 6000);
    msg.classList.remove("none");
    msg.innerHTML = `<div class="${type}">` + message + "</div>";
}

function get_status() {
    const user = localStorage.getItem("status");
    return user ? JSON.parse(user) : null;
}

function check() {
    user = get_status();
    input_formusu(user);
}

async function edita_usuario(event) {
    const url = URL_USER + "/" + user.id;

    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    console.log(data);

    const request = new Request(url, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
    });

    try {
        const response = await fetch(request);
        console.log(response)
        if (response.ok) {
            console.log("Psicólogo editado com sucesso:", data);
            message("Psicólogo editado com sucesso", "success");
            window.location.replace("./modules/perfil/mostra_perfil.html");
        } else {
            console.error("Erro ao editar usuario:", response.statusText);
            DelayNode(500)
            message("Erro ao editar usuario", "error");
        }
    } catch (error) {
        console.error("Erro ao editar novo usuario:", error);
        message("Erro ao editar usuario", "error");
    }
}

function input_formusu(user) {
    const form_data = new FormData(form);
    form_data.set("nome", user.nome);
    form_data.set("genero", user.genero);

    for (const [key, value] of form_data.entries()) {
        const input = form.elements[key];
        if (input) {
            input.value = value;
        }
    }
}

form.addEventListener("submit", edita_usuario);

check();