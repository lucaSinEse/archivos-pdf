console.log("HOLA");

//elementos de agregar tipo tramite
const txtdescripcionTramiteCreado = document.getElementById(
  "txtdescripcionTramiteCreado"
);
const cbxestadoTramiteCreado = document.getElementById(
  "cbxestadoTramiteCreado"
);
const lblnotificacionagregado = document.getElementById(
  "lblnotificacionagregado"
);


//tabla de tipo tramites
const obtenerTipoTramites = document.getElementById(
  "obtenerTipoTramites"
);



$(document).ready(function() {
  //trae todos los elemnetos para l
  ObtenerTipoTramites();

});


function abrirDialog(id) {
  const dialog = document.getElementById(id);
  dialog.showModal();
}

function cerrarDialog(id) {
  document.getElementById(id).close();
}

function abrirDialogEditar(idDialog, id_TipoTramite) {
  const dialog = document.getElementById(idDialog);
  dialog.showModal();
  console.log(id_TipoTramite);
}


function AgregarTipoTramite() {
  $.ajax({
    type: "POST",
    url: "./php/phpinserts.php",
    data: {
      action: "GuardarTipoTramite",
      Descripcion: txtdescripcionTramiteCreado.value,
      estado: cbxestadoTramiteCreado.checked,
    },
    success: function (data) {
      if (data == "esta") {
        lblnotificacionagregado.innerText = "esta";
      } else {
        if (data == "guardado") {
          lblnotificacionagregado.innerText = "Se guardo correctamente";
        } else {
          lblnotificacionagregado.innerText = "Error BD";
        }
      }
    },
  });
}

function ObtenerTipoTramites() {
  $.ajax({
    type: "POST",
    url: "./php/phpgets.php",
    data: {
      action: "ObtenerTipoTramites",
    },
    success: function (data) {
      console.log(data);
      obtenerTipoTramites.innerHTML = data;
    },
    error: function (xhr, status, error) {
      console.error("Error en la solicitud AJAX:", error);
    },
  });
}
