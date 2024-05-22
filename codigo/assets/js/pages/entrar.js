const URL_USER = "http://localhost:3000/usuarios";

// Mensagem na tela
function message(message, type) {
   const msg = document.getElementById("msg");

   // Mostra a mensagem por 6s
   setTimeout(function () {
      msg.classList.add("none");
   }, 6000);
   msg.classList.remove("none");
   msg.innerHTML = `<div class="${type}">${message}</div>`;
}

// Função para salvar o estado de login
function setLoginStatus(user) {
   localStorage.setItem("userLoginStatus", JSON.stringify(user));
}

// Função para obter o estado de login
function getLoginStatus() {
   const user = localStorage.getItem("userLoginStatus");
   return user ? JSON.parse(user) : null;
}

// Função para verificar o estado de login
function checkLogin() {
   const user = getLoginStatus();
   if (user) {
      console.log("Usuário está logado:", user);
      message(`Bem-vindo, ${user.name}`, "success");
   }
}

// Função de login
async function loginUser(event) {
   event.preventDefault();

   const form = event.target;
   const formData = new FormData(form);
   const data = Object.fromEntries(formData);

   try {
      const response = await fetch(URL_USER);
      const users = await response.json();

      const user = users.find((u) => u.email === data.email && u.senha === data.senha);
      if (user) {
         console.log("Login bem-sucedido:", user);
         setLoginStatus(user);
         message("Login bem-sucedido", "success");
         window.location.replace("http://127.0.0.1:5500/index.html");
      } else {
         console.error("Erro ao fazer login: usuário ou senha incorretos");
         message("Erro ao fazer login: usuário ou senha incorretos", "error");
      }
   } catch (error) {
      console.error("Erro ao fazer login:", error);
      message("Erro ao fazer login", "error");
   }
}

// Evento de submissão do formulário de login
document.getElementById("form_usu_entrar").addEventListener("submit", loginUser);

// Verificar o estado de login na carga da página
checkLogin();
