// URLs
const URL_ATD = "http://localhost:3000/atendimentos";
const URL_PSI = "http://localhost:3000/psicologos";

let user;

// usuario logado
function get_status() {
   const user = localStorage.getItem("status");
   return user ? JSON.parse(user) : null;
}

function check() {
   user = get_status();
   if (user) {
      token = true;
      console.log("Usuário está logado:", user);
   }
}

check();

console.log("mostra aqui: ", user);

// Mensagem na tela
function message(message, type) {
   msg = document.getElementById("msg");

   // Mostra a função por 6s
   setTimeout(function () {
      msg.classList.add("none");
   }, 6000);
   msg.classList.remove("none");
   msg.innerHTML = `<div class="${type}">` + message + "</div>";
}

// Recebe uma URL
// Retorna uma resposta em JSON
async function fetchData(url) {
   const response = await fetch(url);
   return response.json();
}

// Popula o select com tipos de atendimentos
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

// Cadastro de psicólogos
async function registerPsicologo(event) {
   event.preventDefault();

   const form = event.target;
   const formData = new FormData(form);
   const data = Object.fromEntries(formData);
   data["usuario"] = user.id;

   const request = new Request(URL_PSI, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
         "Content-Type": "application/json",
      },
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

// Eventos de submissão dos formulários
document.getElementById("form_psi").addEventListener("submit", registerPsicologo);

// Inicialização
populateAtendimentos();
