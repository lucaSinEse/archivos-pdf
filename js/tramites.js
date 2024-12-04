const inputBusqueda = document.getElementById("filtro");
const obtenerTramites = document.getElementById("obtenerTramites");

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
  })
}