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


// elementos formulario editar
const lblIdTipotramite = document.getElementById(
  "lblIdTipotramite"
);
const descripcionTramiteEditado = document.getElementById(
  "descripcionTramiteEditado"
);
const estadoTramiteEditado = document.getElementById(
  "estadoTramiteEditado"
);
const lblnotificacioneditado = document.getElementById(
  "lblnotificacioneditado"
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

function abrirDialogEditar(idDialog, id_TipoTramite,estado, descripcion) {
  const dialog = document.getElementById(idDialog);
  dialog.showModal();
  /* console.log(id_TipoTramite); */
  lblIdTipotramite.innerHTML = id_TipoTramite;
  descripcionTramiteEditado.value = descripcion;
  if(estado =='1'){
    estadoTramiteEditado.checked = true;
  }else{
    estadoTramiteEditado.checked = false;
  }
}

function abrirNav() {
  const navHamburguesa = document.getElementById("nav-hamburguesa");
  navHamburguesa.classList.toggle("active");
}

function AgregarTipoTramite() {
  if(txtdescripcionTramiteCreado.value ==""){
    lblnotificacionagregado.innerText = "complete el campo descripcion";
  }else{
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
            ObtenerTipoTramites();
          } else {
            lblnotificacionagregado.innerText = "Error BD";
          }
        }
      },
    });
  }
}

function ObtenerTipoTramites() {
  $.ajax({
    type: "POST",
    url: "./php/phpgets.php",
    data: {
      action: "ObtenerTipoTramites",
    },
    success: function (data) {
      /* console.log(data); */
      obtenerTipoTramites.innerHTML = data;
    },
    error: function (xhr, status, error) {
      console.error("Error en la solicitud AJAX:", error);
    },
  });
}

function editarTramite(){
  if(descripcionTramiteEditado.value =="") {
    lblnotificacioneditado.innerText = "Complete el campo descripcion";
  }else{
    $.ajax({
      type: "POST",
      url: "./php/phpupdate.php",
      data: {
        action: "EditarTipotramite",
        descripcion : descripcionTramiteEditado.value,
        estado: estadoTramiteEditado.checked,
        idtipotramite: lblIdTipotramite.textContent
      },
      success: function (data) {
        console.log(data);
        if (data == "esta") {
          lblnotificacioneditado.innerText = "Ese nombre ya se encuentra";
        } else {
          if (data == "modificado") {
            lblnotificacioneditado.innerText = "Se modificado correctamente";
            ObtenerTipoTramites();
          } else {
            lblnotificacioneditado.innerText = "Error BD";
          }
        }
      },
      error: function (xhr, status, error) {
        console.error("Error en la solicitud AJAX:", error);
      },
    });
  }
  
}

