const URL_PSI__html = new URLSearchParams(location.search);
const id_psi = URL_PSI__html.get("id");
const URL_PSI_API = URL_PSI + "/" + id_psi;

async function remove_psi() {
   console.log("entrou 2");

   /*const request = new Request(url, {
       method: "DELETE",
       headers: {"Content-Type": "application/json"},
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
    }*/
}
