const URL_USER = "http://localhost:3000/usuarios";

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

// Gera ID
function generateUUID() {
   var d = new Date().getTime();
   var d2 = (performance && performance.now && performance.now() * 1000) || 0;
   return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = Math.random() * 8;
      if (d > 0) {
         r = (d + r) % 16 | 0;
         d = Math.floor(d / 16);
      } else {
         r = (d2 + r) % 16 | 0;
         d2 = Math.floor(d2 / 16);
      }
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
   });
}

async function registraUsuario(event) {
   event.preventDefault();

   const form = event.target;
   const formData = new FormData(form);
   const data = Object.fromEntries(formData);
   data["id"] = generateUUID();

   const request = new Request(URL_USER, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
         "Content-Type": "application/json",
      },
   });

   try {
      const response = await fetch(request);
      if (response.ok) {
         console.log("Usuário cadastrado com sucesso:", data);
         message("Usuário cadastrado com sucesso", "success");
         window.location.replace("./modules/login/entrar.html");
      } else {
         console.error("Erro ao cadastrar usuário:", response.statusText);
         message("Erro ao cadastrar usuário", "error");
      }
   } catch (error) {
      console.error("Erro ao cadastrar novo usuário:", error);
      message("Erro ao cadastrar usuário", "error");
   }
}

// Eventos de submissão dos formulários
document.getElementById("form_usu").addEventListener("submit", registraUsuario);
