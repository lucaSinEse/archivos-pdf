
//? Obtener elementos 
const inputBusqueda = document.getElementById("filtro");
const obtenerTramites = document.getElementById("obtenerTramites");

//? Funcion para buscar tramites por: ID_Tramite, Descripcion, Nombre, ID_Socio, Nombre de socio, ID_Cuenta.
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

//? Funcion para ver el pdf en el dialog.
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

//? Funcion para cerrar el dialog
function cerrarDialog(id) {
  document.getElementById(id).close();
}