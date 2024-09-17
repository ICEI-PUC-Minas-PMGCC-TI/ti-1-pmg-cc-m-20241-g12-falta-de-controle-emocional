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
const btnUsu_edit = document.getElementById("btn_usu_edit");
const btnUsu_editdesk = document.getElementById("btn_usu_edit--desk");
const btnVive_remove = document.getElementById("btn_vive_remove");
const listbtn__action = document.getElementsByClassName("list__btn--action");


// URLs
const URL_PSI = "http://localhost:3000/psicologos";
const URL_ATD = "http://localhost:3000/atendimentos";
const URL_VIVE = "http://localhost:3000/vivencias";
const URL_USER = "http://localhost:3000/usuarios";
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
   const URL_PSI__id = "./modules/psicologos/edita_psicologos.html" + "?id=" + id;

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

function set_vive_delete(vivencia) {
   const id = vivencia.id;
   const URL_VIVE_API = URL_VIVE + "/" + id;

   btnVive_remove.addEventListener("click", (event) => {
      remove_psi(URL_VIVE_API, event);
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

btnUsu_edit.addEventListener("click", (event) => {
   console.log("Tentando editar usuario");
});

btnUsu_editdesk.addEventListener("click", (event) => {
   console.log("Tentando editar usuario");
});

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

async function getFavorites_html() {
   try {
      const response_cont = await fetch("http://localhost:3000/conteudos");
      const conteudos = await response_cont.json();

      const response_fav = await fetch("http://localhost:3000/favoritos");
      const favoritos = await response_fav.json();

      const contentDisplay = document.getElementById('contentDisplay');
      contentDisplay.innerHTML = '';


      conteudos.forEach(item => {
         let isFavorited = false;

         favoritos.forEach(favorito => {
            if (favorito.favorito === item.id && favorito.usuario === user.id) {
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
      });
   } catch (error) {
      console.error(error);
   }
}

async function toggleFavorite(event) {
   const icon = event.target;
   const contentId = icon.getAttribute('data-id');

   try {
      const favorites = await getFavorites();

      const favorite = favorites.filter(fav => fav.favorito === contentId && fav.usuario == user.id);

      favorite.forEach(async fav => {
         await remove_fav(fav.id);
      });

      icon.classList.toggle('favorited', userFavorites.length === 0);
   } catch (error) {
      console.error("Erro ao alternar favorito:", error);
      message("Erro ao alternar favorito", "error");
   }
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

   try {

      const response = await fetch(url, {
         method: "GET",
         headers: { "Content-Type": "application/json" }
      });
      const favorite = await response.json();

      if (favorite.usuario !== user.id) {
         console.error("Este favorito não pertence ao usuário logado.");
         return;
      }

      const deleteResponse = await fetch(url, {
         method: "DELETE",
         headers: { "Content-Type": "application/json" }
      });

      if (deleteResponse.ok) {
         message("Favorito removido com sucesso", "success");
      } else {
         console.error("Erro ao remover favorito:", deleteResponse.statusText);
         message("Erro ao remover favorito", "error");
      }
   } catch (error) {
      console.error("Erro ao remover favorito:", error);
      message("Erro ao remover favorito", "error");
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

async function fillFormUser(form, id) {
   try {
      const usuario = await get_usuario(id);

      const formData = new FormData(form);

      formData.set("nome", usuario.nome);
      formData.set("email", usuario.email);
      formData.set("genero", usuario.genero);

      for (const [key, value] of formData.entries()) {
         const input = form.elements[key];
         if (input) {
            input.value = value;
         }
      }
   } catch (error) {
      console.error("Erro ao obter usuário:", error);
   }
}

// Função de Estado do Formulário
function stateForm(form) {
   const formData = new FormData(form);
   for (const [key, value] of formData.entries()) {
      form.elements[key].disabled = false;
   }
}

async function vivencias() {
   try {
      const response = await fetch(URL_VIVE);
      const vivencias = await response.json();

      if (response.ok) {
         const htmlContent = await Promise.all(vivencias.map(async (vive) => {
            try {
               if (user.id == vive.usuario) {
                  const usuario = await get_usuario(vive.usuario);

                  const data = {
                     id: vive.id,
                     nome: usuario.nome,
                     titulo: vive.titulo,
                     situacao: vive.situacao,
                     solucao: vive.solucao,
                  };

                  return cards_html(data);
               }
            } catch (error) {
               console.error('Erro ao processar vivências:', error);
               message("Erro ao processar as vivências", "error")
               return '';
            }
         }));

         publi_html.innerHTML = htmlContent.join('');

         const deleteButtons = document.querySelectorAll('.btn_outline[data-id]');
         deleteButtons.forEach(button => {
            button.addEventListener('click', async (event) => {
               event.preventDefault();
               const id = button.getAttribute('data-id');
               await delete_vivencia(id);
            });
         });
      } else {
         console.error("Erro ao buscar vivências:", response.statusText);
         message("Erro ao buscar vivências", "error");
      }
   } catch (error) {
      console.error("Erro ao buscar vivências:", error);
      message("Erro ao buscar vivências", "error");
   }
}


function cards_html(data) {

   const url = '/modules/vivencias/edita_vivencias.html?id=' + data.id;

   return `
        <div class="card__vive">
            <i class="card__quote fa-solid fa-quote-left"></i>
            <div class="card__title">
               <div class="card__image">
                     <div class="card__image__icon">
                        <i class="fa-solid fa-camera fa-2xl"></i>
                     </div>
               </div>

               <div class="card__title--info">
                     <h4 class="card__name">${data.titulo}</h4>
                     <p class="card__type">${data.nome}</p>
               </div>
            </div>

            <div class="card__info">
               <ul class="card__info__lista">
                     <li class="card__info__item">
                        <h6><b>Situação:</b></h6>
                        <p>${data.situacao}</p>
                     </li>
                     <li class="card__info__item">
                        <h6><b>Solução:</b></h6>
                        <p>${data.solucao}</p>
                     </li>
               </ul>
            </div>

            <div class="card__footer">
               <a href="${url}" class="btn_outline"> <i class="fa-solid fa-pencil"></i>Editar</a>
               <a href="#" class="btn_outline" data-id="${data.id}"> <i class="fa-solid fa-trash" id="btn_vive_remove"></i>Excluir</a>
            </div>
         </div>
       `;
}


async function get_usuario(id) {
   try {
      const response = await fetch(URL_USER);
      const usuarios = await response.json();

      const usuario = usuarios.find((u) => u.id === id);

      if (usuario) {
         return usuario;
      }
   } catch (error) {
      return console.error("Erro ao buscar usuario:", error);
   }
}

async function delete_vivencia(id) {
   const url = URL_VIVE + "/" + id;

   try {
      const response = await fetch(url, {
         method: "DELETE",
         headers: { "Content-Type": "application/json" }
      });

      if (response.ok) {
         message("Vivência removida com sucesso", "success");
         await vivencias();
      } else {
         console.error("Erro ao remover vivência:", response.statusText);
         message("Erro ao remover vivência", "error");
      }
   } catch (error) {
      console.error("Erro ao remover vivência:", error);
      message("Erro ao remover vivência", "error");
   }
}

// Inicialização
check();
fetchPsicologo();
toggle_page(info);
fillFormUser(formUser, user.id);
get_atendimentos();
getFavorites_html();
vivencias();