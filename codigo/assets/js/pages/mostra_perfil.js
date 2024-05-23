// Constantes
const msg = document.getElementById("msg");
const form_psi = document.getElementById("form_psi");
const form_user = document.getElementById("form_user");
const btn_psi = document.getElementById("btn_psi");

// Usuário logado
let user;

function get_status() {
   const user = localStorage.getItem("status");
   return user ? JSON.parse(user) : null;
}

function check() {
   user = get_status();
}

check();

// Messagem
function message(message, type) {
   // Mostra a mensagem por 6s
   setTimeout(function () {
      msg.classList.add("none");
   }, 6000);
   msg.classList.remove("none");
   msg.innerHTML = `<div class="${type}">${message}</div>`;
}

// Valida a posicao pagina
let page = true;

let btn_info = document.getElementById("state_info");
let btn_publi = document.getElementById("state_publi");

function info_page(page) {
   if (page == false) {
      form_psi.classList.add("none");
      form_user.classList.add("none");
   } else {
      form_psi.classList.remove("none");
      form_user.classList.remove("none");
   }
}

info_page(page);

btn_info.addEventListener("click", function () {
   this.classList.add("item__btn--select");
   btn_publi.classList.remove("item__btn--select");
   page = true;
   info_page(page);
});

btn_publi.addEventListener("click", function () {
   this.classList.add("item__btn--select");
   btn_info.classList.remove("item__btn--select");
   page = false;
   info_page(page);
});

// Cruds
const URL_PSI = "http://localhost:3000/psicologos";

// Busca psicologo no perfil
async function is_psicologo() {
   try {
      const response = await fetch(URL_PSI);
      const psicologos = await response.json();

      psicologo = psicologos.find((p) => p.usuario === user.id);

      if (page) {
         form_psi.classList.remove("none");
      }
      btn_psi.classList.add("none");
      input_formpsi(form_psi, psicologo);

      if (!psicologo) {
         form_psi.classList.add("none");
         btn_psi.classList.remove("none");
      }
   } catch (error) {
      console.error("Erro ao fazer login:", error);
      message("Erro ao fazer login", "error");
   }
}

// Muda como estará os forms
function state_form(form) {
   const form_data = new FormData(form);
}

// Passa para form_psi dados
function input_formpsi(form, psicologo) {
   const form_data = new FormData(form);

   form_data.set("cpf", psicologo.cpf);
   form_data.set("cepp", psicologo.cepp);
   form_data.set("endereco", psicologo.endereco);
   form_data.set("formacao", psicologo.formacao);

   for (const [key, value] of form_data.entries()) {
      const input = form.elements[key];
      if (input) {
         input.value = value;
      }
   }
}

// Busca dados do usuario
function input_formuser(form, user) {
   const form_data = new FormData(form);

   form_data.set("nome", user.name);
   form_data.set("email", user.email);

   for (const [key, value] of form_data.entries()) {
      const input = form.elements[key];
      if (input) {
         input.value = value;
      }
   }
}

document.addEventListener("DOMContentLoaded", is_psicologo);

document.getElementById("btn_edit").addEventListener("click", state_form(form_psi));

input_formuser(form_user, user);
