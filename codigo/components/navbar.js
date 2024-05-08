function myFunction() {
  document.getElementById("dropdown__menu").classList.toggle("show");
}

const links = [
  {
    name: "Home",
  },
  {
    name: "Desabafos",
  },
  {
    name: "Conteúdo",
  },
  {
    name: "Psicólogos",
  },
  {
    name: "Dicas",
  },
];

const listComponent = (links) => {
  return links
    .map((item) => {
      return `
        <li class="item">
            <span>${item.name}</span>
        </li>
      `;
    })
    .join("");
};

function navbar(links) {
  return `
        <div class="navbar__logo">Harmonia</div>
        <ul class="navbar__list">
            ${listComponent(links)}
        </ul>
        <div class="dropdown">
            <svg class="dropdown__icon" onclick="myFunction()" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path
                d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"
                />
            </svg>
            <div id="dropdown__menu" class="dropdown__menu__content">
                <ul class="dropdown__menu__list">
                    <li class="item" href="#">Entrar</li>
                    <li class="item" href="#">Cadastrar</li>
                    <span class="mobile__links">
                        ${listComponent(links)}
                    </span>
                </ul>
            </div>
        </div>
    `;
}

const el = document.querySelector("[links-list]");
el.innerHTML = navbar(links);
