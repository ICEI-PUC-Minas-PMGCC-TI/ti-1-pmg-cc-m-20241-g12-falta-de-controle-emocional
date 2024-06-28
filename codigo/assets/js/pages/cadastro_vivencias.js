const url_vive = "http://localhost:3000/vivencias";

let user;

function get_status() {
    const user = localStorage.getItem("status");
    return user ? JSON.parse(user) : null;
}

function check() {
    user = get_status();
}

function message(message, type) {
    const msg = document.getElementById("msg");
    setTimeout(() => msg.classList.add("none"), 6000);
    msg.classList.remove("none");
    msg.innerHTML = `<div class="${type}">` + message + "</div>";
}

async function register_vive(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    data["usuario"] = user.id;

    console.log(data);

    const request = new Request(url_vive, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': "application/json"
        }
    });

    try {
        const response = await fetch(request);
        if (response.ok) {
            console.log("Vivência cadastrada com sucesso!", data);
            message("Vivência cadastrada com sucesso!", "success");
            window.location.replace("/index.html");
        } else {
            console.error("Erro ao cadastrar a vivência!", response.statusText);
            message("Erro ao cadastrar a vivência!", "error");
        }
    } catch (error) {
        console.error("Erro ao cadastrar a vivência!", error);
        message("Erro ao cadastrar a vivência!", "error");
    }
}

document.getElementById("form_vive").addEventListener("submit", register_vive);

check();