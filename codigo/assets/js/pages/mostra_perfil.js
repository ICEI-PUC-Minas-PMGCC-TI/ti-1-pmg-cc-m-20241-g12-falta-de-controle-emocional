// Constantes de Elementos da DOM
const msg = document.getElementById("msg");
const formPsi = document.getElementById("form_psi");
const formUser = document.getElementById("form_user");
const btnPsi = document.getElementById("btn_psi");
const btnInfo = document.getElementById("state_info");
const btnPubli = document.getElementById("state_publi");
const btnPsi_edit = document.getElementById("btn_psi_edit");

// URLs
const URL_PSI = "http://localhost:3000/psicologos";

// Variáveis Globais
let user;
let page = true;
let psicologo;
console.log("1º: " + psicologo);

// Funções de Manipulação de Usuário
function get_status() {
   const user = localStorage.getItem("status");
   return user ? JSON.parse(user) : null;
}

function check() {
   user = get_status();
}

// Funções de Utilidade
function showMessage(message, type) {
   msg.classList.remove("none");
   msg.innerHTML = `<div class="${type}">${message}</div>`;
   setTimeout(() => {
      msg.classList.add("none");
   }, 6000);
}

function toggle_page(page) {
   if (page) {
      formPsi.classList.remove("none");
      formUser.classList.remove("none");
   } else {
      formPsi.classList.add("none");
      formUser.classList.add("none");
   }
}

// Manipulação de Eventos
btnInfo.addEventListener("click", () => {
   btnInfo.classList.add("item__btn--select");
   btnPubli.classList.remove("item__btn--select");
   page = true;
   toggle_page(page);
});

btnPubli.addEventListener("click", () => {
   btnPubli.classList.add("item__btn--select");
   btnInfo.classList.remove("item__btn--select");
   page = false;
   toggle_page(page);
});

btnPsi_edit.addEventListener("click", () => {
   console.log("Olha para ca");
});

// Funções Assíncronas
async function fetchPsicologo() {
   try {
      const response = await fetch(URL_PSI);
      const psicologos = await response.json();

      psicologo = psicologos.find((p) => p.usuario === user.id);

      if (page) {
         formPsi.classList.remove("none");
      }
      btnPsi.classList.add("none");
      fillFormPsi(formPsi, psicologo);

      if (!psicologo) {
         formPsi.classList.add("none");
         btnPsi.classList.remove("none");
      }
   } catch (error) {
      console.error("Erro ao buscar psicólogo:", error);
      showMessage("Erro ao buscar psicólogo", "error");
   }
}

console.log("2º: " + psicologo);

// Funções de Preenchimento de Formulários
function fillFormPsi(form, psicologo) {
   const formData = new FormData(form);

   formData.set("cpf", psicologo.cpf);
   formData.set("cepp", psicologo.cepp);
   formData.set("endereco", psicologo.endereco);
   formData.set("formacao", psicologo.formacao);

   for (const [key, value] of formData.entries()) {
      const input = form.elements[key];
      if (input) {
         input.value = value;
      }
   }
}

function fillFormUser(form, user) {
   const formData = new FormData(form);

   formData.set("nome", user.name);
   formData.set("email", user.email);

   for (const [key, value] of formData.entries()) {
      const input = form.elements[key];
      if (input) {
         input.value = value;
      }
   }
}

// Função de Estado do Formulário
function stateForm(form) {
   const formData = new FormData(form);
   for (const [key, value] of formData.entries()) {
      form.elements[key].disabled = false;
   }
}

// Inicialização
document.addEventListener("DOMContentLoaded", fetchPsicologo);
check();
toggle_page(page);
fillFormUser(formUser, user);
