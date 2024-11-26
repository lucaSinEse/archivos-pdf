//elementos de agregar tipo tramite
const txtdescripcionTramiteCreado = document.getElementById("txtdescripcionTramiteCreado");
const cbxestadoTramiteCreado = document.getElementById("cbxestadoTramiteCreado");
const lblnotificacionagregado = document.getElementById("lblnotificacionagregado");



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


function abrirNav() {
  const navHamburguesa = document.getElementById("nav-hamburguesa");
  navHamburguesa.classList.toggle('active');
}

function AgregarTipoTramite() {
 
  $.ajax({
    type: "POST",
    url: "./php/phpinserts.php",
    // data: datos,
    data: {
        action: 'GuardarTipoTramite',
        Descripcion: txtdescripcionTramiteCreado.value,
        estado: cbxestadoTramiteCreado.checked

    },
    success: function(data) {
      console.log(data);
    
        if(data ==="esta"){
          lblnotificacionagregado.innerText = "esta";
        }else{
          if(data === "guardado"){
            lblnotificacionagregado.innerText ="Se guardo correctamente";
          }else{
            lblnotificacionagregado.innerText ="Error BD";
          }
        }
    }
});

}