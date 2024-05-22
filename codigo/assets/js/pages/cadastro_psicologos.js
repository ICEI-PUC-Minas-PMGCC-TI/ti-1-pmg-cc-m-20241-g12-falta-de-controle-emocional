// URLs
const url_atd = "http://localhost:3000/atendimentos";
const url_psi = "http://localhost:3000/psicologos";

// Mostra tipos de atendimentos
const select = document.getElementById("select_atd");
fetch(url_atd)
   .then((resp) => resp.json())
   .then(function (data) {
      let atds = data;
      return atds.map(function (atd) {
         let option = createList("option");
         option.innerHTML = `${atd.tipo}`;
         let value = option.setAttribute("value", atd.id);
         append(select, option);
      });
   })
   .catch(function (error) {
      console.log(error);
   });

function createList(element) {
   return document.createElement(element);
}

function append(parent, el) {
   return parent.appendChild(el);
}

// Cadastra psicólogos
document.getElementById("form_psi").addEventListener("submit", async function (event) {
   event.preventDefault();

   const form_data = new FormData(this);

   // Pegar qtd de psicologos cadastrados
   try {
      const newId = Math.floor(Math.random() * 100);

      const data = {
         id: newId,
         cpf: form_data.get("cpf"),
         cepp: form_data.get("cepp"),
         endereco: form_data.get("endereco"),
         formacao: form_data.get("formacao"),
         atendimento: parseInt(form_data.get("atendimento")),
      };

      var request = new Request(url_psi, {
         method: "POST",
         body: JSON.stringify(data),
         headers: {
            "Content-Type": "application/json",
         },
      });

      fetch(request).then(function () {
         console.log(request);
      });

      console.log(data);
   } catch (error) {
      console.error("Erro ao cadastrar novo psicólogo:", error);
   }
});

// Edit Psicologo
document.getElementById("form_psi_edit").addEventListener("submit", function () {
   console.log("clicou no edit");
});

// Delete Psicologo
document.getElementById("form_psi_delete").addEventListener("submit", function () {
   console.log("clicou no delete");
});
