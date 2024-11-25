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

// document.getElementById('hamburger-button').addEventListener('click', function() {
//   const navHamburguesa = document.getElementById('nav-hamburguesa');
//   navHamburguesa.classList.toggle('active');
// });

function abrirNav() {
  const navHamburguesa = document.getElementById("nav-hamburguesa");
  navHamburguesa.classList.toggle('active');
}