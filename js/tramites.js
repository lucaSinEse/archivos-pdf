const inputBusqueda = document.getElementById("filtro");
const obtenerTramites = document.getElementById("obtenerTramites");

const Visorpdf = document.getElementById("Visorpdf");


function buscar() {
  $.ajax({
    type: "POST",
    url: "./php/phpgets.php",
    data: {
      action: "ObtenerTramites",
      inputValue: inputBusqueda.value,
    },
    success: (data) => {
      obtenerTramites.innerHTML = data;
    },
    error: function (xhr, status, error) {
      console.error("Error en la solicitud AJAX:", error);
    },
  });
}

function verPdf(Idtramite){
  $.ajax({
    type: "POST",
    url: "./php/phpgets.php",
    data: {
      action: "ObtenerPdfDeTramites",
      idtramite: Idtramite,
    },
    success: (data) => {
      // console.log(data);
      const dialog = document.getElementById("Visorpdf");
      const dialogContainer = document.getElementById("dialogContainer");
      dialogContainer.innerHTML = data;
      dialog.showModal();
    },
    error: function (xhr, status, error) {
      console.error("Error en la solicitud AJAX:", error);
    },
  });

}


function cerrarDialog(id) {
  document.getElementById(id).close();
}