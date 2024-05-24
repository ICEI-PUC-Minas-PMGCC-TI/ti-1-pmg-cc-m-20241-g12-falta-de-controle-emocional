// Constantes de Elementos da DOM
const msg = document.getElementById("msg");
const formPsi = document.getElementById("form_psi");
const formUser = document.getElementById("form_user");
const btn__actionmob = document.getElementById("btn_action--mob");
const btn__actiondesk = document.getElementById("btn_action--desk");
const btnPsi = document.getElementById("btn_psi");
const btnInfo = document.getElementById("state_info");
const btnPubli = document.getElementById("state_publi");
const btnPsi_edit = document.getElementById("btn_psi_edit");
const btnPsi_editdesk = document.getElementById("btn_psi_edit--desk");
const btnPsi_remove = document.getElementById("btn_psi_remove");
const btnPsi_removedesk = document.getElementById("btn_psi_remove--desk");

// URLs
const URL_PSI = "http://localhost:3000/psicologos";
const URL_ATD = "http://localhost:3000/atendimentos";
let URL_PSI_API;

// Variáveis Globais
let user;
let page = true;

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

async function fetchData(url) {
   const response = await fetch(url);
   return response.json();
}

function set_psi_edit(psicologo) {
   const id = psicologo.id;
   const URL_PSI__id = "http://127.0.0.1:5500/modules/psicologos/edita_psicologos.html" + "?id=" + id;

   btnPsi_edit.setAttribute("href", URL_PSI__id);
   btnPsi_editdesk.setAttribute("href", URL_PSI__id);
}

function set_psi_delete(psicologo) {
   const id = psicologo.id;
   const URL_PSI_API = URL_PSI + "/" + id;

   console.log(URL_PSI_API);

   btnPsi_remove.addEventListener("click", (event) => {
      remove_psi(URL_PSI_API, event);
   });

   btnPsi_removedesk.addEventListener("click", (event) => {
      remove_psi(URL_PSI_API, event);
   });
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

// Funções Assíncronas
async function get_atendimentos() {
   const select = document.getElementById("select_atd");

   try {
      const atendimentos = await fetchData(URL_ATD);
      atendimentos.forEach((atd) => {
         const option = document.createElement("option");
         option.innerHTML = atd.tipo;
         option.value = atd.id;
         select.appendChild(option);
      });
   } catch (error) {
      console.error("Erro ao buscar tipos de atendimentos:", error);
      message("Erro ao buscar atendimentos", "error");
   }
}

async function fetchPsicologo() {
   try {
      const response = await fetch(URL_PSI);
      const psicologos = await response.json();

      const psicologo = psicologos.find((p) => p.usuario === user.id);

      if (!psicologo) {
         formPsi.classList.add("none");
         btnPsi.classList.remove("none");
         btn__actionmob.classList.add("none");
         btn__actiondesk.classList.add("none");
      }

      set_psi_edit(psicologo);
      set_psi_delete(psicologo);

      if (page) {
         formPsi.classList.remove("none");
      }
      btnPsi.classList.add("none");
      fillFormPsi(formPsi, psicologo);
   } catch (error) {
      console.error("Erro ao buscar psicólogo:", error);
      showMessage("Erro ao buscar psicólogo", "error");
   }
}

async function remove_psi(url, event) {
   console.log("entrou 2");

   const request = new Request(url, {
      method: "DELETE",
      headers: {"Content-Type": "application/json"},
   });

   try {
      const response = await fetch(request);
      if (response.ok) {
         console.log("Psicólogo removido com sucesso:", data);
         message("Psicólogo removido com sucesso", "success");
      } else {
         console.error("Erro ao remover psicólogo:", response.statusText);
         message("Erro ao remover psicólogo", "error");
      }
   } catch (error) {
      console.error("Erro ao remover psicólogo:", error);
      message("Erro ao remover psicólogo", "error");
   }
}

// Funções de Preenchimento de Formulários
function fillFormPsi(form, psicologo) {
   const formData = new FormData(form);

   formData.set("cpf", psicologo.cpf);
   formData.set("cepp", psicologo.cepp);
   formData.set("endereco", psicologo.endereco);
   formData.set("formacao", psicologo.formacao);
   formData.set("atendimento", psicologo.atendimento);

   for (const [key, value] of formData.entries()) {
      const input = form.elements[key];
      if (input) {
         input.value = value;
      }
   }
}

function fillFormUser(form, user) {
   const formData = new FormData(form);
   formData.set("nome", user.nome);
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
check();
fetchPsicologo();
toggle_page(page);
fillFormUser(formUser, user);
get_atendimentos();
