const url = "http://localhost:3000/atendimentos";
const select = document.getElementById("select_atd");

fetch(url)
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
