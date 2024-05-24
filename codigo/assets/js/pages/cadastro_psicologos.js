// URLs
const URL_ATD = "http://localhost:3000/atendimentos";
const URL_PSI = "http://localhost:3000/psicologos";

// Variaveis e elementos do dom
let user;

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
}

// Funções Assíncronas
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
         window.location.replace("http://127.0.0.1:5500/modules/perfil/mostra_perfil.html");
      } else {
         console.error("Erro ao cadastrar psicólogo:", response.statusText);
         message("Erro ao cadastrar psicólogo", "error");
      }
   } catch (error) {
      console.error("Erro ao cadastrar novo psicólogo:", error);
      message("Erro ao cadastrar psicólogo", "error");
   }
}

// Funções de Manipulação de Dados
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

document.getElementById("form_psi").addEventListener("submit", registerPsicologo);

// Inicializaçoes
get_atendimentos();
check();
