// URLs e Variáveis Globais
const URL_ATD = "http://localhost:3000/atendimentos";
const URL_PSI = "http://localhost:3000/psicologos";
const URL_PSI__id = URL_PSI + "/" + new URLSearchParams(location.search).get("id");
let user;
let psi;

console.log(URL_PSI__id);

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

// Funções de Manipulação de Usuário
function get_status() {
   const user = localStorage.getItem("status");
   return user ? JSON.parse(user) : null;
}

function check() {
   user = get_status();
   if (user) {
      token = true;
   }
}

// Funções de Manipulação de Formulários
async function registerPsicologo(event) {
   event.preventDefault();
   const form = event.target;
   const formData = new FormData(form);
   const data = Object.fromEntries(formData);
   data["usuario"] = user.id;

   const request = new Request(URL_PSI, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {"Content-Type": "application/json"},
   });

   try {
      const response = await fetch(request);
      if (response.ok) {
         console.log("Psicólogo cadastrado com sucesso:", data);
         message("Psicólogo cadastrado com sucesso", "success");
      } else {
         console.error("Erro ao cadastrar psicólogo:", response.statusText);
         message("Erro ao cadastrar psicólogo", "error");
      }
   } catch (error) {
      console.error("Erro ao cadastrar novo psicólogo:", error);
      message("Erro ao cadastrar psicólogo", "error");
   }
}

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

// Funções de Manipulação de Dados
async function populateAtendimentos() {
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

// Eventos de submissão dos formulários
document.getElementById("form_psi").addEventListener("submit", registerPsicologo);

// Inicializaçoes
populateAtendimentos();
check();

// Funções inativas
/*
async function is_psicologo() {
   try {
      const response = await fetch(URL_PSI);
      const psicologos = await response.json();

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
*/
