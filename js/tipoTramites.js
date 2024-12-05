console.log("HOLA");

//? elementos de agregar tipo tramite
const txtdescripcionTramiteCreado = document.getElementById(
  "txtdescripcionTramiteCreado"
);
const cbxestadoTramiteCreado = document.getElementById(
  "cbxestadoTramiteCreado"
);
const lblnotificacionagregado = document.getElementById(
  "lblnotificacionagregado"
);


//? tabla de tipo tramites
const obtenerTipoTramites = document.getElementById(
  "obtenerTipoTramites"
);


//? elementos formulario editar
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
  //? trae todos los tipos de tramites cuando carga todo el html.
  ObtenerTipoTramites();

});


//? Funcion para abrir el dialog
function abrirDialog(id) {
  const dialog = document.getElementById(id);
  dialog.showModal();
}

//? Funcion para cerrar el dialog
function cerrarDialog(id) {
  document.getElementById(id).close();
}

//? Funcion para abrir el dialog para editar un tipo de tramite
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

//? Funcion para agregar un tipo de tramite
function AgregarTipoTramite() {
  if(txtdescripcionTramiteCreado.value ==""){
    lblnotificacionagregado.innerText = "complete el campo descripcion";
  }else{
    if(validarString(txtdescripcionTramiteCreado.value)){
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
            lblnotificacionagregado.innerText = "Tramite ya existente";
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
    }else{
      lblnotificacionagregado.innerText = "Caracteres no validos";
    }
  }
}

//? FUncion para obtener los tipos de tramites y mostrarlos en el html
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

//? Funcion que edita el tipo de tramite mediante su id.
function editarTramite(){
  if(descripcionTramiteEditado.value =="") {
    lblnotificacioneditado.innerText = "Complete el campo descripcion";
  }else{
    if(validarString(descripcionTramiteEditado.value)){
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
          if (data == "esta") {
            lblnotificacioneditado.innerText = "Ese nombre ya se encuentra";
          } else {
            if (data == "modificado") {
              lblnotificacioneditado.innerText = "Se ha modificado correctamente";
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
    }else{
      lblnotificacioneditado.innerText = "Los caracteres no son validos";
    }
  }
  
}

function validarString(s) {
  //? Definir los caracteres no permitidos
  const caracteresNoPermitidos = /['"!]/;

  //? Verificar si el string contiene algún caracter no permitido
  return !caracteresNoPermitidos.test(s);
}