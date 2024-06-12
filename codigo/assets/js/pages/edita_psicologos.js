// URLs
const URL_ATD = "http://localhost:3000/atendimentos";
const URL_PSI = "http://localhost:3000/psicologos";
const URL_PSI__html = new URLSearchParams(location.search);
const id_psi = URL_PSI__html.get("id");
const URL_PSI_API = URL_PSI + "/" + id_psi;

const form = document.getElementById("form_psi_edit");

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

async function get_psicologo() {
   try {
      console.log(URL_PSI_API);
      const response = await fetch(URL_PSI_API);
      const psicologo = await response.json();

      input_formpsi(form, psicologo);
   } catch (error) {
      console.error("Erro ao buscar psicólogo:", error);
      message("Erro ao buscar psicólogo", "error");
   }
}

async function edita_psicologo(event) {
   event.preventDefault();
   const form = event.target;
   const formData = new FormData(form);
   const data = Object.fromEntries(formData);
   console.log(data);

   const request = new Request(URL_PSI_API, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
   });

   try {
      const response = await fetch(request);
      if (response.ok) {
         console.log("Psicólogo editado com sucesso:", data);
         message("Psicólogo editado com sucesso", "success");
         window.location.replace("/modules/perfil/mostra_perfil.html");
      } else {
         console.error("Erro ao editar psicólogo:", response.statusText);
         message("Erro ao editar psicólogo", "error");
      }
   } catch (error) {
      console.error("Erro ao editar novo psicólogo:", error);
      message("Erro ao editar psicólogo", "error");
   }
}

// Funções de manipulação de formulários
function input_formpsi(form, psicologo) {
   const form_data = new FormData(form);
   form_data.set("cpf", psicologo.cpf);
   form_data.set("cepp", psicologo.cepp);
   form_data.set("endereco", psicologo.endereco);
   form_data.set("formacao", psicologo.formacao);
   form_data.set("atendimento", psicologo.atendimento);

   for (const [key, value] of form_data.entries()) {
      const input = form.elements[key];
      if (input) {
         input.value = value;
      }
   }
}

form.addEventListener("submit", edita_psicologo);

// Inicializaçoes
get_atendimentos();
get_psicologo();
check();
