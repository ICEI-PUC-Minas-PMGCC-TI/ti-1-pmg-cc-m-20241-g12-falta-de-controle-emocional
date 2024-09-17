let token = false;

// Usuario logado
function get_status() {
   const user = localStorage.getItem("status");
   return user ? JSON.parse(user) : null;
}

function check() {
   const user = get_status();
   if (user) {
      token = true;
   }
}

check();

// Logout
function logout() {
   localStorage.removeItem("status");
   sessionStorage.removeItem("status");
   token = false;
   location.reload();
   window.location.replace("/index.html");
   alert("Logout realizado!");
}

// DropDown
function myFunction() {
   document.getElementById("dropdown__menu").classList.toggle("show");
}

const links = [
   {
      name: "Home",
      link: "/index.html",
   },
   {
      name: "Vivências",
      link: "/modules/vivencias/mostra_vivencias.html",
   },
   {
      name: "Conteúdo",
      link: "/modules/conteudos/mostra_conteudos.html",
   },
   {
      name: "Psicólogos",
      link: "/modules/psicologos/mostra_psicologos.html",
   }
];

const listLinks = (links) => {
   return links
      .map((item) => {
         return `
        <li class="item">
            <span><a href="${item.link}">${item.name}</a></span>
        </li>
      `;
      })
      .join("");
};

function auth(token) {
   if (token) {
      return `
         <a class="item" href="/modules/perfil/mostra_perfil.html"><p class="item--style">Perfil</p></a>
         <li><button id="btn_logout" class="item">Logout</button></li>
        `;
   }

   return `
        <a class="item" href="/modules/login/entrar.html"><p class="item--style">Entrar</p></a>
        <a class="item" href="/modules/login/cadastro.html"><p class="item--style">Cadastrar</p></a>
    `;
}

function navbar(links) {
   return `
        <div class="navbar__logo"><a href="/index.html">Harmonia</a></div>
        <ul class="navbar__list">
            ${listLinks(links)}
        </ul>
        <div class="dropdown">
            <svg class="dropdown__icon" onclick="myFunction()" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path
                d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"
                />
            </svg>
            <div id="dropdown__menu" class="dropdown__menu__content">
                <ul class="dropdown__menu__list">
                    ${auth(token)}
                    <span class="mobile__links item--last">
                        ${listLinks(links)}
                    </span>
                </ul>
            </div>
        </div>
    `;
}

const ll = document.querySelector("[links-list]");
ll.innerHTML = navbar(links);

if (token) {
   document.getElementById("btn_logout").addEventListener("click", logout);
}
