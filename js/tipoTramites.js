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