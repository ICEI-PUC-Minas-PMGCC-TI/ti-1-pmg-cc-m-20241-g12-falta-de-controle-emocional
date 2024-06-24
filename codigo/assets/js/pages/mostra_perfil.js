// Constantes de Elementos da DOM
const msg = document.getElementById("msg");
const formPsi = document.getElementById("form_psi");
const formUser = document.getElementById("form_user");
const info__html = document.getElementById("info");
const publi_html = document.getElementById("publi");
const conteudo_html = document.getElementById("cont");
const btn__actionmob = document.getElementById("btn_action--mob");
const btn__actiondesk = document.getElementById("btn_action--desk");
const btnPsi = document.getElementById("btn_psi");
const btnInfo = document.getElementById("state_info");
const btnPubli = document.getElementById("state_publi");
const btnFav = document.getElementById("state_fav");
const btnPsi_edit = document.getElementById("btn_psi_edit");
const btnPsi_editdesk = document.getElementById("btn_psi_edit--desk");
const btnPsi_remove = document.getElementById("btn_psi_remove");
const btnPsi_removedesk = document.getElementById("btn_psi_remove--desk");
const listbtn__action = document.getElementsByClassName("list__btn--action");


// URLs
const URL_PSI = "http://localhost:3000/psicologos";
const URL_ATD = "http://localhost:3000/atendimentos";
let URL_PSI_API;

// Variáveis Globais
let user;
let info = true;
let fav = false;

// Funções de Manipulação de Usuário
function get_status() {
   const user = localStorage.getItem("status");
   return user ? JSON.parse(user) : null;
}

function check() {
   user = get_status();
}

// Funções de Utilidade
function message(message, type) {
   msg.classList.remove("none");
   msg.innerHTML = `<div class="${type}">${message}</div>`;
   setTimeout(() => {
      msg.classList.add("none");
   }, 6000);
}

function toggle_page(info) {
   if (info == true && fav == false) {
      info__html.classList.remove("none");
      conteudo_html.classList.add("none");
      publi_html.classList.add("none");
   } else if (info == false && fav == true) {
      info__html.classList.add("none");
      conteudo_html.classList.remove("none");
      publi_html.classList.add("none");
   } else {
      info__html.classList.add("none");
      conteudo_html.classList.add("none");
      publi_html.classList.remove("none");
   }
}

async function fetchData(url) {
   const response = await fetch(url);
   return response.json();
}

function set_psi_edit(psicologo) {
   const id = psicologo.id;
   const URL_PSI__id = "/modules/psicologos/edita_psicologos.html" + "?id=" + id;

   btnPsi_edit.setAttribute("href", URL_PSI__id);
   btnPsi_editdesk.setAttribute("href", URL_PSI__id);
}

function set_psi_delete(psicologo) {
   const id = psicologo.id;
   const URL_PSI_API = URL_PSI + "/" + id;

   btnPsi_remove.addEventListener("click", (event) => {
      remove_psi(URL_PSI_API, event);
   });

   btnPsi_removedesk.addEventListener("click", (event) => {
      remove_psi(URL_PSI_API, event);
   });
}

function listbtn_remove() {
   for (let i = 0; i < listbtn__action.length; i++) {
      listbtn__action[i].classList.remove('none');
   }
}

function listbtn_add() {
   for (let i = 0; i < listbtn__action.length; i++) {
      listbtn__action[i].classList.add('none');
   }
}

// Manipulação de Eventos
btnInfo.addEventListener("click", () => {
   btnInfo.classList.add("item__btn--select");
   btnPubli.classList.remove("item__btn--select");
   btnFav.classList.remove("item__btn--select");
   listbtn_remove();
   info = true;
   fav = false;
   toggle_page(info);
});

btnPubli.addEventListener("click", () => {
   btnPubli.classList.add("item__btn--select");
   btnInfo.classList.remove("item__btn--select");
   btnFav.classList.remove("item__btn--select");
   listbtn_add();
   info = false;
   fav = false;
   toggle_page(info);
});

btnFav.addEventListener("click", () => {
   btnPubli.classList.remove("item__btn--select");
   btnInfo.classList.remove("item__btn--select");
   btnFav.classList.add("item__btn--select");
   listbtn_add();
   info = false;
   fav = true;
   toggle_page(info);
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

      if (info) {
         formPsi.classList.remove("none");
      }
      btnPsi.classList.add("none");
      fillFormPsi(formPsi, psicologo);
   } catch (error) {
      console.error("Erro ao buscar psicólogo:", error);
      message("Erro ao buscar psicólogo", "error");
   }
}

async function remove_psi(url, event) {
   const request = new Request(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
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

// Mostra os dados
async function getFavorites_html() {
   try {
      const response_cont = await fetch("http://localhost:3000/conteudos");
      const conteudos = await response_cont.json();

      const response_fav = await fetch("http://localhost:3000/favoritos");
      const favoritos = await response_fav.json();

      const contentDisplay = document.getElementById('contentDisplay');
      contentDisplay.innerHTML = '';


      conteudos.forEach(item => {
         const favorito = favoritos.find((fav) => fav.id_favoritos === item.id);
         if (favorito) {
            isFavorited = true;
            const card = document.createElement('div');
            card.classList.add('content-card');
            card.innerHTML = `
               <h3>${item.titulo}</h3>
               <p>Categoria: ${item.categoria}</p>
               <p>Tema: ${item.tema}</p>
               <p>Duração: ${item.duracao} min</p>
               <i class="fa-solid fa-bookmark favorite-icon ${isFavorited ? 'favorited' : ''}" data-id="${item.id}"></i>
           `;
            contentDisplay.appendChild(card);

            card.querySelector('.favorite-icon').addEventListener('click', toggleFavorite);
         }
      });
   } catch (error) {
      console.log(error);
   }
}

function toggleFavorite(event) {
   const icon = event.target;
   const contentId = icon.getAttribute('data-id');

   getFavorites().then(favorites => {
      const favorito = favorites.find((fav) => fav.id_favoritos === contentId);

      if (favorito) {
         remove_fav(favorito.id);
      }
   });
}

async function getFavorites() {
   try {
      const response = await fetch("http://localhost:3000/favoritos");
      const response_json = await response.json();

      return response_json;

   } catch (error) {
      console.error("Não foi possível acessar seus favoritos");
   }
}


// Deleta favoritos
async function remove_fav(id) {
   const url = "http://localhost:3000/favoritos/" + id;

   const request = new Request(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
   });

   try {
      const response = await fetch(request);
      if (response.ok) {
         console.log("Favorito removido com sucesso:", data);
         //message("Psicólogo removido com sucesso", "success");
      } else {
         console.error("Erro ao remover favorito:", response.statusText);
         //message("Erro ao remover psicólogo", "error");
      }
   } catch (error) {
      console.error("Erro ao remover favorito:", error);
      //message("Erro ao remover psicólogo", "error");
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
toggle_page(info);
fillFormUser(formUser, user);
get_atendimentos();
getFavorites_html();